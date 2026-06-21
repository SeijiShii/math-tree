#!/usr/bin/env bash
# 本番 post-deploy スモーク (§3.4): frontend 200 / /api/* 非500 (O51) / ゲスト認証 200 (O22) / core 配信。
# read-only。guest token は秘密でないが先頭のみ表示。
set -uo pipefail
BASE="${1:-https://math-tree-psi.vercel.app}"
echo "smoke target: $BASE"

code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }

echo "[1] frontend (/)            → $(code "$BASE/")  (期待 200)"

echo "[2] guest provision (POST /api/auth?action=guest)"
GUEST_JSON=$(curl -s -X POST "$BASE/api/auth?action=guest")
GTOK=$(printf '%s' "$GUEST_JSON" | sed -n 's/.*"guestToken":"\([^"]*\)".*/\1/p')
if [ -n "$GTOK" ]; then
  echo "    ✓ guestToken 発行 (先頭: $(printf '%s' "$GTOK" | cut -c1-12)…)"
else
  echo "    ✗ guestToken なし: $(printf '%s' "$GUEST_JSON" | cut -c1-120)"
fi

echo "[3] 保護API 無トークン (/api/tech-tree)  → $(code "$BASE/api/tech-tree")  (期待 401=認証ゲートOK)"

if [ -n "$GTOK" ]; then
  echo "[4] 保護API guest Bearer (/api/tech-tree) → $(code -H "Authorization: Bearer $GTOK" "$BASE/api/tech-tree")  (期待 200)"
  echo "[5] tech-tree 本文 (units 配信確認)"
  BODY=$(curl -s -H "Authorization: Bearer $GTOK" "$BASE/api/tech-tree")
  echo "    $(printf '%s' "$BODY" | cut -c1-160)"
fi
