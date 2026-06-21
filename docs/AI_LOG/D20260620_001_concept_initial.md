# AI_LOG セッション D20260620_001 — /flow:concept (initial)

**実行日時**: 2026-06-20 (+09:00)
**コマンド**: /flow:concept
**対象**: プロジェクト全体（初版作成）
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 完了
**含まれる decision**: D20260620-001 〜 D20260620-012 (12 件)
**ファイル**: `D20260620_001_concept_initial.md`

---

## 主要決定サマリ（人間向け要約）

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260620-001 | 技術スタック | 標準 Neon スタック（Vite+React / Vercel Functions / Neon / Drizzle / Clerk / shadcn / Stripe 単発） | auto-recommended |
| D20260620-002 | AI 生成方式・正確性担保 | AI 生成 + 別 AI 多段クロス検証（人手監修なし）+ 事前生成キャッシュ | explicit-choice |
| D20260620-003 | MVP 収録範囲 | 中学数学 1 系統の縦スライス | auto-recommended |
| D20260620-004 | テックツリー見せ方 | 現在地周辺フォーカス + 全体ミニマップ | auto-recommended |
| D20260620-005 | 復習 SRS | MVP 除外、v2 へ | auto-recommended |
| D20260620-006 | 認証・identity | Clerk 匿名ゲスト → 段階認証（O22） | auto-recommended |
| D20260620-007 | 規模・NFR・体制 | 小規模 DAU〜100 / 無料枠 $0 / 数学的正確性 最優先 | auto-recommended |
| D20260620-008 | 論点抽出 | [論点-001] 検証パイプライン / [論点-002] 数式同値判定 | open |

## 依存関係
- D20260620-002 → [D20260620-001]
- D20260620-003 → [D20260620-002]
- D20260620-004 → [D20260620-003]
- D20260620-005 → [D20260620-003]
- D20260620-006,007 → [D20260620-001]
- D20260620-008 → [D20260620-002]

外部依存: なし（初版セッション）

## 生成・更新したアーティファクト
- 新規: `docs/concept.md` (§1〜§11)
- 新規: `docs/INDEX.md` / `docs/DOC_MAP.md` / `docs/PREREQUISITES.md` / `docs/SCENARIO.md`
- 新規: 機能フォルダ 5 + 横断フォルダ 8 の README.md + INDEX.md placeholder
- 新規: `docs/AI_LOG/INDEX.md`
- 更新: `docs/wants.md`（クリア予定、Step 5.5）

## 学習・改善
- Math-Tree は ai-mindmap の sibling（AI 生成 + React Flow + tip-jar）。標準 Neon スタックを再採用。
- 新規傾向候補: AI 生成コンテンツの「別 AI 多段クロス検証で正確性担保」（人手監修不在 PJ。採用 1=試行レベル）。
- 新規ライブラリ候補: MathLive（WYSIWYG 数式入力）+ KaTeX（数式描画）— preferences 未登録カテゴリ。

---

## Decisions

