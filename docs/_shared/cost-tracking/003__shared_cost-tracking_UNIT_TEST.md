# _shared/cost-tracking 単体テスト計画

> **入力**: `./001__shared_cost-tracking_SPEC.md`, `./002__shared_cost-tracking_PLAN.md`
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
| N1 | recordCall | tokens×単価で est_cost_usd を算出し記録 |
| N2 | aggregateCost | 生成/検証別 + 月次で合計が一致 |
| N3 | checkFreeTierAlert | 80/100/120% でアラート発火 |
### 1.2 異常系
| ID | 対象 | 期待 |
| E1 | 単価 env 未設定 | 既定 0 + 警告ログ（0 と誤認しない） |
### 1.3 境界値
| B1 | 閾値ちょうど 100% | アラート発火 |

## 2. Mock 方針
| 対象 | 方針 |
| db ai_call_logs | テスト DB or リポジトリ |
| Resend | mock（送信検証） |
| .env 単価 | 固定注入 |

## 3. カバレッジ目標
| 行 80% / 分岐 70% / 閾値アラート経路 100% |

## 4. 既存ユーティリティ依存
- _shared/db。

## 5. テスト実行環境
- Vitest。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
