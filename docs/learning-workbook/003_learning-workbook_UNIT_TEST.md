# learning-workbook 単体テスト計画

> **入力**: 001 SPEC, 002 PLAN
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| N1 | equivalence | `2x+3` と `3+2x` を同値と判定 |
| N2 | grade-step | 正しいステップで match=true、次へ |
| N3 | master | 全ステップ matched で mastered + 次アンロック |
### 1.2 異常系
| E1 | grade-step 誤答 | match=false + ヒント、習得は進めない |
| E2 | StepPrompt | model_answer_latex を含まない（SEC-002） |
| E3 | 他人 progress 更新 | requireOwner で拒否（SEC-001） |
| E4 | AI フォールバック | CAS 判定不能時のみ AI 照合（コスト最小） |
### 1.3 境界値
| B1 | 等価だが分数/小数表現違い | 同値判定（[論点-LW1]） |
| B2 | 空入力 | バリデーションエラー |

## 2. Mock 方針
| MathLive | jsdom + 値注入 |
| AI 照合 | MockAiClient |
| db | テスト DB |

## 3. カバレッジ目標
| 行 80% / 分岐 70% / 同値判定 + SEC-001/002 経路 100% |

## 4. 既存ユーティリティ依存
- _shared/ai, _shared/db, _shared/ui。

## 5. テスト実行環境
- Vitest + Testing Library。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
