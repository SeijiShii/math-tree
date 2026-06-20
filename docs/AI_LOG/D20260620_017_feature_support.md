# AI_LOG セッション D20260620_017 — /flow:feature (support)

**実行日時**: 2026-06-20 10:08 (+09:00)
**コマンド**: /flow:feature support（/flow:auto 反復15、インライン実行）
**対象**: support（機能: tip-jar）
**状態**: 完了
**含まれる decision**: D20260620-041

## 主要決定サマリ
| D20260620-041 | 支援課金設計 | tip-jar 100円 Stripe 単発 + Webhook 署名検証/冪等 + 価格透明性(O43) | auto-recommended |

## Decisions
```yaml
- id: D20260620-041
  timestamp: 2026-06-20T10:08:00+09:00
  command: /flow:feature
  phase: Step 2-3 / 支援課金設計
  question: support の構成
  options: []
  recommended: null
  chosen: SupportButton(100円明示)+checkout+webhook(署名検証/冪等)。サブスク・任意金額・有料アンロックなし
  chosen_type: auto-recommended
  depends_on: [D20260620-035, D20260620-016]
  context: |
    charter §1.2 100円応援のみ(安易な課金パス採らない)。SEC-001 owner scoped。Webhook 署名検証必須+冪等。
    O43 価格を CTA 前に明示。支援失敗でも機能制限なし(完全任意)。test→live は release。月固定費ゼロ。
```
