# 修正計画
## 1. 修正対象
| ファイル | 内容 |
|---|---|
| equivalence.ts | `gradeProcess(input, model)` 追加。「=」で分割→各セグメント相互同値（途中式の正しさ）＋末尾＝模範解答 で採点。1セグメントは従来同値。parse 不能は null |
| gradeAnswer.ts | areEquivalent → gradeProcess に置換。判定不能メッセージを「式を確認して、もう一度入力」に（「=を付けるな」案内は撤回） |
| WorkbookView.tsx | ラベル「計算の途中を書いて答え合わせ」+ ヘルプ「計算の経過を『=』でつないで書けます（例: -3+5 = 2）」。入力欄に .answer-field クラス |
| screens.css | .answer-field（surface-raised 枠 + focus で primary 境界、design-system §5）。読取専用の問題文と区別 |
## 2. 範囲限定
採点のイコールチェーン対応 + 入力欄 UX。ステップ進行（多段 step）の本格実装は別途（seed は現状 1 step）。
## 4. リリース戦略
即時。tdd green → CLI デプロイ → 本番 /learn で「-3+5=2」→正解 を実検証。
## 7. DoD
- [ ] gradeProcess が -3+5=2 / チェーン / 答えのみ を正しく採点（142 green）
- [ ] 入力欄が「入力箇所」と分かるテーマ
- [ ] 本番で途中式入力→正解 を実検証
