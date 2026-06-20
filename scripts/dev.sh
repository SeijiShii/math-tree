#!/usr/bin/env bash
# ローカル開発 launcher（O36）。Vite + Vercel Functions emulation。
set -e
echo "[dev] typecheck..."; npm run typecheck
echo "[dev] test (smoke)..."; npm run test
echo "[dev] vite + vercel dev を起動してください: npx vite & npx vercel dev"
