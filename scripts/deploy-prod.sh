#!/usr/bin/env bash
# 本番デプロイ (O51 対策の正しい手順、hana-memo 実績)。
#
# ⚠️ `vercel build` / `vercel deploy --prod` (--prebuilt なし) を使ってはいけない:
#    それらは buildCommand 実行後に @vercel/node が api/ を二重ビルドし、生 api/*.js
#    (拡張子なし/alias import) が配信され ERR_MODULE_NOT_FOUND (500) になる。
# 対策: build script を直接実行して .vercel/output を作り、`vercel deploy --prebuilt` で
#    その出力をそのまま deploy する (remote 再ビルド・@vercel/node 検出を回避)。
#
# 使い方: bash scripts/deploy-prod.sh   (Class B = 本番公開。ユーザーが実行)
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[1/4] prod env 同期 (.env.production.local → Vercel prod env)"
bash scripts/sync-prod-env.sh

echo "[2/4] クリーン + build (node scripts/vercel-build.mjs を直接実行 — vercel build は使わない)"
rm -rf .vercel/output
node scripts/vercel-build.mjs

echo "[3/5] handler 検証 (生 api/ .js が残っていれば O51 の罠)"
bad=$(grep -rl '"handler": "api/' .vercel/output/functions 2>/dev/null || true)
if [ -n "$bad" ]; then echo "✗ 生 .js handler 検出: $bad"; exit 1; fi
echo "    ✓ 全 .func handler=index.mjs (bundle) を確認"

# 関数数ガード (CF-20260529-015): Vercel Hobby プランは 1 deploy あたり Serverless Functions 12 個まで。
# 超過すると 22MB upload 後に remote で deploy_failed になる (= 時間と帯域の無駄)。build 直後・upload 前に
# fail-fast し「どれを統合/削除するか」を促す。Pro 以上なら MAX_FUNCTIONS=100 等で上書き。hana-memo / bousai 両方で踏んだ再発トラップ。
MAX_FUNCTIONS="${MAX_FUNCTIONS:-12}"
echo "[4/5] 関数数ガード (Hobby 上限 ${MAX_FUNCTIONS}、CF-015 再発抑止)"
# .func は api/ 配下にネストする (例 api/auth/guest.func) ので -maxdepth は付けない (全深さで数える)。
fn_count=$(find .vercel/output/functions -name '*.func' -type d 2>/dev/null | wc -l)
if [ "$fn_count" -gt "$MAX_FUNCTIONS" ]; then
  echo "✗ Serverless Functions ${fn_count} 個 > 上限 ${MAX_FUNCTIONS} (Vercel Hobby)。"
  echo "  → api/ の関数を統合/削除して ${MAX_FUNCTIONS} 以下にするか、MAX_FUNCTIONS=<n> で上書き (Pro 以上)。"
  echo "  検出された関数:"; find .vercel/output/functions -name '*.func' -type d 2>/dev/null | sed 's#.*/functions/#    - #;s/\.func$##'
  exit 1
fi
echo "    ✓ 関数 ${fn_count}/${MAX_FUNCTIONS} 個 (上限内)"

echo "[5/5] deploy --prebuilt --prod (Class B = 公開)"
vercel deploy --prebuilt --prod
