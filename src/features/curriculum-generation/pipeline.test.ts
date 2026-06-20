import { describe, it, expect, beforeEach } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { DDL } from '../../../db/ddl'
import * as schema from '../../../db/schema'
import { getPublicUnits } from '../../../db/owner'
import { validateAndStore } from './pipeline'
import { MockAiClient } from '../../lib/ai/mock'

let db: any
beforeEach(async () => { const pg = new PGlite(); db = drizzle(pg, { schema }); await pg.exec(DDL) })
const gen = { slug: 'seisuu', title: '正負の数', systemicLine: '中学数学', description: 'd', trivia: 't' }

describe('curriculum-generation pipeline ([論点-CG1])', () => {
  it('N2: 多段検証 pass → verified で保存 + 配信される', async () => {
    const ai = new MockAiClient({ reviews: { claude: { verdict: 'pass' }, 'gpt-4o-mini': { verdict: 'pass' } } })
    const r = await validateAndStore(db, ai, gen, ['claude', 'gpt-4o-mini'])
    expect(r.verified).toBe(true)
    expect(await getPublicUnits(db)).toHaveLength(1)          // 配信される
    expect(await db.select().from(schema.reviews)).toHaveLength(2) // 検証履歴
  })
  it('E1: 重大指摘 → under_review 差し戻し（配信されない）', async () => {
    const ai = new MockAiClient({ reviews: { claude: { verdict: 'pass' }, 'gpt-4o-mini': { verdict: 'fail', critical: true, findings: '符号誤り' } } })
    const r = await validateAndStore(db, ai, gen, ['claude', 'gpt-4o-mini'])
    expect(r.verified).toBe(false)
    expect(await getPublicUnits(db)).toHaveLength(0)  // verified でないので配信されない（SEC: 未検証を出さない）
    expect(await db.select().from(schema.units)).toHaveLength(1) // 保存はされる（under_review）
  })
})
