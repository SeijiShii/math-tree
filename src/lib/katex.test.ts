import { describe, it, expect } from 'vitest'
import { renderMath } from './katex'

describe('_shared/ui katex (SEC-002 trust:false)', () => {
  it('N2: 妥当な LaTeX を描画する', () => {
    const html = renderMath('2x + 3 = 7')
    expect(html).toContain('katex')
  })
  it('E2: \\href の javascript: は anchor として出力されない（trust:false）', () => {
    const html = renderMath('\\href{javascript:alert(1)}{x}')
    expect(html.toLowerCase()).not.toContain('javascript:')
    expect(html.toLowerCase()).not.toContain('<a ')
  })
  it('E2: \\includegraphics は実行されない（trust:false）', () => {
    const html = renderMath('\\includegraphics{evil.png}')
    expect(html.toLowerCase()).not.toContain('<img')
  })
  it('E1: 不正 LaTeX は例外を投げずフォールバック', () => {
    expect(() => renderMath('\\frac{')).not.toThrow()
    const html = renderMath('\\frac{')
    expect(html.length).toBeGreaterThan(0)
  })
})
