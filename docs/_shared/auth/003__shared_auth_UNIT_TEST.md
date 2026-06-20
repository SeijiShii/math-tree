# _shared/auth 単体テスト計画

> **入力**: `./001__shared_auth_SPEC.md`, `./002__shared_auth_PLAN.md`
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
| N1 | establishGuestSession | 匿名 owner_id が発行される |
| N2 | requireOwner | セッションから owner_id を解決 |
| N3 | linkGuestToAccount | ゲスト進捗が連携先 owner に引き継がれる |
| N4 | deleteAllOwnerData | progress/supports/feedback が全削除（SEC-004） |
### 1.2 異常系
| ID | 対象 | 期待 |
| E1 | 匿名→authed 保護 API | 200（401 で詰まらない、P4.46） |
| E2 | owner 不一致 | 0 件（SEC-001） |
| E3 | deleteAllOwnerData | 他人/公開データは不変 |
### 1.3 境界値
| B1 | 連携時の重複進捗 | マージ/上書きで矛盾なし |

## 2. Mock 方針
| 対象 | 方針 |
| Clerk | テスト用セッション注入 + 統合は実セッション経路を検証（P4.46） |
| db | テスト DB or リポジトリ |

## 3. カバレッジ目標
| 行 80% / 分岐 70% / owner 解決 + 匿名→authed + delete 経路 100%（SEC-001/004, P4.46） |

## 4. 既存ユーティリティ依存
- _shared/db, _shared/types。

## 5. テスト実行環境
- Vitest + integration（実セッション経路）。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
