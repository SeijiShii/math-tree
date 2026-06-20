# math-relax — 開発メモ

## テスト
- フレームワーク: Vitest
- 実行: `npm run test`（= `vitest run`）
- 型チェック: `npm run typecheck`
- DB テストは @electric-sql/pglite（in-process Postgres）で実 DB 不要・オフライン green。
- テスト配置: 各モジュール隣接 `*.test.ts`。

## スタック（concept §4.3）
Vite + React + TS / Vercel Functions / Neon(Postgres) + Drizzle / Clerk / MathLive + KaTeX / @xyflow/react / Stripe 単発。
