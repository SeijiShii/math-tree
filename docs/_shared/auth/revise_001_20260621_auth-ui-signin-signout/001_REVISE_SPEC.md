# _shared/auth 変更仕様書（ゲスト→アカウント連携 / サインアウトの UI 動線追加）

> **改修種別**: 機能拡張（既存 backend 契約への UI 層追加）
> **issue / slug**: 001 / auth-ui-signin-signout
> **基準 SPEC**: `../001__shared_auth_SPEC.md`
> **最終更新**: 2026-06-21
> **タグ**: auth-required

---

## 1. 変更概要

`linkGuestToAccount`（backend）+ `POST /api/auth?action=link`（Clerk JWT 検証 + データ引き継ぎ）は実装済だが、**フロントにサインイン/Google連携/サインアウトの UI 動線が存在しない**（audit 2026-06-21 O22(B+E) High）。本改修は **UI 層 + フロント orchestration のみ**を追加し、既存のゲスト匿名フロー・backend 契約は一切変更しない（純加算）。Clerk フロント SDK は **injectable seam**（`AuthProvider` interface）として導入し、実 OAuth は release で `@clerk/clerk-react` + 実 publishable key 注入時に有効化（keyless ローカルでは「連携は準備中」表示で無効化、backend の computed-specifier seam と同じ可逆パターン）。両輪 = 連携（login）↔ サインアウト（logout）。

## 2. 変更前 vs 変更後

### 2.1 UC 変更
| UC ID | 変更前 | 変更後 | 理由 |
|---|---|---|---|
| UC-link | backend `linkGuestToAccount` のみ・UI から到達不能 | マイデータ画面に「Googleで連携してデータを引き継ぐ」ボタン → Clerk OAuth → JWT 取得 → `POST /api/auth?action=link` → 連携完了表示 | O22(B) 連携動線の UI 化 |
| UC-signout | サインアウト動線なし（連携後に抜けられない） | 連携済み状態のとき「サインアウト」ボタン → Clerk signOut + ゲストトークン破棄 + 新規ゲスト再 bootstrap | O22(E) 両輪（連携したら抜けられる） |
| UC-authstate | 認証状態の表示なし | マイデータ画面に現在状態（ゲスト / アカウント連携済み）を表示 | 状態の可視化 |

### 2.2 入出力変更
| 対象 | 変更前 | 変更後 | 互換性 |
|---|---|---|---|
| `POST /api/auth?action=link` | 既存（変更なし）| 変更なし（UI から呼ぶようになるだけ） | ✅ 互換 |
| フロント `apiFetch` の認証ヘッダ | guest JWT 固定 | 連携後は Clerk セッション token を優先、未連携はゲスト JWT（既存挙動） | ✅ 互換（追加） |
| `localStorage` | `mathtree_guest_token` | 変更なし（連携時 clear、サインアウト時 clear→再発行） | ✅ 互換 |

### 2.3 データモデル変更
| エンティティ | 変更内容 | マイグレーション要否 |
|---|---|---|
| （なし）| 新規/変更テーブルなし。`linkGuestToAccount` の owner 付替えは既存実装 | ❌ 不要 |

### 2.4 バリデーション・エラー変更
| 対象 | 変更前 | 変更後 |
|---|---|---|
| 連携時に Clerk 未配線（keyless ローカル）| — | 連携ボタンは「連携は準備中（公開後に有効）」で無効化表示（UI でハードエラーにしない）|
| 連携 API 503/401/400 | backend で定義済 | UI でユーザー向けメッセージ表示（「連携に失敗しました。時間をおいて再度お試しください」）|

## 3. 影響範囲

| 対象 | 影響度 | 説明 |
|---|---|---|
| _shared/auth（フロント） | 高 | 直接対象（authClient orchestration + AuthProvider seam）|
| features/account（AccountView） | 高 | 連携/サインアウト/状態表示 UI を追加 |
| src/lib/api/client.ts | 中 | 連携後の token 切替 + サインアウト時の再 bootstrap |
| src/App.tsx（ヘッダ）| 低 | 任意: ヘッダに連携状態の小表示（MVP では account 画面に集約で可）|
| backend（api/auth.ts, account.ts）| なし | 変更しない（契約は実装済）|

## 4. 後方互換性

- **互換維持**: ✅（純加算）。既存の 0 タップゲスト学習開始・全 owner-scoped API は不変。連携 UI は opt-in。
- 非互換変更: なし。

## 5. ロールバック方針

- **コード revert で戻せる**: ✅（追加コードの revert のみ。DB 変更なし）
- **DB マイグレーションのロールバック**: 不要（スキーマ変更なし）
- 手順: 本 revise のコミットを revert すれば連携 UI が消え、ゲスト匿名フローのみに戻る。

## 6. リリース戦略

