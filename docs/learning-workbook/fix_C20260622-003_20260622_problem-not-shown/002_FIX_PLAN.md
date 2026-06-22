# 修正計画: 問題表示の配線
## 1. 修正対象
| ファイル | 内容 |
|---|---|
| db/grading.ts | `getProblemForLearning(slug)` 追加（title/trivia/statementLatex/steps[order,hint]、modelAnswerLatex 非含 SEC-002、verified のみ SEC-005） |
| api/problem.ts（新規） | GET ?slug= owner 強制（SEC-001）→ getProblemForLearning → 200/404（関数 7→8、上限 12 内） |
| src/features/learning-workbook/WorkbookView.tsx | useEffect で /api/problem?slug= 取得 → 単元名 + 問題文（読取専用 math-field）+ 豆知識 + ステップ手がかり + 解答入力ラベルを表示 |
| src/styles/screens.css | .problem-statement / .trivia / .answer-label |
## 2. 範囲限定
SPEC §6.1 の問題取得 + 表示のみ。採点（grade-step）は既存維持。
## 3. 副作用なき確認
既存テスト維持（smoke.test は "/" で WorkbookView 非マウント）。追加: db/grading.test（SEC-002/005）。手動: 本番 /learn で問題文表示。
## 4. リリース戦略
即時（high）。tdd green → CLI デプロイ → 本番で問題表示を実検証。
## 5. ロールバック
コード revert で戻せる ✅。DB 影響なし。
## 7. DoD
- [ ] /api/problem?slug= が問題文 + steps（模範解答非含）を返す
- [ ] WorkbookView に問題文・豆知識が表示
- [ ] SEC-002/005 テスト green / 既存破壊なし
- [ ] 本番で問題表示を実検証
