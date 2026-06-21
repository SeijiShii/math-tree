# Math-Tree

> **一行で言うと**: 初歩から数学を**ゲームのテックツリー風の知識マップ**で学びなおせる無料 Web サービス。AI が依存グラフ型カリキュラムを生成し（別 AI が多段クロス検証して正確性を担保）、習得した単元がアンロックされて到達点が見える。各単元に「実世界での使われ方」の豆知識を添え、WYSIWYG 数式エディタで途中式を **1 ステップずつ自己採点**して進める。

| 項目 | 内容 |
|---|---|
| ユーザー | 学生時代に数学でつまずいた／離れた大人の独学者（不特定多数向け無料 Web） |
| 解決する課題 | 学びなおし教材は最終答えしか採点せず「どこでつまずいたか」が分からない／単元の前提関係（学ぶ順番）が見えない／到達点が分からず続かない／「何の役に立つか」が分からず挫折する |
| 提供価値 | テックツリー型の知識マップで「学ぶ順番」と「到達点」を可視化 × AI 生成カリキュラム（多段検証で信頼性確保）× ステップ別自己採点ワークブック |
| 現フェーズ | 企画（concept 確定） |
| 最終更新 | 2026-06-20 |

> `source_wants: ./wants.md`（registry `I20260620-001` / origin: human-seed）

---

## 1. プロダクト概要

初歩から数学を**グラフ構造の知識マップ（ゲームのテックツリー風）**で学びなおせる学習サービス。AI がカリキュラム（単元と依存関係＝知識グラフ）を生成し、**別 AI が複数回レビュー（クロス検証）して数学的正確性を担保**する。「何を学ぶと何につながるか」を依存グラフで可視化し、習得した単元が**アンロック**されて自分がどこまで進んだかが見える。各単元に「この知識は実世界でどう使われるか」の豆知識を添え、WYSIWYG（内部 LaTeX）で数式を書きながら問題を**1 ステップずつ自己採点**して進める。

開発者自身が数学の基礎を学びなおしたい当事者であり、**人手監修に頼らず AI 生成 + 多段 AI クロス検証で正確性を担保する**ことが本プロダクトの設計上の核となる。

### 1.1 主要ユースケース
1. **テックツリー（知識マップ）を眺める** — 初歩からの単元が「前提 → 応用」の依存グラフで並び、何を学ぶと何につながるかが一目で分かる。現在地周辺にフォーカスしつつ、ミニマップ/ズームアウトで全体像と遠くのロマンノードも見える
2. **アンロック状況を見る** — 習得済み単元はアンロック表示、次に学べる単元が示され、自分がどこまで進んだかが見える
3. **単元を選ぶ** — グラフ上のノードを選ぶと、その単元の学習に入る
4. **豆知識を読む** — 各単元に「この知識は実世界でどう使われるか」の豆知識が表示される（途中の単元からも「この先このロマンにつながる」が見える）
5. **解く** — WYSIWYG 数式エディタ（MathLive、内部 LaTeX）で途中式を 1 ステップ書く
6. **自己採点** — そのステップの模範解答を開いて照合（合っていれば次のステップへ）
7. **習得 → アンロック** — 1 問を最後まで解き切ると単元が習得済みになり、テックツリー上で次のノードがアンロックされる
8. **支援する（任意）** — 学習の節目や単元アンロック直後などに、固定 100 円「作者を支援」をゲストのままワンタップ（tip-jar）
9. **フィードバックを送る** — どの画面からでも好き嫌い 👍/👎 + バグ報告を 1 タップ（運用品質シグナル）

### 1.2 スコープ

**PJ 分類**: 個人ツール（マイクロサービス連発前提）／完全無料 Web サービス + tip-jar／公開予定あり

**含むもの（MVP）**:
- 中学数学 **1 系統の縦スライス**（例: 正負の数 → 文字式 → 一次方程式 → 一次関数）のテックツリー
- AI 生成 + 多段クロス検証パイプライン（テックツリー/単元/豆知識/問題/模範解答を**事前生成 + キャッシュ**）
- React Flow による知識グラフ UI（現在地周辺フォーカス + 全体ミニマップ、アンロック進捗連動）
- 各単元の豆知識表示（実世界での使われ方）
- WYSIWYG 数式エディタ（MathLive）+ ステップ別自己採点（模範解答照合）
- 確定的アンロック進捗（学んだら習得済み・解放、匿名ゲストのまま保存）
- tip-jar 支援課金（Stripe 単発、ゲスト決済）
- 好き嫌い + バグ報告ウィジェット（feedback-hub 連携）

**含まないもの（明示除外、将来拡張）**:
- 間隔反復（SRS）による復習スケジューリング・通知（→ v2）
- 最先端数学のロマンノード（AI 基礎 / 量子・波動関数 / 画像圧縮=DCT / 暗号=RSA・ECC・格子 ほか）の**実単元化**（MVP では「見えるが遠いゴール」の未解放表示のみ、実際に解ける単元は将来アップデートで順次）
- 中学数学全域・小学算数の土台（縦スライス完成後に横展開）
- リアルタイム AI 添削（自己採点がコア、将来余地）
- 競争ランキング・他者比較・ガチャ・ランダム報酬・FOMO 煽り（charter §2.2 射幸性 NG を遵守、アンロックは「学んだら開く」確定的解放のみ）

### 1.3 ドキュメントフォルダ分割設計

> ここで設計するのは `docs/` 配下の**ドキュメント置き場**の構造であって、実装コード（`src/` 等）の構造ではない（§1.4 参照）。

#### 1.3.1 機能フォルダ（業務ドメイン別）

