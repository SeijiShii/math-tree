# 根本原因分析
## 5 Whys（採点側）
| # | 問い | 答え |
|---|---|---|
| Why1 | なぜ -3+5=2 が採点されないか | areEquivalent が「=」入りを parse 不能で null → 採点不能扱い |
| Why2 | なぜ「=」を扱えないか | 採点は単一式同値（mathjs simplify(a-b)）のみで、イコールチェーン（途中式）を想定していない |
| Why3 | なぜ想定外か | 「答え＝最終値の単一式」前提で実装し、計算の途中経過入力（=で繋ぐ）の採点を設計に落とし込んでいなかった |
| 根本原因 | — | **途中式（イコールチェーン）入力の採点が未実装**。加えて入力欄が design-system §5 未適用で「入力箇所」と分からない（UX） |
## 直接原因
- src/features/learning-workbook/equivalence.ts: 「=」を含む入力を扱う関数が無い。
- gradeAnswer.ts: 「=」入力で null → 「準備中…展開・整理」の混乱メッセージ。
- WorkbookView 入力 math-field: テーマ未適用（白box）+ ラベル不明瞭。
## 寄与要因
| 種別 | 内容 |
|---|---|
| 設計漏れ | 途中式入力（=チェーン）の採点仕様が未具体化 |
| デザイン未適用 | 入力 math-field が design-system §5（surface-raised枠/focus primary）未適用 |
