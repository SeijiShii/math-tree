# _shared/ai 単体テスト計画

> **入力**: `./001__shared_ai_SPEC.md`, `./002__shared_ai_PLAN.md`
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
| N1 | generate(mock) | text + usage を返す |
| N2 | runCrossValidation | 多段の verdict を reviews に記録、合格/不合格を返す |
| N3 | logAiCall | ai_call_logs に input/output tokens + 概算コスト |
### 1.2 異常系
| ID | 対象 | 期待 |
| E1 | API レート超過(mock) | 指数バックオフ後フォールバック |
| E2 | キー未設定 | server エラー、ブラウザに漏らさない |
| E3 | piiScrub | email/位置/本文 PII を送信前に除去（SEC-003） |
| E4 | 異モデル不一致 | [論点-001] 合格基準に従い不合格（再生成フラグ） |
### 1.3 境界値
| ID | 対象 | 期待 |
| B1 | 空コンテンツ review | 安全に skip/fail |

## 2. Mock 方針
| 対象 | 方針 |
| Anthropic SDK | MockAiClient 注入（実 API 叩かない、コストゼロ） |
| db reviews/ai_call_logs | テスト DB or リポジトリ mock |

## 3. カバレッジ目標
| 行 80% / 分岐 70% / PII scrub + キー秘匿経路 100%（SEC-003） |

## 4. 既存ユーティリティ依存
- _shared/db, _shared/types。

## 5. テスト実行環境
- Vitest。実 API 呼び出しなし（mock）。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
