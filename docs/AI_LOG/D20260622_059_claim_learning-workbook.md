# AI_LOG D20260622_059 — /flow:claim learning-workbook C20260622-006
**2026-06-22 / 状態: 完了（仕様変更 revise 判定 → /flow:revise auto-route）**
## Decisions
```yaml
- id: D20260622-111
  command: /flow:claim
  question: 1単元1問は少ない/毎回同じ/合格率/ライブスコア が欲しい
  chosen: 仕様変更 (revise) → /flow:revise learning-workbook C20260622-006
  chosen_type: explicit-choice
  context: |
    三項照合: 期待=複数問/ランダム/合格率(60%)/ライブスコア /
    現実=1unit 先頭1問・即習得(SPEC §6.1 MVP 単一問題どおり、バグでない) /
    照合=SPEC 未記載の新仕様だが learning-workbook 既存機能の改修=revise。
    schema(problems unitId/order) は複数問格納可能、コードが limit(1) 固定。
    revise 設計論点: 出題数/合格閾値の既定可変/問題出所(seed vs curriculum-generation)/進捗永続。
```
