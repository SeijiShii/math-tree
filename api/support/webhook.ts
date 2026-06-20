import { db } from '../_handler'
import { handleWebhook } from '../../src/features/support/webhook'
// 署名検証は実 Stripe を release で inject（O35）。
export default async function handler(req: any, res: any) {
  res.status(501).json({ error: 'Stripe 署名検証未 inject（release で実キー配線）' }); void db; void handleWebhook
}
