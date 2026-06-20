import { describe, it, expect, beforeEach } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { DDL } from '../../../db/ddl'
import * as schema from '../../../db/schema'
import { advanceProgress, getOwnerProgress } from '../../../db/owner'
import { establishGuestSession, requireOwner, MissingOwnerError, type SessionProvider } from './session'
import { deleteAllOwnerData, linkGuestToAccount } from './account'

let db: any
beforeEach(async () => {
  const pg = new PGlite(); db = drizzle(pg, { schema }); await pg.exec(DDL)
})
async function seedUnit(slug = 'u') {
  const [u] = await db.insert(schema.units).values({ slug, title: slug, systemicLine: 's', description: 'd', trivia: 't', verificationStatus: 'verified' }).returning()
  return u
}

describe('_shared/auth ゲスト→authed (O22 / P4.46)', () => {
  it('N1: establishGuestSession で匿名 owner 発行', () => {
    const s = establishGuestSession()
    expect(s.ownerId).toMatch(/^guest_/)
  })
  it('E1: 匿名ゲスト owner で保護操作が通る（401 にしない, P4.46）', async () => {
    const guest = establishGuestSession()
    const provider: SessionProvider = { async resolve() { return guest } }
    const ownerId = await requireOwner(provider, {})  // 401 を投げない
    const u = await seedUnit()
    await advanceProgress(db, ownerId, u.id, 'unlocked')
    expect(await getOwnerProgress(db, ownerId)).toHaveLength(1)
  })
  it('owner 不在は 401（MissingOwnerError）', async () => {
    const provider: SessionProvider = { async resolve() { return { ownerId: null } } }
    await expect(requireOwner(provider, {})).rejects.toBeInstanceOf(MissingOwnerError)
  })
})

describe('_shared/auth データ引き継ぎ + DSR', () => {
  it('N3: ゲスト進捗が連携先 owner に引き継がれる', async () => {
    const u = await seedUnit()
    await advanceProgress(db, 'guest_1', u.id, 'mastered')
    await linkGuestToAccount(db, 'guest_1', 'user_99')
    expect(await getOwnerProgress(db, 'guest_1')).toHaveLength(0)
    expect(await getOwnerProgress(db, 'user_99')).toHaveLength(1)
  })
  it('N4: deleteAllOwnerData で全削除（SEC-004）', async () => {
    const u = await seedUnit()
    await advanceProgress(db, 'guest_1', u.id, 'mastered')
    await deleteAllOwnerData(db, 'guest_1')
    expect(await getOwnerProgress(db, 'guest_1')).toHaveLength(0)
    expect(await db.select().from(schema.units)).toHaveLength(1) // 公開不変
  })
})
