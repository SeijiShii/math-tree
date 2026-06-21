# 改修: ゲスト→アカウント連携 / サインアウトの UI 動線追加

- **issue / slug**: 001 / auth-ui-signin-signout
- **実施日**: 2026-06-21
- **対象機能**: ../README.md（_shared/auth）
- **基準 SPEC**: ../001__shared_auth_SPEC.md
- **改修要望**: audit 2026-06-21 が O22(B+E) を High 検出。`linkGuestToAccount`（backend）+ `/api/auth?action=link` は実装済だが、フロントに **サインイン/Google連携/サインアウトの UI 動線が皆無**（broad-match マスク: ゲスト部 (A) で pass、連携 (B) + サインアウト (E) 欠落）。ユーザー判断で **MVP に含める**（[flow] 2026-06-21）。連携 backend は実装済のため UI 層 + フロント orchestration を追加する改修。Clerk フロントは injectable seam（実 OAuth は release で `@clerk/clerk-react` + 実キー注入時に有効化、backend の computed-specifier seam と同パターン）。両輪（login↔logout）+ 連携時データ引き継ぎ確認。
- **状態**: 設計中

## このフォルダに置くドキュメント
- `001_REVISE_SPEC.md` — 変更仕様書（変更前 vs 変更後）
- `002_REVISE_PLAN.md` — 変更計画書
- `003_REVISE_UNIT_TEST.md` — 単体テスト計画
- `004_REVISE_E2E_TEST.md` — E2E テスト計画
- `101_REVISE_IMPL_REPORT.md` — 実装レポート（/flow:tdd）

## 関連
- audit: ../../AUDIT_20260621_1813.md（O22(B+E) High）
- 高度モデルレビュー: /flow:spec-review 推奨
