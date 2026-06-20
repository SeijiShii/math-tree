#!/usr/bin/env bash
pkill -f "vite" 2>/dev/null || true
pkill -f "vercel dev" 2>/dev/null || true
echo "[stop] dev サーバー停止"
