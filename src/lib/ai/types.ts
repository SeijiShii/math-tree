import type { AiPurpose } from '../../types/enums'

export interface AiUsage { inputTokens: number; outputTokens: number }
export interface GenerateResult { text: string; usage: AiUsage; model: string }
export interface ReviewResult {
  verdict: 'pass' | 'fail'
  critical: boolean      // 重大指摘の有無（[論点-CG1]）
  findings: string
  model: string
  usage: AiUsage
}
// 可逆性 O35: interface（mock/実 SDK を差し替え可能）
export interface AiClient {
  generate(prompt: string, opts: { model: string; purpose: AiPurpose }): Promise<GenerateResult>
  review(content: string, criteria: string, opts: { model: string }): Promise<ReviewResult>
}
