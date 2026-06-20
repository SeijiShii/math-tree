// 習得→アンロック連動（UC-LW1 #7）。全ステップ正解で unit を mastered、後続ノードを unlocked。
import { eq } from 'drizzle-orm'
import { unitEdges } from '../../../db/schema'
import { advanceProgress } from '../../../db/owner'
type Db = any

export async function masterUnitAndUnlock(
  db: Db, ownerId: string, unitId: string,
): Promise<{ mastered: boolean; unlocked: string[] }> {
  await advanceProgress(db, ownerId, unitId, 'mastered')
  const edges = await db.select().from(unitEdges).where(eq(unitEdges.fromUnitId, unitId))
  const unlocked: string[] = []
  for (const e of edges) {
    const res = await advanceProgress(db, ownerId, e.toUnitId, 'unlocked')
    if (res.updated) unlocked.push(e.toUnitId)
  }
  return { mastered: true, unlocked }
}