| フォルダ (docs/ 配下) | 含む機能 | 担当する画面 / API | 依存 | 優先度 | 基盤 |
|---|---|---|---|---|---|
| docs/curriculum-generation/ | AI 生成 + 多段クロス検証パイプライン。テックツリー/単元/豆知識/問題/模範解答を事前生成し、別 AI レビューで数学的正確性をゲートしてキャッシュ | 生成バッチ / レビュー API / コンテンツ承認フロー | _shared/ai, _shared/db, _shared/types, _shared/cost-tracking | 3 | ❌ |
| docs/learning-workbook/ | 単元学習。WYSIWYG 数式エディタ（MathLive）でステップ別に途中式を書き、模範解答とステップ単位で照合する自己採点。習得判定 | 学習画面 / ステップ照合 / 習得判定 API | _shared/db, _shared/types, _shared/ui | 3 | ✅ |
| docs/tech-tree/ | 知識グラフ UI。React Flow でノード=単元/エッジ=依存を描画、現在地周辺フォーカス + ミニマップ、アンロック進捗（習得/解放/未解放）連動、ノード詳細に豆知識 | テックツリー画面 / 進捗取得 API | _shared/db, _shared/types, _shared/ui, learning-workbook | 4 | ✅ |
| docs/support/ | tip-jar 支援課金。固定 100 円「作者を支援」をゲストのままワンタップ（Stripe 単発、継続課金なし） | 支援ボタン / Checkout / Webhook | _shared/auth, _shared/db, _shared/cost-tracking | 4 | ❌ |
| docs/feedback/ | 好き嫌い 👍/👎 + バグ報告ウィジェット。自動コンテキスト付与（PII scrub）→ 即時通知 + 中央 feedback-hub へ蓄積 | フィードバックウィジェット / ingestion | _shared/db | 3 | ❌ |

#### 1.3.2 横断フォルダ（機能をまたぐ技術設計）

| フォルダ (docs/ 配下) | 責務 | 含む設計 | 依存 | 優先度 | 基盤 |
|---|---|---|---|---|---|
| docs/_shared/db/ | DB スキーマ・マイグレーション（Neon + Drizzle） | 単元・依存エッジ・問題・ステップ・模範解答・進捗・支援記録・フィードバック・コストログ テーブル | (なし) | 1 | ✅ |
| docs/_shared/types/ | 共通型定義 | 単元 / エッジ / 進捗状態 / 問題 / ステップ / 豆知識 の TypeScript 型 | (なし) | 1 | ✅ |
| docs/_shared/ui/ | デザイン基盤（shadcn/ui + Tailwind） | テーマトークン・基本コンポーネント・数式描画（KaTeX）ラッパ・自作 SVG イラスト | (なし) | 1 | ✅ |
| docs/_shared/ai/ | Claude API クライアント基盤（キー秘匿） | Vercel Functions 経由の生成/レビュー呼び出しラッパ・レート制御・呼び出しログ（コスト積算用） | (なし) | 1 | ✅ |
| docs/_shared/auth/ | 認証・認可基盤（Clerk） | 匿名ゲスト → 課金/同期時に段階認証（progressive auth, O22）・ゲスト→アカウント連携時のデータ引き継ぎ | _shared/db | 2 | ✅ |
| docs/_shared/cost-tracking/ | 外部 API コスト積算（§4.6.2） | Claude API 等の呼び出しログ × `.env` 単価 = 概算コスト算出・無料枠超過アラート | _shared/db, _shared/ai | 2 | ✅ |
| docs/_shared/legal/ | 法務・コンプライアンス書類 | プライバシーポリシー / 利用規約 / 特定商取引法表記（公開ページ + 同意導線） | (なし) | 1 | ✅ |
| docs/_shared/app-shell/ | **アプリ合成レイヤ**（部品を動く・デプロイ可能なアプリに組み立てる、O57） | 合成ルート（entry/main/router/providers）+ UI↔data 配線 + API ルートハンドラ層 + 認証セッション確立 + deploy scaffold | **全 feature + _shared 全部** | **最大（最後）** | ❌ |

#### 1.3.3 依存・優先度・基盤の定義
- **依存**: そのフォルダが先に必要とする他フォルダ。循環依存なし。
- **優先度**: topological sort 順（小さいほど先）。優先度 1 = 依存なし。
- **基盤**: ✅ は他から多く参照される。横断は原則 ✅、機能でも tech-tree / learning-workbook は中核体験のため基盤扱い。

#### 1.3.4 優先度算出
依存関係からの topological sort:
- **優先度 1**: _shared/db, _shared/types, _shared/ui, _shared/ai, _shared/legal
- **優先度 2**: _shared/auth (←db), _shared/cost-tracking (←db, ai)
- **優先度 3**: learning-workbook, curriculum-generation, feedback
- **優先度 4**: tech-tree (←learning-workbook 他), support
- **最後**: _shared/app-shell（全 feature + 全 _shared に依存、合成 target、O57）

循環依存: なし。

#### 1.3.5 命名規約
- 機能フォルダ: ケバブケース業務名（`tech-tree`, `learning-workbook`）
- 横断フォルダ: `_shared/<技術領域>/`

### 1.4 実装コードフォルダ構成（たたき台）

> 実装コード（`src/`）の構造。Q11 確定スタック（Vite + React + TS + Vercel Functions）に整合。あくまでたたき台、機能境界の名前は §1.3 と揃える。

