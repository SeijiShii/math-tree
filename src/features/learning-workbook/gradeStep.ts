import { areEquivalent } from './equivalence'
import type { AiClient } from '../../lib/ai/types'

export interface GradeResult { match: boolean; viaAi: boolean; hint?: string }

// CAS 優先 + AI フォールバック（[論点-LW1]）。模範解答は server-only（SEC-002）。
export async function gradeStep(
  userLatex: string, modelLatex: string, ai: AiClient,
): Promise<GradeResult> {
  const cas = areEquivalent(userLatex, modelLatex)
  if (cas !== null) {
    return { match: cas, viaAi: false, hint: cas ? undefined : '惜しい、式を見直してみましょう' }
  }
  // CAS 判定不能 → AI 照合
  const r = await ai.review(
    `user: ${userLatex}\nmodel: ${modelLatex}`,
    'この 2 式は数学的に同値か。pass=同値, fail=非同値',
    { model: 'gpt-4o-mini' },
  )
  return { match: r.verdict === 'pass', viaAi: true, hint: r.verdict === 'pass' ? undefined : '惜しい、見直してみましょう' }
}
