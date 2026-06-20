import { db } from './_handler'
import { getPublicUnits } from '../db/owner'
export default async function handler(_req: any, res: any) {
  res.status(200).json(await getPublicUnits(db())) // verified のみ（SEC-005）
}
