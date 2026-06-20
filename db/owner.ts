// _shared/db — owner-scoped クエリ + DSR purge。SEC-001（認可）/ SEC-004（DSR）。
import { eq, and } from 'drizzle-orm'
import { progress, supports, feedback, units } from './schema'

export type ProgressState = 'locked' | 'unlocked' | 'mastered'
const RANK: Record<ProgressState, number> = { locked: 0, unlocked: 1, mastered: 2 }

// 任意の drizzle db インスタンスを受ける（Neon 本番 / PGlite テスト 両対応、可逆性 O35）
type Db = any

/** 認証主体（owner）の進捗のみ返す（SEC-001: 他人のは見えない） */
export async function getOwnerProgress(db: Db, ownerId: string) {
  return db.select().from(progress).where(eq(progress.ownerId, ownerId))
}

/** 進捗を前進のみ更新（後退拒否）。owner scoped。 */
export async function advanceProgress(
  db: Db, ownerId: string, unitId: string, next: ProgressState,
): Promise<{ updated: boolean }> {
  const rows = await db.select().from(progress)
    .where(and(eq(progress.ownerId, ownerId), eq(progress.unitId, unitId)))
  const current = (rows[0]?.state as ProgressState | undefined) ?? 'locked'
  if (RANK[next] <= RANK[current] && rows.length > 0) return { updated: false }
  if (rows.length === 0) {
    await db.insert(progress).values({ ownerId, unitId, state: next })
  } else {
    await db.update(progress).set({ state: next })
      .where(and(eq(progress.ownerId, ownerId), eq(progress.unitId, unitId)))
  }
  return { updated: true }
}

/** DSR セルフサービス削除: owner の全データを実削除（SEC-004）。公開 units は不変。 */
export async function purgeOwnerData(db: Db, ownerId: string): Promise<void> {
  await db.delete(progress).where(eq(progress.ownerId, ownerId))
  await db.delete(supports).where(eq(supports.ownerId, ownerId))
  await db.delete(feedback).where(eq(feedback.ownerId, ownerId))
}

/** 公開配信は verified のみ（未検証コンテンツを出さない） */
export async function getPublicUnits(db: Db) {
  const rows = await db.select().from(units).where(eq(units.verificationStatus, 'verified'))
  // UnitPublic: verification_status を露出しない
  return rows.map(({ verificationStatus, ...pub }: any) => pub)
}
