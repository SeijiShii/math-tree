import { describe, it, expect, expectTypeOf } from 'vitest'
import { PROGRESS_STATES, type ProgressState } from './enums'
import type { UnitPublic, StepPrompt, Unit, Step } from './domain'

describe('_shared/types', () => {
  it('N1: enums がリテラルユニオン', () => {
    expect(PROGRESS_STATES).toEqual(['locked', 'unlocked', 'mastered'])
    expectTypeOf<ProgressState>().toEqualTypeOf<'locked' | 'unlocked' | 'mastered'>()
  })

  it('E1: UnitPublic は verificationStatus を持たない（SEC-002）', () => {
    expectTypeOf<UnitPublic>().not.toHaveProperty('verificationStatus')
    expectTypeOf<UnitPublic>().toHaveProperty('trivia')
    expectTypeOf<UnitPublic>().toHaveProperty('isRomanceNode')
  })

  it('E2: StepPrompt は modelAnswerLatex を持たない（模範解答漏洩防止 SEC-002）', () => {
    expectTypeOf<StepPrompt>().not.toHaveProperty('modelAnswerLatex')
    expectTypeOf<StepPrompt>().not.toHaveProperty('normalizedForm')
    expectTypeOf<StepPrompt>().toHaveProperty('order')
  })

  it('Unit/Step は内部フィールドを持つ（封じ込め前の素の型）', () => {
    expectTypeOf<Unit>().toHaveProperty('verificationStatus')
    expectTypeOf<Step>().toHaveProperty('modelAnswerLatex')
  })
})
