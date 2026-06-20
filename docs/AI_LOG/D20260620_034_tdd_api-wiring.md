# AI_LOG セッション D20260620_034 — /flow:tdd (api 結線)
**実行日時**: 2026-06-20 13:02 / **対象**: api/（Vercel Functions 結線）/ **状態**: 完了 / **decision**: D20260620-060
## Decisions
```yaml
- id: D20260620-060
  command: /flow:tdd
  phase: Phase 3 / api 結線（app-shell API ルートハンドラ層）
  chosen: api/tech-tree,curriculum,feedback,account/delete + grade-step/support(501=実キー要) 結線。typecheck green
  chosen_type: auto-recommended
  depends_on: [D20260620-058, D20260620-056, D20260620-055, D20260620-051]
  context: |
    実装済みロジックを Vercel Functions に薄く結線。DB は makeDb(DATABASE_URL)、AI/Stripe は release で実キー inject(O35)。
    grade-step/support webhook は 501（実キー未配線）で release を待つ。no-key Class A の結線は完了。
```
