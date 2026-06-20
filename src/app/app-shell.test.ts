import { describe, it, expect } from 'vitest'
import { ROUTES, orphanedRoutes } from './routes'
import { bootstrapSession } from './bootstrap'

describe('_shared/app-shell 合成 (O57)', () => {
  it('E2: orphaned route なし（全ルートに inbound 導線, O55）', () => {
    expect(orphanedRoutes()).toEqual([])
  })
  it('N2: 主要ルートが定義されている', () => {
    const paths = ROUTES.map(r => r.path)
    expect(paths).toContain('/')
    expect(paths).toContain('/account')                                   // DSR セルフ削除導線
    expect(paths).toContain('/legal/privacy')
    expect(paths).toContain('/legal/specified-commercial-transactions')
  })
  it('法務 3 点はフッタ導線（常設, O55）', () => {
    const legal = ROUTES.filter(r => r.path.startsWith('/legal/'))
    expect(legal).toHaveLength(3)
    expect(legal.every(r => r.nav === 'footer')).toBe(true)
  })
  it('N3: 起動で匿名ゲストセッション確立（P4.46、401 にしない）', () => {
    const s = bootstrapSession()
    expect(s.ownerId).toMatch(/^guest_/)
  })
  it('既存セッションがあれば維持', () => {
    const s = bootstrapSession({ ownerId: 'user_42' })
    expect(s.ownerId).toBe('user_42')
  })
})
