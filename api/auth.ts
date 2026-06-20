import { randomUUID } from 'node:crypto'
import { db } from './_handler'
import { signGuestToken, verifyGuestToken } from '../src/lib/auth/guest-token'
import {
  provisionGuest,
  GuestRateLimitedError,
  GuestProvisionError,
} from '../src/lib/auth/provisionGuest'
import { linkGuestToAccount } from '../src/lib/auth/account'
import { extractBearerToken } from '../src/lib/auth/resolveOwner'
import { InMemoryRateLimiter } from '../src/lib/ratelimit'

/**
 * /api/auth — 認証エンドポイント統合（Vercel Functions 数の節約）。
 *   ?action=guest → 匿名ゲストの自前署名 guest JWT 発行（0 タップ学習開始, O22）
 *   ?action=link  → ゲスト→アカウント連携（昇格 + データ引き継ぎ）
 */

// 1 IP / 60s で 10 発行（匿名量産防止, SEC）。serverless cold-start ごとにリセット。
const guestLimiter = new InMemoryRateLimiter(10, 60_000)

function clientKey(req: any): string {
  const xff = req.headers?.['x-forwarded-for']
  const ip = Array.isArray(xff) ? xff[0] : (xff ?? 'local').split(',')[0].trim()
  return ip || 'local'
}

export default async function handler(req: any, res: any) {
  const action = Array.isArray(req.query?.action) ? req.query.action[0] : req.query?.action
  if (action === 'guest') return handleGuest(req, res)
  if (action === 'link') return handleLink(req, res)
  res.status(404).json({ error: 'Not Found' })
}

/** 匿名ゲストの guest JWT を発行（O22）。 */
async function handleGuest(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  const secret = process.env.GUEST_TOKEN_SECRET
  if (!secret) {
    res.status(503).json({ error: 'Service Unavailable' }) // 秘密未配線（release で FILL）
    return
  }
  try {
    const { guestToken } = await provisionGuest(
      { rateKey: `guest:${clientKey(req)}` },
      {
        checkRateLimit: (key) => guestLimiter.allow(key),
        signToken: (sub) => signGuestToken(secret, sub),
        genSub: () => `guest_${randomUUID()}`,
      },
    )
    res.status(201).json({ guestToken })
  } catch (e) {
    if (e instanceof GuestRateLimitedError) {
      res.status(429).json({ error: 'Too Many Requests' })
      return
    }
    if (e instanceof GuestProvisionError) {
      res.status(503).json({ error: 'Service Unavailable' })
      return
    }
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

/**
 * ゲスト→アカウント連携（昇格）。
 * Authorization=guest token（所有証明）、body.account_token=Clerk JWT。
 * ゲストの全データを連携先 owner へ引き継ぐ（取りこぼしなし）。
 */
async function handleLink(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  const guestSecret = process.env.GUEST_TOKEN_SECRET
  const clerkSecret = process.env.CLERK_SECRET_KEY
  if (!guestSecret || !clerkSecret) {
    res.status(503).json({ error: 'Service Unavailable' }) // Clerk 実キー未配線（release で FILL）
    return
  }
  const guestToken = extractBearerToken(req.headers)
  const accountToken = (req.body as { account_token?: unknown } | undefined)?.account_token
  if (!guestToken || typeof accountToken !== 'string' || !accountToken) {
    res.status(400).json({ error: 'Bad Request' })
    return
  }
  // ゲスト所有証明
  let guestOwnerId: string
  try {
    guestOwnerId = verifyGuestToken(guestSecret, guestToken).sub
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  // Clerk JWT 検証（computed specifier で未 install 時の build 破壊を回避）
  let accountOwnerId: string | null = null
  try {
    const spec = ['@clerk', 'backend'].join('/')
    const mod: any = await import(/* @vite-ignore */ spec)
    const payload = await mod.verifyToken(accountToken, { secretKey: clerkSecret })
    accountOwnerId = payload?.sub ?? null
  } catch {
    accountOwnerId = null
  }
  if (!accountOwnerId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  await linkGuestToAccount(db(), guestOwnerId, accountOwnerId)
  res.status(204).end()
}
