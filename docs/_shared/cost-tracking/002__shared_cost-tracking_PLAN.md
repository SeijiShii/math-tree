# _shared/cost-tracking 実装計画書

> **入力**: `./001__shared_cost-tracking_SPEC.md`, `../../concept.md` §4.6.2
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
| `api/cost/record.ts` | recordCall（積算 + 単価算出） | db, env | 50 |
| `api/cost/aggregate.ts` | aggregateCost（日次/月次/機能別） | db | 60 |
| `api/cost/alert.ts` | checkFreeTierAlert（80/100/120%） | aggregate, resend | 50 |
| `src/lib/cost/pricing.ts` | .env 単価ロード + 変更日記録 | — | 30 |

## 2. 実装 Phase 分割
### Phase 1: pricing（.env 単価）+ recordCall（積算）
### Phase 2: aggregateCost + checkFreeTierAlert（Cron 連携）
- ゴール: AI 呼び出しが全件 ai_call_logs に積算され、概算コストが集計でき、閾値アラートが出る。

## 3. 依存関係順序
pricing → record → aggregate → alert

## 4. 既存ファイルへの影響
- _shared/ai の logAiCall が recordCall を呼ぶ。

## 5. 横断フォルダへの追加・変更
- db の ai_call_logs を集計。

## 6. リスク・注意点
- 単価はコードにハードコードせず .env（§4.6.2）。取りこぼしゼロで記録（無料枠超過の手前で気づく）。

## 7. 完了の定義（DoD）
- [ ] recordCall が全呼び出しを積算
- [ ] aggregateCost が日次/月次/機能別で集計
- [ ] checkFreeTierAlert が閾値で発火

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
