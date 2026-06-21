# _shared/auth 単体テスト計画（連携 / サインアウト UI 動線追加）

> **入力**: `./001_REVISE_SPEC.md`, `./002_REVISE_PLAN.md`, 既存 `../auth.test.ts`
> **最終更新**: 2026-06-21

---

## 1. 追加テストケース

### 1.1 正常系
| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| N1 | authProvider（stub）| keyless（key なし）| `isAvailable()===false` |
| N2 | authClient.linkAccount | mock provider（signInWithGoogle→accountToken='ck_jwt'）+ mock fetch(POST link→204) | POST `/api/auth?action=link` が Authorization=guest Bearer + body.account_token='ck_jwt' で呼ばれる / `clearGuestToken` 呼出 / state=linked |
| N3 | authClient.signOut | mock provider.signOut + mock bootstrap | provider.signOut 呼出 / clearGuestToken 呼出 / bootstrapSession 再実行 / state=guest |
| N4 | AccountAuthSection | state=guest & seam available | 「Googleで連携」ボタン表示、押下で linkAccount 呼出 |
| N5 | AccountAuthSection | state=linked | 「サインアウト」ボタン表示、押下で signOut 呼出 |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待振る舞い |
|---|---|---|---|
| E1 | authClient.linkAccount | mock fetch POST link → 401 | state は guest 維持 / エラー（連携失敗）を返す / clearGuestToken 呼ばない |
| E2 | authClient.linkAccount | provider.signInWithGoogle が reject（OAuth キャンセル）| state 据え置き / no-op（エラー throw せず握る）|
| E3 | AccountAuthSection | seam unavailable（keyless）| 「準備中」表示でボタン無効（disabled）、linkAccount 呼ばれない |
| E4 | authClient.linkAccount | fetch reject（オフライン）| state 維持 + エラー返却 |

### 1.3 境界値
| ID | 対象 | 境界 | 期待振る舞い |
|---|---|---|---|
| B1 | authClient.linkAccount | guest token 不在（localStorage 空）| ensureGuestToken で発行後に link、または「先にゲスト確立」を保証 |

## 2. 修正テストケース
| ID | 対象 | 修正前 | 修正後 | 理由 |
|---|---|---|---|---|
| M1 | `AccountView.test.tsx` | DSR 削除導線のみ検証 | AuthSection が存在（状態表示 + ボタン）を追加検証 | UI 追加に追従 |

## 3. 削除テストケース
なし。

## 4. リグレッション強化
- 既存 `auth.test.ts`（resolveOwner / guest-token / provisionGuest / owner scoping）は全維持・不変。
- 連携後も owner-scoped API（SEC-001）が壊れないこと（authClient が token を差し替えても Authorization Bearer 経路は不変）。

## 5. Mock 方針差分
| 対象 | 前回 | 今回 | 理由 |
|---|---|---|---|
| Clerk フロント | — | mock AuthProvider（DI 注入）| 実 SDK/キー不要で orchestration 全分岐を緑に |
| fetch（/api/auth?action=link）| — | vi.fn モック | API 結果（204/401/reject）を制御 |
| bootstrapSession | — | spy | 再 bootstrap 呼出を検証 |

## 6. カバレッジ目標
| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | 既存継承 |
| 分岐 | 70%（authClient 分岐は全網羅）| 連携/サインアウト/失敗の全経路 |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-21 | 初版作成 | /flow:revise |
