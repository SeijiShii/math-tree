// フィードバック ingestion。送信前 PII scrub（SEC-003）→ 保存（→ 即時通知/hub は integration で配線）
import { feedback as feedbackTable } from '../../../db/schema'
import { scrubPII } from '../../lib/ai/piiScrub'
import type { FeedbackKind } from '../../types/enums'
type Db = any

export interface FeedbackInput {
  ownerId?: string | null
  kind: FeedbackKind
  body?: string
  context?: { screen?: string; route?: string; appVersion?: string; ua?: string }
}

export async function ingestFeedback(db: Db, input: FeedbackInput): Promise<{ ok: true }> {
  const body = input.body ? scrubPII(input.body) : null           // SEC-003
  const context = input.context
    ? { ...input.context, ua: input.context.ua ? scrubPII(input.context.ua) : undefined }
    : null
  await db.insert(feedbackTable).values({
    ownerId: input.ownerId ?? null, kind: input.kind, body, context,
  })
  return { ok: true }
}