```
src/
  features/                 # 機能単位（§1.3 機能フォルダと命名統一）
    tech-tree/              # React Flow グラフ・周辺フォーカス・ミニマップ・進捗連動
    learning-workbook/      # MathLive エディタ・ステップ別自己採点・模範解答照合
    curriculum-generation/  # 生成オーケストレーション（呼び出しは server side）
    support/                # tip-jar（Stripe Checkout 起動）
    feedback/               # フィードバックウィジェット
  components/               # 共通 UI 部品（shadcn/ui ベース）
  lib/                      # ユーティリティ（数式正規化ヘルパ等）
  services/                 # クライアントから叩く API ラッパ（TanStack Query）
  types/                    # 共通型（§1.3.2 _shared/types に対応）
  routes/                   # ルーティング
api/                        # Vercel Functions（サーバーレス）
  ai/                       # Claude API 呼び出し（キー秘匿）+ 生成/多段レビュー
  curriculum/               # 事前生成バッチ・キャッシュ提供
  support/                  # Stripe Checkout / Webhook
  feedback/                 # feedback ingestion
  cost/                     # コスト積算
db/                         # Drizzle スキーマ・マイグレーション
scripts/                    # dev.sh / 生成バッチ起動 / コスト集計
```

#### 1.4.2 §1.3 ドキュメントフォルダとの対応
- 機能単位は名前を揃える（`docs/tech-tree/` ↔ `src/features/tech-tree/`）
- 横断 `_shared/<領域>/` ↔ `src/types`, `src/lib`, `api/`, `db/` 等（言語慣習に従う）

## 2. 前提条件・制約
- **業務前提**: 開発者自身に数学の基礎知識がないため、コンテンツの正確性は **AI 生成 + 別 AI 多段クロス検証**で担保する（人手監修に依存しない）。
- **技術制約**: 完全無料 Web サービスとして無料枠厳守（$0）。AI 生成コストは事前生成 + キャッシュで実行時呼び出しを抑制。
- **体制・予算・納期**: 個人開発 / 無料枠厳守 / 固定納期なし。

## 3. 非機能要件

> 本 PJ は学習サービスのため「数学的正確性 / 説明性 / 自己採点の照合精度」を最優先項目に差し替え、性能・スケールは中優先。

| 項目 | 目標値 | 根拠 |
|---|---|---|
| **数学的正確性（最優先）** | 公開コンテンツは多段 AI レビューを通過したもののみ。誤り検知時は未公開差し戻し | 誤情報リスクが本 PJ のトップリスク。人手監修不在のため検証パイプラインが品質の生命線（[論点-001]） |
| **自己採点の照合精度** | 同値な式の表現揺れを正解扱いできる（文字列一致に依存しない） | ステップ別自己採点が体験の核。誤判定は学習意欲を削ぐ（[論点-002]） |
| **説明性** | 各単元に実世界の使われ方（豆知識）と模範解答のステップ根拠を提示 | 「何の役に立つか」「途中式の進め方」を示すのが提供価値 |
| 性能 | テックツリー初期表示は周辺フォーカスで体感速い（事前生成キャッシュ配信）。数式入力のレイテンシ最小 | 初学者の離脱防止。React Flow 全ノード一括描画を避ける |
| 可用性 | 個人ツール水準（Vercel Hobby 無料枠の範囲）。重大障害時は静的キャッシュで閲覧継続を優先 | 無料サービス、過剰投資しない |
| セキュリティ | Claude API キーは Vercel Functions に秘匿（ブラウザ非露出）。送信前 PII scrub。`.env*.local` を Git 除外 | O25 / O26 |
| 運用・監視 | Sentry（Free）でエラー監視。外部 API コストを自前積算（§4.6.2） | 無料枠超過の手前で気づく |
| スケール上限 | DAU 〜100 想定。超過時は §4.3 代替候補へ切替判断 | 個人ツール無料枠厳守 |

<!-- auto-generated-start -->
### 3.X セキュリティ要件（auto-added by /flow:secure 2026-06-20）

L1 設計レビュー（`SECURITY_REVIEW_20260620.md`）で High と判定された項目を要件化（accepted-as-requirement）:

- **認可（O23, SEC-001）**: progress / support / feedback の全 API は、認証主体（Clerk ゲスト/ユーザー）の owner に紐づくデータのみ操作可能に強制する（owner resolver / Drizzle query を owner_id でフィルタ）。他人の進捗が見える/書ける状態を作らない。
- **入力検証（O24, SEC-002）**: API 入力を Zod スキーマで一元検証。KaTeX は `trust:false, strict:true` でレンダリング（任意 LaTeX コマンド実行を防ぐ）。feedback 自由記述・**AI 生成テキスト（豆知識/問題/模範解答）も信頼境界外として表示時に sanitize/エスケープ**する。
- **PII ログ漏洩（O26, SEC-003, 法令必須）**: Sentry `beforeSend` で email/位置/本文中 PII をマスク。feedback ingestion 前の PII scrub を必須化（§6 既出の実装担保）。
- **DSR 履行（O54, SEC-004, 法令必須）**: 匿名ゲストは運営側で本人特定不可のため、**in-app セルフサービスで「全データ削除」を実動作**させる（delete endpoint + DB cascade purge）。開示は in-app で自分の全進捗/支援/フィードバックを閲覧できることで履行。運用者向け identify/delete ツールは作らない（匿名で incoherent）。§9.1 の約束と実装を一致させる。
- **秘密情報（O25, SEC-006, 対応済）**: Claude/Stripe/Clerk のシークレットは Vercel Functions に秘匿（`VITE_*` に置かない）。`.env*.local` は .gitignore 除外済み。
<!-- auto-generated-end -->

## 4. 全体アーキテクチャ

