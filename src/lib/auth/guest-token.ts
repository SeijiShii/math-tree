/**
 * 匿名ゲストの自前署名 guest JWT (HS256) の sign/verify 純関数。
 *
 * ゲストを Clerk セッションから切り離す（Clerk 非セッション化）方式。bousai-bag / naze-bako /
 * hana-memo 実績パターン（perspectives O58）。ゲストは Clerk user を作らないため MAU を消費しない。
 *
 * - **SDK 非依存**: Node 組み込み `crypto`（HMAC-SHA256）のみ。secret は引数注入（env 読まない）。
 *   → 単体テスト可能、署名は server 専用（api/auth/* のみが呼ぶ。client は不透明 token を保持するだけ）。
 * - `iss` は `mathtree-guest` 固定。resolver はこの iss で Clerk JWT と振り分ける。
 * - 失効戦略: 既定 180 日の長命。連携成功時に client 側で破棄する。
 */
import { createHmac, timingSafeEqual } from 'node:crypto'

/** guest JWT の issuer。resolver が Clerk JWT と振り分ける鍵。 */
export const GUEST_TOKEN_ISS = 'mathtree-guest'

/** 既定有効秒（180 日）。 */
export const GUEST_TOKEN_TTL_SEC = 180 * 24 * 60 * 60

/** guest token の検証失敗（改竄 / 失効 / iss 不一致 / 形式不正）。handler は 401 にマップ。 */
export class GuestTokenError extends Error {
  constructor(message = 'invalid_guest_token') {
    super(message)
    this.name = 'GuestTokenError'
  }
}

type GuestTokenPayload = { iss: string; sub: string; iat: number; exp: number }

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url')
}

function sign(secret: string, signingInput: string): string {
  return createHmac('sha256', secret).update(signingInput).digest('base64url')
}

/**
 * guest JWT を発行する。**server 専用**（secret を渡せるのは api 層のみ）。
 * @param sub 匿名 user の subject（`guest_<uuid>` 形式を想定）。
 */
export function signGuestToken(
  secret: string,
  sub: string,
  opts: { ttlSec?: number; now?: number } = {},
): string {
  if (!secret) throw new GuestTokenError('missing_secret')
  const nowSec = Math.floor((opts.now ?? Date.now()) / 1000)
  const ttl = opts.ttlSec ?? GUEST_TOKEN_TTL_SEC
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload: GuestTokenPayload = { iss: GUEST_TOKEN_ISS, sub, iat: nowSec, exp: nowSec + ttl }
  const body = b64url(JSON.stringify(payload))
  const signingInput = `${header}.${body}`
  return `${signingInput}.${sign(secret, signingInput)}`
}

/**
 * guest JWT を検証し payload を返す。失敗は GuestTokenError（token 値はログに出さない=SEC-002）。
 * iss が `mathtree-guest` でない token は弾く（Clerk JWT を guest 経路で誤受理しない）。
 */
export function verifyGuestToken(
  secret: string,
  token: string,
  opts: { now?: number } = {},
): { sub: string; iss: string } {
  if (!secret) throw new GuestTokenError('missing_secret')
  const parts = token.split('.')
  if (parts.length !== 3) throw new GuestTokenError('malformed')
  const [header, body, sig] = parts as [string, string, string]
  const expected = sign(secret, `${header}.${body}`)
  const sigBuf = Buffer.from(sig, 'utf8')
  const expBuf = Buffer.from(expected, 'utf8')
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    throw new GuestTokenError('bad_signature')
  }
  let payload: GuestTokenPayload
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  } catch {
    throw new GuestTokenError('bad_payload')
  }
  if (payload.iss !== GUEST_TOKEN_ISS) throw new GuestTokenError('bad_iss')
  if (typeof payload.sub !== 'string' || !payload.sub) throw new GuestTokenError('bad_sub')
  const nowSec = Math.floor((opts.now ?? Date.now()) / 1000)
  if (typeof payload.exp !== 'number' || payload.exp < nowSec) throw new GuestTokenError('expired')
  return { sub: payload.sub, iss: payload.iss }
}
