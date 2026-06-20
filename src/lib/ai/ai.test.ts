import { describe, it, expect } from 'vitest'
import { scrubPII } from './piiScrub'
import { runCrossValidation } from './crossValidation'
import { MockAiClient } from './mock'

describe('_shared/ai piiScrub (SEC-003)', () => {
  it('E3: email/電話/位置を送信前に除去', () => {
    const out = scrubPII('連絡は a.b@example.com / 090-1234-5678 / 35.6812,139.7671 まで')
    expect(out).not.toContain('@example.com')
    expect(out).not.toContain('090-1234-5678')
    expect(out).not.toContain('35.6812,139.7671')
    expect(out).toContain('[email]')
  })
})

describe('_shared/ai crossValidation ([論点-CG1])', () => {
  it('N2: 多数決 pass + 重大指摘なし → verified', async () => {
    const client = new MockAiClient({ reviews: {
      'claude': { verdict: 'pass', critical: false },
      'gpt-4o-mini': { verdict: 'pass', critical: false },
    } })
    const r = await runCrossValidation(client, 'x', 'math correctness', ['claude', 'gpt-4o-mini'])
    expect(r.verified).toBe(true)
    expect(r.reviews).toHaveLength(2)
  })
  it('E4: 重大指摘ありなら verified にしない（差し戻し）', async () => {
    const client = new MockAiClient({ reviews: {
      'claude': { verdict: 'pass', critical: false },
      'gpt-4o-mini': { verdict: 'pass', critical: true, findings: '符号誤り' },
    } })
    const r = await runCrossValidation(client, 'x', 'c', ['claude', 'gpt-4o-mini'])
    expect(r.verified).toBe(false)
    expect(r.reason).toContain('重大指摘')
  })
  it('B1: 多数決未達 → 差し戻し', async () => {
    const client = new MockAiClient({ reviews: {
      'a': { verdict: 'pass' }, 'b': { verdict: 'fail' }, 'c': { verdict: 'fail' },
    } })
    const r = await runCrossValidation(client, 'x', 'c', ['a', 'b', 'c'])
    expect(r.verified).toBe(false)
  })
})
