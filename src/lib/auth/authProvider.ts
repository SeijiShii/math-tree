/**
 * フロント認証 seam（O22 段階的認証, Clerk injectable）。
 *
 * keyless 安全: publishable key + 実 SDK が無ければ `StubAuthProvider`（isAvailable=false）を返し、
 * UI は「連携は準備中」で無効化する。実 OAuth は release で `@clerk/clerk-react` + 実 key 注入時に
 * 有効化（backend の `@clerk/backend` computed-specifier seam と対称、build/test は実 SDK 不要で緑）。
 */
export interface AuthProvider {
  /** publishable key + SDK が利用可能か（false なら連携 UI を「準備中」で無効化）。 */
  isAvailable(): boolean
  /** 現在アカウント連携済みか。 */
  isLinked(): boolean
  /** Google OAuth → Clerk セッション JWT を取得（連携 API の account_token）。 */
  signInWithGoogle(): Promise<{ accountToken: string }>
  /** Clerk セッションを破棄。 */
  signOut(): Promise<void>
}

export class NotAvailableError extends Error {
  constructor() {
    super('auth provider not available')
    this.name = 'NotAvailableError'
  }
}

/** keyless / 未配線時の stub。連携 UI を無効化し、ゲスト匿名フローのみで安全に動かす。 */
export class StubAuthProvider implements AuthProvider {
  isAvailable(): boolean {
    return false
  }
  isLinked(): boolean {
    return false
  }
  async signInWithGoogle(): Promise<{ accountToken: string }> {
    throw new NotAvailableError()
  }
  async signOut(): Promise<void> {
    /* no-op（連携していないため） */
  }
}

/**
 * 既定の AuthProvider を返す。publishable key（`VITE_CLERK_PUBLISHABLE_KEY`）が無ければ stub。
 * release で実 Clerk provider に差し替える（Phase 3.5）。現状は keyless 安全に stub を返す。
 */
export function getAuthProvider(): AuthProvider {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
  const pk = env?.VITE_CLERK_PUBLISHABLE_KEY
  if (!pk) return new StubAuthProvider()
  // release: 実 Clerk provider 注入時に有効化（未配線時は stub フォールバックで build 不破壊）
  return new StubAuthProvider()
}
