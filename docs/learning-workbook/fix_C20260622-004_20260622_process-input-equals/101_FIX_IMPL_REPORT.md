# 実装レポート: learning-workbook C20260622-004（途中式イコール入力 + 入力欄 UX）
## 実装日時 / モード
2026-06-22 (JST) / fix（要件: 計算の途中経過を=で繋いで学べる）
## 変更一覧
- equivalence.ts: `gradeProcess(input, model)` 追加（「=」分割→各セグメント相互同値＋末尾＝模範解答、1セグメントは従来同値、parse 不能 null）。
- gradeAnswer.ts: areEquivalent→gradeProcess。判定不能メッセージを「式を確認して、もう一度入力」に変更（「=を付けるな」案内を撤回）。
- WorkbookView.tsx: ラベル「計算の途中を書いて答え合わせ」+ ヘルプ「『=』でつないで書けます（例: -3+5 = 2）」+ 入力欄 .answer-field。
- screens.css: .answer-field（surface-raised 枠 / focus で primary 境界 + ring、design-system §5）。読取専用問題文と区別。
- equivalence.test.ts（新規 10）。
## 検証
typecheck / build green / 142 tests green。
## PR Description
fix(learning-workbook): 計算の途中経過（=チェーン）を採点 + 入力欄を明確化（C20260622-004）
