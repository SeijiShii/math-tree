import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { DDL } from "./ddl";
import * as schema from "./schema";
import { seedCurriculum, type SeedData } from "./seed";
import { getPublicUnits } from "./owner";
import { getStepForGrading } from "./grading";
import { gradeAnswer } from "../src/features/learning-workbook/gradeAnswer";
import seedData from "./seed-data.json";

let db: any;
beforeEach(async () => {
  const pg = new PGlite();
  db = drizzle(pg, { schema });
  await pg.exec(DDL);
});

describe("seedCurriculum (starter カリキュラム)", () => {
  it("N1: 全 unit を verified で投入し getPublicUnits で配信できる", async () => {
    const r = await seedCurriculum(db, seedData as SeedData);
    expect(r.insertedUnits).toBe((seedData as SeedData).units.length);
    const pub = await getPublicUnits(db);
    expect(pub.length).toBe((seedData as SeedData).units.length);
  });

  it("N2: 再実行は idempotent（slug 衝突は skip、二重投入しない）", async () => {
    await seedCurriculum(db, seedData as SeedData);
    const r2 = await seedCurriculum(db, seedData as SeedData);
    expect(r2.insertedUnits).toBe(0);
    expect(r2.skipped).toBe((seedData as SeedData).units.length);
    const pub = await getPublicUnits(db);
    expect(pub.length).toBe((seedData as SeedData).units.length);
  });

  it("N3: 各 unit の step0 が CAS で採点でき、模範解答が正解判定される", async () => {
    await seedCurriculum(db, seedData as SeedData);
    for (const u of (seedData as SeedData).units) {
      const model = u.problems[0].steps[0].modelAnswerLatex;
      const r = await gradeAnswer(
        db,
        { slug: u.slug, stepIndex: 0, latex: model },
        null,
      );
      expect(r.found).toBe(true);
      expect(
        r.match,
        `unit ${u.slug} model "${model}" should self-match via CAS`,
      ).toBe(true);
    }
  });

  it("N4: 模範解答が DB に取得できる（grade-step 配線確認）", async () => {
    await seedCurriculum(db, seedData as SeedData);
    const step = await getStepForGrading(db, "moji-shiki", 0);
    expect(step?.modelAnswerLatex).toBe("5x");
  });
});
