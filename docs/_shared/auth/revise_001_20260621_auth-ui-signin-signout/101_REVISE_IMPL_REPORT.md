# 実装レポート: _shared/auth 連携/サインアウト UI 動線（revise 001）

## 実装日時
2026-06-21 18:33 (JST)

## モード
revise

## 関連ドキュメント
- [001_REVISE_SPEC.md] — 変更仕様書
- [002_REVISE_PLAN.md] — 変更計画書
- [003_REVISE_UNIT_TEST.md] — 単体テスト項目
- [AI_LOG](../../../AI_LOG/D20260621_039_revise__shared_auth_001.md) / [tdd セッション](../../../AI_LOG/D20260621_040_tdd__shared_auth_001.md)

## 変更一覧

### Phase 1: AuthProvider seam interface + StubAuthProvider
- `src/lib/auth/authProvider.ts`（新規）: `AuthProvider` interface（isAvailable/isLinked/signInWithGoogle/signOut）+ `StubAuthProvider`（keyless 安全, isAvailable=false）+ `NotAvailableError` + `getAuthProvider()`（`VITE_CLERK_PUBLISHABLE_KEY` 無 → stub）。実 Clerk provider は release（Phase 3.5）で差し替え。

### Phase 2: authClient orchestration
- `src/lib/auth/authClient.ts`（新規）: `linkAccount`（available 判定 → OAuth → Clerk JWT → `POST /api/auth?action=link`（guest Bearer + account_token）→ 成功で `clearGuestToken` / 失敗は unavailable・cancelled・failed を返し guest 状態維持）、`signOut`（Clerk signOut → `setSessionTokenGetter(null)` → `clearGuestToken` → reBootstrap、provider 失敗でもローカルはゲストに戻す）、`getAuthState`。
- `src/lib/api/client.ts`（変更）: `setSessionTokenGetter` 追加 + `apiFetch` が session token getter を guest token より優先（連携後 Clerk セッション token、未登録はゲスト）。既存 ensureGuestToken/clearGuestToken 不変。

### Phase 3: UI + 配線
- `src/features/account/AccountAuthSection.tsx`（新規）: 状態表示（ゲスト/連携済み）+ 連携/サインアウトボタンの出し分け、seam unavailable は「準備中」で無効化、失敗時メッセージ表示（white-screen 回避）。
- `src/features/account/AccountView.tsx`（変更）: `<AccountAuthSection />` を DSR 削除 UI の上に配線。

### Phase 3.5（release 時）
- 実 Clerk provider（`@clerk/clerk-react` computed import + 実 publishable key）。実 OAuth round-trip の疎通は release Phase 2（実キー + 実機、aged guest smoke）で確認。

## 実装計画からの差分
| 項目 | 内容 |
|---|---|
| 計画にない追加変更 | なし（PLAN どおり）|
| 計画から省略した変更 | Phase 3.5 実 Clerk provider は release 工程（計画どおり deferred）|
| 想定外の問題と対処 | テストの `mock.calls[0]` が空タプル型 → `as unknown as [...]` で解決 |

## PR Description
### タイトル
auth: ゲスト→アカウント連携/サインアウト UI 動線（O22(B+E)）
### 概要
backend の連携契約（linkGuestToAccount）に欠けていた UI 層を追加。Clerk を injectable seam 化し keyless 安全に「準備中」表示、実 OAuth は release 有効化。連携↔サインアウトの両輪。
### 変更内容
- authProvider seam + StubAuthProvider（keyless）
- authClient orchestration（link / signout / state）
- AccountAuthSection UI + AccountView 配線
- client.ts session token 優先
### テスト
- 13 新規（authClient 8 + AccountAuthSection 3 + AccountView M1 2）/ 全体 109 passed / typecheck・build green
