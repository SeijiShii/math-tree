// 初期カリキュラム seed（手動 starter、AI 生成は後日）。idempotent（slug 衝突は skip）。
// scripts/migrate-seed.mjs（本番 Neon）と db/seed.test.ts（pglite）が同じ seed-data.json を消費。
import { eq } from 'drizzle-orm'
import { units, unitEdges, problems, steps } from './schema'

type Db = any

export interface SeedStep { order: number; modelAnswerLatex: string; hint?: string }
export interface SeedProblem { statementLatex: string; steps: SeedStep[] }
export interface SeedUnit {
  slug: string
  title: string
  description: string
  trivia: string
  isRomanceNode?: boolean
  problems: SeedProblem[]
}
export interface SeedData {
  systemicLine: string
  units: SeedUnit[]
  edges: [string, string][]
}

export interface SeedResult { insertedUnits: number; skipped: number }

export async function seedCurriculum(db: Db, data: SeedData): Promise<SeedResult> {
  const slugToId = new Map<string, string>()
  let inserted = 0
  let skipped = 0

  for (const u of data.units) {
    const existing = await db.select().from(units).where(eq(units.slug, u.slug)).limit(1)
    if (existing[0]) {
      slugToId.set(u.slug, existing[0].id)
      skipped++
      continue
    }
    const [row] = await db
      .insert(units)
      .values({
        slug: u.slug,
        title: u.title,
        systemicLine: data.systemicLine,
        description: u.description,
        trivia: u.trivia,
        isRomanceNode: u.isRomanceNode ?? false,
        verificationStatus: 'verified', // 手動 starter は verified（公開配信対象, SEC-005）
      })
      .returning()
    slugToId.set(u.slug, row.id)
    inserted++

    for (let pi = 0; pi < u.problems.length; pi++) {
      const p = u.problems[pi]
      const [prow] = await db
        .insert(problems)
        .values({ unitId: row.id, statementLatex: p.statementLatex, order: pi, verificationStatus: 'verified' })
        .returning()
      for (const s of p.steps) {
        await db.insert(steps).values({
          problemId: prow.id,
          order: s.order,
          modelAnswerLatex: s.modelAnswerLatex,
          hint: s.hint ?? null,
        })
      }
    }
  }

  // edges（両端が存在するもののみ、idempotent）
  for (const [from, to] of data.edges) {
    const f = slugToId.get(from)
    const t = slugToId.get(to)
    if (!f || !t) continue
    await db.insert(unitEdges).values({ fromUnitId: f, toUnitId: t }).onConflictDoNothing()
  }

  return { insertedUnits: inserted, skipped }
}
