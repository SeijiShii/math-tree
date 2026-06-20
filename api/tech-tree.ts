import { db, ownerFrom, send401If } from './_handler'
import { buildTechTreeGraph } from '../src/features/tech-tree/buildGraph'
export default async function handler(req: any, res: any) {
  let ownerId: string
  try {
    ownerId = await ownerFrom(req) // 認証主体の owner（なりすまし不可、SEC-001）
  } catch (e) {
    if (send401If(res, e)) return
    throw e
  }
  const graph = await buildTechTreeGraph(db(), ownerId)
  res.status(200).json(graph)
}
