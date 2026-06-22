import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { DDL } from "../../../db/ddl";
import * as schema from "../../../db/schema";
import { MockAiClient } from "../../lib/ai/mock";
import { runGeneration } from "./runGeneration";

let db: any;
beforeEach(async () => {
  const pg = new PGlite();
  db = drizzle(pg, { schema });
  await pg.exec(DDL);
});

// 単一の generate text に units/edges/problems を同梱（mock は同テキストを返すため両 parser が読む）
function combinedMock() {
  return new MockAiClient({
    generate: {
      text: JSON.stringify({
        units: [
          { slug: "a", title: "A", systemicLine: "中1 数学", description: "d", trivia: "t" },
          { slug: "b", title: "B", systemicLine: "中1 数学", description: "d", trivia: "t" },
        ],
        edges: [["a", "b"]],
        problems: [
          { statementLatex: "3x+2x", modelAnswerLatex: "5x" },
          { statementLatex: "4x+x", modelAnswerLatex: "5x" },
        ],
      }),
    },
  });
}

describe("runGeneration（bootstrap + top-up オーケストレーション, C20260622-007）", () => {
  it("N1: 空ツリーは bootstrap で単元生成 + プール top-up", async () => {
    const r = await runGeneration(db, combinedMock(), ["m1"], {
      maxLines: 1,
      maxUnits: 5,
      maxPerUnit: 3,
    });
    expect(r.addedUnits).toBe(2);
    expect(r.toppedUnits).toBe(2);
    expect(r.addedProblems).toBeGreaterThan(0);
  });
  it("N2: 既存ツリーは bootstrap せず top-up のみ", async () => {
    await db.insert(schema.units).values({ slug: "a", title: "A", systemicLine: "中1 数学", description: "d", trivia: "t", isRomanceNode: false, verificationStatus: "verified" });
    const r = await runGeneration(db, combinedMock(), ["m1"], { maxUnits: 5, maxPerUnit: 3 });
    expect(r.bootstrappedLines).toBe(0);
    expect(r.toppedUnits).toBe(1);
  });
  it("N3: per-run CAP（maxUnits）で top-up 単元数を制限", async () => {
    for (const s of ["a", "b", "c"])
      await db.insert(schema.units).values({ slug: s, title: s, systemicLine: "中1 数学", description: "d", trivia: "t", isRomanceNode: false, verificationStatus: "verified" });
    const r = await runGeneration(db, combinedMock(), ["m1"], { maxUnits: 2, maxPerUnit: 1 });
    expect(r.toppedUnits).toBe(2); // 3 単元中 2 のみ
  });
});
