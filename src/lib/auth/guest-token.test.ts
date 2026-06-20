import { describe, it, expect } from 'vitest'
import {
  signGuestToken,
  verifyGuestToken,
  GuestTokenError,
  GUEST_TOKEN_ISS,
} from './guest-token'

const SECRET = 'test-secret-0123456789'

describe('guest-token sign/verify (O58 自前署名)', () => {
  it('N1: sign→verify ラウンドトリップで sub/iss を復元', () => {
    const t = signGuestToken(SECRET, 'guest_abc')
    const r = verifyGuestToken(SECRET, t)
    expect(r.sub).toBe('guest_abc')
    expect(r.iss).toBe(GUEST_TOKEN_ISS)
  })

  it('E1: 改竄署名は bad_signature で弾く（なりすまし不可）', () => {
    const t = signGuestToken(SECRET, 'guest_abc')
    const tampered = t.slice(0, -2) + (t.endsWith('aa') ? 'bb' : 'aa')
    expect(() => verifyGuestToken(SECRET, tampered)).toThrow(GuestTokenError)
  })

  it('E2: 別 secret では検証失敗（secret 知らない者は発行不可）', () => {
    const t = signGuestToken(SECRET, 'guest_abc')
    expect(() => verifyGuestToken('other-secret', t)).toThrow(GuestTokenError)
  })

  it('E3: 失効 token は expired', () => {
    const past = 1_000_000_000_000
    const t = signGuestToken(SECRET, 'guest_abc', { ttlSec: 60, now: past })
    expect(() => verifyGuestToken(SECRET, t, { now: past + 120_000 })).toThrow(/expired/)
  })

  it('E4: iss 不一致（他アプリ/Clerk JWT 風）は bad_iss', () => {
    // 手組みで iss=clerk の token を作って弾かれることを確認
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
    const body = Buffer.from(
      JSON.stringify({ iss: 'clerk', sub: 'x', iat: 0, exp: 9_999_999_999 }),
    ).toString('base64url')
    const { createHmac } = require('node:crypto')
    const sig = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url')
    expect(() => verifyGuestToken(SECRET, `${header}.${body}.${sig}`)).toThrow(/bad_iss/)
  })

  it('E5: 形式不正（3 分割でない）は malformed', () => {
    expect(() => verifyGuestToken(SECRET, 'not.a.jwt.token')).toThrow(/malformed/)
    expect(() => verifyGuestToken(SECRET, 'single')).toThrow(/malformed/)
  })

  it('E6: secret 未設定は missing_secret', () => {
    expect(() => signGuestToken('', 'guest_x')).toThrow(/missing_secret/)
    expect(() => verifyGuestToken('', 'a.b.c')).toThrow(/missing_secret/)
  })
})
