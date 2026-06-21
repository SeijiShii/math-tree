/**
 * フロント認証 orchestration（O22(B+E) 連携 ↔ サインアウトの両輪）。
 *
 * linkAccount: Google OAuth → Clerk JWT → `POST /api/auth?action=link`（guest 所有証明 + account_token）
 *              → 成功で guest token を破棄（以後は Clerk セッション token で認証）。
 * signOut:     Clerk セッション破棄 → guest token 破棄 → 新規ゲスト再 bootstrap（空進捗で再開、
 *              連携先アカウントのデータはサーバに保持）。
 * すべての失敗は white-screen を出さずゲスト状態を維持して握る。
 */
import { type AuthProvider, getAuthProvider } from './authProvider'
import { ensureGuestToken, clearGuestToken, setSessionTokenGetter } from '../api/client'

export type AuthState = { linked: boolean }
export type LinkResult = { ok: true } | { ok: false; reason: 'unavailable' | 'cancelled' | 'failed' }

type LinkDeps = { fetchFn?: typeof fetch }
type SignOutDeps = { reBootstrap?: () => void }

/** ゲスト → アカウント連携。失敗時はゲスト状態を維持（guest token を消さない）。 */
export async function linkAccount(
  provider: AuthProvider = getAuthProvider(),
  deps: LinkDeps = {},
): Promise<LinkResult> {
  const fetchFn = deps.fetchFn ?? fetch
  if (!provider.isAvailable()) return { ok: false, reason: 'unavailable' }

  let accountToken: string
  try {
    accountToken = (await provider.signInWithGoogle()).accountToken
  } catch {
    return { ok: false, reason: 'cancelled' } // OAuth キャンセル等は握る（状態据え置き）
  }

  const guestToken = await ensureGuestToken()
  try {
    const res = await fetchFn('/api/auth?action=link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(guestToken ? { Authorization: `Bearer ${guestToken}` } : {}),
      },
      body: JSON.stringify({ account_token: accountToken }),
    })
    if (!res.ok) return { ok: false, reason: 'failed' } // state 維持、guest token は破棄しない
  } catch {
    return { ok: false, reason: 'failed' } // オフライン等
  }

  // 連携成功: 以後は Clerk セッション token を優先（実 provider が getter を登録）
  clearGuestToken()
  return { ok: true }
}

/** サインアウト（両輪）。Clerk セッションを破棄し、新規ゲストへ戻す。 */
export async function signOut(
  provider: AuthProvider = getAuthProvider(),
  deps: SignOutDeps = {},
): Promise<void> {
  try {
    await provider.signOut()
  } catch {
    /* provider 失敗でもローカルは必ずゲストに戻す */
  }
  setSessionTokenGetter(null) // Clerk セッション token 優先を解除
  clearGuestToken()
  if (deps.reBootstrap) deps.reBootstrap() // 新規ゲスト再確立（空進捗で再開）
}

export function getAuthState(provider: AuthProvider = getAuthProvider()): AuthState {
  return { linked: provider.isLinked() }
}
