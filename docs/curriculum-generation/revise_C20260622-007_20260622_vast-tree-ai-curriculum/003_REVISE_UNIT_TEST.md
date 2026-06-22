# 単体テスト計画
## 追加
| 対象 | ケース |
|---|---|
| poolPolicy.normalizeStatement | 空白/表記揺れを正規化し dedup 判定 |
| poolPolicy.dedup | 既存プールと重複する生成問題を除外 |
| poolPolicy.selectTopupUnits | POOL_MAX 未満の単元のみ・per-run CAP で選定 |
| generateProblems(mock AI) | 生成→クロス検証 pass のみ追記 / fail は除外 / CAS 一次チェックで statement≢answer を弾く / dedup |
| generateUnits(mock AI) | {units,edges} 生成→循環エッジ拒否→検証 pass のみ保存 |
| pipeline.validateAndStore 拡張 | problems/steps/edges 追記 + reviews 記録 |
| api/cron/generate | CRON_SECRET 不一致=401 / per-run CAP 超で停止 |
## リグレッション
既存 pipeline.test / 公開 API（curriculum/problem）/ learning-workbook セッション / tech-tree 不変。
## Mock 方針
src/lib/ai/mock.ts（既存）で generate/review を決定的化。実 AI 呼び出しはテストしない（Phase 5 本番スモーク）。
