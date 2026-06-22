# 実装レポート: learning-workbook C20260622-003（問題表示）
## 実装日時 / モード
2026-06-22 (JST) / fix
## 変更一覧（Phase 1）
- db/grading.ts: `getProblemForLearning(slug)`（title/trivia/statementLatex/steps[order,hint]、模範解答非含 SEC-002、verified のみ SEC-005）。
- api/problem.ts（新規）: GET ?slug= owner 強制 → 問題取得（関数 8/12）。
- WorkbookView.tsx: useEffect で /api/problem?slug= 取得 → 単元名 + 問題文（読取専用 math-field）+ 豆知識 + ステップ手がかり + 解答ラベル表示。読込失敗ガード。
- screens.css: .problem-statement / .trivia / .answer-label。
- db/grading.test.ts: N1 / SEC-002 / E1 / SEC-005。
## 検証
typecheck / build green / 132 tests green / 関数 8（上限 12 内）。
## PR Description
### タイトル
fix(learning-workbook): 学習画面に問題文を表示（取得 API + 表示配線、C20260622-003）
### 概要
SPEC §6.1 未実装だった問題取得 API（模範解答非含）+ WorkbookView の問題表示を実装。
