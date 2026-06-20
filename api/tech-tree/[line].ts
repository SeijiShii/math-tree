import { db, ownerFrom } from '../_handler'
import { buildTechTreeGraph } from '../../src/features/tech-tree/buildGraph'
export default async function handler(req: any, res: any) {
  const graph = await buildTechTreeGraph(db(), ownerFrom(req))
  res.status(200).json(graph)
}
