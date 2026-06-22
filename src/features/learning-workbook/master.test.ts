import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { DDL } from "../../../db/ddl";
import * as schema from "../../../db/schema";
import { masterUnitBySlug } from "./master";
import { getOwnerProgress } from "../../../db/owner";

let db: any;
beforeEach(async () => {
  const pg = new PGlite();
  db = drizzle(pg, { schema });
  await pg.exec(DDL);
});

async function unit(slug: string) {
  const [u] = await db
    .insert(schema.units)
    .values({
      slug,
      title: slug,
      systemicLine: "s",
      description: "d",
      trivia: "t",
      isRomanceNode: false,
      verificationStatus: "verified",
    })
    .returning();
  return u;
}

describe("masterUnitBySlug（C20260622-005 習得→アンロック）", () => {
  it("N1: 単元を習得（mastered）し、後続ノードを unlocked にする", async () => {
    const a = await unit("a");
    const b = await unit("b");
    await db
      .insert(schema.unitEdges)
      .values({ fromUnitId: a.id, toUnitId: b.id });

    const r = await masterUnitBySlug(db, "ownerA", "a");
    expect(r).not.toBeNull();
    expect(r!.mastered).toBe(true);
    expect(r!.unlocked).toEqual([b.id]); // 次ノード b がアンロック

    const prog = await getOwnerProgress(db, "ownerA");
    const byUnit = new Map(prog.map((p: any) => [p.unitId, p.state]));
    expect(byUnit.get(a.id)).toBe("mastered");
    expect(byUnit.get(b.id)).toBe("unlocked");
  });

  it("N2: 末端ノード（後続なし）は unlocked が空", async () => {
    await unit("solo");
    const r = await masterUnitBySlug(db, "ownerA", "solo");
    expect(r!.mastered).toBe(true);
    expect(r!.unlocked).toEqual([]);
  });

  it("E1: 未知 slug は null", async () => {
    expect(await masterUnitBySlug(db, "ownerA", "missing")).toBeNull();
  });

  it("SEC-001: 習得は owner ごと（他 owner の progress に影響しない）", async () => {
    await unit("a");
    await masterUnitBySlug(db, "ownerA", "a");
    const progB = await getOwnerProgress(db, "ownerB");
    expect(progB.length).toBe(0);
  });
});
