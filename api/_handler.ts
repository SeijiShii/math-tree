// 軽量ハンドラ補助（Vercel Functions / 任意ランタイム）。実 DB/Clerk は env から（release で FILL）。
import { makeDb } from '../db/client'
import { resolveOwnerFromAuth, type OwnerResolverDeps } from '../src/lib/auth/resolveOwner'
import { MissingOwnerError } from '../src/lib/auth/session'

export function db() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL 未設定（release で FILL）')
  return makeDb(url)
}

// Clerk JWT 検証（release で CLERK_SECRET_KEY + @clerk/backend が揃えば有効化）。
// specifier を計算して静的解決を避ける（未 install でも build/typecheck を壊さない）。
async function verifyClerk(token: string): Promise<string | null> {
  const secretKey = process.env.CLERK_SECRET_KEY
  if (!secretKey) return null
  try {
    const spec = ['@clerk', 'backend'].join('/')
    const mod: any = await import(/* @vite-ignore */ spec)
    const payload = await mod.verifyToken(token, { secretKey })
    return payload?.sub ?? null
  } catch {
    return null
  }
}

// owner 解決の唯一の信用入口（SEC-001）。Authorization: Bearer を guest/Clerk JWT で検証。
// クライアント申告（旧 x-owner-id 等）は信用しない。
export async function ownerFrom(req: {
  headers?: Record<string, string | string[] | undefined>
}): Promise<string> {
  const raw = req.headers?.['authorization'] ?? req.headers?.['Authorization']
  const auth = Array.isArray(raw) ? raw[0] : raw
  const deps: OwnerResolverDeps = {
    guestSecret: process.env.GUEST_TOKEN_SECRET,
    verifyClerk,
  }
  return resolveOwnerFromAuth(auth, deps)
}

// MissingOwnerError を 401 にマップする標準ヘルパ。401 化したら true。
export function send401If(res: any, e: unknown): boolean {
  if (e instanceof MissingOwnerError) {
    res.status(401).json({ error: 'Unauthorized' })
    return true
  }
  return false
}

export { MissingOwnerError }
export type Json = (status: number, body: unknown) => void
