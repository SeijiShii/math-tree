// カリキュラム生成バッチ（C20260622-007）。
//   デプロイ済の /api/cron/generate を CRON_SECRET で繰り返し叩き、ツリーを bootstrap → プールを成長させる。
//   使い方: node scripts/generate-curriculum.mjs [回数]   (.env.production.local の CRON_SECRET を読む)
//   ※ 実生成は ANTHROPIC_API_KEY が prod env に設定済みであること（未設定なら endpoint が 503）。
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const env = readFileSync(join(root, '.env.production.local'), 'utf8')
const secret = env.match(/^CRON_SECRET=(.+)$/m)?.[1]?.trim()
if (!secret) {
  console.error('CRON_SECRET が .env.production.local にありません')
  process.exit(1)
}
const base = process.env.MATH_TREE_URL ?? 'https://math-tree.givers.work'
const rounds = Number(process.argv[2] ?? 10)

let totalUnits = 0
let totalProblems = 0
for (let i = 1; i <= rounds; i++) {
  const res = await fetch(`${base}/api/cron/generate`, {
    headers: { authorization: `Bearer ${secret}` },
  })
  if (!res.ok) {
    console.error(`round ${i}: ${res.status} ${await res.text()}`)
    process.exit(res.status === 503 ? 2 : 1)
  }
  const s = await res.json()
  totalUnits += s.addedUnits ?? 0
  totalProblems += s.addedProblems ?? 0
  console.log(
    `round ${i}: +${s.addedUnits} units (bootstrap ${s.bootstrappedLines} lines), +${s.addedProblems} problems (${s.toppedUnits} units)`,
  )
  if ((s.addedUnits ?? 0) === 0 && (s.addedProblems ?? 0) === 0) {
    console.log('追加なし → 完了（プール上限到達 or 全系統生成済）')
    break
  }
}
console.log(`done: +${totalUnits} units, +${totalProblems} problems`)
