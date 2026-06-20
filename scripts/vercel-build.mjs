#!/usr/bin/env node
/**
 * Vercel Build Output API ビルダー（O51 対策: ESM + 拡張子なし相対 import）。
 *
 * 背景: @vercel/node は api/*.ts を非 bundle で ESM コンパイルするため、`"type":"module"` +
 * 拡張子なし相対 import が本番関数で ERR_MODULE_NOT_FOUND (500) になる。
 * 対策: 各 api 関数を esbuild で bundle（import を 1 ファイルに inline）し .vercel/output を自前生成。
 * frontend は vite build → static。bousai-bag / hana-memo 実績パターン。
 */
import { build as esbuild } from 'esbuild'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, '.vercel/output')
const FN_OUT = path.join(OUT, 'functions')

console.log('[vercel-build] vite build…')
execSync('npx vite build', { stdio: 'inherit' })

fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(path.join(OUT, 'static'), { recursive: true })
fs.cpSync(path.join(ROOT, 'dist'), path.join(OUT, 'static'), { recursive: true })

// api/**/*.ts を収集（_handler 等 _ 前置 / test を除く）
function collectRoutes(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) {
      if (name.startsWith('_')) continue
      collectRoutes(full, acc)
    } else if (name.endsWith('.ts') && !name.endsWith('.test.ts') && !name.startsWith('_')) {
      acc.push(path.relative(path.join(ROOT, 'api'), full).replace(/\.ts$/, ''))
    }
  }
  return acc
}
const routes = collectRoutes(path.join(ROOT, 'api'))
console.log(`[vercel-build] ${routes.length} functions:`, routes.join(', '))

// 生 body 必須ルート（Stripe 署名検証）。helpers を付けると生バイトを失うため false（CF-20260607-001）。
const RAW_BODY_ROUTES = new Set(['support/webhook'])

for (const route of routes) {
  const funcDir = path.join(FN_OUT, 'api', `${route}.func`)
  fs.mkdirSync(funcDir, { recursive: true })
  await esbuild({
    entryPoints: [path.join(ROOT, 'api', `${route}.ts`)],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    outfile: path.join(funcDir, 'index.mjs'),
    external: ['pg-native'],
    tsconfig: path.join(ROOT, 'tsconfig.json'),
    logLevel: 'error',
    banner: {
      js: "import{createRequire as ___cr}from'module';const require=___cr(import.meta.url);import{fileURLToPath as ___f}from'url';import{dirname as ___d}from'path';const __filename=___f(import.meta.url);const __dirname=___d(__filename);",
    },
  })
  const rawBody = RAW_BODY_ROUTES.has(route)
  fs.writeFileSync(
    path.join(funcDir, '.vc-config.json'),
    JSON.stringify(
      { handler: 'index.mjs', runtime: 'nodejs20.x', launcherType: 'Nodejs', shouldAddHelpers: !rawBody, shouldAddSourcemapSupport: true },
      null,
      2,
    ),
  )
}

// routing（auth は統合関数 + action 振り分け、filesystem、SPA フォールバック）
const config = {
  version: 3,
  routes: [
    { src: '/api/auth/guest', dest: '/api/auth?action=guest' },
    { src: '/api/auth/link', dest: '/api/auth?action=link' },
    { handle: 'filesystem' },
    { src: '/api/(.*)', status: 404 },
    { src: '/(.*)', dest: '/index.html' },
  ],
}
fs.writeFileSync(path.join(OUT, 'config.json'), JSON.stringify(config, null, 2))
console.log('[vercel-build] .vercel/output 生成完了')
