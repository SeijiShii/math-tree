// アカウント領域: DSR セルフ削除 + ゲスト→アカウント連携（データ引き継ぎ）
import { eq } from 'drizzle-orm'
import { progress, supports, feedback } from '../../../db/schema'
import { purgeOwnerData } from '../../../db/owner'

type Db = any

// DSR セルフサービス全削除（SEC-004） = db.purgeOwnerData の実体
export async function deleteAllOwnerData(db: Db, ownerId: string): Promise<void> {
  await purgeOwnerData(db, ownerId)
}

// ゲスト → アカウント連携: ゲストの全データを連携先 owner へ引き継ぐ（取りこぼしなし）
export async function linkGuestToAccount(db: Db, guestOwnerId: string, accountOwnerId: string): Promise<void> {
  await db.update(progress).set({ ownerId: accountOwnerId }).where(eq(progress.ownerId, guestOwnerId))
  await db.update(supports).set({ ownerId: accountOwnerId }).where(eq(supports.ownerId, guestOwnerId))
  await db.update(feedback).set({ ownerId: accountOwnerId }).where(eq(feedback.ownerId, guestOwnerId))
}
