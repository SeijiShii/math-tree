# リグレッションテスト計画: 問題表示
## 1. 再発防止（db/grading.test.ts）
| ID | 対象 | 期待 |
|---|---|---|
| N1 | getProblemForLearning | title/statementLatex/trivia/steps[order,hint] を返す |
| SEC-002 | 返却 JSON | modelAnswerLatex/normalizedForm/模範解答値を含まない |
| E1 | 未知 slug | null |
| SEC-005 | 未 verified unit/problem | null（配信しない） |
## 2. 類似境界
| ID | 境界 | 期待 |
|---|---|---|
| B1 | problem に steps 複数 | order 昇順で返る |
## 3. 既存維持
| ID | テスト | 理由 |
|---|---|---|
| K1 | smoke.test.tsx | "/" で WorkbookView 非マウント、影響なし |
| K2 | gradeAnswer/tech-tree 系 | 採点・グラフは不変 |
## 6. カバレッジ
getProblemForLearning 分岐 100%。実表示は本番スモークで担保。
