import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { DDL } from "./ddl";
import * as schema from "./schema";
import { getProblemForLearning } from "./grading";

let db: any;
beforeEach(async () => {
  const pg = new PGlite();
  db = drizzle(pg, { schema });
  await pg.exec(DDL);
});

async function seedUnit(slug: string, status = "verified", pStatus = "verified") {
  const [u] = await db
    .insert(schema.units)
    .values({
      slug,
      title: `${slug} タイトル`,
      systemicLine: "s",
      description: "d",
      trivia: `${slug} の豆知識`,
      isRomanceNode: false,
      verificationStatus: status,
    })
    .returning();
  const [p] = await db
    .insert(schema.problems)
    .values({
      unitId: u.id,
      statementLatex: "(-3) + 5 = ?",
      order: 0,
      verificationStatus: pStatus,
    })
    .returning();
  await db.insert(schema.steps).values({
    problemId: p.id,
    order: 0,
    modelAnswerLatex: "2",
    hint: "符号に注意",
  });
  return u;
}

describe("getProblemForLearning（C20260622-003 問題表示）", () => {
  it("N1: 問題文 + 単元名 + 豆知識 + ステップ手がかりを返す", async () => {
    await seedUnit("seisu-no-keisan");
    const prob = await getProblemForLearning(db, "seisu-no-keisan");
    expect(prob).not.toBeNull();
    expect(prob!.title).toBe("seisu-no-keisan タイトル");
    expect(prob!.statementLatex).toBe("(-3) + 5 = ?");
    expect(prob!.trivia).toBe("seisu-no-keisan の豆知識");
    expect(prob!.steps[0]).toEqual({ order: 0, hint: "符号に注意" });
  });

  it("SEC-002: 返却に modelAnswerLatex / normalizedForm を含めない", async () => {
    await seedUnit("seisu-no-keisan");
    const prob = await getProblemForLearning(db, "seisu-no-keisan");
    const json = JSON.stringify(prob);
    expect(json).not.toContain("modelAnswerLatex");
    expect(json).not.toContain("normalizedForm");
    expect(json).not.toContain('"2"'); // 模範解答の値が漏れない
  });

  it("E1: 未知 slug は null", async () => {
    const prob = await getProblemForLearning(db, "no-such-unit");
    expect(prob).toBeNull();
  });

  it("SEC-005: 未 verified の unit / problem は配信しない（null）", async () => {
    await seedUnit("draft-unit", "draft");
    expect(await getProblemForLearning(db, "draft-unit")).toBeNull();
    await seedUnit("draft-problem", "verified", "draft");
    expect(await getProblemForLearning(db, "draft-problem")).toBeNull();
  });
});
