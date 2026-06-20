import { describe, it, expect } from 'vitest'
import {
  provisionGuest,
  GuestRateLimitedError,
  GuestProvisionError,
} from './provisionGuest'
import { signGuestToken, verifyGuestToken } from './guest-token'

const SECRET = 'prov-secret'

describe('provisionGuest (匿名発行, bousai 同型)', () => {
  it('N1: 発行した token は verify で sub を復元でき、guest_ 形式', async () => {
    let n = 0
    const { guestToken } = await provisionGuest(
      { rateKey: 'ip:1' },
      {
        checkRateLimit: async () => true,
        signToken: (sub) => signGuestToken(SECRET, sub),
        genSub: () => `guest_fixed_${n++}`,
      },
    )
    const r = verifyGuestToken(SECRET, guestToken)
    expect(r.sub).toBe('guest_fixed_0')
  })

  it('E1: レート超過は GuestRateLimitedError(429)', async () => {
    await expect(
      provisionGuest(
        { rateKey: 'ip:1' },
        {
          checkRateLimit: async () => false,
          signToken: (s) => s,
          genSub: () => 'guest_x',
        },
      ),
    ).rejects.toBeInstanceOf(GuestRateLimitedError)
  })

  it('E2: 署名失敗は GuestProvisionError(503)', async () => {
    await expect(
      provisionGuest(
        { rateKey: 'ip:1' },
        {
          checkRateLimit: async () => true,
          signToken: () => {
            throw new Error('no secret')
          },
          genSub: () => 'guest_x',
        },
      ),
    ).rejects.toBeInstanceOf(GuestProvisionError)
  })

  it('N2: 毎回異なる sub（owner が衝突しない）', async () => {
    const ids = new Set<string>()
    for (let i = 0; i < 3; i++) {
      const { guestToken } = await provisionGuest(
        { rateKey: `ip:${i}` },
        {
          checkRateLimit: async () => true,
          signToken: (sub) => signGuestToken(SECRET, sub),
          genSub: () => `guest_${i}_${Math.floor(i * 7)}`,
        },
      )
      ids.add(verifyGuestToken(SECRET, guestToken).sub)
    }
    expect(ids.size).toBe(3)
  })
})