```
[ユーザー(ブラウザ/PWA)]
   │  React + TS (Vite) + React Flow + MathLive/KaTeX + shadcn/ui
   │  TanStack Query
   ▼
[Vercel (Hobby) 静的配信 + Functions(api/)]
   ├─ api/curriculum  … 事前生成済みテックツリー/単元/問題のキャッシュ配信
   ├─ api/ai          … Claude API 呼び出し（生成 + 多段レビュー、キー秘匿）
   ├─ api/support     … Stripe Checkout / Webhook（tip-jar 単発）
   ├─ api/feedback    … フィードバック ingestion → feedback-hub
   └─ api/cost        … 外部 API コスト積算
   ▼
[Neon (Postgres) + Drizzle]  … 単元/依存/問題/ステップ/進捗/支援/フィードバック/コストログ
[Clerk]                      … 匿名ゲスト → 課金/同期時に段階認証
[Stripe]                     … 単発決済
[Claude API]                 … カリキュラム生成 + 多段クロス検証
```

### 4.1 主要コンポーネント
| 名前 | 責務 | 技術領域（具体名は例示） |
|---|---|---|
| テックツリー UI | 知識グラフ描画・周辺フォーカス・ミニマップ・アンロック表示 | React Flow (@xyflow) |
| 学習ワークブック | 数式入力・ステップ別自己採点・模範解答照合 | MathLive（入力）+ KaTeX（描画） |
| 生成・検証パイプライン | AI 生成 → 別 AI 多段レビュー → 正確性ゲート → キャッシュ | Claude API + Vercel Functions（server side） |
| 進捗・アンロック | 習得判定・確定的解放状態管理 | Neon + Drizzle |
| 支援課金 | tip-jar 単発決済 | Stripe Checkout |

### 4.2 技術スタック（方向性）
- フロント: SPA + PWA（例: Vite + React + TypeScript）／知識グラフ: React Flow／数式: MathLive（入力）+ KaTeX（描画）／UI: shadcn/ui + Tailwind／データ取得: TanStack Query
- バック: サーバーレス関数（例: Vercel Functions）で AI 呼び出し・決済・ingestion をキー秘匿
- データ層: マネージド Postgres（例: Neon）+ 型安全 ORM（例: Drizzle）
- インフラ: 静的ホスティング + サーバーレス（例: Vercel Hobby）
- 監視・ログ: エラー監視（例: Sentry Free）+ cookieless アナリティクス（例: Vercel Web Analytics）

### 4.3 リソース選定たたき台

> 各サービスの pricing は変動する。採用判断時は必ず最新の公式 pricing を確認。

| カテゴリ | 推奨具体名 | 代替候補 | 選定根拠 | 想定単価 (USD/月、桁感) |
|---|---|---|---|---|
| フロント FW | Vite + React + TypeScript | Next.js (App Router) | preferences §2.1 強い選好（8 採用）/ クライアント主体 SPA/PWA。SEO LP が必要になれば Next 検討 | $0 ※ 2026-06 時点想定、最新 pricing 要確認 |
| 知識グラフ描画 | React Flow (@xyflow) | Cytoscape.js / vis-network | preferences §2.23（ai-mindmap 実績）/ ノード・エッジのカスタム描画に最適 | $0（MIT） ※ |
| 数式入力 | MathLive | mathquill | WYSIWYG → 内部 LaTeX、スマホ入力対応 | $0（OSS） ※ |
| 数式描画 | KaTeX | MathJax | 高速・軽量レンダリング | $0（OSS） ※ |
| UI | shadcn/ui + Tailwind | Radix + 自前 | preferences §2.14 強い選好（9 採用） | $0 ※ |
| 状態/データ取得 | TanStack Query | SWR | preferences §2.15（生成ステータスのポーリングに適合） | $0 ※ |
| バック（関数） | Vercel Functions | Cloudflare Workers | preferences §2.2 強い選好（8 採用）/ AI キー秘匿 | $0（Hobby） ※ |
| DB | Neon (Postgres) | Supabase（2 プロジェクト制約で不可） | preferences §2.3 強い選好（8 採用）/ サービス別 DB 分離 | $0（Free 10 DB） ※ |
| ORM | Drizzle | Prisma | preferences §2.13 強い選好（8 採用）/ Neon 親和性 | $0 ※ |
| 認証 | Clerk | Supabase Auth / Lucia | preferences §2.4 強い選好（8 採用）/ 匿名ゲスト + 段階認証 O22 | $0（Free 10k MAU） ※ |
| AI（生成 + 検証） | Claude API（生成 + 多段レビュー、複数モデル/多段パス） | OpenAI gpt-4o-mini（代替/併用で別系統レビュー） | wants 明示。事前生成 + キャッシュで呼び出し抑制。多段検証で正確性担保 | 事前生成主体で 〜数 $/月（生成量依存、要試算） ※ |
| ホスティング | Vercel Hobby | Cloudflare Pages | preferences §2.5 強い選好（9 採用） | $0 ※ |
| 監視 | Sentry (Free) | — | preferences §2.6 強い選好（9 採用） | $0（5k events/月） ※ |
| アナリティクス | Vercel Web Analytics (cookieless) | PostHog | preferences §2.7（6 採用）/ consent banner 不要 | $0（Hobby） ※ |
| 決済 | Stripe（単発 tip-jar） | — | preferences §2.19 強い選好（6 採用）/ 月固定費ゼロ | 従量手数料のみ ※ |
| CI/CD | GitHub Actions + Vercel Preview | — | preferences §2.8 強い選好（9 採用） | $0 ※ |
| ボット対策 | Cloudflare Turnstile（不可視） | reCAPTCHA v3 | feedback/support フォームのスパム対策（O27） | $0（1M req/月） ※ |
| ドメイン | 既存ドメインのサブドメ運用（`math-tree.<existing>` 等） | Vercel デフォルト `*.vercel.app` | O29 撤退リスク最小（DNS 1 行削除で完結） | 年額追加 $0（既存ドメイン流用時） ※ |

### 4.4 想定コストサマリ

