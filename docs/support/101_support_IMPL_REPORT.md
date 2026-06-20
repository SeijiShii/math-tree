# 実装レポート: support
## 実装日時
2026-06-20 12:50 (JST)
## 変更一覧
- `src/features/support/checkout.ts`: createCheckoutParams（固定 100 円 + 価格明示 O43、サブスクなし charter §1.2）。
- `src/features/support/webhook.ts`: handleWebhook（**署名検証 O35 injectable**）+ recordSupport（**冪等** unique(stripe_session_id)、SEC-001 owner scoped）。
## テスト
- 4/4 green: 固定 100 円+価格明示(O43) / 署名 OK→記録 / 署名不正→拒否 / 同 session 冪等。typecheck green。実 Stripe SDK は integration で inject、test→live は release。
## PR Description
### タイトル
support: tip-jar 100円（Webhook 署名検証/冪等）
