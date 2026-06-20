// 軽量ハンドラ補助（Vercel Functions / 任意ランタイム）。実 DB/Clerk は env から（release で FILL）。
import { makeDb } from '../db/client'
export function db() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL 未設定（release で FILL）')
  return makeDb(url)
}
// owner 解決のプレースホルダ（実 Clerk は integration で inject、P4.46）
export function ownerFrom(req: { headers?: Record<string, string | undefined> }): string {
  return req.headers?.['x-owner-id'] ?? 'guest_anon'
}
export type Json = (status: number, body: unknown) => void
