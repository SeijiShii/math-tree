# _shared/types 実装計画書

> **入力**: `./001__shared_types_SPEC.md`, `../../concept.md` §1.4
> **最終更新**: 2026-06-20

---

## 1. 実装対象ファイル一覧（src/types/）
| ファイル | 責務 | 依存 | LOC 見積 |
|---|---|---|---|
| `src/types/enums.ts` | ProgressState / VerificationStatus / FeedbackKind / AiPurpose / ReviewVerdict | — | 20 |
| `src/types/domain.ts` | Unit/UnitPublic/UnitEdge/Problem/Step/StepPrompt/UnitProgress/Trivia | db schema 型 | 90 |
| `src/types/graph.ts` | TechTreeGraph / TechTreeNode / TechTreeEdge（React Flow 用） | domain | 40 |
| `src/types/dto.ts` | API DTO（Zod 由来の `z.infer` 再 export ポイント） | zod | 30 |
| `src/types/index.ts` | 集約 export | 上記 | 15 |

## 2. 実装 Phase 分割
### Phase 1: enums + domain 型 + graph 型 + index export
- ゴール: 全機能が `@/types` から単一の型を import できる。typecheck green。
- `StepPrompt` が `model_answer_latex` を含まないことを型テストで担保。

## 3. 依存関係順序
```
db schema 型 → domain → graph / dto → index
```

## 4. 既存ファイルへの影響
- なし（基盤）。

## 5. 横断フォルダへの追加・変更
- db のスキーマ型を参照（型のみ）。

## 6. リスク・注意点
- 公開 DTO（UnitPublic / StepPrompt）が内部フィールド（verification_status / model_answer_latex）を漏らさないよう型で封じる（SEC-002 と協調）。

## 7. 完了の定義（DoD）
- [ ] 全型定義 + index export
- [ ] StepPrompt が模範解答を含まない型テスト green
- [ ] typecheck green

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:feature |
