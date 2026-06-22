# 実装レポート: learning-workbook C20260622-005（習得→アンロック+完了UI）
## 2026-06-22 / fix
## 変更
- master.ts: masterUnitBySlug 追加（slug 解決 + masterUnitAndUnlock）。
- api/master.ts（新規）: POST ?slug= owner 強制 → {mastered, unlockedNext[]}（SPEC §2.2、関数 9/12）。
- WorkbookView.tsx: 正解→/api/master→習得完了パネル「習得しました🎉」+ 状況文 +「テックツリーに戻る」(navigate /)。over-promise 文言撤去。
- screens.css: .mastered-panel。
- master.test.ts（新規 4）。
## 検証
typecheck/build green / 146 tests green / 関数 9。
## PR
fix(learning-workbook): 正解で習得→次ノードアンロック + 完了導線（C20260622-005）
