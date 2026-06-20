# 実装レポート: learning-workbook
## 実装日時
2026-06-20 12:42 (JST)
## 変更一覧
- `src/features/learning-workbook/equivalence.ts`: latexToExpr + areEquivalent（**mathjs CAS 同値判定**、[論点-LW1]、判定不能は null）。
- `src/features/learning-workbook/gradeStep.ts`: gradeStep（**CAS 優先 + AI フォールバック**、模範解答 server-only SEC-002）。
- `src/features/learning-workbook/master.ts`: masterUnitAndUnlock（習得→次ノード unlocked、UC-LW1 #7）。
## テスト
- 8/8 green: 2x+3≡3+2x / ½≡0.5 / 2x+3≠2x+4 / 2(x+1)≡2x+2 / CAS 正解(AI不使用) / CAS 誤答+ヒント / CAS 不能→AI フォールバック / 習得→アンロック。typecheck green。
## 論点解決
[論点-LW1]（concept [論点-002]）= CAS 正規化優先 + AI フォールバック を mathjs で実装・検証。
## PR Description
### タイトル
learning-workbook: MathLive ステップ別自己採点（CAS 同値判定）
