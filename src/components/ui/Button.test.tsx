// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from './Button'

describe('_shared/ui Button', () => {
  it('N1: variant が対応トークン class を持つ', () => {
    const { getByRole, rerender } = render(<Button variant="primary">学ぶ</Button>)
    expect(getByRole('button').className).toContain('btn-primary')
    rerender(<Button variant="accent">支援</Button>)
    expect(getByRole('button').className).toContain('btn-accent')
  })
})
