# 変更計画書（複数問題 + ランダム + 合格率 + スコア）
## 1. 既存ファイル変更
| ファイル | 変更 | リスク |
|---|---|---|
| db/seed-data.json | 各 unit の problems を複数化（簡単な単元は ~8-10 問、数値バリエーション） | 低（データ追加） |
| db/grading.ts | getProblemsForSession(slug,K)（ランダム K 問, 模範解答非含）+ getStepByProblemId(problemId,stepIndex) 追加。既存 getStepForGrading/getProblemForLearning は維持 | 中 |
| src/features/learning-workbook/gradeAnswer.ts | problemId 任意引数を受け、あれば getStepByProblemId で採点（無指定は先頭=後方互換） | 中 |
| api/problem.ts | セッション（K 問配列）を返す | 中 |
| api/grade-step.ts | body の problemId を gradeAnswer へ渡す | 低 |
| src/features/learning-workbook/WorkbookView.tsx | セッション state（問題配列/現在index/正答数）+ ライブスコア + 合否→master/再挑戦 | 高 |
| src/lib/learning/session.ts（新規） | スコア/合否の純ロジック（pickSession 並べ替えは grading 側、scoreOf/passed の純関数） | 低 |
| src/styles/screens.css | .score-bar / .session-progress | 低 |
## 4. マイグレーション
不要（schema 既対応、seed 追加のみ）。
## 5. 実装 Phase
- Phase 1: grading.ts（getProblemsForSession + getStepByProblemId）+ gradeAnswer problemId + session 純ロジック + テスト。
- Phase 2: api（problem セッション / grade-step problemId）。
- Phase 3: seed 拡充（各単元 複数問）。
- Phase 4: WorkbookView セッション UI + ライブスコア + 合否。
## 9. DoD
- [ ] プールから K 問ランダム抽出（模範解答非含）
- [ ] problemId で正しい問題を採点
- [ ] ライブスコア表示 + 60% で習得→アンロック / 未満で再挑戦
- [ ] 全テスト green / 本番スモーク