| 区分 | 月額目安 (USD) | 内訳の例 |
|---|---|---|
| 個人・無料枠 | $0（+ AI 生成の従量分のみ） | Neon Free + Vercel Hobby + Clerk Free + Sentry Free。AI は事前生成主体で生成量に応じた従量 |

**本プロジェクトのレンジ**: **個人・無料枠（$0 厳守）**。根拠: 完全無料 Web サービス + tip-jar、個人開発、無料枠超過時は §4.3 代替候補へ切替判断（BEP は設けない）。**AI 生成コストのみ従量で発生**するため、事前生成 + キャッシュ + §4.6.2 コスト積算で監視し、無料運用の範囲に収める。

### 4.5 ローカル開発環境計画

#### 4.5.1 開発スタイル
**サーバーレス emulation + マネージド DB 直結**（本 PJ の選定）。理由: Vercel Functions + Neon 構成のため、`vercel dev` でローカル関数実行し、DB は Neon の dev ブランチに直結（重い docker 不要）。

#### 4.5.2 必要サービス（ローカル起動対象）
| サービス | 役割 | ローカル起動方式 | ポート | 永続化 |
|---|---|---|---|---|
| Vite dev server | フロント | `npm run dev` | 5173 | host-fs |
| Vercel Functions | API（AI/決済/ingestion） | `vercel dev` | 3000 | (なし) |
| Neon (dev branch) | DB | リモート直結（branch） | — | volume(リモート) |

#### 4.5.3 環境変数・シークレット管理
- `.env.example`: 必須キー一覧（ダミー値、Git コミット可）
- `.env.local`: 実値（Git コミット禁止、`.gitignore` 必須）
- 平文コミット禁止: `CLERK_SECRET_KEY` / `STRIPE_SECRET_KEY` / `ANTHROPIC_API_KEY` / `DATABASE_URL`

#### 4.5.4 起動・停止コマンド
| 操作 | 抽象表現 | 例 |
|---|---|---|
| 起動 | 統合 launcher | `./scripts/dev.sh`（Vite + vercel dev 並列起動）|
| 生成バッチ | カリキュラム事前生成 + 多段検証 | `npm run generate:curriculum` |
| マイグレーション | Drizzle | `npm run db:migrate` |
| 停止 | 統合 stop | `./scripts/stop.sh` または Ctrl+C |

#### 4.5.7 dev 起動スクリプト計画（O36）
- launcher 種別: bash（`scripts/dev.sh`）
- 起動順序: db マイグレーション確認 → vercel dev → Vite
- health check: `/api/health`、smoke endpoint: `/api/curriculum/health`, `/api/ai/health`
- stop script: 起動した子プロセスの cleanup

#### 4.5.6 CI/CD との関係
- CI（GitHub Actions）で lint / typecheck / unit / build。Neon は CI 用 branch を使用。
- 本番との差異: AI 生成は CI では走らせず、事前生成済みキャッシュを使う。

### 4.6 コスト・収益追跡と継続判断ループ

#### 4.6.1 PJ 性質別の必要レベル
**本 PJ の該当レベル: 個人ツール / 無料枠**。コスト追跡 ✅ 必須 / 無料枠超過アラート ✅ 必須 / 収益指標 ❌ 不要 / BEP ❌ 不要 / レビュー 四半期推奨 / 撤退判断 必須（無料枠超過時の対応方針）/ 判断主体 本人。

#### 4.6.2 コスト集計メカニズム（必須）
外部請求ダッシュボードだけに頼らず、システム内部で能動的に積算する。
1. **呼び出しログの積算記録**: Claude API 呼び出しを 1 件ごとにログ（リクエスト数 / 入力・出力トークン数 / 生成 or レビュー区分 / 成功失敗）。記録先は Neon の専用テーブル（`_shared/cost-tracking`）。
2. **単価表は `.env` で管理**:
   ```
   COST_ANTHROPIC_PER_1K_INPUT_TOKENS=<USD>
   COST_ANTHROPIC_PER_1K_OUTPUT_TOKENS=<USD>
   ```
   単価変更日も記録（過去ログ再計算の精度向上）。コードへのハードコード禁止。
3. **概算コスト算出**: `トークン数 × 単価 = 概算コスト`。機能別（生成 / 検証）/ 日次・月次で集計。
4. **精度検証**: 月次で Anthropic 請求と突合、誤差 > 10% なら単価再調査。
5. **アラート閾値**: 想定上限の 80% / 100% / 120% でアラート（メール等）。

#### 4.6.3 追跡するコスト指標
| 指標 | 集計頻度 | 集計元 |
|---|---|---|
| Claude API コスト（生成 / 検証 別） | 日次 / 月次 | 内部ログ × `.env` 単価 |
| Neon / Vercel / Clerk 使用量 | 日次 | 各ダッシュボード（無料枠監視） |

#### 4.6.7 継続 / 縮退 / 撤退判断基準
| 判断 | 基準 | 対応 |
|---|---|---|
| 継続 | 無料枠内 + AI 従量が許容内 | 通常運用 |
| 縮退 | 生成コストが許容超 | 事前生成頻度を下げる / 安価モデルでレビュー段数調整 |
| 撤退 | 無料枠超過の代替も無く維持困難 | §4.7.5 撤退手順 |

#### 4.6.8 判断主体
本人。判断ログは `docs/AI_LOG/` または運用ログに記録。

### 4.7 公開戦略・ドメイン・リバースプロキシ

#### 4.7.1 ドメイン情報
- **既存ドメイン**: 既存ドメインありなら**サブドメ運用**（`math-tree.<existing>`）を推奨（撤退リスク最小、DNS 1 行削除で完結）。検証段階は Vercel デフォルト `*.vercel.app` で開始可。

