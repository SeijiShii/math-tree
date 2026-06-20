# _shared/db 単体テスト計画

> **入力**: `./001__shared_db_SPEC.md`, `./002__shared_db_PLAN.md`
> **最終更新**: 2026-06-20

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 入力 | 期待 |
|---|---|---|---|
| N1 | units 挿入/取得 | verified unit | 取得できる |
| N2 | unit_edges | from→to | グラフ辺が引ける |
| N3 | progress state 前進 | locked→unlocked→mastered | 更新成功 |
| N4 | withOwner(progress) | owner A の進捗 | A のデータのみ返る |
| N5 | purgeOwnerData(A) | A の progress/supports/feedback | 全削除、units 不変 |
| N6 | supports 冪等 | 同 stripe_session_id 2 回 | unique 制約で 1 件 |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待 |
|---|---|---|---|
| E1 | owner 分離（SEC-001） | owner B が A の progress を取得 | 0 件（見えない） |
| E2 | 未 verified 公開取得 | draft unit を公開クエリ | 除外される |
| E3 | progress state 後退 | mastered→locked | 拒否（前進のみ） |
| E4 | unit_edges 自己ループ | from=to | 制約/バリデーションで拒否 |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | feedback.owner_id null | 匿名前フィードバック | 許容（nullable） |
| B2 | units.trivia 長文 | 大きな text | 保存できる |

## 2. Mock 方針
| 対象 | 方針 | 理由 |
|---|---|---|
| Neon DB | テスト用 Postgres（Neon dev branch or pglite/testcontainer） | スキーマ・制約の実挙動を検証 |
| 時刻 | 固定注入 | created_at 再現性 |
| Clerk owner 解決 | スタブ ownerId 注入 | db 層単体は owner 値のみ依存 |

## 3. カバレッジ目標
| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | concept 継承 |
| 分岐 | 70% | concept 継承 |
| owner scoping 経路 | 100% | SEC-001 は全分岐必須 |

## 4. 既存ユーティリティ依存
- なし（基盤）。drizzle-orm / @neondatabase/serverless。

## 5. テスト実行環境
- フレームワーク: Vitest（concept §4.3 系）
- DB: Neon dev branch もしくはローカル Postgres/pglite
- 実行: テストツールを実行（例: `npm run test`）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:feature |
