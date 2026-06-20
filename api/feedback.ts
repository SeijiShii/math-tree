import { db } from './_handler'
import { ingestFeedback } from '../src/features/feedback/ingest'
export default async function handler(req: any, res: any) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  await ingestFeedback(db(), body)   // 送信前 PII scrub は ingest 内（SEC-003）
  res.status(200).json({ ok: true })
}
