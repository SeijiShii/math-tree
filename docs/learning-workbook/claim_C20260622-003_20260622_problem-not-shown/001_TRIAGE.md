# クレーム判定レポート

**claim id**: C20260622-003
**判定日**: 2026-06-22
**判定者**: Claude (Opus 4.8) + seiji
**判定**: **バグ (fix)**

## 1. 三項照合
### 1.1 期待
学習画面に解くべき問題文（+ 単元名/豆知識/ステップ手がかり）が表示される（concept §1.1 UC#5）。
### 1.2 既存仕様 (Spec)
- learning-workbook SPEC §6.1: 「**GET /api/units/:slug/problem → StepPrompt[]（模範解答非含, SEC-002）**」で問題を取得し、MathLive で途中式を書く設計。
- DB: `problems.statementLatex`（問題文）+ `steps`（order/hint、modelAnswerLatex は非公開）が seed 済（db/seed.test.ts）。
### 1.3 現実 (Actual)
- `src/features/learning-workbook/WorkbookView.tsx`: `<h1>{slug}</h1>` + 空 `<math-field>` + 「答え合わせ」のみ。**問題を fetch する処理が皆無**。
- API: `api/curriculum.ts`（units 一覧、problem 非含）/ `api/grade-step.ts`（採点のみ）。**SPEC §6.1 の問題取得 endpoint が未実装**（api/ に 7 関数あるが problem 取得用は無い）。
### 1.4 照合結果
期待（問題表示 = SPEC §6.1）≠ 現実（endpoint も表示も未実装）→ **バグ (fix)**。SPEC で設計済みの取得 API + 表示が実装漏れ。

## 2. 判定根拠
1. 期待は concept UC#5 + SPEC §6.1 に明記（問題取得 API + 表示）= 解釈余地なし（revise でない）。
2. learning-workbook 機能・データ（problems.statementLatex）は存在（feature でない、新規 SPEC 不要）。
3. 現実は SPEC §6.1 の実装漏れ（取得 endpoint 不在 + WorkbookView 未表示）= バグ。
4. severity=high: 問題が見えなければ学習が成立しない中核 UC。

## 3. 推奨分岐先
- **コマンド**: `/flow:fix`
- **引数**: `learning-workbook C20260622-003 --severity=high --from-claim=C20260622-003`
- **修正方向（fix で詳細化）**: (1) 公開問題取得（slug→{title, trivia, statementLatex, steps[order,hint]}、modelAnswerLatex 非含 SEC-002）のクエリ + API endpoint 追加（関数 7→8、上限 12 内）。(2) WorkbookView で問題を fetch し、単元名・問題文（数式描画）・豆知識・現ステップ手がかりを表示。

## 6. 関連
- クレーム原文: ./000_CLAIM_REPORT.md
- 分岐先: ../fix_C20260622-003_20260622_*/