#### 4.7.2 公開構成パターン
- **採用: (A) PaaS 完結**（Vercel + Neon）。運用負担ゼロ、リバースプロキシ不要。

#### 4.7.5 撤退時の手順
1. ユーザー事前通知（アプリ内バナー / SNS）
2. データエクスポート機能提供（進捗 CSV/JSON）
3. Stripe は単発のため停止不要
4. DNS レコード削除（サブドメ運用なら 1 行）
5. データバックアップを N ヶ月保管 → DB 削除

### 4.8 サービス公開周知 / マーケティング戦略

> 個人開発マイクロサービスの「作ったが誰も知らない」回避。ai-mindmap と同型の軽量周知。

#### 4.8.1.1 個人開発での優先順位（本 PJ）
| 優先度 | チャネル | 本 PJ の採用 |
|---|---|---|
| ★★★ 必須 | 製品内グロース + SEO | シェア可能な「学習到達マップ」+ ヘルプ/使い方ページ SEO（§4.8.2/§4.8.3） |
| ★★★ 必須 | note（汎用ブログ） | 採用（月 1 記事ペース） |
| ★ 既存維持 | X / Zenn 等 開発者向け | 既存活動継続、新規開設しない |
| 任意 | YouTube / プレスリリース | 不採用 |

#### 4.8.2 製品内グロース設計
- **シェアしたくなる成果物**: 自分のテックツリー到達マップ（どこまでアンロックしたか）の画像化シェア。
- シェア導線は常設・非強制（charter §2.2 抵触回避）。シェアしなくても全機能使える。OG カード自動生成（§4.8.5）。
- **アンチパターン（NG）**: 強制シェアモーダル / シェアでガチャ / 招待ランキング / 数字煽り。

#### 4.8.3 SEO
- 狙うキーワード例: 「数学 学びなおし」「中学数学 やり直し」「一次方程式 つまずき」等のロングテール。
- 技術 SEO: 構造化データ / sitemap.xml / Core Web Vitals / モバイル対応。
- コンテンツ SEO: ヘルプ・使い方・FAQ ページの充実。

#### 4.8.4 Build in Public ストーリー軸
- 「超高速 AI 駆動開発」「AI 生成 × 多段検証で数学コンテンツの信頼性を担保する挑戦」を継続コンテンツ軸に。撤退も透明化。

#### 4.8.5 OGP
- `og:title` / `og:description` / `og:image` / `twitter:card=summary_large_image`。動的 OG 画像（到達マップ）検討。

#### 4.8.7 コンテンツペース
- 標準: 月 1〜2 記事 + 週 1 ツイート。疲弊しない最小ペース優先。

## 5. データ設計（高レベル）

### 5.1 主要エンティティ
- **unit（単元）**: id, title, 系統, 説明, 豆知識（実世界の使われ方）, ロマンノードフラグ（遠いゴール表示用）, 生成元 / 検証状態
- **edge（依存エッジ）**: from_unit, to_unit（前提 → 応用）
- **problem（問題）**: unit_id, 問題文（LaTeX）, 検証状態
- **step（ステップ）**: problem_id, 順序, 模範解答（LaTeX）, 正規化形（同値判定用）
- **progress（進捗）**: user/guest_id, unit_id, 状態（未解放 / 解放済 / 習得済）, 更新日時
- **support（支援記録）**: guest/user_id, amount(100), stripe_session_id, 日時
- **feedback**: guest/user_id, 種別（好き嫌い / バグ）, 本文（PII scrub 済）, コンテキスト（画面/version/UA）
- **ai_call_log（コストログ）**: provider, 用途（生成 / レビュー）, input/output tokens, 概算コスト, 日時
- **review（検証記録）**: 対象（unit/problem/step）, レビューモデル, 判定, 指摘, 段番号

### 5.2 データフロー
1. 生成バッチ: Claude が単元/エッジ/豆知識/問題/模範解答を生成 → review に複数段の AI レビュー記録 → 全段合格で「検証済」→ キャッシュ
2. 学習: ユーザーがステップ入力 → 模範解答の正規化形と照合 → 習得判定 → progress 更新 → tech-tree でアンロック

## 6. 外部連携

| 連携先 | 用途 | 方式 | 認証 |
|---|---|---|---|
| Claude API（Anthropic） | カリキュラム/問題/模範解答/豆知識の生成 + 多段クロス検証 | REST（Vercel Functions 経由、キー秘匿） | API キー（`.env.local` / Vercel env） |
| Clerk | 匿名ゲスト → 段階認証 | SDK | Publishable / Secret Key |
| Stripe | tip-jar 単発決済 | Checkout + Webhook（署名検証） | API キー（test/live） |
| Neon | DB | Postgres 接続 | DATABASE_URL |
| feedback-hub（別 PJ） | フィードバック中央集約 | `POST /api/feedback`（hub 安定 ingestion 契約） | service ID + hub endpoint env |

> **外部 AI サービス利用: あり（Q12.5）**。用途 = カリキュラム生成 + 多段クロス検証（本サービスの核）。プライバシー方針 = ユーザーの学習入力は AI 学習に使わせない（`store=false` 相当 / no-training オプション）、送信前 PII scrub。オプトアウト = MVP は学習入力を AI 添削に送らない設計（自己採点はローカル/正規化照合）ため、生成は事前バッチでユーザーデータ非依存。フォールバック = API ダウン時は事前生成キャッシュで閲覧・学習継続。**AI 価値検証（Q12.5(7)）**: ユーザーが自分で ChatGPT を叩くより、本サービスは「生成 → 別 AI 多段クロス検証 → 正確性ゲート → 依存グラフ構造化」というマルチステップ後処理を裏で実行する点で勝る（差別化根拠 = (c) 出力後処理 + (d) マルチステップ推論 + (e) UI 統合）。
>
> **アナリティクス・計測ツール利用: あり（Q12.6）**。Vercel Web Analytics（cookieless）で流入計測。consent banner 不要。加えて §4.6.2 の自前コスト積算を必須化。

