import { describe, it, expect } from 'vitest'
import { resolveOwnerFromAuth, extractBearerToken } from './resolveOwner'
import { MissingOwnerError } from './session'
import { signGuestToken } from './guest-token'

const GUEST_SECRET = 'guest-secret-xyz'

describe('resolveOwnerFromAuth (auth seam, SEC-001)', () => {
  it('N1: 有効な guest JWT → ownerId(sub) を解決（匿名でも 401 にしない, P4.46）', async () => {
    const token = signGuestToken(GUEST_SECRET, 'guest_42')
    const owner = await resolveOwnerFromAuth(`Bearer ${token}`, { guestSecret: GUEST_SECRET })
    expect(owner).toBe('guest_42')
  })

  it('E1: Authorization なし → MissingOwnerError(401)', async () => {
    await expect(resolveOwnerFromAuth(undefined, { guestSecret: GUEST_SECRET })).rejects.toBeInstanceOf(
      MissingOwnerError,
    )
  })

  it('E2: 改竄/別 secret の token → 401（なりすまし不可）', async () => {
    const token = signGuestToken('attacker-secret', 'guest_victim')
    await expect(
      resolveOwnerFromAuth(`Bearer ${token}`, { guestSecret: GUEST_SECRET }),
    ).rejects.toBeInstanceOf(MissingOwnerError)
  })

  it('E3: x-owner-id 風の生文字列を Bearer に入れても解決しない（旧 header 信頼の排除）', async () => {
    await expect(
      resolveOwnerFromAuth('Bearer guest_anon', { guestSecret: GUEST_SECRET }),
    ).rejects.toBeInstanceOf(MissingOwnerError)
  })

  it('N2: Clerk JWT は注入 verifyClerk で userId 解決（guest 不一致時に fall through）', async () => {
    const owner = await resolveOwnerFromAuth('Bearer clerk.jwt.here', {
      guestSecret: GUEST_SECRET,
      verifyClerk: async (t) => (t === 'clerk.jwt.here' ? 'user_clerk_7' : null),
    })
    expect(owner).toBe('user_clerk_7')
  })

  it('N3: guest token は Clerk verify を呼ばずに解決（iss 振り分け）', async () => {
    let clerkCalled = false
    const token = signGuestToken(GUEST_SECRET, 'guest_99')
    const owner = await resolveOwnerFromAuth(`Bearer ${token}`, {
      guestSecret: GUEST_SECRET,
      verifyClerk: async () => {
        clerkCalled = true
        return 'should_not_be_used'
      },
    })
    expect(owner).toBe('guest_99')
    expect(clerkCalled).toBe(false)
  })
})

describe('extractBearerToken', () => {
  it('Bearer プレフィックスを剥がす（大小無視）', () => {
    expect(extractBearerToken({ authorization: 'Bearer abc' })).toBe('abc')
    expect(extractBearerToken({ Authorization: 'bearer xyz' })).toBe('xyz')
    expect(extractBearerToken({})).toBeNull()
    expect(extractBearerToken({ authorization: 'abc' })).toBeNull()
  })
})
