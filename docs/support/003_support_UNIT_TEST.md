# support 単体テスト計画

> **入力**: 001 SPEC, 002 PLAN
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| N1 | checkout | 100 円固定の Checkout URL を返す |
| N2 | webhook | 署名検証 OK → supports 記録 |
### 1.2 異常系
| E1 | webhook 署名不正 | 拒否 |
| E2 | 同 session 2 回 | 冪等（unique で 1 件） |
| E3 | 他人 supports 取得 | owner scoped 拒否（SEC-001） |
### 1.3 境界値
| B1 | 決済失敗 | 機能制限なし（任意支援） |

## 2. Mock 方針
| Stripe | MockStripe（実決済なし） |
| db | テスト DB |

## 3. カバレッジ目標
| 行 80% / 分岐 70% / Webhook 署名 + 冪等 + owner 経路 100% |

## 4. 既存ユーティリティ依存
- _shared/auth, _shared/db。

## 5. テスト実行環境
- Vitest（実 Stripe 叩かない）。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
