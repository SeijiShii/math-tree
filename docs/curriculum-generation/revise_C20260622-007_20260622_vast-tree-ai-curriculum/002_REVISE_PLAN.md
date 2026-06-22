# 変更計画書（広大ツリー + AI 全生成 + 定期バッチ + 成長プール）
## 1. 既存ファイル変更
| ファイル | 変更 | リスク |
|---|---|---|
| src/features/curriculum-generation/pipeline.ts | validateAndStore を units 限定 → edges/problems/steps 追記対応に拡張（dedup/POOL_MAX） | 中 |
| vercel.json | crons 追加（api/cron/generate を日次） | 低 |
| package.json | scripts に generate:curriculum 追加 | 低 |
| .env.example | ANTHROPIC_API_KEY（既存）+ CRON_SECRET 追加 | 低 |
## 2. 新規ファイル
| ファイル | 責務 | LOC |
|---|---|---|
| src/features/curriculum-generation/curriculumSyllabus.ts | 中学〜高校数I・A の系統・単元見出し・依存骨格（生成ガードレール） | ~120 |
| src/features/curriculum-generation/generateUnits.ts | Claude→{units,edges} 生成 + JSON parse + 循環検出 + クロス検証→保存 | ~90 |
| src/features/curriculum-generation/generateProblems.ts | Claude→{problems} 生成 + クロス検証 + CAS 一次チェック + dedup 追記 | ~110 |
| src/features/curriculum-generation/poolPolicy.ts | POOL_MAX/CAP/dedup(normalize statement)/top-up 対象選定 の純ロジック | ~60 |
| scripts/generate-curriculum.mjs | バッチ（--line / --mode=bootstrap\|topup、prod DB + 実 AI） | ~90 |
| api/cron/generate.ts | Vercel Cron（CRON_SECRET 認証、per-run CAP 内で top-up）。関数 10/12 | ~50 |
## 3. 削除ファイル
なし（db/seed-data.json は bootstrap の最小フォールバックとして残す）。
## 4. マイグレーション要否
不要（schema 既存、生成データ追加のみ）。
## 5. 実装 Phase 分割
- Phase 1: poolPolicy（純ロジック: dedup/POOL_MAX/CAP/top-up 選定）+ テスト。
- Phase 2: generateProblems（mock AI で生成→クロス検証→dedup 追記）+ pipeline.ts 拡張 + テスト。
- Phase 3: generateUnits（mock AI で {units,edges}→循環検出→検証→保存）+ curriculumSyllabus + テスト。
- Phase 4: scripts/generate-curriculum.mjs（bootstrap/topup）+ api/cron/generate（CRON_SECRET）+ vercel.json crons。
- Phase 5: [key-gated, Class C/B-4] ANTHROPIC_API_KEY 設定 → bootstrap 実行（中学→高校数I・A）→ tech-tree レイアウト確認 → Cron 有効化。
## 6. 依存順序
poolPolicy → generateProblems/Units（pipeline 拡張）→ batch/cron → 実生成。
## 7. ロールアウト
| 1 コード+mockテスト green（Class A）| 2 キー設定（Class C）| 3 bootstrap 実行（Class B-4 本人承認）| 4 Cron 有効化 |
## 8. リスク
- AI 生成の数学的誤り → 多段クロス検証 + CAS 一次チェック + verified のみ配信で防御。
- コスト暴走 → per-run CAP + ai_call_logs 積算 + 月次上限。
- 広大グラフの React Flow レイアウト → tech-tree の自動レイアウト確認（Phase 5）。
## 9. DoD
- [ ] poolPolicy/generateProblems/generateUnits が mock AI で green（dedup・循環検出・クロス検証ゲート）
- [ ] バッチ + Cron が CAP/CRON_SECRET 込みで動作（mock）
- [ ] [key後] bootstrap で ~40-50 単元 verified 生成 + 成長プール + 再挑戦で別問題を本番確認
