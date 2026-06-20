<!-- auto-generated-start -->
# 設計レベル脆弱性レビュー — Math-Tree（プロダクト全体）

**レビュー日**: 2026-06-20
**レビュー実施者**: Claude (Opus 4.8) + seiji
**対象**: プロダクト全体（concept 段階、feature SPEC 未生成）
**入力**: docs/concept.md (§1.2 / §1.3 / §3 / §4.3 / §4.5 / §5 / §6 / §9)
**観点ソース**: ~/.claude/flow-data/perspectives.md (O23-O28, O54)
**severity-threshold**: medium

## 1. PJ 性質判定
- ユーザー数: **複数ユーザー**（不特定多数向け無料 Web）
- 公開性: **公開**
- 課金: **無償**（+ tip-jar 任意支援、Stripe 単発）
- 個人情報: **扱いあり（最小）**— 匿名ゲスト中心、進捗 / 支援記録 / フィードバック
- AI 利用: **あり**（Claude API、生成 + 多段クロス検証、事前生成 + キャッシュ）
- 地域: 主に国内（不特定多数）

## 2. 脆弱性パターン照合結果

### 2.1 サマリ
- Critical: 0 件
- High: 4 件（§8 論点登録 + §3 NFR 要件化、accepted-as-requirement）
- Medium: 1 件（§8 open 登録）
- Low / Info: 1 件（注記のみ）
- 法令必須: 2 件（O26 / O54、いずれも部分対応 → 要件化）

### 2.2 詳細（severity 降順）

#### [SEC-001] 認可漏れ（所有者チェック） (O23_authorization_check, severity=High)
- **照合結果**: SPEC 未対応（concept レベルで認可マトリクス未明示）
- **不在根拠**: §5 で progress / support / feedback を guest/user_id で所有する設計はあるが、各 API エンドポイントでの所有者チェック（`owner_id = requester` の強制）や認可マトリクスが明示されていない。複数ユーザー PJ のため他人の進捗が見える/書けるリスク。
- **PJ 性質との関連**: require=[複数ユーザー] 該当
- **推奨対策**: 全 API（progress 取得/更新、support、feedback）で `withOwner` / owner resolver により認証主体の guest/user_id に紐づくデータのみ操作可能に強制。Neon + Drizzle では query を owner_id でフィルタ。匿名ゲストでも Clerk セッションの owner で絞る。
- **route**: accepted-as-requirement → **実装済（2026-06-20, /flow:tdd _shared/auth）**。owner はサーバ検証済みの値のみ（旧 `x-owner-id` ヘッダ信頼 = なりすまし・全員 guest_anon 共有 を撤廃）。`resolveOwner`（auth seam）が Authorization Bearer を guest JWT 署名検証 / Clerk JWT 検証で解決し、`withOwner`/owner_id フィルタ（db/owner.ts）で全クエリを所有者強制。3 保護 handler（tech-tree/grade-step/account.delete）は未認証で 401。

#### [SEC-002] 入力検証（XSS / sanitize） (O24_input_validation, severity=High)
- **照合結果**: SPEC 未対応
- **不在根拠**: ユーザー入力 = MathLive 数式（LaTeX）/ feedback 自由記述 / 支援。さらに **AI 生成コンテンツ（豆知識・問題・模範解答）を画面表示**する。入力検証スキーマ（Zod 等）や KaTeX レンダリングの `trust=false`、feedback 自由記述の sanitize が concept に明示されていない。AI 生成物も「信頼境界の外」として扱い、表示時にエスケープが要る。
- **PJ 性質との関連**: require=[公開] 該当
- **推奨対策**: API 入力を Zod スキーマで一元検証。KaTeX は `trust:false, strict:true` でレンダリング（任意 LaTeX コマンド実行を防ぐ）。feedback 本文は表示時にエスケープ（プレーンテキスト扱い）。AI 生成テキストも sanitize して表示。
- **route**: accepted-as-requirement（concept §3.X + §8 [論点-004]）

#### [SEC-003] 個人情報のログ漏洩 (O26_pii_logging, severity=High, legal_required)
- **照合結果**: 部分対応
- **該当箇所**: §1.3.1 feedback + §6 で「送信前 PII scrub」を明示、§3 NFR セキュリティに PII scrub あり。
- **不在根拠**: Sentry に送るエラー/イベントの `beforeSend` での PII マスク機構が未明示。feedback 自動コンテキスト（UA/直近操作）に PII が混入した場合のマスクも要明示。
- **PJ 性質との関連**: require=[公開, 個人情報扱い]、legal_required=true（個人情報保護法）
- **推奨対策**: Sentry `beforeSend` で email/位置/本文中 PII をマスク。feedback ingestion 前に PII scrub を必須化（§3 NFR 既出を実装で担保）。
- **route**: accepted-as-requirement（concept §3.X + §8 [論点-005]）

