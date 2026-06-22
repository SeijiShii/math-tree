import { db, ownerFrom, send401If } from "./_handler";
import { gradeAnswer } from "../src/features/learning-workbook/gradeAnswer";
import { makeAiClientFromEnv } from "../src/lib/ai/anthropic";

// 答え合わせ: owner 強制（SEC-001）→ CAS 採点（キー不要）→ 判定不能時のみ AI（キーあれば）。
export default async function handler(req: any, res: any) {
  try {
    await ownerFrom(req);
  } catch (e) {
    if (send401If(res, e)) return;
    throw e;
  }
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const slug = body?.slug;
  const latex = body?.latex;
  if (typeof slug !== "string" || typeof latex !== "string") {
    res.status(400).json({ error: "Bad Request" });
    return;
  }
  const problemId =
    typeof body?.problemId === "string" ? body.problemId : undefined;
  const stepIndex = Number.isFinite(Number(body?.stepIndex))
    ? Number(body.stepIndex)
    : 0;
  const r = await gradeAnswer(
    db(),
    { slug, problemId, stepIndex, latex },
    makeAiClientFromEnv(),
  );
  if (!r.found) {
    res.status(404).json({ error: "Not Found" });
    return;
  }
  res
    .status(200)
    .json({ match: r.match, viaAi: r.viaAi, hint: r.hint ?? null });
}
