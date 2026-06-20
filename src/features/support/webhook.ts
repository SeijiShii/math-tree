// Stripe Webhook: 署名検証（O35 injectable）+ supports 冪等記録（SEC-001 owner scoped）
import { supports } from '../../../db/schema'
type Db = any

export interface VerifiedSession { ownerId: string; stripeSessionId: string; amount: number }
export type SignatureVerifier = (payload: string, sig: string) => VerifiedSession | null

export async function recordSupport(db: Db, session: VerifiedSession): Promise<{ recorded: boolean }> {
  try {
    await db.insert(supports).values({
      ownerId: session.ownerId, amount: session.amount, stripeSessionId: session.stripeSessionId,
    })
    return { recorded: true }
  } catch {
    // unique(stripe_session_id) 違反 = 既処理（冪等、Webhook 重複配信）
    return { recorded: false }
  }
}

export async function handleWebhook(
  db: Db, payload: string, sig: string, verify: SignatureVerifier,
): Promise<{ ok: boolean; reason?: string }> {
  const session = verify(payload, sig)
  if (!session) return { ok: false, reason: '署名検証失敗' }
  await recordSupport(db, session)
  return { ok: true }
}
