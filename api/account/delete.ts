import { db, ownerFrom, send401If } from '../_handler'
import { deleteAllOwnerData } from '../../src/lib/auth/account'
export default async function handler(req: any, res: any) {
  let ownerId: string
  try {
    ownerId = await ownerFrom(req) // 本人のみ（なりすましでの他人データ削除を排除、SEC-001/004）
  } catch (e) {
    if (send401If(res, e)) return
    throw e
  }
  await deleteAllOwnerData(db(), ownerId) // DSR セルフ削除（SEC-004）
  res.status(200).json({ ok: true })
}
