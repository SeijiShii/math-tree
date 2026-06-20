// 本番 Neon にスキーマ適用 + starter カリキュラム seed（idempotent）。
// 使い方: node scripts/migrate-seed.mjs   (.env.production.local の DATABASE_URL を読む)
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

neonConfig.webSocketConstructor = ws
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const envText = readFileSync(join(root, '.env.production.local'), 'utf8')
const m = envText.match(/^DATABASE_URL=(.+)$/m)
if (!m || !m[1].trim()) {
  console.error('DATABASE_URL が .env.production.local にありません')
  process.exit(1)
}
const pool = new Pool({ connectionString: m[1].trim() })
const sql = { query: (text, params) => pool.query(text, params).then((r) => r.rows) }

// --- schema (db/ddl.ts のテンプレートリテラルを抽出) ---
const ddlText = readFileSync(join(root, 'db/ddl.ts'), 'utf8')
const ddl = ddlText.match(/`([\s\S]*?)`/)[1]
const stmts = ddl.split(';').map((s) => s.trim()).filter(Boolean)
for (const s of stmts) await sql.query(s)
console.log(`schema applied (${stmts.length} statements)`)

// --- seed ---
const data = JSON.parse(readFileSync(join(root, 'db/seed-data.json'), 'utf8'))
let inserted = 0
let skipped = 0
for (const u of data.units) {
  await sql.query(
    'INSERT INTO units (slug,title,systemic_line,description,trivia,is_romance_node,verification_status) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (slug) DO NOTHING',
    [u.slug, u.title, data.systemicLine, u.description, u.trivia, u.isRomanceNode ?? false, 'verified'],
  )
  const urow = await sql.query('SELECT id FROM units WHERE slug=$1', [u.slug])
  const unitId = urow[0].id
  const pc = await sql.query('SELECT count(*)::int AS c FROM problems WHERE unit_id=$1', [unitId])
  if (pc[0].c > 0) {
    skipped++
    continue
  }
  inserted++
  for (let pi = 0; pi < u.problems.length; pi++) {
    const p = u.problems[pi]
    const pr = await sql.query(
      'INSERT INTO problems (unit_id,statement_latex,"order",verification_status) VALUES ($1,$2,$3,$4) RETURNING id',
      [unitId, p.statementLatex, pi, 'verified'],
    )
    for (const s of p.steps) {
      await sql.query(
        'INSERT INTO steps (problem_id,"order",model_answer_latex,hint) VALUES ($1,$2,$3,$4)',
        [pr[0].id, s.order, s.modelAnswerLatex, s.hint ?? null],
      )
    }
  }
}
for (const [from, to] of data.edges) {
  const f = await sql.query('SELECT id FROM units WHERE slug=$1', [from])
  const t = await sql.query('SELECT id FROM units WHERE slug=$1', [to])
  if (!f[0] || !t[0]) continue
  await sql.query(
    'INSERT INTO unit_edges (from_unit_id,to_unit_id) VALUES ($1,$2) ON CONFLICT (from_unit_id,to_unit_id) DO NOTHING',
    [f[0].id, t[0].id],
  )
}
const total = await sql.query('SELECT count(*)::int AS c FROM units')
console.log(`seed done: inserted ${inserted} units, skipped ${skipped} (total units now ${total[0].c})`)
await pool.end()
