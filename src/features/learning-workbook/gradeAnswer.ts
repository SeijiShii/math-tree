// 採点オーケストレーション: 模範解答取得 → CAS 採点（キー不要）→ 判定不能時のみ AI フォールバック。
// AI 未配線（キー無し）でも CAS で動く。誤って正解を誤答にしない（判定不能は「準備中」案内）。
import type { AiClient } from '../../lib/ai/types'
import { areEquivalent } from './equivalence'
import { gradeStep, type GradeResult } from './gradeStep'
import { getStepForGrading } from '../../../db/grading'

type Db = any

export interface GradeAnswerResult extends GradeResult {
  found: boolean
}

export async function gradeAnswer(
  db: Db,
  input: { slug: string; stepIndex: number; latex: string },
  ai: AiClient | null,
): Promise<GradeAnswerResult> {
  const step = await getStepForGrading(db, input.slug, input.stepIndex)
  if (!step) return { found: false, match: false, viaAi: false }

  const cas = areEquivalent(input.latex, step.modelAnswerLatex)
  if (cas !== null) {
    return {
      found: true,
      match: cas,
      viaAi: false,
      hint: cas ? undefined : (step.hint ?? '惜しい、式を見直してみましょう'),
    }
  }

  // CAS 判定不能。AI キーが無ければ誤答にせず「準備中」案内（正解を弾かない）。
  if (!ai) {
    return {
      found: true,
      match: false,
      viaAi: false,
      hint: 'この形は自動採点の準備中です。展開・整理した形で入力すると採点できます',
    }
  }

  const r = await gradeStep(input.latex, step.modelAnswerLatex, ai)
  return { found: true, ...r }
}
