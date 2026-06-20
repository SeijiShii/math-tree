import { aiCallLogs } from '../../../db/schema'
type Db = any
export async function aggregateCost(db: Db): Promise<{ total: number; byPurpose: Record<string, number> }> {
  const rows = await db.select().from(aiCallLogs)
  const byPurpose: Record<string, number> = {}
  let total = 0
  for (const r of rows) {
    const c = Number(r.estCostUsd ?? 0)
    total += c
    byPurpose[r.purpose] = (byPurpose[r.purpose] ?? 0) + c
  }
  return { total, byPurpose }
}
