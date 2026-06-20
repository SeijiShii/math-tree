# 実装レポート: _shared/types

## 実装日時
2026-06-20 12:27 (JST)
## モード
feature (cross-cutting)
## 変更一覧
- `src/types/enums.ts`: ProgressState/VerificationStatus/FeedbackKind/AiPurpose/ReviewVerdict（const-as + union）。
- `src/types/domain.ts`: db schema 推論型を土台に Unit/Problem/Step/Progress + **UnitPublic（verificationStatus 封じ込め）/ StepPrompt（modelAnswerLatex 封じ込め）**（SEC-002）。
- `src/types/graph.ts`: TechTreeGraph/Node/Edge（React Flow 用）。
- `src/types/index.ts`: 集約 export。
## テスト
- 4/4 green（enums / UnitPublic 封じ込め / StepPrompt 封じ込め / 素の型）。型レベル封じ込めを `expectTypeOf` で検証。typecheck green。
## PR Description
### タイトル
_shared/types: 共通型 + 公開 DTO 封じ込め(SEC-002)
