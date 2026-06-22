// AI で単元の問題を生成 → CAS 一次チェック + 多段クロス検証ゲート → verified のみプールに追記（C20260622-007）。
//   SEC-005: 公開から直叩き不可（server-only 事前生成）。SEC-002: 模範解答は生成側のみ、配信 DTO は別途除外。
import { eq, asc } from "drizzle-orm";
import { units, problems, steps, reviews } from "../../../db/schema";
import { runCrossValidation } from "../../lib/ai/crossValidation";
import { areEquivalent } from "../learning-workbook/equivalence";
import { dedupNew, topupCount, normalizeStatement } from "./poolPolicy";
import type { AiClient } from "../../lib/ai/types";

type Db = any;

export interface GenProblem {
  statementLatex: string;
  modelAnswerLatex: string;
  hint?: string;
}

/** AI 出力テキストから {problems:[...]} を抽出。壊れた JSON は空配列。 */
export function parseProblems(text: string): GenProblem[] {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return [];
  try {
    const obj = JSON.parse(m[0]);
    const arr = Array.isArray(obj.problems) ? obj.problems : [];
    return arr.filter(
      (p: any) =>
        typeof p?.statementLatex === "string" &&
        typeof p?.modelAnswerLatex === "string",
    );
  } catch {
    return [];
  }
}

/** CAS 一次チェック: 方程式(=を含む)以外は statement≡modelAnswer を要求。判定不能(null)は通し、明確な不一致(false)のみ弾く。 */
export function casPrecheck(p: GenProblem): boolean {
  if (p.statementLatex.includes("=")) return true; // 方程式は答えのみ、CAS 照合外
  return areEquivalent(p.statementLatex, p.modelAnswerLatex) !== false;
}

const GEN_PROMPT = (slug: string, n: number) =>
  `単元「${slug}」の中学/高校数学の練習問題を ${n} 問、JSON で出力してください。` +
  `形式: {"problems":[{"statementLatex":"...","modelAnswerLatex":"...","hint":"..."}]}。` +
  `statementLatex は問題式、modelAnswerLatex は最も簡約な解答。数値・係数を変えて多様に。`;

/** 単元プールに verified 問題を n 問まで追記成長させる。返り値 = 追加/却下数。 */
export async function generateProblems(
  db: Db,
  ai: AiClient,
  unitSlug: string,
  n: number,
  models: string[],
): Promise<{ added: number; rejected: number }> {
  const u = await db
    .select()
    .from(units)
    .where(eq(units.slug, unitSlug))
    .limit(1);
  if (!u[0]) return { added: 0, rejected: 0 };
  const existing = await db
    .select()
    .from(problems)
    .where(eq(problems.unitId, u[0].id))
    .orderBy(asc(problems.order));
  const cap = topupCount(existing.length, n);
  if (cap === 0) return { added: 0, rejected: 0 };

  const gen = await ai.generate(GEN_PROMPT(unitSlug, cap), {
    model: models[0],
    purpose: "generation",
  });
  const casChecked = parseProblems(gen.text).filter(casPrecheck);
  const candidates = dedupNew(
    existing.map((p: any) => p.statementLatex),
    casChecked,
  ).slice(0, cap);

  let added = 0;
  let rejected = 0;
  let order = existing.length;
  for (const c of candidates) {
    const outcome = await runCrossValidation(
      ai,
      `${c.statementLatex} = ${c.modelAnswerLatex}`,
      "数学的に正確で、模範解答が問題に対し正しいか",
      models,
    );
    if (!outcome.verified) {
      rejected++;
      continue;
    }
    const [prow] = await db
      .insert(problems)
      .values({
        unitId: u[0].id,
        statementLatex: c.statementLatex,
        order,
        verificationStatus: "verified",
      })
      .returning();
    await db.insert(steps).values({
      problemId: prow.id,
      order: 0,
      modelAnswerLatex: c.modelAnswerLatex,
      normalizedForm: normalizeStatement(c.modelAnswerLatex),
      hint: c.hint ?? null,
    });
    for (const r of outcome.reviews) {
      await db.insert(reviews).values({
        targetType: "problem",
        targetId: prow.id,
        reviewModel: r.model,
        stage: 1,
        verdict: r.verdict,
        findings: r.findings,
      });
    }
    added++;
    order++;
  }
  return { added, rejected };
}
