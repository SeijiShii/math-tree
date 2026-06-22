// AI でツリー構造（単元 + 依存エッジ）を生成 → 循環検出 → 多段クロス検証 → verified 単元を追記（C20260622-007）。
//   既存 slug は壊さず skip（追記成長）。SEC-005: server-only 事前生成。
import { eq } from "drizzle-orm";
import { units, unitEdges, reviews } from "../../../db/schema";
import { runCrossValidation } from "../../lib/ai/crossValidation";
import { buildSyllabusPrompt } from "./curriculumSyllabus";
import type { AiClient } from "../../lib/ai/types";

type Db = any;

export interface GenUnit {
  slug: string;
  title: string;
  systemicLine: string;
  description: string;
  trivia: string;
}
export interface GenTree {
  units: GenUnit[];
  edges: [string, string][];
}

/** AI 出力から {units, edges} を抽出。壊れた形は空ツリー。 */
export function parseTree(text: string): GenTree {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return { units: [], edges: [] };
  try {
    const o = JSON.parse(m[0]);
    const us = Array.isArray(o.units)
      ? o.units.filter(
          (u: any) =>
            typeof u?.slug === "string" && typeof u?.title === "string",
        )
      : [];
    const es = Array.isArray(o.edges)
      ? o.edges.filter(
          (e: any) =>
            Array.isArray(e) &&
            e.length === 2 &&
            typeof e[0] === "string" &&
            typeof e[1] === "string",
        )
      : [];
    return { units: us, edges: es };
  } catch {
    return { units: [], edges: [] };
  }
}

/** 有向グラフの循環検出（DFS 3 色）。 */
export function hasCycle(edges: [string, string][]): boolean {
  const adj = new Map<string, string[]>();
  const nodes = new Set<string>();
  for (const [f, t] of edges) {
    if (!adj.has(f)) adj.set(f, []);
    adj.get(f)!.push(t);
    nodes.add(f);
    nodes.add(t);
  }
  const color = new Map<string, number>(); // 0 白 / 1 灰 / 2 黒
  function dfs(n: string): boolean {
    color.set(n, 1);
    for (const m of adj.get(n) ?? []) {
      const c = color.get(m) ?? 0;
      if (c === 1) return true;
      if (c === 0 && dfs(m)) return true;
    }
    color.set(n, 2);
    return false;
  }
  for (const n of nodes) if ((color.get(n) ?? 0) === 0 && dfs(n)) return true;
  return false;
}

/** ツリー構造を生成・検証・保存。返り値 = 追加単元/エッジ・却下数・循環フラグ。 */
export async function generateUnits(
  db: Db,
  ai: AiClient,
  line: string | undefined,
  models: string[],
): Promise<{
  addedUnits: number;
  addedEdges: number;
  rejected: number;
  cycle: boolean;
}> {
  const gen = await ai.generate(buildSyllabusPrompt(line), {
    model: models[0],
    purpose: "generation",
  });
  const tree = parseTree(gen.text);
  if (hasCycle(tree.edges))
    return { addedUnits: 0, addedEdges: 0, rejected: 0, cycle: true };

  const slugToId = new Map<string, string>();
  let addedUnits = 0;
  let rejected = 0;
  for (const gu of tree.units) {
    const existing = await db
      .select()
      .from(units)
      .where(eq(units.slug, gu.slug))
      .limit(1);
    if (existing[0]) {
      slugToId.set(gu.slug, existing[0].id); // 既存は壊さず skip（追記）
      continue;
    }
    const outcome = await runCrossValidation(
      ai,
      `${gu.title}: ${gu.description}`,
      "数学的に正確で、単元の依存関係・難易度が妥当か",
      models,
    );
    if (!outcome.verified) {
      rejected++;
      continue;
    }
    const [u] = await db
      .insert(units)
      .values({ ...gu, isRomanceNode: false, verificationStatus: "verified" })
      .returning();
    slugToId.set(gu.slug, u.id);
    for (const r of outcome.reviews) {
      await db.insert(reviews).values({
        targetType: "unit",
        targetId: u.id,
        reviewModel: r.model,
        stage: 1,
        verdict: r.verdict,
        findings: r.findings,
      });
    }
    addedUnits++;
  }

  let addedEdges = 0;
  for (const [from, to] of tree.edges) {
    const f = slugToId.get(from);
    const t = slugToId.get(to);
    if (!f || !t) continue;
    await db
      .insert(unitEdges)
      .values({ fromUnitId: f, toUnitId: t })
      .onConflictDoNothing();
    addedEdges++;
  }
  return { addedUnits, addedEdges, rejected, cycle: false };
}
