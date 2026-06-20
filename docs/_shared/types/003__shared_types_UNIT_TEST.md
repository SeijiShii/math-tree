# _shared/types 単体テスト計画

> **入力**: `./001__shared_types_SPEC.md`, `./002__shared_types_PLAN.md`
> **最終更新**: 2026-06-20

---

## 1. テストケース一覧（型テスト中心、`expectTypeOf` / `tsd`）
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | enums | リテラルユニオンが期待値と一致 |
| N2 | UnitPublic | trivia/is_romance_node を含む |
| N3 | TechTreeGraph | nodes/edges 構造が React Flow と適合 |

### 1.2 異常系（型レベルの封じ込め）
| ID | 対象 | 期待 |
|---|---|---|
| E1 | UnitPublic | `verification_status` プロパティを**持たない**（漏洩防止） |
| E2 | StepPrompt | `model_answer_latex` を**持たない**（模範解答漏洩防止、SEC-002） |

### 1.3 境界値
| ID | 対象 | 期待 |
|---|---|---|
| B1 | ProgressState 遷移ヘルパ型（あれば） | locked/unlocked/mastered のみ許容 |

## 2. Mock 方針
| 対象 | 方針 | 理由 |
|---|---|---|
| 実行時依存 | なし | 純型定義 |

## 3. カバレッジ目標
| 種別 | 目標 | 根拠 |
|---|---|---|
| 型テスト | 主要 DTO の封じ込め 100% | SEC-002（模範解答/内部フィールド漏洩防止） |

## 4. 既存ユーティリティ依存
- zod / drizzle 推論型。

## 5. テスト実行環境
- フレームワーク: Vitest + `expectTypeOf`（or `tsd`）
- 実行: テストツールを実行

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:feature |
