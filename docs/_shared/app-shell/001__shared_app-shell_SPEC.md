# _shared/app-shell 仕様書（横断: アプリ合成レイヤ, O57）

> **役割**: 全 feature + 全 _shared を 1 つの動く・デプロイ可能なアプリに組み立てる合成 target。合成ルート（entry/main/router/providers）+ UI↔data 配線 + API ルートハンドラ層 + 認証セッション確立 + deploy scaffold。
> **タグ**: cross-cutting, auth-required
> **最終更新**: 2026-06-20
> **入力**: `../../concept.md`（§1.3.2, §4, §10, §12.9）, 全 feature SPEC
> **依存**: 全 feature + 全 _shared（優先度=最後）

---

## 1. 提供インターフェース（合成）
- **合成ルート**: `index.html` / `main.tsx`（providers: Clerk, TanStack Query, Router, Sentry）/ `App.tsx`（ルーティング + グローバルレイアウト + FeedbackWidget 常設 + フッタ法務導線）。
- **ルーティング**: `/`（テックツリー）/ `/learn/:slug`（学習）/ `/account`（DSR 閲覧・削除）/ `/legal/*`（法務）/ `/support`（支援）。全ルートに inbound link（O55 orphaned 回避）。
- **API ルートハンドラ層**: 実装済み各機能の API（curriculum/grade-step/master/support/feedback/auth/cost）を Vercel Functions として外部公開・配線。
- **認証セッション確立**: 初回起動で establishGuestSession（匿名、0 タップ、P4.46）。
- **deploy scaffold**: scripts/dev.sh・stop.sh（O36）, .github/workflows/ci.yml・cd（O37）, dependabot, README バッジ, manifest/PWA, ブランドマーク（design）。

## 2. 入出力
- 合成のみ（新規ロジックは持たない）。副作用: アプリ起動・デプロイ。

## 3. データモデル
- なし（各機能の型・API を配線）。

## 4. バリデーション + エラーケース
| 起動 | 全 provider が初期化、匿名セッション確立で保護 API が 200（P4.46） |
| ルート到達性 | 全ルートに導線（O55） |
| エラー境界 | グローバル ErrorBoundary + Sentry（PII scrub, SEC-003） |

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- **起動・デプロイできる**（部品が全部あっても合成 target が無いと release で露見、O57 を塞ぐ）。匿名→authed で全保護 API 通る（P4.46）。
### 5.2 連携
- 依存: **全 feature + 全 _shared**（最後に設計・実装）。被依存: なし（葉/根の頂点）。

## 6. タグ別追加項目
### 6.1 認可
- グローバルに establishGuestSession + requireOwner 配線（SEC-001, P4.46）。

## 7. スコープ外
- 各機能のドメインロジック（それぞれの feature が持つ）。本層は配線のみ。

## 8. 未決事項
- 現時点で論点なし（2026-06-20）。本番デプロイ（Class B）+ サブドメイン確定は release フェーズ。

## 9. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
