# 実装レポート: feedback
## 実装日時
2026-06-20 12:46 (JST)
## 変更一覧
- `src/features/feedback/ingest.ts`: ingestFeedback（**送信前 PII scrub** SEC-003 → 保存。即時通知/feedback-hub は integration で配線）。
## テスト
- 3/3 green: 👍 保存 / バグ本文 PII 除去(SEC-003) / owner null 許容。typecheck green。
## PR Description
### タイトル
feedback: 👍/👎+バグ報告（PII scrub SEC-003）
