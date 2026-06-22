# 実装レポート: curriculum-generation C20260622-007（広大ツリー + AI全生成 + 定期バッチ + 成長プール）
## 2026-06-22 / revise / Phase 1-4 完了（実生成 Phase 5 は key-gated）
## 実装（Class A, mock AI で決定的テスト）
### Phase 1-2（commit bbddb4a）
- poolPolicy.ts: POOL_MAX=30 / TOPUP_UNIT_CAP=5 / TOPUP_PROBLEM_CAP=5、normalizeStatement/dedupNew/selectTopupUnits/topupCount。
- generateProblems.ts: AI 生成→parseProblems→CAS 一次チェック(areEquivalent、方程式は素通し)→dedup→多段クロス検証(runCrossValidation)→verified のみ problems/steps 追記 + reviews 記録。
### Phase 3-4（commit 10e4ab8）
- generateUnits.ts: AI が {units,edges} 生成→parseTree→hasCycle(循環検出で拒否)→クロス検証→verified 単元追記(既存 slug skip=壊さない) + unitEdges。
- curriculumSyllabus.ts: 中学1〜高校数A の系統・単元・依存骨格（生成ガードレール、buildSyllabusPrompt）。
- runGeneration.ts: bootstrap(空ツリーは系統生成) + top-up(プール未満を per-run CAP で問題追記) オーケストレーション。
- api/cron/generate.ts: Vercel Cron（CRON_SECRET 認証、makeAiClientFromEnv 無=503、runGeneration）。関数 10/12。
- scripts/generate-curriculum.mjs: バッチ（cron endpoint を CRON_SECRET で反復トリガ）。vercel.json crons(日次) + package.json generate:curriculum + .env.example(CRON_SECRET/CURRICULUM_MODELS)。
## 検証
typecheck/build green / 181 tests green（追加 22: poolPolicy/generateProblems 12 + generateUnits 7 + runGeneration 3）。
## Phase 5（key-gated, Class C/B-4 — 本セッション外）
1. prod env に ANTHROPIC_API_KEY + CRON_SECRET + CURRICULUM_MODELS 設定（Class C 人間）。
2. デプロイ（cron 登録）。3. `npm run generate:curriculum` で bootstrap（中学→高校数I・A、実 AI コスト B-4 本人承認）。4. 本番で広大ツリー + 成長プール + 再挑戦の新鮮さを実検証。Cron が日次 top-up。
## 新鮮さの仕組み
プール成長（追記）× ランダム K 出題（C20260622-006）→ 再挑戦で異なる問題。
