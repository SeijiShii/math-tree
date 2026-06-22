# AI_LOG D20260622_061 — /flow:revise curriculum-generation C20260622-007
**2026-06-22 / revise / 状態: Phase1-4 実装完了（181 green）→ Phase5 key-gated**
## Decisions
```yaml
- id: D20260622-113
  command: /flow:revise
  question: ツリーを5倍以上に広大化 + 問題をAI生成する仕組み
  chosen: 全AI生成(ツリー構造+問題)→多段クロス検証→verified保存 / 定期バッチ(Vercel Cron)で成長プール
  chosen_type: explicit-choice
  context: |
    ユーザー選択: 生成=全AI生成 / スコープ=中学〜高校数I・A(~40-50単元) / バッチ定期実行で新鮮な問題 / 再挑戦で別問題。
    既存 curriculum-generation は半完成(validateAndStore=units のみ, crossValidation 済, 生成step/batch/cron 未)。
    設計: generateUnits/generateProblems + poolPolicy(dedup/POOL_MAX/CAP) + scripts/generate-curriculum.mjs +
    api/cron/generate(CRON_SECRET, 関数10/12) + curriculumSyllabus(中学〜高校数I・A 骨格)。
    成長プール追記 × ランダムK出題(C20260622-006)で再挑戦の新鮮さ実現。SEC-005 verified のみ配信。
    実装=Class A(mock AIで決定的テスト)、実生成=key-gated(ANTHROPIC_API_KEY=Class C + 実コスト B-4)。
- id: D20260622-114
  command: /flow:revise
  question: 定期実行と成長プールの新鮮さ
  chosen: Vercel Cron 日次 top-up + problems 追記成長(POOL_MAX/単元) + per-run CAP コスト制御
  chosen_type: explicit-choice
  depends_on: [D20260622-113, D20260622-112]
  context: ユーザー「バッチ処理で定期実行し新鮮な問題」「再挑戦で異なる問題」。プール成長×ランダム出題で実現。
```
