// 外部 API 呼び出しを ai_call_logs に積算記録（§4.6.2）
import { aiCallLogs } from '../../../db/schema'
import { estimateCost, type Pricing } from './pricing'
type Db = any
export async function recordCall(
  db: Db,
  call: { provider: string; purpose: 'generation' | 'review'; model: string; inputTokens: number; outputTokens: number },
  pricing: Pricing,
): Promise<number> {
  const cost = estimateCost(call.inputTokens, call.outputTokens, pricing)
  await db.insert(aiCallLogs).values({
    provider: call.provider, purpose: call.purpose, model: call.model,
    inputTokens: call.inputTokens, outputTokens: call.outputTokens,
    estCostUsd: cost.toFixed(4),
  })
  return cost
}
