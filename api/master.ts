import { db, ownerFrom, send401If } from './_handler'
import { masterUnitBySlug } from '../src/features/learning-workbook/master'

// 単元の習得確定 + 次ノードのアンロック（SPEC §2.2 POST /api/units/:slug/master）。
//   owner 強制（SEC-001）。owner ごとに progress を mastered/unlocked へ前進。
export default async function handler(req: any, res: any) {
  let ownerId: string
  try {
    ownerId = await ownerFrom(req)
  } catch (e) {
    if (send401If(res, e)) return
    throw e
  }
  const slug = Array.isArray(req.query?.slug) ? req.query.slug[0] : req.query?.slug
  if (typeof slug !== 'string' || !slug) {
    res.status(400).json({ error: 'Bad Request' })
    return
  }
  const r = await masterUnitBySlug(db(), ownerId, slug)
  if (!r) {
    res.status(404).json({ error: 'Not Found' })
    return
  }
  res.status(200).json({ mastered: r.mastered, unlockedNext: r.unlocked })
}
