import { describe, it, expect, beforeEach } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { DDL } from './ddl'
import * as schema from './schema'
import { getOwnerProgress, advanceProgress, purgeOwnerData, getPublicUnits } from './owner'

let db: any
let pg: PGlite

async function seedUnit(slug: string, status = 'verified') {
  const [u] = await db.insert(schema.units).values({
    slug, title: slug, systemicLine: '中学数学', description: 'd', trivia: 't',
    verificationStatus: status,
  }).returning()
  return u
}

beforeEach(async () => {
  pg = new PGlite()
  db = drizzle(pg, { schema })
  await pg.exec(DDL)
})

describe('_shared/db owner scoping (SEC-001)', () => {
  it('N4/E1: owner は自分の進捗のみ取得（他人のは見えない）', async () => {
    const u = await seedUnit('seisuu')
    await advanceProgress(db, 'ownerA', u.id, 'unlocked')
    await advanceProgress(db, 'ownerB', u.id, 'mastered')
    const a = await getOwnerProgress(db, 'ownerA')
    const b = await getOwnerProgress(db, 'ownerB')
    expect(a).toHaveLength(1)
    expect(a[0].ownerId).toBe('ownerA')
    expect(a[0].state).toBe('unlocked')
    expect(b[0].state).toBe('mastered')
  })

  it('N3: progress state は前進のみ（locked→unlocked→mastered）', async () => {
    const u = await seedUnit('moji-shiki')
    expect((await advanceProgress(db, 'ownerA', u.id, 'unlocked')).updated).toBe(true)
    expect((await advanceProgress(db, 'ownerA', u.id, 'mastered')).updated).toBe(true)
    const r = await getOwnerProgress(db, 'ownerA')
    expect(r[0].state).toBe('mastered')
  })

  it('E3: progress 後退は拒否（mastered→locked 不可）', async () => {
    const u = await seedUnit('ichiji')
    await advanceProgress(db, 'ownerA', u.id, 'mastered')
    const res = await advanceProgress(db, 'ownerA', u.id, 'locked')
    expect(res.updated).toBe(false)
    expect((await getOwnerProgress(db, 'ownerA'))[0].state).toBe('mastered')
  })
})

describe('_shared/db DSR purge (SEC-004)', () => {
  it('N5: purgeOwnerData で owner 全データ削除、公開 units は不変', async () => {
    const u = await seedUnit('kansuu')
    await advanceProgress(db, 'ownerA', u.id, 'mastered')
    await db.insert(schema.supports).values({ ownerId: 'ownerA', stripeSessionId: 'cs_1' })
    await db.insert(schema.feedback).values({ ownerId: 'ownerA', kind: 'like' })
    // 他人のデータ
    await advanceProgress(db, 'ownerB', u.id, 'unlocked')

    await purgeOwnerData(db, 'ownerA')

    expect(await getOwnerProgress(db, 'ownerA')).toHaveLength(0)
    expect((await db.select().from(schema.supports)).filter((s: any) => s.ownerId === 'ownerA')).toHaveLength(0)
    expect((await db.select().from(schema.feedback)).filter((f: any) => f.ownerId === 'ownerA')).toHaveLength(0)
    // 公開 units と他人データは不変
    expect(await db.select().from(schema.units)).toHaveLength(1)
    expect(await getOwnerProgress(db, 'ownerB')).toHaveLength(1)
  })
})

describe('_shared/db verified-only 配信 (E2)', () => {
  it('E2: getPublicUnits は verified のみ、verification_status を露出しない', async () => {
    await seedUnit('verified-unit', 'verified')
    await seedUnit('draft-unit', 'draft')
    const pub = await getPublicUnits(db)
    expect(pub).toHaveLength(1)
    expect(pub[0].slug).toBe('verified-unit')
    expect(pub[0]).not.toHaveProperty('verificationStatus')
    expect(pub[0]).toHaveProperty('trivia')
  })
})

describe('_shared/db 冪等 (N6)', () => {
  it('N6: supports stripe_session_id 一意（同 session 2 回で 1 件）', async () => {
    await db.insert(schema.supports).values({ ownerId: 'ownerA', stripeSessionId: 'cs_x' })
    await expect(
      db.insert(schema.supports).values({ ownerId: 'ownerA', stripeSessionId: 'cs_x' }),
    ).rejects.toThrow()
  })
})
