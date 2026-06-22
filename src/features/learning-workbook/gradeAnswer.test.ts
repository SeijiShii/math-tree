import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { DDL } from "../../../db/ddl";
import * as schema from "../../../db/schema";
import { gradeAnswer } from "./gradeAnswer";
import { MockAiClient } from "../../lib/ai/mock";

let db: any;
beforeEach(async () => {
  const pg = new PGlite();
  db = drizzle(pg, { schema });
  await pg.exec(DDL);
});

// slug + 先頭 problem + step(order) に modelAnswerLatex/hint を仕込む
async function seedStep(
  slug: string,
  modelAnswerLatex: string,
  hint = "ヒント",
  order = 0,
) {
  const [u] = await db
    .insert(schema.units)
    .values({
      slug,
      title: slug,
      systemicLine: "s",
      description: "d",
      trivia: "t",
      verificationStatus: "verified",
    })
    .returning();
  const [p] = await db
    .insert(schema.problems)
    .values({
      unitId: u.id,
      statementLatex: "x",
      order: 0,
      verificationStatus: "verified",
    })
    .returning();
  await db
    .insert(schema.steps)
    .values({ problemId: p.id, order, modelAnswerLatex, hint });
}

describe("gradeAnswer (CAS コア採点 + AI フォールバック)", () => {
  it("N1: CAS で正解（交換法則、キー不要・AI 不使用）", async () => {
    await seedStep("u1", "2x+3");
    const r = await gradeAnswer(
      db,
      { slug: "u1", stepIndex: 0, latex: "3+2x" },
      null,
    );
    expect(r.found).toBe(true);
    expect(r.match).toBe(true);
    expect(r.viaAi).toBe(false);
  });

  it("E1: CAS で誤答 → step の hint を返す", async () => {
    await seedStep("u2", "2x+3", "もう一度展開してみよう");
    const r = await gradeAnswer(
      db,
      { slug: "u2", stepIndex: 0, latex: "2x+4" },
      null,
    );
    expect(r.match).toBe(false);
    expect(r.hint).toBe("もう一度展開してみよう");
  });

  it("E2: 対象 step 不在 → found=false（404 用）", async () => {
    const r = await gradeAnswer(
      db,
      { slug: "missing", stepIndex: 0, latex: "x" },
      null,
    );
    expect(r.found).toBe(false);
  });

  it("E3: CAS 判定不能 + AI キー無し → 正解を弾かず「準備中」案内（match=false, viaAi=false）", async () => {
    await seedStep("u3", "2 +"); // parse 不能 → areEquivalent=null
    const r = await gradeAnswer(
      db,
      { slug: "u3", stepIndex: 0, latex: "2 +" },
      null,
    );
    expect(r.found).toBe(true);
    expect(r.viaAi).toBe(false);
    expect(r.hint).toContain("判定できません");
  });

  it("N2: CAS 判定不能 + AI あり → AI フォールバックで判定（viaAi=true）", async () => {
    await seedStep("u4", "2 +");
    const ai = new MockAiClient({
      reviews: { "gpt-4o-mini": { verdict: "pass", critical: false } },
    });
    const r = await gradeAnswer(
      db,
      { slug: "u4", stepIndex: 0, latex: "2 +" },
      ai,
    );
    expect(r.viaAi).toBe(true);
    expect(r.match).toBe(true);
  });
});