#### [SEC-004] DSR（開示・削除）の履行可能性 (O54_dsr_fulfillment_operability, severity=High, legal_required)
- **照合結果**: 設計レベルで対応済み、実装で担保が必要
- **該当箇所**: §9.1 で「ゲスト/匿名特例（O12×O22）: 運営側で個人特定不可 → 確認・削除はアプリ内セルフサービス、窓口削除を約束しない、**全データ削除のセルフサービス導線は非交渉の必須**」を明記。
- **不在根拠**: in-app セルフ削除が**実動作**する delete endpoint + 全ストア purge（DB 行の cascade）、開示 = in-app で自分の全進捗/支援/フィードバックを閲覧できること、が実装要件として未確定。「プラポリに書いたが UI が no-op」を避ける。
- **PJ 性質との関連**: require=[公開]、legal_required=true。O22 ゲスト認証採用のためペア照合必須。
- **推奨対策**: account 領域に「全データ削除」セルフサービス（delete endpoint + cascade purge）を実装。開示は in-app の進捗/支援履歴閲覧で履行。運用者向け identify/delete ツールは作らない（匿名で incoherent）。
- **route**: accepted-as-requirement（concept §3.X + §8 [論点-006]）

#### [SEC-005] レート制限 / 公開エンドポイント (O27_rate_limit_scope, severity=Medium)
- **照合結果**: 部分対応（AI コスト爆発は設計で緩和済み）
- **該当箇所**: AI 生成は**事前バッチ + キャッシュ**で、公開エンドポイントから直接 Claude API を叩かない設計（§1.2 / §4.6）。feedback/support フォームに Turnstile（§4.3）。
- **不在根拠**: 一般 API（progress 取得/更新、support Checkout 起動、feedback ingestion）の IP/ユーザー単位レート制限が未設計。AI コスト爆発リスクは低いが、書き込み API の濫用余地は残る。
- **PJ 性質との関連**: require=[公開]
- **推奨対策**: 書き込み API に Upstash Ratelimit 等で N req/min。feedback/support は Turnstile + レート制限の二重防御。
- **route**: open（§8 [論点-007]、Medium のため登録のみ。実装/設計時に再評価）

#### [SEC-006] 秘密情報の管理 (O25_secrets_management, severity=Info, 対応済み)
- **照合結果**: 対応済み（注記のみ）
- **該当箇所**: §4.5.3（`.env.example` / `.env.local` / 平文コミット禁止）、§10.7（`.env*.local` を .gitignore 除外、gitleaks 推奨）、`.gitignore` 作成済み（`.env*.local` 除外）。Claude/Stripe/Clerk のシークレットは Vercel Functions に秘匿（クライアント非露出、§3 NFR）。
- **注記**: Vite の `VITE_*` プレフィックスにシークレットを置かないこと（クライアントバンドルに含まれる）。実装時に build 成果物を grep チェック。

## 3. §8 未決事項に登録した論点

| 論点 ID | SEC | severity | title | status | 期限 |
|---|---|---|---|---|---|
| [論点-003] | SEC-001 | High | 認可漏れ（所有者チェック） | accepted-as-requirement | 実装着手前 |
| [論点-004] | SEC-002 | High | 入力検証（XSS/sanitize） | accepted-as-requirement | 実装着手前 |
| [論点-005] | SEC-003 | High | PII ログ漏洩（法令必須） | accepted-as-requirement | 実装着手前 |
| [論点-006] | SEC-004 | High | DSR 履行可能性（法令必須） | accepted-as-requirement | 実装着手前 |
| [論点-007] | SEC-005 | Medium | レート制限 | open | 設計/実装時 |

## 4. 次のステップ
- Critical/High（SEC-001〜004）は concept §3.X NFR セキュリティ要件として要件化済み（accepted-as-requirement）。各 feature 設計（`/flow:feature`）でこの要件を SPEC に落とす。
- O27 レート制限（Medium）は feature 設計時に再評価。
- L2 実装前チェックリスト生成（`/flow:secure --phase=pre-impl`）は feature SPEC 生成後に実施。
- L4 依存スキャン（`/flow:secure --phase=deps`）は実装でロックファイル生成後に実施。
- 実装後に Anthropic 標準 `security-review` スキルで L3 確認。
- CI に npm audit / Dependabot を組み込み（L4-cont）。
<!-- auto-generated-end -->
