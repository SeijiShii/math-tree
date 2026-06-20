// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LegalPage } from './LegalPage'

describe('LegalPage', () => {
  it('プラポリにセルフサービス削除文言（SEC-004）', () => {
    const { container } = render(<LegalPage doc="privacy" />)
    expect(container.textContent).toContain('セルフサービス')
  })
})
