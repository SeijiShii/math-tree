// Neon serverless クライアント（本番）。テストは PGlite を直接 drizzle に渡す（owner.ts は Db 非依存）。
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

export function makeDb(databaseUrl: string) {
  const sql = neon(databaseUrl)
  return drizzle(sql, { schema })
}
