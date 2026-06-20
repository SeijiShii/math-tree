import { db, ownerFrom } from '../_handler'
import { deleteAllOwnerData } from '../../src/lib/auth/account'
export default async function handler(req: any, res: any) {
  await deleteAllOwnerData(db(), ownerFrom(req))  // DSR セルフ削除（SEC-004）
  res.status(200).json({ ok: true })
}
