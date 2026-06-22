# 実装レポート: learning-workbook C20260622-006（複数問題プール + ランダム + 合格率 + スコア）
## 2026-06-22 / revise
## 変更
- db/seed-data.json: 各単元を 10 問に拡充（数値バリエーション、CAS 検証済）。
- db/grading.ts: getProblemsForSession(slug,K)（プールから K 問ランダム distinct, 模範解答非含 SEC-002/verified のみ SEC-005）+ getStepByProblemId。
- src/lib/learning/session.ts（新規）: SESSION_SIZE=5 / PASS_RATE=0.6 / scorePercent / passed。
- src/features/learning-workbook/equivalence.ts: 分配・展開を rationalize で正規化（simplify が積を展開しないため）+ 累乗 x^{2} 解釈。
- src/features/learning-workbook/gradeAnswer.ts: problemId 任意引数（あればその問題を採点、無指定は先頭=後方互換）。
- api/problem.ts: セッション（K 問配列）を返す。api/grade-step.ts: problemId を gradeAnswer へ。
- WorkbookView.tsx: セッション state（K 問/現在index/正答数）+ 進捗「第N問/全M問」+ ライブスコア「現在X/Y正解」+ 合否（60%で習得→アンロック完了パネル / 未満で再挑戦パネル→新ランダムセッション）。
- screens.css: .session-progress / .score-badge / .failed-panel。
- scripts/migrate-seed.mjs: 既存 unit の問題プールを seed-data に同期（delete+reinsert、複数問題対応）。
## テスト
typecheck/build green / 159 tests green（session 3 / grading session・problemId 6 / equivalence 分配展開 4）。関数 9/12。
## 検証予定
本番: migrate-seed で問題プール同期 → /api/problem が複数問返す / セッションでスコア・60% 合格→アンロック。
