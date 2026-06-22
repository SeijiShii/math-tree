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

import { getProblemsForSession, getStepByProblemId } from "./grading";

async function seedPool(slug: string, n: number, pStatus = "verified") {
  const [u] = await db
    .insert(schema.units)
    .values({ slug, title: `${slug} T`, systemicLine: "s", description: "d", trivia: "triv", isRomanceNode: false, verificationStatus: "verified" })
    .returning();
  const ids: string[] = [];
  for (let i = 0; i < n; i++) {
    const [p] = await db
      .insert(schema.problems)
      .values({ unitId: u.id, statementLatex: `(${i})+1`, order: i, verificationStatus: pStatus })
      .returning();
    await db.insert(schema.steps).values({ problemId: p.id, order: 0, modelAnswerLatex: String(i + 1), hint: "h" });
    ids.push(p.id);
  }
  return ids;
}

describe("getProblemsForSession（C20260622-006 ランダム出題）", () => {
  it("N1: プールから最大 K 問を distinct 抽出（模範解答非含）", async () => {
    await seedPool("pool10", 10);
    const s = await getProblemsForSession(db, "pool10", 5);
    expect(s).not.toBeNull();
    expect(s!.problems.length).toBe(5);
    const ids = s!.problems.map((p: any) => p.problemId);
    expect(new Set(ids).size).toBe(5); // distinct
    expect(JSON.stringify(s)).not.toContain("modelAnswerLatex"); // SEC-002
    expect(s!.problems[0]).toHaveProperty("statementLatex");
    expect(s!.problems[0].steps[0]).toEqual({ order: 0, hint: "h" });
  });
  it("N2: プールが K 未満なら全部（distinct）", async () => {
    await seedPool("pool3", 3);
    const s = await getProblemsForSession(db, "pool3", 5);
    expect(s!.problems.length).toBe(3);
  });
  it("SEC-005: verified problem のみ", async () => {
    await seedPool("draftpool", 4, "draft");
    expect(await getProblemsForSession(db, "draftpool", 5)).toBeNull();
  });
  it("E1: 未知 slug は null", async () => {
    expect(await getProblemsForSession(db, "nope", 5)).toBeNull();
  });
});

describe("getStepByProblemId（C20260622-006）", () => {
  it("N1: 指定 problem の step（模範解答）を返す", async () => {
    const ids = await seedPool("byid", 3);
    const step = await getStepByProblemId(db, ids[1], 0);
    expect(step?.modelAnswerLatex).toBe("2"); // i=1 → i+1=2
  });
  it("E1: 未知 problemId は null", async () => {
    expect(await getStepByProblemId(db, "00000000-0000-0000-0000-000000000000", 0)).toBeNull();
  });
});
