import { describe, it, expect, beforeEach } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { DDL } from '../../../db/ddl'
import * as schema from '../../../db/schema'
import { ingestFeedback } from './ingest'

let db: any
beforeEach(async () => { const pg = new PGlite(); db = drizzle(pg, { schema }); await pg.exec(DDL) })

describe('feedback ingestion (SEC-003 PII scrub)', () => {
  it('N1/N3: 👍 を保存', async () => {
    await ingestFeedback(db, { ownerId: 'guest_1', kind: 'like' })
    const rows = await db.select().from(schema.feedback)
    expect(rows).toHaveLength(1)
    expect(rows[0].kind).toBe('like')
  })
  it('E3/N2: バグ報告本文の PII を送信前に除去', async () => {
    await ingestFeedback(db, { ownerId: 'guest_1', kind: 'bug', body: 'メール a@b.com で落ちた 090-1111-2222' })
    const [row] = await db.select().from(schema.feedback)
    expect(row.body).not.toContain('a@b.com')
    expect(row.body).not.toContain('090-1111-2222')
    expect(row.body).toContain('[email]')
  })
  it('B1: owner null（匿名前）でも許容', async () => {
    await ingestFeedback(db, { kind: 'dislike' })
    expect(await db.select().from(schema.feedback)).toHaveLength(1)
  })
})
