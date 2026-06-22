# リグレッションテスト計画
## 再発防止（equivalence.test.ts、10 ケース）
| 対象 | 期待 |
|---|---|
| gradeProcess("2","2") / ("3","2") | true / false |
| gradeProcess("-3+5","2") | true（=なし式） |
| gradeProcess("-3+5=2","2") | true（イコール途中式・本要件） |
| gradeProcess("(-3)+5=5-3=2","2") | true（複数ステップチェーン） |
| gradeProcess("-3+5=3","2") | false（途中式誤り） |
| gradeProcess("2x+3=3+2x","3+2x") | true（文字式チェーン） |
| gradeProcess("2 +","2") | null（parse 不能） |
| gradeProcess("","2") / ("=","2") | null（空） |
## gradeAnswer（既存維持 + E3 メッセージ更新）
N1 正解 / E1 誤答 hint / E3 判定不能メッセージ「判定できません」/ N2 AI。