## 7. 決定事項ログ

| 日付 | 決定内容 | 根拠 | 影響セクション | decision_id |
|---|---|---|---|---|
| 2026-06-20 | AI 生成 + 別 AI 多段クロス検証で正確性担保（人手監修なし） | Q（AI 生成方式）| §1, §3, §4.1, §6 | [D20260620-002](./AI_LOG/D20260620_001_concept_initial.md#decisions) |
| 2026-06-20 | MVP は中学数学 1 系統の縦スライス | Q（MVP 収録範囲）| §1.2 | [D20260620-003](./AI_LOG/D20260620_001_concept_initial.md#decisions) |
| 2026-06-20 | テックツリーは現在地周辺フォーカス + 全体ミニマップ | Q（グラフ見せ方）| §1.1, §1.3.1 | [D20260620-004](./AI_LOG/D20260620_001_concept_initial.md#decisions) |
| 2026-06-20 | 間隔反復（SRS）は MVP 除外、v2 へ | Q（復習）| §1.2 | [D20260620-005](./AI_LOG/D20260620_001_concept_initial.md#decisions) |
| 2026-06-20 | 認証 = Clerk 匿名ゲスト → 課金/同期時に段階認証 | preferences §2.4 / O22 | §1.3.2, §4.3 | [D20260620-006](./AI_LOG/D20260620_001_concept_initial.md#decisions) |
| 2026-06-20 | 標準 Neon スタック（Vite+React / Vercel Functions / Neon / Drizzle / shadcn / Stripe 単発） | preferences 強い選好 | §4.2, §4.3 | [D20260620-001](./AI_LOG/D20260620_001_concept_initial.md#decisions) |

## 8. 未決事項（論点リスト）

### [論点-001] AI 多段クロス検証パイプラインの具体設計
- **影響範囲**: curriculum-generation, _shared/ai, §3 NFR（数学的正確性）, §4.1
- **詰めるべき問い**:
  1. 何モデル・何段のレビューを行うか（同一モデル多段 / 異モデル併用 = Claude + gpt-4o-mini 等のクロス検証）
  2. 合格基準（全段一致 / 多数決 / 重大指摘ゼロ）と不一致時の扱い（再生成 / 未公開差し戻し）
  3. 人手フォールバック不在下での最終ゲート（自動公開の可否、サンプリング検証の要否）
  4. 検証対象の粒度（単元説明 / 依存エッジの妥当性 / 問題 / 模範解答ステップの数学的正しさ）
- **候補案**:
  - 案 A: 異モデル 2 系統（Claude 生成 → gpt-4o-mini + Claude 別プロンプトでレビュー）の多数決 + 重大指摘ゼロで合格 ／ 利点: 単一モデルの系統誤差を相殺 ／ 欠点: コスト増
  - 案 B: 同一モデル多段（生成 → 自己批判 → 再検証）／ 利点: 安価 ／ 欠点: 系統的誤りを見逃しやすい
- **推奨**: 案 A（異モデルクロス検証）。理由: 数学的正確性が生命線で、単一モデルの hallucination 傾向を別系統で相殺できる。コストは事前生成 + キャッシュで吸収。
- **判断期限**: curriculum-generation の feature 設計前
- **担当**: seiji

### [論点-002] 数式ステップの同値判定（自己採点の照合ロジック）
- **影響範囲**: learning-workbook, _shared/types（step.正規化形）, §3 NFR（照合精度）
- **詰めるべき問い**:
  1. ユーザーの途中式（LaTeX）と模範解答ステップの**同値判定**をどう行うか（文字列一致では表現揺れに弱い）
  2. CAS による数式正規化（例: sympy で正規化して比較）/ AI 照合 / 併用のどれか
  3. クライアント完結 or サーバー側（CAS は server side が現実的）
- **候補案**:
  - 案 A: server side で CAS（sympy 等）により正規化して同値判定 ／ 利点: 決定的・低コスト・正確 ／ 欠点: 表現自由度の高いステップ（途中の言葉混じり）には別処理が要る
  - 案 B: AI 照合（このステップは模範解答と同値か判定）／ 利点: 柔軟 ／ 欠点: コスト・非決定性・誤判定リスク
  - 案 C: 併用（まず CAS 正規化、判定不能時のみ AI 照合）
- **推奨**: 案 C（CAS 優先 + AI フォールバック）。理由: 大半は CAS で決定的に正解判定でき低コスト、難しいケースのみ AI に回してコストと精度を両立。
- **判断期限**: learning-workbook の feature 設計前
- **担当**: seiji

### [論点-003] [SEC-001] 認可漏れ（所有者チェック）: High
- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-06-20 open → 2026-06-20 accepted-as-requirement（/flow:secure --scope=concept で §3.X 要件化）
- **影響範囲**: §3 NFR, §5, §6, tech-tree / learning-workbook / support / feedback
- **観点 ID**: O23_authorization_check
- **検出根拠**: 複数ユーザー PJ だが API の所有者チェック/認可マトリクスが concept 未明示
- **推奨**: 全 API を owner resolver で認証主体のデータのみに絞る（§3.X 要件化済み）
- **判断期限**: 各 feature 設計前
- **L1 レポート**: `./SECURITY_REVIEW_20260620.md#sec-001`

### [論点-004] [SEC-002] 入力検証（XSS/sanitize）: High
- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-06-20 open → 2026-06-20 accepted-as-requirement
- **影響範囲**: §3 NFR, §5, §6, learning-workbook / feedback / curriculum-generation 表示層
- **観点 ID**: O24_input_validation
- **検出根拠**: MathLive/LaTeX・feedback 自由記述・AI 生成表示の sanitize / 入力スキーマが未明示
- **推奨**: Zod 入力検証 + KaTeX `trust:false` + AI 生成/feedback の表示時 sanitize（§3.X 要件化済み）
- **判断期限**: learning-workbook / feedback 設計前
- **L1 レポート**: `./SECURITY_REVIEW_20260620.md#sec-002`

### [論点-005] [SEC-003] PII ログ漏洩: High（法令必須）
- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-06-20 open → 2026-06-20 accepted-as-requirement
- **影響範囲**: §3 NFR, §9.1, §9.2, feedback / 監視（Sentry）
- **観点 ID**: O26_pii_logging
- **検出根拠**: feedback PII scrub は明示だが Sentry beforeSend マスクが未明示（部分対応）
- **推奨**: Sentry beforeSend マスク + feedback ingestion 前 PII scrub 必須化（§3.X 要件化済み）
- **判断期限**: feedback / 監視設計前
- **L1 レポート**: `./SECURITY_REVIEW_20260620.md#sec-003`

### [論点-006] [SEC-004] DSR 履行可能性: High（法令必須）
- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-06-20 open → 2026-06-20 accepted-as-requirement
- **影響範囲**: §1.1 UC, §5 データ設計（cascade/purge）, §9 法務, _shared/auth / account
- **観点 ID**: O54_dsr_fulfillment_operability
- **検出根拠**: §9.1 でセルフサービス削除を約束、in-app 実削除 + 全ストア purge の実装担保が未確定
- **推奨**: in-app「全データ削除」セルフサービス（delete endpoint + cascade purge）+ 開示=in-app 閲覧。運用者ツールは作らない（§3.X 要件化済み）
- **判断期限**: _shared/auth / account 設計前
- **L1 レポート**: `./SECURITY_REVIEW_20260620.md#sec-004`

### [論点-007] [SEC-005] レート制限: Medium
- **status**: `open`
- **影響範囲**: §3 NFR, §4.3, §4.6.2, support / feedback / progress API
- **観点 ID**: O27_rate_limit_scope
- **検出根拠**: AI コスト爆発は事前生成で緩和済みだが、一般書き込み API のレート制限が未設計
- **候補案**: 案 A 書き込み API に Upstash Ratelimit + Turnstile 二重防御 ／ 案 B feature 実装時に Vercel Edge で対応
- **推奨**: 案 A（feature 設計時に確定）
- **判断期限**: support / feedback feature 設計時
- **L1 レポート**: `./SECURITY_REVIEW_20260620.md#sec-005`

## 9. 法務・コンプライアンス書類

> 公開 PJ（無料）。最低限 §9.1 プライバシーポリシー必須。tip-jar は単発決済のため、特商法は「有償サービス」該当性を要確認（任意支援の投げ銭でも決済を扱うため §9.3 を整備推奨）。

### 9.1 必須書類チェックリスト
| 書類 | 必要性 | 状態 | 配置パス / URL | 備考 |
|---|---|---|---|---|
| プライバシーポリシー | ✅ | 未作成 | `/legal/privacy` | 進捗・支援・フィードバックで個人データ最小取得。**ゲスト/匿名特例（O12×O22）**: 運営側で個人特定不可のため、確認・削除はアプリ内セルフサービスで提供（窓口削除を約束しない旨を正直に明記）。**全データ削除のセルフサービス導線は非交渉の必須** |
| 利用規約 | ✅ | 未作成 | `/legal/terms` | 学習コンテンツは AI 生成 + 検証だが正確性を保証しない旨の免責、tip-jar の返金不可方針 |
| 特定商取引法に基づく表記 | △（要確認） | 未作成 | `/legal/specified-commercial-transactions` | tip-jar（任意支援）でも決済導線があるため整備推奨。個人事業主の住所は「請求あれば遅滞なく開示」で省略可 |
| Cookie ポリシー | ❌ | — | — | cookieless アナリティクス採用のため不要 |

### 9.2 対応地域法規
| 法規 | 対象 | 対応方針 |
|---|---|---|
| 個人情報保護法（日本） | ✅ | 取得目的明示 / 最小取得 / セルフサービス削除 |
| GDPR / CCPA | △（不特定多数、主に国内想定） | 国外ユーザーが増えたら consent / DSR を再評価 |

### 9.3 書類作成方針
- 作成手段: テンプレ採用（Termly / Iubenda 等）+ 自前ドラフト。配置: `_shared/legal/` 原稿 → 公開時 `/legal/` ルート。
- 公開導線: フッタリンク全ページ + 初回起動時の軽い案内。

## 10. Git リポジトリ・運用

### 10.1 リポジトリ情報
| 項目 | 値 |
|---|---|
| リポジトリ URL | 未設定（公開予定、GitHub private で開始想定） |
| 可視性 | private（公開準備後に判断） |
| ホスティング | GitHub |
| デフォルトブランチ | main |

### 10.2 ブランチ戦略
- Trunk-based + Protected main（推奨）。protected_branches: `[main]`。auto_branch_prefix: `flow/`。

### 10.3 コミット規約
- Conventional Commits。flow コマンド自動コミット: `docs(flow:concept): ...`。

### 10.6 flow コマンド自動コミット方針
```yaml
auto_commit: true
branch_strategy: trunk-based
commit_message_lang: ja
protected_branches: [main]
auto_branch_prefix: "flow/"
```

### 10.7 セキュリティ
- `.env*.local` / 秘密情報を `.gitignore` で除外（O25）。pre-commit で gitleaks 推奨。

## 11. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:concept |
