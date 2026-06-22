// 生成オーケストレーション（C20260622-007）: ツリー空なら bootstrap、各単元プールを per-run CAP 内で top-up。
//   定期 Cron / バッチから呼ぶ。SEC-005: server-only。コスト制御 = maxLines/maxUnits/maxPerUnit。
import { eq } from "drizzle-orm";
import { units, problems } from "../../../db/schema";
import { generateUnits } from "./generateUnits";
import { generateProblems } from "./generateProblems";
import { allLines } from "./curriculumSyllabus";
import {
  selectTopupUnits,
  topupCount,
  TOPUP_UNIT_CAP,
  TOPUP_PROBLEM_CAP,
} from "./poolPolicy";
import type { AiClient } from "../../lib/ai/types";

type Db = any;

export interface RunOpts {
  maxLines?: number; // 1 回で bootstrap する系統数
  maxUnits?: number; // 1 回で top-up する単元数
  maxPerUnit?: number; // 1 単元に追加する問題数
}

export async function runGeneration(
  db: Db,
  ai: AiClient,
  models: string[],
  opts: RunOpts = {},
): Promise<{
  bootstrappedLines: number;
  addedUnits: number;
  toppedUnits: number;
  addedProblems: number;
}> {
  const maxLines = opts.maxLines ?? 1;
  const unitCap = opts.maxUnits ?? TOPUP_UNIT_CAP;
  const perUnit = opts.maxPerUnit ?? TOPUP_PROBLEM_CAP;

  // bootstrap: ツリーが空なら系統を順に生成（per-run で maxLines まで）
  let bootstrappedLines = 0;
  let addedUnits = 0;
  const existing = await db.select().from(units);
  if (existing.length === 0) {
    for (const line of allLines().slice(0, maxLines)) {
      const r = await generateUnits(db, ai, line, models);
      addedUnits += r.addedUnits;
      bootstrappedLines++;
    }
  }

  // top-up: プールが上限未満の単元に verified 問題を追記
  const all = await db.select().from(units);
  const withPool: { slug: string; poolSize: number }[] = [];
  for (const u of all) {
    const ps = await db
      .select()
      .from(problems)
      .where(eq(problems.unitId, u.id));
    withPool.push({ slug: u.slug, poolSize: ps.length });
  }
  const targets = selectTopupUnits(withPool, unitCap);
  let addedProblems = 0;
  for (const slug of targets) {
    const cur = withPool.find((w) => w.slug === slug)!.poolSize;
    const r = await generateProblems(
      db,
      ai,
      slug,
      topupCount(cur, perUnit),
      models,
    );
    addedProblems += r.added;
  }

  return {
    bootstrappedLines,
    addedUnits,
    toppedUnits: targets.length,
    addedProblems,
  };
}