- **方式**: 一括（フィーチャーフラグ不要）。ただし Clerk フロントは **injectable seam** = ローカル/keyless では UI が「準備中」で無効化、release で実 publishable key + `@clerk/clerk-react` install 時に有効化。
- フィーチャーフラグ名: なし（seam の可用性 = key 有無で自動切替）。
- ロールアウト: backend 同様、release Phase 1 で `CLERK_PUBLISHABLE_KEY`/`CLERK_SECRET_KEY` を FILL すると連携が live 化。それまでは「準備中」表示で安全に公開可。

## 7. 詳細仕様（新仕様）

### 7.1 詳細 UC（新仕様）
**UC-link（ゲスト→アカウント連携）**
- トリガー: マイデータ画面の「Googleで連携してデータを引き継ぐ」ボタン押下
- 前提: ゲストセッション確立済み（guest JWT 保持）、Clerk seam が available（publishable key あり）
- 処理: ① `authProvider.signInWithGoogle()` で Clerk OAuth → Clerk セッション JWT 取得 → ② 現ゲスト JWT を Authorization、Clerk JWT を `account_token` として `POST /api/auth?action=link` → ③ 204 で連携成功 → ④ `clearGuestToken()`（以後 Clerk セッション token で認証）→ ⑤ 状態を「連携済み」に更新
- 出力: 「データを引き継いで連携しました」表示、状態=連携済み
- 例外: seam unavailable → ボタン無効「準備中」/ OAuth キャンセル → 状態据え置き / API 401/503 → エラーメッセージ

**UC-signout（サインアウト）**
- トリガー: 連携済み状態での「サインアウト」ボタン
- 処理: ① `authProvider.signOut()`（Clerk セッション破棄）→ ② `clearGuestToken()` → ③ `bootstrapSession()` で新規ゲスト再確立 → ④ 状態を「ゲスト」に更新
- 出力: 「サインアウトしました」表示、状態=ゲスト（連携先アカウントのデータはサーバに保持され、次回同アカウント連携時に再表示）
- 注: サインアウト後は新規ゲスト（空の進捗）から再開。アカウントのデータは消えない（owner=Clerk id のまま保持）。

**UC-authstate（状態表示）**
- マイデータ画面の冒頭で「現在: ゲスト利用中 / アカウント連携済み」を表示。連携済みなら「サインアウト」、ゲストなら「Googleで連携」ボタンを出し分け。

### 7.2 入出力（新仕様）
| メソッド | パス | 入力 | 出力 | 認証 |
|---|---|---|---|---|
| POST | /api/auth?action=link | Authorization: Bearer <guest JWT>, body.account_token=<Clerk JWT> | 204 | ゲスト所有証明 + Clerk JWT（既存）|

フロント interface（新規 seam）:
- `AuthProvider.isAvailable(): boolean` — Clerk publishable key + SDK の有無
- `AuthProvider.signInWithGoogle(): Promise<{ accountToken: string }>` — OAuth → Clerk JWT
- `AuthProvider.signOut(): Promise<void>` — Clerk セッション破棄
- `AuthProvider.getState(): { linked: boolean }`

### 7.3 データモデル（新仕様）
変更なし（§2.3）。

### 7.4 バリデーション・エラー（新仕様）
§2.4 のとおり。UI はすべての失敗で white-screen を出さず、ゲスト状態を維持してメッセージ表示。

### 7.5 機能固有 NFR + 既存連携（新仕様）
- **keyless 安全性**: Clerk publishable key 未設定でも build/test/local が緑（seam unavailable で UI 無効化）。backend の `@clerk/backend` computed-specifier seam と対称。
- **両輪 NFR（O22(E)）**: 連携（login）と必ず対のサインアウト（logout）を提供。E2E で「ゲスト→連携→サインアウト→ゲスト」の可逆性を検証可能にする。
- 既存連携: features/account（UI 宿主）、src/lib/api/client.ts（token 切替）、main.tsx/bootstrap（再 bootstrap）。

## 8. タグ別追加項目

### 認可（auth-required）
- 所有者チェック: 連携は guest JWT 所有証明（Authorization）+ Clerk JWT 検証の二者で行い、クライアント申告 owner は不信用（既存 SEC-001 を踏襲）。
- サインアウト後の owner は新規ゲスト sub（`guest_<uuid>`）。連携済みデータへの再アクセスは同 Clerk アカウント再連携時のみ。

## 9. 未決事項
- 現時点で論点なし（2026-06-21）。Clerk フロント SDK の具体 API（`signIn` ticket vs OAuth redirect）は release 時の `@clerk/clerk-react` バージョンに合わせて実装版 seam で確定（interface は本 SPEC で固定）。

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-21 | 初版作成（O22(B+E) audit High 対応、連携/サインアウト UI 動線追加）| /flow:revise |
