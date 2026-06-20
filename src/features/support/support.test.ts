import { describe, it, expect, beforeEach } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { DDL } from '../../../db/ddl'
import * as schema from '../../../db/schema'
import { createCheckoutParams, SUPPORT_AMOUNT_JPY } from './checkout'
import { handleWebhook, recordSupport, type SignatureVerifier } from './webhook'

let db: any
beforeEach(async () => { const pg = new PGlite(); db = drizzle(pg, { schema }); await pg.exec(DDL) })

describe('support tip-jar', () => {
  it('N1: Checkout は固定 100 円 + 価格明示(O43)', () => {
    const p = createCheckoutParams('guest_1')
    expect(p.amount).toBe(100)
    expect(SUPPORT_AMOUNT_JPY).toBe(100)
    expect(p.description).toContain('100円')
  })
  it('N2: 署名検証 OK → supports 記録', async () => {
    const verify: SignatureVerifier = () => ({ ownerId: 'guest_1', stripeSessionId: 'cs_1', amount: 100 })
    const r = await handleWebhook(db, '{}', 'sig', verify)
    expect(r.ok).toBe(true)
    expect(await db.select().from(schema.supports)).toHaveLength(1)
  })
  it('E1: 署名不正 → 拒否', async () => {
    const verify: SignatureVerifier = () => null
    const r = await handleWebhook(db, '{}', 'bad', verify)
    expect(r.ok).toBe(false)
    expect(await db.select().from(schema.supports)).toHaveLength(0)
  })
  it('E2: 同 session 2 回 → 冪等（1 件）', async () => {
    const s = { ownerId: 'guest_1', stripeSessionId: 'cs_x', amount: 100 }
    expect((await recordSupport(db, s)).recorded).toBe(true)
    expect((await recordSupport(db, s)).recorded).toBe(false) // 冪等
    expect(await db.select().from(schema.supports)).toHaveLength(1)
  })
})
