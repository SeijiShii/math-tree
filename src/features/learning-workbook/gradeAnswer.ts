// 採点オーケストレーション: 模範解答取得 → CAS 採点（キー不要）→ 判定不能時のみ AI フォールバック。
// AI 未配線（キー無し）でも CAS で動く。誤って正解を誤答にしない（判定不能は見直し案内）。
// 入力は「計算の途中経過」（イコールで繋いだ式、例 -3+5=2）を受け付ける（concept UC#5）。
import type { AiClient } from "../../lib/ai/types";
import { gradeProcess } from "./equivalence";
import { gradeStep, type GradeResult } from "./gradeStep";
import { getStepForGrading, getStepByProblemId } from "../../../db/grading";

type Db = any;

export interface GradeAnswerResult extends GradeResult {
  found: boolean;
}

export async function gradeAnswer(
  db: Db,
  input: { slug: string; problemId?: string; stepIndex: number; latex: string },
  ai: AiClient | null,
): Promise<GradeAnswerResult> {
  // problemId 指定があればその問題を採点。無指定は先頭問題（後方互換）。
  const step = input.problemId
    ? await getStepByProblemId(db, input.problemId, input.stepIndex)
    : await getStepForGrading(db, input.slug, input.stepIndex);
  if (!step) return { found: false, match: false, viaAi: false };

  // 途中経過（イコールチェーン）をそのまま採点する。
  const cas = gradeProcess(input.latex, step.modelAnswerLatex);
  if (cas !== null) {
    return {
      found: true,
      match: cas,
      viaAi: false,
      hint: cas ? undefined : (step.hint ?? "惜しい、式を見直してみましょう"),
    };
  }

  // CAS 判定不能。AI キーが無ければ誤答にせず、見直しを案内（正解を弾かない）。
  if (!ai) {
    return {
      found: true,
      match: false,
      viaAi: false,
      hint: "うまく判定できませんでした。式を確認して、もう一度入力してみてください",
    };
  }

  const r = await gradeStep(input.latex, step.modelAnswerLatex, ai);
  return { found: true, ...r };
}
