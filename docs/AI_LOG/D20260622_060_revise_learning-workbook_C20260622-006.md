# AI_LOG D20260622_060 — /flow:revise learning-workbook C20260622-006
**2026-06-22 / revise / 状態: 設計完了 → tdd**
## Decisions
```yaml
- id: D20260622-112
  command: /flow:revise
  question: 複数問題/ランダム/合格率/スコアの設計 + 問題の出所
  chosen: seed 拡充 + セッション(K=5 ランダム)/PASS_RATE=0.6/ライブスコア/合格で master
  chosen_type: explicit-choice
  depends_on: [D20260622-111]
  context: |
    出所=seed 拡充(ユーザー選択 a)。AI 生成は将来。CAS 採点(キー不要)維持。
    SESSION_SIZE=5/PASS_RATE=0.6(ユーザー指定 60%)。
    grade-step に problemId 任意追加(後方互換、無指定=先頭)。/api/problem はセッション配列に。
    getProblemsForSession(ランダムK,模範解答非含)+getStepByProblemId。WorkbookView セッション+スコア+合否→master/再挑戦。
```
