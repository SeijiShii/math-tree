# feedback 実装計画書

> **入力**: 001 SPEC, ../concept.md §6
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧
| `src/features/feedback/FeedbackWidget.tsx` | 常設 👍/👎+バグ UI | ui | 90 |
| `api/feedback.ts` | ingestion（scrub→保存→通知→hub） | db, piiScrub | 80 |
| `src/lib/feedback/context.ts` | 自動コンテキスト収集 | — | 40 |
| `src/lib/feedback/scrub.ts` | PII scrub（SEC-003） | — | 50 |

## 2. 実装 Phase 分割
### Phase 1: scrub + context + api/feedback（保存 + 即時通知、mock hub）
### Phase 2: FeedbackWidget（全画面常設）+ Turnstile + レート制限
### Phase 3: feedback-hub 接続（endpoint env、未構築なら即時通知のみで先行）

## 3. 依存関係順序
scrub/context → api → Widget → hub 接続

## 4. 既存ファイルへの影響
- app-shell が Widget を全画面に埋め込む。

## 5. 横断フォルダへの追加・変更
- db feedback テーブル使用。

## 6. リスク・注意点
- PII scrub を送信前に必ず通す（SEC-003）。スパム対策（SEC-005）。押し付けない UX（charter §2.2）。

## 7. 完了の定義（DoD）
- [ ] 1 タップ送信 + PII scrub
- [ ] 即時通知 + (hub or ローカル蓄積)
- [ ] Turnstile + レート制限
- [ ] unit + E2E green

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
