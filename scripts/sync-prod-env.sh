#!/usr/bin/env bash
# .env.production.local を Vercel production env に冪等同期 (CF-20260528-008/014/015)。
# user が実行する (agent は秘密値を読まない、CF-004/005)。空値キーは prod から削除。
set -euo pipefail
cd "$(dirname "$0")/.."
FILE=".env.production.local"
[ -f "$FILE" ] || { echo "✗ $FILE がありません。.env.production.example を元に作成してください"; exit 1; }
while IFS= read -r line || [ -n "$line" ]; do
  line="${line#"${line%%[![:space:]]*}"}"
  case "$line" in ''|\#*) continue;; *=*) ;; *) continue;; esac
  key="${line%%=*}"
  val="${line#*=}"
  # 値の「空白+#以降」をインラインコメント除去 (空白前置でない # は値の一部)
  val="$(printf '%s' "$val" | sed -E 's/[[:space:]]+#.*$//')"
  # 前後空白 + 両端クォート除去
  val="${val#"${val%%[![:space:]]*}"}"; val="${val%"${val##*[![:space:]]}"}"
  val="${val%\"}"; val="${val#\"}"; val="${val%\'}"; val="${val#\'}"
  if [ -z "$val" ]; then
    vercel env rm "$key" production -y >/dev/null 2>&1 || true
    echo "  - $key (空 → prod から削除)"
  else
    vercel env rm "$key" production -y >/dev/null 2>&1 || true
    printf '%s' "$val" | vercel env add "$key" production >/dev/null
    echo "  ✓ $key (…${val: -4})"
  fi
done < "$FILE"
echo "prod env 同期完了"
