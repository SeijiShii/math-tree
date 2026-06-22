# 単体テスト計画
## 追加
| 対象 | ケース |
|---|---|
| getProblemsForSession | verified のみ / distinct K 問 / pool<K は全部 / 模範解答非含(SEC-002) / 未知 slug=[] |
| getStepByProblemId | 指定 problem の step を返す / 未知 id=null |
| gradeAnswer(problemId) | problemId 指定でその問題を採点 / 無指定は先頭(後方互換) |
| session 純ロジック | scoreOf(正答数/総数) / passed(rate>=0.6) 境界（3/5=true, 2/5=false） |
## 修正
| gradeAnswer.test | problemId 任意化に伴い既存（無指定=先頭）は維持して通る |
## リグレッション
gradeProcess(=チェーン)/master/tech-tree/problem 既存維持。
