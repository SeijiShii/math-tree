// 習得→アンロック連動（UC-LW1 #7）。全ステップ正解で unit を mastered、後続ノードを unlocked。
import { eq } from "drizzle-orm";
import { units, unitEdges } from "../../../db/schema";
import { advanceProgress } from "../../../db/owner";
type Db = any;

export async function masterUnitAndUnlock(
  db: Db,
  ownerId: string,
  unitId: string,
): Promise<{ mastered: boolean; unlocked: string[] }> {
  await advanceProgress(db, ownerId, unitId, "mastered");
  const edges = await db
    .select()
    .from(unitEdges)
    .where(eq(unitEdges.fromUnitId, unitId));
  const unlocked: string[] = [];
  for (const e of edges) {
    const res = await advanceProgress(db, ownerId, e.toUnitId, "unlocked");
    if (res.updated) unlocked.push(e.toUnitId);
  }
  return { mastered: true, unlocked };
}

// slug から習得→アンロック（API/UI 用）。未知 slug は null。
export async function masterUnitBySlug(
  db: Db,
  ownerId: string,
  slug: string,
): Promise<{ mastered: boolean; unlocked: string[] } | null> {
  const u = await db.select().from(units).where(eq(units.slug, slug)).limit(1);
  if (!u[0]) return null;
  return masterUnitAndUnlock(db, ownerId, u[0].id);
}
