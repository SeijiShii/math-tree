# curriculum-generation 変更仕様書（広大ツリー + AI 全生成 + 定期バッチ + 成長プール）
> 改修種別: 機能拡張 / issue: C20260622-007 / 基準 SPEC: ../001_curriculum-generation_SPEC.md
> タグ: feature, server-only, analytics(生成コスト), scheduled(cron) / 最終更新: 2026-06-22
## 1. 変更概要
手動 seed 5 単元（中1）を、**AI が中学〜高校数I・A（~40-50 単元）のツリー構造＋問題を生成→多段クロス検証→verified 保存**するパイプラインに置換・拡張。**定期バッチ（Vercel Cron）で各単元の問題プールを継続成長**させ、ランダム出題（C20260622-006）と合わせて**再挑戦時に異なる新鮮な問題**を供給する。
## 2. 変更前 vs 変更後
### 2.1 UC 変更
| UC | 変更前 | 変更後 |
|---|---|---|
| カリキュラム調達 | db/seed-data.json 手動 5 単元（中1） | AI 生成バッチ: 中学〜高校数I・A ~40-50 単元（ツリー構造+依存+問題を生成→クロス検証→verified 保存） |
| 問題プール | seed 固定 10 問/単元 | 定期バッチで verified 問題を**追記成長**（上限まで）。再挑戦で別問題 |
| ツリー構造 | 手動 edges | AI 生成（依存エッジ含む、循環検出で拒否） |
### 2.2 入出力変更
| 対象 | 変更前 | 変更後 | 互換 |
|---|---|---|---|
| generateUnits(line)（新規 server） | — | Claude が系統シラバスから 単元+依存エッジ を生成→検証→保存 | 新規 |
| generateProblems(unit, n)（新規 server） | — | Claude が単元の問題（statement+模範解答+step+hint）を n 問生成→クロス検証→**プールに追記**（dedup） | 新規 |
| バッチ `npm run generate:curriculum --line=<系統> --mode=bootstrap\|topup`（新規） | — | bootstrap=ツリー全生成 / topup=各単元に新鮮問題を追加 | 新規 |
| Vercel Cron `api/cron/generate`（新規, CRON_SECRET 認証） | — | 定期実行で各単元プールを top-up（per-run コスト上限内） | 新規（関数 10/12） |
| GET /api/curriculum・/api/problem（既存） | 5 単元 | ~40-50 単元・成長プールをそのまま配信（変更なし、SEC-005 verified のみ） | 互換維持 |
### 2.3 データモデル変更
| エンティティ | 変更 | マイグレーション |
|---|---|---|
| units/unit_edges | 生成バッチが投入（~40-50 単元・依存）。schema 変更なし | 不要 |
| problems/steps | 生成バッチが**追記**（プール成長、上限 POOL_MAX/単元）。dedup=同一 normalized statement 回避 | 不要 |
| reviews | クロス検証履歴を記録（既存） | 不要 |
| ai_call_logs | 生成/検証コスト積算（既存 cost-tracking） | 不要 |
## 3. 影響範囲
| 対象 | 影響度 | 説明 |
|---|---|---|
| curriculum-generation | 高 | 生成ロジック・バッチ・Cron 新設 |
| tech-tree | 中 | 広大グラフを表示（既存の buildGraph/unlock がそのまま ~40-50 単元を描画。レイアウト確認要） |
| learning-workbook | 低 | 成長プールをセッション（C20260622-006）が消費（変更なし） |
| _shared/ai, _shared/cost-tracking | 中 | 生成呼び出し + コスト上限 |
## 4. 後方互換性
互換維持 ✅。生成は**追記**で既存 5 単元/問題を壊さない（bootstrap は既存 slug を ON CONFLICT skip、新単元のみ追加）。公開 API 形状は不変。
## 5. ロールバック方針
コード revert 可。生成物は under_review 隔離（verified のみ配信）で品質ゲート、不良は DB 行削除で撤回。Cron は vercel.json から外す/CRON_SECRET 無効化で停止。
## 6. リリース戦略
段階的:
1. **コード実装**（mock AI クライアントで決定的テスト、Class A）
2. **ANTHROPIC_API_KEY 設定**（prod env、Class C 人間）
3. **bootstrap バッチ実行**（中学範囲 → クロス検証 → 高校数I・A、Class B-4 実コスト・本人承認）
4. **Cron 有効化**（定期 top-up、per-run コスト上限内）
## 7. 詳細仕様（新仕様）
- **シラバス定義** `curriculumSyllabus.ts`: 中学〜高校数I・A の系統・単元見出し・依存の骨格（生成プロンプトのガードレール＝AI に丸投げせず教育的妥当性の枠を与える）。
- **生成 → 検証 → 保存**:
  - generateUnits(line): Claude が {units[{slug,title,systemicLine,description,trivia}], edges[[from,to]]} を JSON 生成 → 循環検出 → 各単元 runCrossValidation（数学/依存妥当性、重大指摘ゼロ + 多数決）→ verified を units/unit_edges へ。
  - generateProblems(unitSlug, n): Claude が {problems[{statementLatex, modelAnswerLatex, hint}]} を生成 → 各問 runCrossValidation（数学的正確性: statement≡modelAnswer を CAS でも一次チェック）→ verified を problems/steps へ**追記**（dedup: normalized statement 既存と重複しない、POOL_MAX/単元まで）。
- **定期 top-up**: Cron が各単元のプールが POOL_MAX 未満なら n 問 top-up（per-run 単元数・問題数を CAP、ai_call_logs でコスト積算、上限超で停止）。
- **新鮮さ**: プール成長 + ランダム K 問抽出（C20260622-006）→ 再挑戦で異なる問題。
- **SEC-005**: 公開エンドポイントは AI 直叩き不可（事前生成 verified のみ配信）。Cron/バッチは server-only + CRON_SECRET/運用者。
## 8. タグ別追加項目
- analytics: 生成/検証コストを ai_call_logs + cost-tracking に積算、per-run/月次上限。
- scheduled: Vercel Cron（vercel.json crons）。CRON_SECRET で認証（公開トリガ不可）。
## 9. 未決事項（実装時に Class A で確定）
- POOL_MAX（単元あたり問題上限、推奨 30）/ Cron 頻度（推奨 日次）/ per-run CAP（推奨 5 単元 × 5 問）/ 生成・検証モデル選定（cost-tracking と整合）。判断期限: tdd 実装時。
## 10. 更新履歴
| 2026-06-22 | 初版作成 | /flow:revise |
