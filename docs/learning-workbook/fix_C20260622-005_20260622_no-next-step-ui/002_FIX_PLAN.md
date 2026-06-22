# 修正計画
## 修正対象
| ファイル | 内容 |
|---|---|
| master.ts | `masterUnitBySlug(ownerId, slug)` 追加（slug→unitId 解決 + masterUnitAndUnlock） |
| api/master.ts（新規） | POST ?slug= owner 強制 → {mastered, unlockedNext[]}（関数 8→9, 上限 12 内、SPEC §2.2） |
| WorkbookView.tsx | 正解時に /api/master 呼び出し → 習得完了パネル「習得しました🎉 次の単元が開きました」+「テックツリーに戻る」導線（/ へ navigate）。「次のステップへ」over-promise 文言を撤去 |
| screens.css | .mastered-panel（success トーン） |
## 範囲限定
習得→アンロック+完了 UI。多段ステップ進行（seed 1step）は将来。
## リリース戦略
即時（high）。tdd green → CLI デプロイ → 本番で習得→アンロック→戻る導線 + 2 単元目アンロックを実検証。
## ロールバック
コード revert + api/master.ts 削除で戻せる。DB は progress 行が増えるのみ（破壊なし）。
## DoD
- [ ] POST /api/master が mastered + unlockedNext を返す
- [ ] 正解→習得完了パネル + テックツリーへ戻る導線
- [ ] 戻った先で次ノードが unlocked（クリック可）
- [ ] 146 green / 既存破壊なし / 本番実検証
