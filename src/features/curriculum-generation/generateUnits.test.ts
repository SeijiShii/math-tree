import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { DDL } from "../../../db/ddl";
import * as schema from "../../../db/schema";
import { MockAiClient } from "../../lib/ai/mock";
import { generateUnits, parseTree, hasCycle } from "./generateUnits";
import { topicsForLine, allLines } from "./curriculumSyllabus";

let db: any;
beforeEach(async () => {
  const pg = new PGlite();
  db = drizzle(pg, { schema });
  await pg.exec(DDL);
});

function treeMock(tree: any, reviewOverride: any = {}) {
  return new MockAiClient({
    generate: { text: JSON.stringify(tree) },
    reviews: { m1: reviewOverride },
  });
}
async function unitCount() {
  return (await db.select().from(schema.units)).length;
}

describe("parseTree / hasCycle / syllabus（純）", () => {
  it("parseTree: units/edges 抽出、壊れた形は空", () => {
    const t = parseTree('{"units":[{"slug":"a","title":"A"}],"edges":[["a","b"]]}');
    expect(t.units).toHaveLength(1);
    expect(t.edges).toEqual([["a", "b"]]);
    expect(parseTree("x")).toEqual({ units: [], edges: [] });
  });
  it("hasCycle: 循環を検出", () => {
    expect(hasCycle([["a", "b"], ["b", "c"]])).toBe(false);
    expect(hasCycle([["a", "b"], ["b", "a"]])).toBe(true);
    expect(hasCycle([["a", "b"], ["b", "c"], ["c", "a"]])).toBe(true);
  });
  it("syllabus: 中学〜高校数I・A を網羅", () => {
    expect(allLines()).toContain("高校 数A");
    expect(topicsForLine("中3 数学")).toContain("三平方の定理");
  });
});

describe("generateUnits（AI生成→循環検出→検証→追記, C20260622-007）", () => {
  it("N1: verified 単元と依存エッジを保存", async () => {
    const ai = treeMock({
      units: [
        { slug: "u1", title: "U1", systemicLine: "中1 数学", description: "d", trivia: "t" },
        { slug: "u2", title: "U2", systemicLine: "中1 数学", description: "d", trivia: "t" },
      ],
      edges: [["u1", "u2"]],
    });
    const r = await generateUnits(db, ai, "中1 数学", ["m1"]);
    expect(r.addedUnits).toBe(2);
    expect(r.addedEdges).toBe(1);
    expect(await unitCount()).toBe(2);
  });
  it("N2: 循環エッジは拒否（保存しない）", async () => {
    const ai = treeMock({
      units: [{ slug: "a", title: "A", systemicLine: "中1 数学", description: "d", trivia: "t" }],
      edges: [["a", "b"], ["b", "a"]],
    });
    const r = await generateUnits(db, ai, "中1 数学", ["m1"]);
    expect(r.cycle).toBe(true);
    expect(await unitCount()).toBe(0);
  });
  it("N3: 既存 slug は壊さず skip（追記成長）", async () => {
    await db.insert(schema.units).values({ slug: "u1", title: "既存", systemicLine: "中1 数学", description: "d", trivia: "t", isRomanceNode: false, verificationStatus: "verified" });
    const ai = treeMock({
      units: [
        { slug: "u1", title: "新", systemicLine: "中1 数学", description: "d", trivia: "t" },
        { slug: "u2", title: "U2", systemicLine: "中1 数学", description: "d", trivia: "t" },
      ],
      edges: [["u1", "u2"]],
    });
    const r = await generateUnits(db, ai, "中1 数学", ["m1"]);
    expect(r.addedUnits).toBe(1); // u2 のみ新規
    expect(await unitCount()).toBe(2);
    const u1 = (await db.select().from(schema.units).where(require("drizzle-orm").eq(schema.units.slug, "u1")))[0];
    expect(u1.title).toBe("既存"); // 上書きしない
  });
  it("N4: クロス検証 fail（重大指摘）は却下", async () => {
    const ai = treeMock(
      { units: [{ slug: "x", title: "X", systemicLine: "中1 数学", description: "d", trivia: "t" }], edges: [] },
      { critical: true, verdict: "fail" },
    );
    const r = await generateUnits(db, ai, "中1 数学", ["m1"]);
    expect(r.addedUnits).toBe(0);
    expect(r.rejected).toBe(1);
  });
});
