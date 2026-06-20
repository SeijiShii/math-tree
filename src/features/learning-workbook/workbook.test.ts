import { describe, it, expect } from 'vitest'
import { areEquivalent } from './equivalence'
import { gradeStep } from './gradeStep'
import { MockAiClient } from '../../lib/ai/mock'

describe('learning-workbook 同値判定 ([論点-LW1] CAS)', () => {
  it('N1: 2x+3 ≡ 3+2x（交換法則）', () => {
    expect(areEquivalent('2x+3', '3+2x')).toBe(true)
  })
  it('B1: 等価な分数/小数（1/2 ≡ 0.5）', () => {
    expect(areEquivalent('\\frac{1}{2}', '0.5')).toBe(true)
  })
  it('E1: 非同値（2x+3 ≠ 2x+4）', () => {
    expect(areEquivalent('2x+3', '2x+4')).toBe(false)
  })
  it('展開: 2(x+1) ≡ 2x+2', () => {
    expect(areEquivalent('2(x+1)', '2x+2')).toBe(true)
  })
})

describe('learning-workbook gradeStep (CAS 優先 + AI フォールバック)', () => {
  it('N2: CAS で正解判定（AI 不使用）', async () => {
    const ai = new MockAiClient()
    const r = await gradeStep('3+2x', '2x+3', ai)
    expect(r.match).toBe(true)
    expect(r.viaAi).toBe(false)
  })
  it('E1: CAS で誤答判定 + ヒント', async () => {
    const ai = new MockAiClient()
    const r = await gradeStep('2x+4', '2x+3', ai)
    expect(r.match).toBe(false)
    expect(r.hint).toBeTruthy()
  })
  it('E4: CAS 判定不能時のみ AI フォールバック', async () => {
    const ai = new MockAiClient({ reviews: { 'gpt-4o-mini': { verdict: 'pass' } } })
    // 自然言語混じりで CAS が parse できないケース
    const r = await gradeStep('両辺を 2 で割って x=3', '\\text{x=3}', ai)
    expect(r.viaAi).toBe(true)
    expect(r.match).toBe(true)
  })
})

import { beforeEach } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { DDL } from '../../../db/ddl'
import * as schema from '../../../db/schema'
import { getOwnerProgress } from '../../../db/owner'
import { masterUnitAndUnlock } from './master'

describe('learning-workbook master→unlock (UC-LW1 #7)', () => {
  let db: any
  beforeEach(async () => { const pg = new PGlite(); db = drizzle(pg, { schema }); await pg.exec(DDL) })
  it('N3: 習得で次ノードがアンロック', async () => {
    const [a] = await db.insert(schema.units).values({ slug: 'a', title: 'a', systemicLine: 's', description: 'd', trivia: 't', verificationStatus: 'verified' }).returning()
    const [b] = await db.insert(schema.units).values({ slug: 'b', title: 'b', systemicLine: 's', description: 'd', trivia: 't', verificationStatus: 'verified' }).returning()
    await db.insert(schema.unitEdges).values({ fromUnitId: a.id, toUnitId: b.id })
    const r = await masterUnitAndUnlock(db, 'ownerA', a.id)
    expect(r.unlocked).toContain(b.id)
    const prog = await getOwnerProgress(db, 'ownerA')
    expect(prog.find((p: any) => p.unitId === a.id).state).toBe('mastered')
    expect(prog.find((p: any) => p.unitId === b.id).state).toBe('unlocked')
  })
})