```yaml
- id: D20260620-001
  timestamp: 2026-06-20T00:00:00+09:00
  command: /flow:concept
  phase: Step 1.7 / preferences.md 読込
  question: preferences.md 読込
  options: []
  recommended: null
  chosen: 読込成功（学習元 PJ 11、強い選好 = Neon スタック core 8-9 採用）
  chosen_type: auto-recommended
  depends_on: []
  context: |
    preferences.md (最終更新 2026-06-19、学習元 11 PJ) を Read。
    強い選好 (採用 6+): React+TS(Vite) 8 / Vercel Functions 8 / Neon 8 / Clerk 8 /
    Vercel Hobby 9 / Sentry 9 / Vercel Web Analytics 6 / GitHub Actions CI 9 /
    Drizzle 8 / shadcn/ui 9 / Stripe 単発 6。Math-Tree は ai-mindmap の sibling
    (AI 生成コンテンツ + React Flow グラフ + tip-jar) と判定。

- id: D20260620-002
  timestamp: 2026-06-20T00:10:00+09:00
  command: /flow:concept
  phase: Step 2 / Q (AI 生成方式・正確性担保)
  question: カリキュラム・豆知識・問題・模範解答を AI でどこまで自動生成し、正確性をどう担保するか
  options:
    - AI 下書き＋人手監修 (recommended)
    - 固定マスターカリキュラム (AI は補助のみ)
    - 完全 AI 自動 (実行時生成)
  recommended: AI 下書き＋人手監修
  chosen: AI 生成 + 別 AI による多段レビュー（クロス検証）で正確性を担保。事前生成 + キャッシュ
  chosen_type: explicit-choice
  depends_on: [D20260620-001]
  context: |
    開発者 seiji 自身に数学の基礎知識がないため人手監修は非現実的。
    代わりに AI がカリキュラム/テックツリー/豆知識/問題/模範解答を生成し、
    別 AI（複数モデル or 多段パス）が数学的正確性を複数回レビューして信頼性を担保する。
    Q12.5(7) AI 価値検証: ユーザー直接叩きより「生成→多段クロス検証」パイプライン経由が
    hallucination を抑え信頼性で勝る = 差別化根拠。事前生成 + キャッシュで実行時コスト抑制。
    問題・模範解答も同一パイプラインで生成・検証（旧 Q「問題生成方式」はここに統合）。

- id: D20260620-003
  timestamp: 2026-06-20T00:20:00+09:00
  command: /flow:concept
  phase: Step 2 / Q (MVP 収録範囲)
  question: MVP のテックツリー収録範囲の起点と幅
  options:
    - 中学数学1系統の縦スライス (recommended)
    - 中学数学全域（3年分）
    - 小学算数の土台から中学接続まで
  recommended: 中学数学1系統の縦スライス
  chosen: 中学数学1系統の縦スライス（体験ループ完成優先）
  chosen_type: auto-recommended
  depends_on: [D20260620-002]
  context: |
    例: 正負の数→文字式→一次方程式→一次関数 の 1 本の依存連鎖を MVP 収録。
    テックツリー + アンロック + 豆知識 + ステップ別自己採点の体験ループを完成させ、
    AI 生成+多段検証パイプラインもこの限定範囲で検証。横展開は MVP 後。

- id: D20260620-004
  timestamp: 2026-06-20T00:30:00+09:00
  command: /flow:concept
  phase: Step 2 / Q (グラフの見せ方)
  question: テックツリーの見せ方（認知負荷 vs 牽引力）
  options:
    - 現在地周辺フォーカス＋全体ミニマップ (recommended)
    - 全体俯瞰（全ノード一括）
    - リスト主体＋グラフ補助
  recommended: 現在地周辺フォーカス＋全体ミニマップ
  chosen: 現在地周辺フォーカス＋全体ミニマップ
  chosen_type: auto-recommended
  depends_on: [D20260620-003]
  context: |
    メイン表示は習得済み/次/その先 1〜2 ホップの周辺に絞り初学者の認知負荷を下げる。
    別途ミニマップ/ズームアウトで全体像と遠くのロマンノード（牽引力）も見える。
    React Flow の fitView/フォーカス遷移で実現。wants の「出しすぎない見せ方」リスクに対応。

- id: D20260620-005
  timestamp: 2026-06-20T00:40:00+09:00
  command: /flow:concept
  phase: Step 2 / Q (復習 SRS の要否)
  question: 間隔反復（SRS）を MVP に含めるか
  options:
    - MVP には入れず将来拡張 (recommended)
    - 軽量な復習（要復習マークのみ）
    - 本格的な SRS エンジン
  recommended: MVP には入れず将来拡張
  chosen: MVP には入れず将来拡張
  chosen_type: auto-recommended
  depends_on: [D20260620-003]
  context: |
    MVP は確定的進捗（学んだら習得済み・アンロック）のみ。SRS はデータモデル
    （復習スケジュール/定着度）+ スケジューリング + 通知を増やすため v2 へ。
    charter §2.2「シンプルに保つ・煽らない」とも整合。

- id: D20260620-006
  timestamp: 2026-06-20T00:45:00+09:00
  command: /flow:concept
  phase: Step 2 / Q12.7(1) 認証・identity 設計
  question: 進捗保存のための identity 設計
  options:
    - Clerk 匿名ゲスト → 課金/同期時に段階認証 (recommended)
    - 端末ローカル保存のみ（認証なし）
    - 初手からログイン必須
  recommended: Clerk 匿名ゲスト → 課金/同期時に段階認証
  chosen: Clerk 匿名ゲスト → 課金/同期時に段階認証（progressive auth, O22）
  chosen_type: auto-recommended
  depends_on: [D20260620-001]
  context: |
    preferences §2.4 Clerk 採用 8（強い選好）+ §3.1 + O22。
    ai-mindmap/gohoubi/otetsudai/michikusa と同型。冷たいリンク流入でも
    起動→即学習（0 タップ）、進捗はゲストのまま端末/クラウドに保存、
    他端末同期や tip-jar 課金時にのみ Google OAuth リンクで段階認証。

- id: D20260620-007
  timestamp: 2026-06-20T00:50:00+09:00
  command: /flow:concept
  phase: Step 2 / Q5,Q6,Q8,Q9 規模・NFR・体制
  question: データ規模 / 同時利用者数 / 非機能要件 / 体制・予算・納期
  options: []
  recommended: 個人ツール・無料枠厳守・小規模
  chosen: 小規模（DAU〜100 想定）/ 無料枠厳守 $0 / 個人開発 / 納期なし。NFR は数学的正確性（出力品質）最優先
  chosen_type: auto-recommended
  depends_on: [D20260620-001]
  context: |
    完全無料 Web サービス + tip-jar。preferences §4.5 個人ツール無料枠 $0 厳守 +
    Stripe 固定費ゼロ課金導線。NFR は学習サービス系で「数学的正確性 / 説明性 /
    自己採点の照合精度」を最優先項目に差し替え、性能・スケールは中優先。

- id: D20260620-008
  timestamp: 2026-06-20T00:55:00+09:00
  command: /flow:concept
  phase: Step 3 / 論点抽出
  question: 設計レベルで詰めるべき技術論点
  options:
    - "[論点-001] AI 多段クロス検証パイプラインの具体設計"
    - "[論点-002] 数式ステップの同値判定（自己採点の照合ロジック）"
  recommended: null
  chosen: null
  chosen_type: open
  depends_on: [D20260620-002]
  context: |
    [論点-001] 正確性担保の核。何モデル/何段レビュー/合格基準/不一致時の扱い/
    人手フォールバック不在下での最終ゲートを実装前に確定する必要。
    [論点-002] MathLive 入力のステップを模範解答とどう照合するか。文字列一致では
    不十分（同値な式の表現揺れ）。数式正規化（CAS/sympy 等）or AI 照合 or 併用を詰める。

- id: D20260620-009
  timestamp: 2026-06-20T08:45:00+09:00
  command: /flow:concept
  phase: Step 5.5 / wants クリーンアップ
  question: 入力 wants をクリアするか
  options: [クリアする, クリアせず残す, _archive に移送]
  recommended: クリアする
  chosen: クリアする
  chosen_type: explicit-choice
  depends_on: []
  context: 全話題は concept.md または §8 未決事項に反映済み。docs/wants.md 本文を空にし clear コメントを残した。

- id: D20260620-010
  timestamp: 2026-06-20T08:46:00+09:00
  command: /flow:concept
  phase: Step 7.5 / preferences 更新
  question: preferences.md を今回の decision で更新するか
  options: [すべて更新, 一部だけ更新, 更新しない]
  recommended: すべて更新
  chosen: すべて更新
  chosen_type: explicit-choice
  depends_on: [D20260620-001, D20260620-002]
  context: |
    Neon スタック core row +1（PJ 例に Math-Tree）、React Flow 1→2（傾向到達）、
    Turnstile 1→2、Claude API 生成+多段検証 新規行、新カテゴリ §2.25 MathLive+KaTeX。
    学習元 PJ 数 11→12。§7 更新履歴追記。

- id: D20260620-011
  timestamp: 2026-06-20T08:47:00+09:00
  command: /flow:concept
  phase: Step 7.7 / Git 自動コミット
  question: git init してドキュメント生成物を初回コミットするか
  options: [git init してコミット, git init しない]
  recommended: git init してコミット
  chosen: git init してコミット（commit b252c15、master、36 files、push なし）
  chosen_type: explicit-choice
  depends_on: []
  context: 公開予定 PJ。.gitignore（O25 秘密情報除外）作成、docs + README + .gitignore を 1 commit。秘密情報ステージなし確認済み。

- id: D20260620-012
  timestamp: 2026-06-20T08:48:00+09:00
  command: /flow:concept
  phase: Step 5.47 / SCENARIO 種別確認
  question: SCENARIO のシナリオ種別と進行フェーズ
  options: [新規 MVP 立ち上げ（そのまま採用）, 一部修正]
  recommended: 新規 MVP 立ち上げ（そのまま採用）
  chosen: 新規 MVP 立ち上げ（UI あり、Phase 1.5 デザイン含む）
  chosen_type: auto-recommended
  depends_on: [D20260620-001]
  context: UI を持つ PJ のため Phase 1.5 デザインシステム（/flow:design, O39）を含む標準 6 フェーズ構成。
```
