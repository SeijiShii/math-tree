import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { DDL } from "../../../db/ddl";
import * as schema from "../../../db/schema";
import { advanceProgress } from "../../../db/owner";
import { buildTechTreeGraph } from "./buildGraph";
import { nodeVisual } from "../../lib/nodeStyle";

let db: any;
beforeEach(async () => {
  const pg = new PGlite();
  db = drizzle(pg, { schema });
  await pg.exec(DDL);
});
async function unit(slug: string, romance = false, status = "verified") {
  const [u] = await db
    .insert(schema.units)
    .values({
      slug,
      title: slug,
      systemicLine: "s",
      description: "d",
      trivia: "t",
      isRomanceNode: romance,
      verificationStatus: status,
    })
    .returning();
  return u;
}

describe("tech-tree buildGraph", () => {
  it("N1/N3: verified units + edges + owner progress でグラフ組成", async () => {
    const a = await unit("a");
    const b = await unit("b");
    await db
      .insert(schema.unitEdges)
      .values({ fromUnitId: a.id, toUnitId: b.id });
    await advanceProgress(db, "ownerA", a.id, "mastered");
    const g = await buildTechTreeGraph(db, "ownerA");
    expect(g.nodes).toHaveLength(2);
    expect(g.edges).toHaveLength(1);
    expect(g.nodes.find((n) => n.slug === "a")!.state).toBe("mastered");
    expect(g.nodes.find((n) => n.slug === "b")!.state).toBe("unlocked"); // 前提 a が mastered → b 解放（SPEC §6.2）
  });
  it("N4: 入口ノード（前提なし・進捗なし）は unlocked = 学習開始できる（C20260622-001）", async () => {
    await unit("root");
    const g = await buildTechTreeGraph(db, "ownerA");
    expect(g.nodes[0].state).toBe("unlocked");
  });
  it("E1: owner 分離（他人の習得は反映されない, SEC-001）", async () => {
    const a = await unit("a");
    const b = await unit("b");
    await db
      .insert(schema.unitEdges)
      .values({ fromUnitId: a.id, toUnitId: b.id });
    await advanceProgress(db, "ownerB", a.id, "mastered");
    await advanceProgress(db, "ownerB", b.id, "mastered");
    const g = await buildTechTreeGraph(db, "ownerA");
    // ownerA には ownerB の習得（mastered）が見えない。a は入口で unlocked、b は前提未習得で locked
    expect(g.nodes.find((n) => n.slug === "a")!.state).toBe("unlocked");
    expect(g.nodes.find((n) => n.slug === "b")!.state).toBe("locked");
  });
  it("E2: draft unit は配信グラフに含まれない", async () => {
    await unit("verified-u", false, "verified");
    await unit("draft-u", false, "draft");
    const g = await buildTechTreeGraph(db, "ownerA");
    expect(g.nodes).toHaveLength(1);
    expect(g.nodes[0].slug).toBe("verified-u");
  });
  it("B2: ロマンノードは romance visual（遠景）", async () => {
    const r = await unit("quantum", true);
    const g = await buildTechTreeGraph(db, "ownerA");
    const node = g.nodes.find((n) => n.slug === "quantum")!;
    expect(node.isRomanceNode).toBe(true);
    expect(nodeVisual(node.state, node.isRomanceNode)).toBe("romance");
  });
});
