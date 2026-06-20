// 単価は .env 管理（§4.6.2、ハードコード禁止）。テストは注入。
export interface Pricing { inputPer1k: number; outputPer1k: number }
export function loadPricing(env: Record<string, string | undefined> = process.env): Pricing {
  return {
    inputPer1k: Number(env.COST_ANTHROPIC_PER_1K_INPUT_TOKENS ?? 0),
    outputPer1k: Number(env.COST_ANTHROPIC_PER_1K_OUTPUT_TOKENS ?? 0),
  }
}
export function estimateCost(inputTokens: number, outputTokens: number, p: Pricing): number {
  return (inputTokens / 1000) * p.inputPer1k + (outputTokens / 1000) * p.outputPer1k
}
