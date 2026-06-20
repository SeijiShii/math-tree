// AI 生成 → 多段クロス検証ゲート → verified のみ保存（事前生成）。[論点-CG1]。SEC-005: 公開から直叩き不可。
import { units, reviews } from '../../../db/schema'
import { runCrossValidation } from '../../lib/ai/crossValidation'
import type { AiClient } from '../../lib/ai/types'
type Db = any

export interface GeneratedUnit {
  slug: string; title: string; systemicLine: string; description: string; trivia: string
}

// 生成物を多段検証し、合格時のみ verified で保存。不一致は under_review 差し戻し。
export async function validateAndStore(
  db: Db, ai: AiClient, gen: GeneratedUnit, models: string[],
): Promise<{ stored: boolean; verified: boolean; reason: string }> {
  const outcome = await runCrossValidation(
    ai, `${gen.title}: ${gen.description}`, '数学的に正確で、依存関係・問題が妥当か', models,
  )
  const status = outcome.verified ? 'verified' : 'under_review'
  const [u] = await db.insert(units).values({ ...gen, verificationStatus: status }).returning()
  // 検証履歴を reviews に記録
  for (const r of outcome.reviews) {
    await db.insert(reviews).values({
      targetType: 'unit', targetId: u.id, reviewModel: r.model,
      stage: 1, verdict: r.verdict, findings: r.findings,
    })
  }
  return { stored: true, verified: outcome.verified, reason: outcome.reason }
}
