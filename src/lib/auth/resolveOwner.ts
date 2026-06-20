/**
 * owner 解決の唯一の信用入口（auth seam, SEC-001）。
 *
 * Authorization: Bearer <token> を受け、token の出所で振り分けて検証し ownerId を返す:
 *   - 自前署名 guest JWT（iss=mathtree-guest）→ verifyGuestToken → sub
 *   - Clerk JWT → 注入された verifyClerk（@clerk/backend、release で実キー注入）→ userId
 * いずれでもなければ MissingOwnerError（handler が 401 にマップ）。
 *
 * **リクエストボディ / x-owner-id 等のクライアント申告は一切信用しない**（なりすまし防止）。
 * verifyClerk / guestSecret は注入 = SDK・env 非依存で単体テスト可能（O35）。
 */
import { verifyGuestToken, GuestTokenError } from './guest-token'
import { MissingOwnerError } from './session'

export interface OwnerResolverDeps {
  /** GUEST_TOKEN_SECRET（未設定なら guest 経路は無効）。 */
  guestSecret?: string
  /** Clerk JWT 検証（成功で userId、失敗で null）。release で @clerk/backend を注入。 */
  verifyClerk?: (token: string) => Promise<string | null>
  /** テスト用の現在時刻。 */
  now?: number
}

/** `Authorization: Bearer <token>` から token を抽出（なければ null）。 */
export function extractBearerToken(
  headers: Record<string, string | string[] | undefined> | undefined,
): string | null {
  const raw = headers?.['authorization'] ?? headers?.['Authorization']
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value) return null
  const m = /^Bearer\s+(.+)$/i.exec(value)
  return m ? m[1].trim() : null
}

/**
 * Authorization ヘッダから ownerId を解決する。
 * @throws MissingOwnerError 認証不可（401）。
 */
export async function resolveOwnerFromAuth(
  authorization: string | undefined,
  deps: OwnerResolverDeps = {},
): Promise<string> {
  const token = authorization
    ? extractBearerToken({ authorization })
    : null
  if (!token) throw new MissingOwnerError()

  // 1) 自前署名 guest JWT を試す（iss/署名/失効を検証）
  if (deps.guestSecret) {
    try {
      return verifyGuestToken(deps.guestSecret, token, { now: deps.now }).sub
    } catch (e) {
      if (!(e instanceof GuestTokenError)) throw e
      // guest として不正 → Clerk JWT かもしれないので fall through
    }
  }

  // 2) Clerk JWT を試す（注入された検証関数）
  if (deps.verifyClerk) {
    const userId = await deps.verifyClerk(token)
    if (userId) return userId
  }

  throw new MissingOwnerError()
}
