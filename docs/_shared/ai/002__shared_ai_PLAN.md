# _shared/ai 実装計画書

> **入力**: `./001__shared_ai_SPEC.md`, `../../concept.md` §4.1/§4.6.2/§6
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧（api/ai/ + src/）
| ファイル | 責務 | 依存 | LOC |
| `api/ai/_client.ts` | AiClient interface | types | 30 |
| `api/ai/anthropic.ts` | AnthropicClient（実 SDK、server-only） | @anthropic-ai/sdk | 70 |
| `api/ai/mock.ts` | MockAiClient（テスト注入） | _client | 40 |
| `api/ai/crossValidation.ts` | runCrossValidation（多段・異モデル） | client, db(reviews) | 90 |
| `api/ai/costLog.ts` | logAiCall（ai_call_logs 書込 + 概算コスト） | db, cost-tracking | 50 |
| `api/ai/piiScrub.ts` | 送信前 PII scrub（SEC-003） | — | 40 |

## 2. 実装 Phase 分割（可逆性原則 O35）
### Phase 1: AiClient interface + MockAiClient
- ゴール: mock 注入で generate/review が動く（実 SDK なしでテスト green）
### Phase 2: crossValidation + costLog + piiScrub（mock 経由）
- ゴール: 多段検証ロジック + コスト積算 + PII scrub が mock でテスト green
### Phase 3 (app/api bootstrap): 実 SDK install + AnthropicClient inject + 結合
- `npm install @anthropic-ai/sdk`、env 配線（ANTHROPIC_API_KEY）、`.env.example` 更新

## 3. 依存関係順序
interface → mock → crossValidation/costLog/piiScrub → 実 SDK inject

## 4. 既存ファイルへの影響
- なし（基盤）。cost-tracking が costLog を利用。

## 5. 横断フォルダへの追加・変更
- db の ai_call_logs/reviews を使用。

## 6. リスク・注意点
- キーがブラウザに漏れないこと（server-only、SEC）。PII scrub を送信前に必ず通す（SEC-003）。多段検証の異モデル構成は [論点-001] 確定に追従。

## 7. 完了の定義（DoD）
- [ ] mock 経由で generate/review/crossValidation green
- [ ] costLog が全呼び出しを ai_call_logs に記録
- [ ] piiScrub が送信前に PII 除去
- [ ] 実 SDK inject 結合（Phase 3）

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
