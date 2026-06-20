# _shared/app-shell 単体テスト計画

> **入力**: 001 SPEC, 002 PLAN
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| N1 | アプリ起動 | 全 provider 初期化、クラッシュなし |
| N2 | ルーティング | /, /learn/:slug, /account, /legal/*, /support が解決 |
| N3 | 匿名セッション | 起動で establishGuestSession → 保護 API 200（P4.46） |
### 1.2 異常系
| E1 | グローバルエラー | ErrorBoundary 表示 + Sentry（PII scrub） |
| E2 | 未配線ルート | orphaned なし（全ルートに inbound link, O55） |
### 1.3 境界値
| B1 | API 集約 | 全機能 API ハンドラが公開されている（statfrom health） |

## 2. Mock 方針
| Clerk/Stripe/AI | mock 注入（起動経路は実） |
| 統合 | 匿名→authed の実セッション経路を検証（P4.46） |

## 3. カバレッジ目標
| 起動 + ルーティング + 匿名セッション + API 公開 経路 100%（O57/P4.46） |

## 4. 既存ユーティリティ依存
- 全 _shared + 全 feature。

## 5. テスト実行環境
- Vitest + Testing Library + Playwright（合成 smoke）。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
