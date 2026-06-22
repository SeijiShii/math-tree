import { db, ownerFrom, send401If } from './_handler'
import { getProblemsForSession } from '../db/grading'
import { SESSION_SIZE } from '../src/lib/learning/session'

// 学習セッション用の問題取得（SPEC §6.1 + C20260622-006）。
//   owner 強制（SEC-001）→ verified のみ（SEC-005）→ プールから K 問ランダム（模範解答非含 SEC-002）。
//   返却: { title, trivia, problems: [{ problemId, statementLatex, steps[order,hint] }] }
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
  const session = await getProblemsForSession(db(), slug, SESSION_SIZE)
  if (!session) {
    res.status(404).json({ error: 'Not Found' })
    return
  }
  res.status(200).json(session)
}
