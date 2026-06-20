// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { SupportButton } from './SupportButton'

describe('SupportButton (O43)', () => {
  it('価格 100円 を CTA 前に明示', () => {
    const { getByText, getByRole } = render(<SupportButton />)
    expect(getByText(/100円で作者を支援できます/)).toBeTruthy()
    expect(getByRole('button').textContent).toContain('100円')
  })
  it('クリックで onSupport', () => {
    const fn = vi.fn()
    const { getByRole } = render(<SupportButton onSupport={fn} />)
    fireEvent.click(getByRole('button'))
    expect(fn).toHaveBeenCalled()
  })
})
