# 実装レポート: _shared/ai
## 実装日時
2026-06-20 12:33 (JST)
## 変更一覧
- `src/lib/ai/types.ts`: AiClient interface（generate/review、O35 差し替え可能）。
- `src/lib/ai/mock.ts`: MockAiClient（テスト注入、実 Anthropic SDK は integration phase で inject）。
- `src/lib/ai/piiScrub.ts`: scrubPII（email/電話/位置を送信前除去 SEC-003）。
- `src/lib/ai/crossValidation.ts`: runCrossValidation（[論点-CG1] 異モデル多数決 + 重大指摘ゼロ → verified）。
## テスト
- 4/4 green: PII scrub / 多数決 pass→verified / 重大指摘→差し戻し / 多数決未達→差し戻し。typecheck green。
## PR Description
### タイトル
_shared/ai: Claude クライアント基盤（多段検証 + PII scrub SEC-003）
