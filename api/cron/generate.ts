import { db } from '../_handler'
import { makeAiClientFromEnv } from '../../src/lib/ai/anthropic'
import { runGeneration } from '../../src/features/curriculum-generation/runGeneration'

// 定期カリキュラム生成（Vercel Cron, C20260622-007）。
//   CRON_SECRET で認証（公開トリガ不可、SEC-005）→ AI で bootstrap/top-up → verified のみ保存。
//   per-run CAP でコスト制御（runGeneration 既定: 1系統/5単元/5問）。
export default async function handler(req: any, res: any) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers?.authorization
  if (!secret || auth !== `Bearer ${secret}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  const ai = makeAiClientFromEnv()
  if (!ai) {
    res.status(503).json({ error: 'AI unavailable (ANTHROPIC_API_KEY 未設定)' })
    return
  }
  const models = (process.env.CURRICULUM_MODELS ?? 'claude-haiku-4-5,claude-sonnet-4-6')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean)
  const summary = await runGeneration(db(), ai, models)
  res.status(200).json(summary)
}
