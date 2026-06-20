# 実装レポート: _shared/legal
## 実装日時
2026-06-20 12:35 (JST)
## 変更一覧
- `src/content/legal/privacy.ts`: プラポリ（**ゲスト匿名特例: セルフサービス削除明記 / 窓口削除を約束しない** SEC-004/O54）。
- `src/content/legal/terms.ts`: 利用規約（AI 生成の正確性免責 + tip-jar 返金不可）。
- `src/content/legal/sct.ts`: 特定商取引法表記。
## テスト
- 3/3 green: セルフサービス削除明記 / 履行不能な窓口削除約束なし(SEC-004) / 免責文言。typecheck green。
## PR Description
### タイトル
_shared/legal: 法務書類（DSR セルフ削除文言 SEC-004）
