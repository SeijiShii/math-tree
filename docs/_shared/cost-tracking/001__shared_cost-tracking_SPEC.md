# _shared/cost-tracking 仕様書（横断: 外部 API コスト積算）

> **役割**: 外部 API（Claude）呼び出しをシステム内部で能動的に積算し、`.env` 単価で概算コストを算出、無料枠超過アラートを出す（concept §4.6.2）。
> **タグ**: cross-cutting, analytics
> **最終更新**: 2026-06-20
> **入力**: `../../concept.md`（§4.6.2, §4.6.3, §4.6.7）, `../db/001__shared_db_SPEC.md`, `../ai/001__shared_ai_SPEC.md`

---

## 1. 提供インターフェース
- `recordCall({ provider, purpose, inputTokens, outputTokens, model })`: ai_call_logs に積算記録 + 単価×トークンで est_cost_usd 算出。`_shared/ai` の logAiCall がこれを呼ぶ。
- `aggregateCost({ period })`: 日次/月次 + 機能別（生成/検証）にコスト集計。
- `checkFreeTierAlert()`: 想定上限の 80/100/120% でアラート（メール/通知）。
- 単価は `.env` 管理（`COST_ANTHROPIC_PER_1K_INPUT_TOKENS` 等、ハードコード禁止、単価変更日も記録）。

## 2. 入出力
- 副作用: ai_call_logs 集計、アラート発火（Resend 等）。外部呼び出しはしない（記録/集計のみ）。

## 3. データモデル
- ai_call_logs（_shared/db 定義）を使用。新規テーブルなし。

## 4. バリデーション + エラーケース
| ケース | 期待 |
| 単価 env 未設定 | 既定 0 + 警告（コスト 0 と誤認しないログ） |
| 月次突合 誤差 >10% | 単価再調査フラグ（§4.6.2） |

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- 全 AI 呼び出しを記録（取りこぼしゼロ、§4.6.2）。外部請求の遅延に依存せず自前で無料枠超過手前に気づく。
### 5.2 連携
- 依存: _shared/db（ai_call_logs）, _shared/ai（呼び出し源）。被依存: 運用ダッシュボード（将来）、curriculum-generation（生成コスト監視）。

## 6. タグ別追加項目
### 6.6 ログ・分析
- イベント: `cost_aggregate`（period/total_usd/by_purpose）。アラート: `free_tier_alert`（threshold）。

## 7. スコープ外
- 収益指標（MRR 等、本 PJ は無償 + tip-jar のため §4.6.4 不要、concept §4.6.1）。

## 8. 未決事項
- 現時点で論点なし（2026-06-20）。アラート配信チャネルは Resend（preferences §2.18）想定。

## 9. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
