// 採点用の模範解答取得（server-only、SEC-002: 模範解答はブラウザに出さない）。
import { eq, and, asc } from 'drizzle-orm'
import { units, problems, steps } from './schema'

type Db = any

export interface GradingStep {
  modelAnswerLatex: string
  hint: string | null
}

// unit slug + step index から採点対象ステップを解決。
// 中学数学の縦スライス: 1 unit = 先頭 problem の steps を順に解く想定（MVP）。
export async function getStepForGrading(
  db: Db,
  slug: string,
  stepIndex: number,
): Promise<GradingStep | null> {
  const u = await db.select().from(units).where(eq(units.slug, slug)).limit(1)
  if (!u[0]) return null
  const p = await db
    .select()
    .from(problems)
    .where(eq(problems.unitId, u[0].id))
    .orderBy(asc(problems.order))
    .limit(1)
  if (!p[0]) return null
  const s = await db
    .select()
    .from(steps)
    .where(and(eq(steps.problemId, p[0].id), eq(steps.order, stepIndex)))
    .limit(1)
  if (!s[0]) return null
  return { modelAnswerLatex: s[0].modelAnswerLatex, hint: s[0].hint ?? null }
}
