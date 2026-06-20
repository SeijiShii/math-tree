import type { AiClient, ReviewResult } from './types'

export interface CrossValidationOutcome {
  verified: boolean
  reviews: ReviewResult[]
  reason: string
}

// [論点-CG1]: 異モデル多段クロス検証。合格 = 多数決 pass かつ 重大指摘ゼロ。
export async function runCrossValidation(
  client: AiClient,
  content: string,
  criteria: string,
  models: string[],
): Promise<CrossValidationOutcome> {
  const reviews: ReviewResult[] = []
  for (const model of models) {
    reviews.push(await client.review(content, criteria, { model }))
  }
  const passes = reviews.filter((r) => r.verdict === 'pass').length
  const anyCritical = reviews.some((r) => r.critical)
  const majority = passes > reviews.length / 2
  const verified = majority && !anyCritical
  const reason = anyCritical
    ? '重大指摘あり → 未公開差し戻し'
    : majority ? '多数決 pass + 重大指摘なし → verified' : '多数決未達 → 差し戻し'
  return { verified, reviews, reason }
}
