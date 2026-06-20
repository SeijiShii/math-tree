# 実装レポート: _shared/cost-tracking
## 実装日時
2026-06-20 12:39 (JST)
## 変更一覧
- `src/lib/cost/pricing.ts`: loadPricing（.env 単価、ハードコード禁止）+ estimateCost。
- `src/lib/cost/record.ts`: recordCall（ai_call_logs へ積算 + est_cost 算出 §4.6.2）。
- `src/lib/cost/aggregate.ts`: aggregateCost（機能別 + 合計）。
- `src/lib/cost/alert.ts`: checkFreeTierAlert（80/100/120%）。
## テスト
- 4/4 green: 積算+単価算出 / 機能別集計 / 閾値アラート / 単価未設定=0。typecheck green。
## PR Description
### タイトル
_shared/cost-tracking: コスト積算 + 無料枠アラート(§4.6.2)
