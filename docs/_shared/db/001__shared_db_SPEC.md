# _shared/db 仕様書（横断: DB スキーマ）

> **役割**: math-relax の DB スキーマ・マイグレーション基盤（Neon Postgres + Drizzle ORM）。全機能が参照する単一のデータ基盤。
> **タグ**: cross-cutting, auth-required（owner scoping）
> **最終更新**: 2026-06-20
> **入力アーティファクト**: `../../concept.md`（§5 データ設計 / §3.X セキュリティ要件 / §1.3.2）, `./README.md`

---

## 1. 提供インターフェース（cross-cutting）

DB スキーマ（Drizzle テーブル定義）+ マイグレーション + owner-scoped クエリヘルパを提供する。UI は持たない。

### 1.1 テーブル一覧
| テーブル | 責務 | owner-scoped | 備考 |
|---|---|---|---|
| `units` | 単元（タイトル/系統/説明/豆知識/ロマンノード/検証状態） | ❌ 公開コンテンツ | 事前生成 + 多段検証済みのみ verified |
| `unit_edges` | 依存エッジ（前提 → 応用） | ❌ | 知識グラフの辺 |
| `problems` | 問題（問題文 LaTeX/検証状態） | ❌ 公開コンテンツ | unit に紐づく |
| `steps` | 模範解答ステップ（順序/模範解答 LaTeX/正規化形） | ❌ | problem に紐づく、同値判定用 normalized_form |
| `progress` | 進捗（owner × unit の状態） | ✅ | locked/unlocked/mastered |
| `supports` | tip-jar 支援記録 | ✅ | Stripe single |
| `feedback` | 好き嫌い + バグ報告 | ✅(nullable) | PII scrub 済 body |
| `ai_call_logs` | 外部 API 呼び出しコスト積算 | ❌ | §4.6.2 コスト追跡 |
| `reviews` | 多段クロス検証記録 | ❌ | 生成コンテンツの検証履歴 |

### 1.2 提供する owner-scoped クエリヘルパ（SEC-001）
- `withOwner(ownerId)` / `requireOwner(ctx)` — 認証主体（Clerk ゲスト/ユーザー id = text）を解決し、owner-scoped テーブルのクエリを必ず `owner_id = ownerId` でフィルタ/制約する。
- `purgeOwnerData(ownerId)` — owner の全データ（progress/supports/feedback）を cascade 削除（SEC-004 DSR セルフサービス削除の実体）。

## 2. 入出力（スキーマ詳細）

### 2.1 units
| フィールド | 型 | 制約 | 備考 |
|---|---|---|---|
| id | uuid | pk, default gen | |
| slug | text | unique, not null | 例: `seisuu`, `ichiji-houteishiki` |
| title | text | not null | 単元名 |
| systemic_line | text | not null | 系統（例: 中学数学/代数） |
| description | text | not null | 単元説明 |
| trivia | text | not null | 実世界での使われ方（豆知識） |
| is_romance_node | boolean | not null default false | 遠いゴール（未解放表示） |
| verification_status | enum(`draft`,`under_review`,`verified`) | not null default `draft` | verified のみ公開 |
| created_at / updated_at | timestamptz | not null default now | |

### 2.2 unit_edges
| id uuid pk / from_unit_id uuid fk→units / to_unit_id uuid fk→units / unique(from_unit_id,to_unit_id) |
- from = 前提, to = 応用。循環は生成側で禁止（concept §1.3.3）。

### 2.3 problems
| id uuid pk / unit_id uuid fk→units(on delete cascade) / statement_latex text not null / order int not null / verification_status enum 同上 |

### 2.4 steps
| id uuid pk / problem_id uuid fk→problems(cascade) / order int not null / model_answer_latex text not null / normalized_form text | hint text null |
- `normalized_form`: CAS 正規化済みの式表現（[論点-002] 同値判定の高速パス）。

### 2.5 progress（owner-scoped）
| id uuid pk / owner_id text not null / unit_id uuid fk→units / state enum(`locked`,`unlocked`,`mastered`) not null default `locked` / updated_at timestamptz / unique(owner_id,unit_id) |

### 2.6 supports（owner-scoped）
| id uuid pk / owner_id text not null / amount int not null（既定 100）/ stripe_session_id text unique / created_at timestamptz |

### 2.7 feedback（owner-scoped, nullable owner）
| id uuid pk / owner_id text null / kind enum(`like`,`dislike`,`bug`) not null / body text（PII scrub 済）/ context jsonb（screen/app_version/ua/route）/ created_at timestamptz |

### 2.8 ai_call_logs
| id uuid pk / provider text not null / purpose enum(`generation`,`review`) not null / model text / input_tokens int / output_tokens int / est_cost_usd numeric(10,4) / created_at timestamptz |

### 2.9 reviews（多段クロス検証）
| id uuid pk / target_type enum(`unit`,`problem`,`step`) / target_id uuid / review_model text / stage int / verdict enum(`pass`,`fail`) / findings text / created_at timestamptz |

### 2.10 副作用
- マイグレーション適用（`drizzle-kit`）。シードは別途（生成バッチが units/edges/problems/steps を投入）。

## 3. データモデル（新規エンティティ）
上記 §2 の 9 テーブル。すべて新規（is_new=true、concept §5 由来）。

## 4. バリデーション + エラーケース
| 対象 | ルール |
|---|---|
| units.slug | unique、空不可、kebab |
| unit_edges | (from,to) 一意、from≠to、循環禁止（生成側で担保） |
| progress | (owner_id,unit_id) 一意。state 遷移は locked→unlocked→mastered のみ前進（後退なし） |
| owner-scoped クエリ | owner_id なしのクエリは型レベルで禁止（withOwner 経由必須、SEC-001） |
| supports.stripe_session_id | 一意（Webhook 冪等性） |

| エラーケース | 期待 |
|---|---|
| owner_id 不一致のデータアクセス | 0 件返却（他人のデータは見えない、SEC-001） |
| 未 verified content の公開取得 | 除外（verified のみ配信） |
| purgeOwnerData | owner の progress/supports/feedback を全削除、units 等公開データは不変 |

## 5. 機能固有 NFR + 既存連携

### 5.1 NFR
| 項目 | 目標 | 根拠 |
|---|---|---|
| owner 分離 | owner-scoped テーブルは withOwner 経由のみ（型強制） | SEC-001 |
| DSR 削除 | purgeOwnerData で owner 全データが実削除（cascade） | SEC-004（法令必須） |
| マイグレーション | Drizzle migration で再現可能、Neon dev branch で検証 | §4.5 |

### 5.2 連携
- 被依存: 全機能 + _shared/auth（owner 解決）+ _shared/cost-tracking（ai_call_logs）+ curriculum-generation（reviews/units 書込）。
- 依存: なし（優先度1 基盤）。

## 6. タグ別追加項目

### 6.1 認可（auth-required）
- owner-scoped テーブル（progress/supports/feedback）は `owner_id`（Clerk のゲスト/ユーザー id = text）で所有。全クエリは `withOwner` 経由で `owner_id` フィルタを強制。Neon は RLS でなくアプリ層 owner scoping（Clerk + Drizzle）で担保。

## 7. スコープ外
- Realtime 購読（MVP 対象外）。
- SRS 復習スケジュール用テーブル（v2、concept §1.2 除外）。

## 8. 未決事項
- 現時点で論点なし（2026-06-20）。同値判定の `normalized_form` 形式詳細は [論点-002]（learning-workbook 側で確定）に従う。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:feature |
