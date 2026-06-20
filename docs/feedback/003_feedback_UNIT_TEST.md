# feedback 単体テスト計画

> **入力**: 001 SPEC, 002 PLAN
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| N1 | scrub | email/位置/本文 PII を除去（SEC-003） |
| N2 | api/feedback | 保存 + 即時通知 + hub POST |
| N3 | Widget | 👍/👎 1 タップで送信 |
### 1.2 異常系
| E1 | hub ダウン | ローカル保存 + リトライ |
| E2 | スパム連投 | レート制限 + Turnstile で拒否（SEC-005） |
| E3 | body 表示 | エスケープ（SEC-002） |
### 1.3 境界値
| B1 | owner null（匿名前） | 許容 |

## 2. Mock 方針
| hub | mock POST |
| Turnstile | mock 検証 |
| db | テスト DB |

## 3. カバレッジ目標
| 行 80% / 分岐 70% / PII scrub 経路 100%（SEC-003） |

## 4. 既存ユーティリティ依存
- _shared/db, _shared/ui。

## 5. テスト実行環境
- Vitest + Testing Library。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
