# クレーム判定レポート
**claim id**: C20260622-005 / **判定日**: 2026-06-22 / **判定**: **バグ (fix)**
## 1. 三項照合
### 1.1 期待
正解（最終ステップ）→ 習得記録（mastered）→ 次ノードアンロック + 次へ/完了の導線（concept UC#7）。
### 1.2 既存仕様 (Spec)
- concept §1.1 UC#7「1 問を最後まで解き切ると単元が習得済みになり、テックツリー上で次のノードがアンロック」。
- learning-workbook SPEC §6.1「最終ステップ到達で習得 → progress を mastered に、次ノードアンロック」。
- SPEC §2.2「**POST /api/units/:slug/master → {mastered, unlockedNext[]}**（owner）」。
- 実装: `src/features/learning-workbook/master.ts` の `masterUnitAndUnlock` 済（workbook.test で検証済）。
### 1.3 現実 (Actual)
- WorkbookView.grade(): 正解時に文字列「正解。次のステップへ」を表示するのみ。次へ UI / 習得呼び出し / 遷移なし。
- api/grade-step.ts: 採点のみ（progress 前進なし）。
- 習得 endpoint（SPEC §2.2）未実装。masterUnitAndUnlock はどこからも呼ばれない（orphaned）。
- seed は 1 problem = 1 step。よって正解 = 単元完了であり「次のステップへ」という文言自体も不正確。
### 1.4 照合結果
期待（習得→アンロック+導線 = SPEC §6.2/§2.2/UC#7）≠ 現実（メッセージのみ・endpoint/UI/習得配線すべて未実装）→ **バグ (fix)**。
## 2. 判定根拠
1. 期待は concept UC#7 + SPEC §6.1/§6.2/§2.2 に明記（習得→アンロック + 導線）= 解釈余地なし（revise でない）。
2. 機能・ロジック（masterUnitAndUnlock）は実装済み（feature でない）。
3. 現実は SPEC §2.2 endpoint 未実装 + UI 未配線 = 実装漏れ（バグ）。メッセージが実装と乖離して over-promise。
4. severity=high: 解く→習得→アンロックの中核ループが閉じず、2 単元目以降に進めない。
## 3. 推奨分岐先
- **コマンド**: `/flow:fix`
- **引数**: `learning-workbook C20260622-005 --severity=high --from-claim=C20260622-005`
- **修正方向**: (1) `POST /api/master?slug=`（owner 強制）→ masterUnitAndUnlock → {mastered, unlockedNext[]}（関数 8→9, 上限 12 内）。(2) WorkbookView: 正解（最終ステップ）→ master 呼び出し → 「習得しました！次の単元が開きました」+ 「テックツリーに戻る」導線（/ へ navigate、次ノードが unlocked 表示に）。単一ステップ seed に合わせ文言も「次のステップへ」→ 完了文言に修正。
## 6. 関連
- クレーム原文: ./000_CLAIM_REPORT.md / 分岐先: ../fix_C20260622-005_20260622_*/
