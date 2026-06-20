# 依存ライブラリ脆弱性スキャン結果（L4）

**スキャン日**: 2026-06-20
**対象**: package-lock.json（~300 packages）
**スキャナ**: npm audit（/flow:secure --phase=deps、§3.0c release-pre 必須監査）

## 1. サマリ（修正前）
- Critical: 1 / High: 3 / Moderate: 3 / 合計 7

## 2. Critical / High 詳細 + 対応
| パッケージ | severity | 脆弱性 | 対応 |
|---|---|---|---|
| drizzle-orm <0.45.2 | High | SQL injection via improperly escaped SQL identifiers (GHSA-gpj5-g38j-94v9) | **0.45.2 へ upgrade**（DB owner-scoping パスに直結、最重要）|
| mathjs 13.1.0-15.1.1 | High | Unsafe object property setter / prototype pollution (GHSA-29qv-4j9f-fjw5, GHSA-jvff-x2qm-6286) | **15.2.0 へ upgrade**（CAS 同値判定の式評価パスに直結）|
| esbuild <=0.24.2 (via vite/vitest) | Moderate | dev server が任意リクエストを受ける (GHSA-67mh-4wv8-2f99、dev-only) | vite 6.4 / vitest 3.2 へ upgrade（esbuild 修正版）|

## 3. 結果（修正後）
- **npm audit: found 0 vulnerabilities**
- 回帰チェック: 64/64 unit green + typecheck green + production build 成功（drizzle 0.36→0.45 / mathjs 13→15 / vite 5→6 / vitest 2→3 の major 含むが破壊なし）

## 4. 継続監視
- `.github/dependabot.yml` 設定済（weekly）。CI に npm audit 組み込み推奨。
