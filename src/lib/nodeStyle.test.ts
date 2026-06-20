import { describe, it, expect } from 'vitest'
import { nodeVisual, NODE_TOKEN } from './nodeStyle'

describe('_shared/ui nodeStyle (design §2.1)', () => {
  it('N3: 状態が design §2.1 の visual にマップ', () => {
    expect(nodeVisual('mastered', false)).toBe('mastered')
    expect(nodeVisual('unlocked', false)).toBe('unlocked')
    expect(nodeVisual('locked', false)).toBe('locked')
  })
  it('ロマンノード（未習得）は romance visual', () => {
    expect(nodeVisual('locked', true)).toBe('romance')
    expect(nodeVisual('unlocked', true)).toBe('romance')
    expect(nodeVisual('mastered', true)).toBe('mastered') // 習得済は通常表示
  })
  it('全 visual がトークン参照（生値 hex 直書きなし, 原則#3）', () => {
    for (const v of Object.values(NODE_TOKEN)) {
      expect(v.outline).toMatch(/^var\(--/)
      expect(v.outline).not.toMatch(/#[0-9a-f]/i)
    }
  })
})
