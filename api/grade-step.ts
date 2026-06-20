import { db, ownerFrom } from './_handler'
// 注: 実 AI クライアントは integration で inject（O35）。ここでは結線形のみ。
export default async function handler(req: any, res: any) {
  ownerFrom(req); void db
  res.status(501).json({ error: 'AI クライアント未 inject（release で実キー配線）' })
}
