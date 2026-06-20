/**
 * 匿名（ゲスト）発行の純オーケストレーション（bousai-bag 同型、guest 自前署名 JWT）。
 *
 * フロー: レート制限（匿名量産防止）→ genSub() で `guest_<uuid>` → signToken(sub) で guest JWT 署名。
 * sign / limiter はすべて注入 = SDK・env 非依存で単体テスト可能（O35）。
 * （bousai は users 行 upsert も行うが、math-tree は progress 等が owner_id を text で持ち
 *  ゲスト専用 users テーブルを持たないため upsert は省略。owner_id は guest token の sub がそのまま。）
 */

/** レート超過（429 にマップ）。 */
export class GuestRateLimitedError extends Error {
  readonly status = 429
  constructor() {
    super('rate_limited')
    this.name = 'GuestRateLimitedError'
  }
}

/** token 署名失敗 / secret 未設定（503 にマップ）。 */
export class GuestProvisionError extends Error {
  readonly status = 503
  constructor(message = 'guest_provision_failed', options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'GuestProvisionError'
  }
}

export interface ProvisionGuestDeps {
  /** レート判定。false で 429。 */
  checkRateLimit: (key: string) => Promise<boolean>
  /** guest JWT を署名（handler が signGuestToken に GUEST_TOKEN_SECRET を bind して注入）。 */
  signToken: (sub: string) => string
  /** 匿名 user の subject 生成（`guest_<uuid>` を想定）。 */
  genSub: () => string
}

/**
 * 匿名 session 用の guest JWT を発行する。
 * @returns `{ guestToken }` フロントが localStorage 保持 + Authorization に付与する。
 * @throws GuestRateLimitedError(429) / GuestProvisionError(503)
 */
export async function provisionGuest(
  input: { rateKey: string },
  deps: ProvisionGuestDeps,
): Promise<{ guestToken: string }> {
  if (!(await deps.checkRateLimit(input.rateKey))) throw new GuestRateLimitedError()
  try {
    const sub = deps.genSub()
    const guestToken = deps.signToken(sub)
    return { guestToken }
  } catch (err) {
    throw new GuestProvisionError('guest_provision_failed', { cause: err })
  }
}
