import { db, ownerFrom, send401If } from './_handler'
import { getProblemForLearning } from '../db/grading'

// 学習画面用の問題取得（SPEC §6.1 GET /api/units/:slug/problem）。
//   owner 強制（SEC-001）→ verified のみ（SEC-005）→ modelAnswerLatex 非含（SEC-002）。
export default async function handler(req: any, res: any) {
  try {
    await ownerFrom(req)
  } catch (e) {
    if (send401If(res, e)) return
    throw e
  }
  const slug = Array.isArray(req.query?.slug) ? req.query.slug[0] : req.query?.slug
  if (typeof slug !== 'string' || !slug) {
    res.status(400).json({ error: 'Bad Request' })
    return
  }
  const problem = await getProblemForLearning(db(), slug)
  if (!problem) {
    res.status(404).json({ error: 'Not Found' })
    return
  }
  res.status(200).json(problem)
}
