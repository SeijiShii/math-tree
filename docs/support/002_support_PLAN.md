# support 実装計画書

> **入力**: 001 SPEC, ../concept.md §4.3
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧
| `src/features/support/SupportButton.tsx` | 「100円で支援」常設 UI（価格明示 O43） | ui | 50 |
| `api/support/checkout.ts` | Stripe Checkout 作成 | stripe | 50 |
| `api/support/webhook.ts` | Webhook 署名検証 + supports 記録（冪等） | stripe, db | 60 |

## 2. 実装 Phase 分割（可逆性 O35）
### Phase 1: checkout/webhook interface + MockStripe（冪等記録テスト）
### Phase 2: SupportButton（価格透明性 O43）
### Phase 3 (bootstrap): 実 Stripe SDK install + 鍵配線（test→live は release）+ .env.example

## 3. 依存関係順序
webhook/checkout(mock) → SupportButton → 実 Stripe inject

## 4. 既存ファイルへの影響
- tech-tree/learning-workbook の節目に SupportButton 配置。

## 5. 横断フォルダへの追加・変更
- supports（db）、cost-tracking（決済は外部だが記録）。

## 6. リスク・注意点
- Webhook 署名検証必須 + 冪等。価格を CTA 前に明示（O43）。test→live 化は release（CF-009）。煽らない（charter §2.2）。

## 7. 完了の定義（DoD）
- [ ] Checkout → Webhook → supports 冪等記録
- [ ] 価格透明性（O43）
- [ ] 支援失敗でも機能制限なし
- [ ] unit + E2E green（test モード）

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
