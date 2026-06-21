# 実装前準備チェックリスト

**最終更新**: 2026-06-20 08:45
**集約元**: §4.3 リソース選定 / §6 外部連携 / §9 法務 / §4.5 ローカル開発 / §4.4 コスト / perspectives O12 / O22 / O25 / O27
**生成元**: /flow:concept

> 開発運用者向け実装前準備チェックリスト。状態列は `<!-- user-edit -->` 区間で手動更新可。

<!-- auto-generated-start -->

## 1. 外部 API キー (環境変数 `.env.local`)

| サービス | 環境変数名 | 用途 | 取得 URL | プラン / 無料枠 |
|---|---|---|---|---|
| Anthropic (Claude API) | `ANTHROPIC_API_KEY` | カリキュラム生成 + 多段クロス検証 | console.anthropic.com | 従量課金（事前生成主体で抑制） |
| Clerk | `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | 匿名ゲスト → 段階認証 | clerk.com | Free 10,000 MAU |
| Stripe | `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | tip-jar 単発決済 | dashboard.stripe.com | 従量手数料のみ |
| Neon | `DATABASE_URL` | DB 接続 | neon.tech | Free 0.5GB × 10 DB |
| Cloudflare Turnstile | `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | feedback/support スパム対策 | cloudflare.com | Free 1M req/月 |

## 2. BaaS / インフラアカウント (charter §0 = Neon スタック)

| サービス | 用途 | 取得 URL | プラン | 制限 |
|---|---|---|---|---|
| **Neon** | DB (Postgres、サービス専用 DB) | neon.tech | Free | 0.5GB、コンピュート月 191.9h |
| **Vercel** | ホスティング + Functions | vercel.com | Hobby (Free) | 100GB 帯域 |
| **Clerk** | Auth | clerk.com | Free | 10,000 MAU |
| **GitHub** | リポジトリ + CI | github.com | Free | Actions 無料枠 |

## 3. ドメイン (公開 PJ)
- 既存ドメインありなら **サブドメ運用**（`math-tree.<existing>`）を推奨（O29、撤退時 DNS 1 行削除）。
- 検証段階は `*.vercel.app` で開始可。

## 4. 認証プロバイダ設定 (O22)
| 項目 | 取得方法 | 備考 |
|---|---|---|
| Clerk App 作成 | clerk.com → New Application | Publishable / Secret Key を `.env.local` に |
| 匿名ゲスト有効化 | Clerk: Anonymous sign-in | 起動→即学習（0 タップ）、進捗保存 |
| Google OAuth リンク | console.cloud.google.com → Credentials | 課金/同期時の段階認証で利用 |

## 5. 決済プロバイダ設定 (tip-jar)
| 項目 | 取得方法 | 備考 |
|---|---|---|
| Stripe アカウント本人確認 | dashboard.stripe.com | 国内決済に必要 |
| Stripe API キー (test/live) | dashboard.stripe.com/apikeys | live は本番デプロイ後 |
| Webhook エンドポイント登録 | dashboard.stripe.com/webhooks | 署名検証鍵を `.env.local` に |

## 6. 法務書類準備 (§9)
| 書類 | 必要性 | 配置 URL | 作成方法 |
|---|---|---|---|
| プライバシーポリシー | 必須 | `/legal/privacy` | テンプレ + 自前（ゲスト特例 O12×O22: セルフサービス削除明記） |
| 利用規約 | 必須 | `/legal/terms` | AI 生成コンテンツの正確性免責 + tip-jar 返金不可 |
| 特定商取引法表記 | 要確認（tip-jar 決済あり） | `/legal/specified-commercial-transactions` | 自前作成 |

## 7. 監視・アナリティクス
| サービス | 用途 | 取得 URL | プラン |
|---|---|---|---|
| Sentry | エラー監視 | sentry.io | Free (5,000 events/月) |
| Vercel Web Analytics | cookieless 流入計測 | vercel.com | Hobby Free |

## 10. ローカル開発環境準備 (§4.5)
| 項目 | コマンド / 手順 |
|---|---|
| Node.js | nvm 等で管理 |
| Vercel CLI | `npm i -g vercel`（`vercel dev`） |
| `.env.example` 作成 | §1, §4, §5, §7 のキー名をダミー値付きで列挙 |
| `.env.local` 作成 | 実値入力、`.gitignore` 確認 |
| Git pre-commit hook | gitleaks / husky で秘密情報コミット防止 |

## 11. コスト試算 (§4.4)
- **月額目安**: $0（無料枠）+ Claude API 従量（事前生成主体、§4.6.2 で積算監視）
- **無料枠超過アラート**: 想定上限の 80% / 100% / 120%

## 12. 実装着手前 最終チェックリスト
- [ ] §1-§7 の必須キー取得済み
- [ ] `.env.example` 作成・必須キー全定義
- [ ] `.gitignore` に `.env*.local` / `.env` 追加（O25）
- [ ] 法務書類のドラフト作成（公開前確認用）
- [ ] `~/.claude/flow-data/preferences.md` に採用ベンダー記録
- [ ] `/flow:secure` で L1 設計レビュー（[論点-001] 検証パイプライン含む）
- [ ] CI に `npm audit` / Dependabot 組み込み

<!-- auto-generated-end -->

<!-- user-edit-start -->

## ユーザー手動メモ (auto-generated で保護)

### 取得状況 (状態列)
| 項目 | 状態 | 取得日 / 備考 |
|---|---|---|
| ANTHROPIC_API_KEY | ❌ | |
| Clerk プロジェクト | ❌ | |
| Neon DB | ❌ | |
| Stripe アカウント | ❌ | |

<!-- user-edit-end -->
