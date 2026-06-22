import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import { DDL } from "../../../db/ddl";
import * as schema from "../../../db/schema";
import { MockAiClient } from "../../lib/ai/mock";
import {
  generateProblems,
  parseProblems,
  casPrecheck,
} from "./generateProblems";

let db: any;
beforeEach(async () => {
  const pg = new PGlite();
  db = drizzle(pg, { schema });
  await pg.exec(DDL);
});

async function seedUnit(slug = "tenkai") {
  const [u] = await db
    .insert(schema.units)
    .values({
      slug,
      title: slug,
      systemicLine: "中学",
      description: "d",
      trivia: "t",
      isRomanceNode: false,
      verificationStatus: "verified",
    })
    .returning();
  return u;
}
function genMock(probs: any[], reviewOverride: any = {}) {
  return new MockAiClient({
    generate: { text: JSON.stringify({ problems: probs }) },
    reviews: { m1: reviewOverride },
  });
}
async function poolSize(unitId: string) {
  const ps = await db
    .select()
    .from(schema.problems)
    .where(eq(schema.problems.unitId, unitId));
  return ps.length;
}

describe("parseProblems / casPrecheck（純）", () => {
  it("parseProblems: JSON を抽出、壊れた形は空", () => {
    expect(
      parseProblems('前置き {"problems":[{"statementLatex":"a","modelAnswerLatex":"b"}]} 後'),
    ).toHaveLength(1);
    expect(parseProblems("not json")).toEqual([]);
  });
  it("casPrecheck: 非方程式は statement≡answer を要求 / 方程式は素通し", () => {
    expect(casPrecheck({ statementLatex: "3x+2x", modelAnswerLatex: "5x" })).toBe(true);
    expect(casPrecheck({ statementLatex: "3x+2x", modelAnswerLatex: "6x" })).toBe(false);
    expect(casPrecheck({ statementLatex: "2x+1=7", modelAnswerLatex: "3" })).toBe(true);
  });
});

describe("generateProblems（AI生成→検証→追記成長, C20260622-007）", () => {
  it("N1: クロス検証 pass の verified 問題をプールに追記", async () => {
    const u = await seedUnit();
    const ai = genMock([
      { statementLatex: "(x+1)(x+2)", modelAnswerLatex: "x^2+3x+2", hint: "展開" },
      { statementLatex: "(x+2)(x+3)", modelAnswerLatex: "x^2+5x+6", hint: "展開" },
    ]);
    const r = await generateProblems(db, ai, "tenkai", 5, ["m1"]);
    expect(r.added).toBe(2);
    expect(await poolSize(u.id)).toBe(2);
  });
  it("N2: CAS 一次チェックで statement≢answer を弾く", async () => {
    const u = await seedUnit();
    const ai = genMock([
      { statementLatex: "3x+2x", modelAnswerLatex: "6x" }, // 誤答 → CAS で除外
      { statementLatex: "4x+x", modelAnswerLatex: "5x" }, // 正
    ]);
    const r = await generateProblems(db, ai, "tenkai", 5, ["m1"]);
    expect(r.added).toBe(1);
  });
  it("N3: 既存プールと重複する生成は dedup", async () => {
    const u = await seedUnit();
    await db.insert(schema.problems).values({ unitId: u.id, statementLatex: "4x+x", order: 0, verificationStatus: "verified" });
    const ai = genMock([
      { statementLatex: "4x + x", modelAnswerLatex: "5x" }, // 既存重複
      { statementLatex: "7a-2a", modelAnswerLatex: "5a" },
    ]);
    const r = await generateProblems(db, ai, "tenkai", 5, ["m1"]);
    expect(r.added).toBe(1);
    expect(await poolSize(u.id)).toBe(2);
  });
  it("N4: 重大指摘ありのクロス検証 fail は却下（未保存）", async () => {
    const u = await seedUnit();
    const ai = genMock(
      [{ statementLatex: "4x+x", modelAnswerLatex: "5x" }],
      { critical: true, verdict: "fail" },
    );
    const r = await generateProblems(db, ai, "tenkai", 5, ["m1"]);
    expect(r.added).toBe(0);
    expect(r.rejected).toBe(1);
    expect(await poolSize(u.id)).toBe(0);
  });
  it("N5: POOL_MAX 到達でそれ以上追加しない", async () => {
    const u = await seedUnit();
    for (let i = 0; i < 30; i++)
      await db.insert(schema.problems).values({ unitId: u.id, statementLatex: `p${i}`, order: i, verificationStatus: "verified" });
    const ai = genMock([{ statementLatex: "new", modelAnswerLatex: "new" }]);
    const r = await generateProblems(db, ai, "tenkai", 5, ["m1"]);
    expect(r.added).toBe(0);
  });
  it("E1: 未知 slug は no-op", async () => {
    const r = await generateProblems(db, genMock([]), "nope", 5, ["m1"]);
    expect(r).toEqual({ added: 0, rejected: 0 });
  });
});
