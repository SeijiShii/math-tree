import { describe, it, expect, beforeEach } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { DDL } from '../../../db/ddl'
import * as schema from '../../../db/schema'
import { estimateCost, loadPricing } from './pricing'
import { recordCall } from './record'
import { aggregateCost } from './aggregate'
import { checkFreeTierAlert } from './alert'

let db: any
beforeEach(async () => { const pg = new PGlite(); db = drizzle(pg, { schema }); await pg.exec(DDL) })

describe('_shared/cost-tracking (§4.6.2)', () => {
  const pricing = { inputPer1k: 0.003, outputPer1k: 0.015 }
  it('N1: recordCall が tokens×単価で est_cost を算出し記録', async () => {
    const cost = await recordCall(db, { provider: 'anthropic', purpose: 'generation', model: 'claude', inputTokens: 1000, outputTokens: 1000 }, pricing)
    expect(cost).toBeCloseTo(0.018, 4)
    expect(await db.select().from(schema.aiCallLogs)).toHaveLength(1)
  })
  it('N2: aggregateCost が機能別 + 合計を集計', async () => {
    await recordCall(db, { provider: 'a', purpose: 'generation', model: 'm', inputTokens: 1000, outputTokens: 0 }, pricing)
    await recordCall(db, { provider: 'a', purpose: 'review', model: 'm', inputTokens: 1000, outputTokens: 0 }, pricing)
    const agg = await aggregateCost(db)
    expect(agg.total).toBeCloseTo(0.006, 4)
    expect(agg.byPurpose.generation).toBeCloseTo(0.003, 4)
    expect(agg.byPurpose.review).toBeCloseTo(0.003, 4)
  })
  it('N3: checkFreeTierAlert が閾値で発火', () => {
    expect(checkFreeTierAlert(5, 10)).toBe('ok')
    expect(checkFreeTierAlert(8, 10)).toBe('warn80')
    expect(checkFreeTierAlert(10, 10)).toBe('over100')
    expect(checkFreeTierAlert(12, 10)).toBe('over120')
  })
  it('E1: 単価 env 未設定なら 0（誤算出しない）', () => {
    const p = loadPricing({})
    expect(estimateCost(1000, 1000, p)).toBe(0)
  })
})
