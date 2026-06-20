# support 機能仕様書

> **役割**: 固定 100 円「作者を支援」をゲストのままワンタップ（Stripe 単発、継続課金なし）。学習の節目に常設・非煽りで表示。
> **タグ**: feature, auth-required(owner), analytics
> **最終更新**: 2026-06-20
> **入力**: `../concept.md`（§1.1 UC8, §4.3, §9）, `./README.md`

---

## 1. 詳細 UC
### UC-SP1: 支援する（concept §1.1 #8）
- トリガー: 単元アンロック直後等の節目に常設「100 円で作者を支援」
- 前提: ゲスト/ユーザー（owner）
- 入力: ワンタップ → Stripe Checkout（ゲスト決済可）
- 処理: Checkout 完了 → Webhook（署名検証）→ supports 記録（冪等）
- 出力: 「ありがとう」軽い表示（押し付けない、charter §2.2）
- 例外: 決済失敗 → 通常画面へ（機能制限なし、支援は完全任意）

## 2. 入出力
### 2.1 API
| POST | /api/support/checkout | owner | {checkoutUrl} | owner |
| POST | /api/support/webhook | Stripe event | {ok} | 署名検証 |
### 2.3 副作用
- Stripe Checkout セッション作成、supports 記録（stripe_session_id 一意で冪等）。

## 3. データモデル
- 既存 supports テーブル使用。新規なし。

## 4. バリデーション + エラーケース
| 金額 | 固定 100 円（任意金額・サブスクなし） |
| Webhook | 署名検証必須、stripe_session_id 冪等 |
| 他人の支援記録 | owner scoped（SEC-001） |
| 価格透明性 | 「100 円で作者を支援」と金額を CTA 前に明示（O43） |

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- 月固定費ゼロ（Stripe 従量手数料のみ、preferences §4.5）。支援は完全任意（機能ゲートしない）。
### 5.2 連携
- 依存: _shared/auth(owner), _shared/db(supports), _shared/cost-tracking。外部: Stripe。被依存: tech-tree/learning-workbook（節目での表示）, legal（特商法導線近接）。

## 6. タグ別追加項目
### 6.1 認可
- supports は owner scoped（SEC-001）。Webhook は署名検証（server）。
### 6.6 ログ・分析
- イベント: `support_complete`（amount=100）。

## 7. スコープ外
- サブスク・任意金額・有料機能アンロック（charter §1.2「安易な課金パス」を採らない、100円応援のみ）。

## 8. 未決事項
- 特商法の有償該当性は legal と連動して公開前確定（concept §9.1 △）。

## 9. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
