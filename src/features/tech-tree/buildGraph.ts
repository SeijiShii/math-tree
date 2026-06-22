// verified units + edges + owner progress → TechTreeGraph（SEC-001: owner の progress のみ）
import { eq } from "drizzle-orm";
import { units, unitEdges } from "../../../db/schema";
import { getOwnerProgress } from "../../../db/owner";
import type { TechTreeGraph, TechTreeNode } from "../../types/graph";
import type { ProgressState } from "../../types/enums";
import { effectiveState } from "./unlock";
type Db = any;

export async function buildTechTreeGraph(
  db: Db,
  ownerId: string,
): Promise<TechTreeGraph> {
  const us = await db
    .select()
    .from(units)
    .where(eq(units.verificationStatus, "verified"));
  const edges = await db.select().from(unitEdges);
  const prog = await getOwnerProgress(db, ownerId); // SEC-001
  const stateByUnit = new Map<string, ProgressState>(
    prog.map((p: any) => [p.unitId, p.state]),
  );
  const unitIds = new Set(us.map((u: any) => u.id));

  // 各ユニットの前提（verified 同士のエッジ）を集約 → 入口/前提充足を導出（SPEC §6.2）
  const prereqByUnit = new Map<string, string[]>();
  for (const e of edges) {
    if (!unitIds.has(e.fromUnitId) || !unitIds.has(e.toUnitId)) continue;
    const arr = prereqByUnit.get(e.toUnitId) ?? [];
    arr.push(e.fromUnitId);
    prereqByUnit.set(e.toUnitId, arr);
  }

  const nodes: TechTreeNode[] = us.map((u: any) => {
    const own = stateByUnit.get(u.id) ?? "locked";
    const prereqStates = (prereqByUnit.get(u.id) ?? []).map(
      (pid) => stateByUnit.get(pid) ?? "locked",
    );
    return {
      id: u.id,
      slug: u.slug,
      title: u.title,
      state: effectiveState(own, prereqStates, u.isRomanceNode),
      isRomanceNode: u.isRomanceNode,
    };
  });
  return {
    nodes,
    edges: edges
      .filter((e: any) => unitIds.has(e.fromUnitId) && unitIds.has(e.toUnitId))
      .map((e: any) => ({ id: e.id, from: e.fromUnitId, to: e.toUnitId })),
  };
}
