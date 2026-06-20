// @vitest-environment jsdom
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'

beforeAll(() => {
  // @xyflow が要求する jsdom 未実装 API を polyfill
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as any
  ;(global as any).fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({ nodes: [], edges: [] }) }))
  if (!(Element.prototype as any).scrollIntoView) (Element.prototype as any).scrollIntoView = () => {}
})

describe('App keyless white-screen スモーク（§4.5.1#0）', () => {
  it('API 不在でも white-screen にならず header/footer がレンダリング', () => {
    const { getByText, container } = render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>)
    expect(getByText('math-relax')).toBeTruthy()           // ブランド
    expect(getByText('プライバシー')).toBeTruthy()          // フッタ法務導線（O55）
    expect(container.querySelector('.app-header')).toBeTruthy()
  })
  it('法務ページが直 URL でレンダリング（O55 到達性）', () => {
    const { container } = render(<MemoryRouter initialEntries={['/legal/privacy']}><App /></MemoryRouter>)
    expect(container.textContent).toContain('セルフサービス')  // DSR 文言（SEC-004）
  })
})
