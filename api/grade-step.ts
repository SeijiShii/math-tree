import { db, ownerFrom, send401If } from './_handler'
// 注: 実 AI クライアントは integration で inject（O35）。ここでは結線形 + owner 強制のみ。
export default async function handler(req: any, res: any) {
  try {
    await ownerFrom(req) // owner 強制（未認証は 401、SEC-001）
  } catch (e) {
    if (send401If(res, e)) return
    throw e
  }
  void db
  res.status(501).json({ error: 'AI クライアント未 inject（release で実キー配線）' })
}
