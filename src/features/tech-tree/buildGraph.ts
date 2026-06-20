// verified units + edges + owner progress → TechTreeGraph（SEC-001: owner の progress のみ）
import { eq } from 'drizzle-orm'
import { units, unitEdges } from '../../../db/schema'
import { getOwnerProgress } from '../../../db/owner'
import type { TechTreeGraph, TechTreeNode } from '../../types/graph'
import type { ProgressState } from '../../types/enums'
type Db = any

export async function buildTechTreeGraph(db: Db, ownerId: string): Promise<TechTreeGraph> {
  const us = await db.select().from(units).where(eq(units.verificationStatus, 'verified'))
  const edges = await db.select().from(unitEdges)
  const prog = await getOwnerProgress(db, ownerId) // SEC-001
  const stateByUnit = new Map<string, ProgressState>(prog.map((p: any) => [p.unitId, p.state]))
  const unitIds = new Set(us.map((u: any) => u.id))

  const nodes: TechTreeNode[] = us.map((u: any) => ({
    id: u.id, slug: u.slug, title: u.title,
    state: stateByUnit.get(u.id) ?? 'locked',
    isRomanceNode: u.isRomanceNode,
  }))
  return {
    nodes,
    edges: edges
      .filter((e: any) => unitIds.has(e.fromUnitId) && unitIds.has(e.toUnitId))
      .map((e: any) => ({ id: e.id, from: e.fromUnitId, to: e.toUnitId })),
  }
}
