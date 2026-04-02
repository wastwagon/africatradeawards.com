#!/bin/sh
set -e

echo "[docker-dev] prisma generate…"
npx prisma generate

echo "[docker-dev] prisma migrate deploy…"
npx prisma migrate deploy

echo "[docker-dev] initial sass build…"
npm run sass:build

echo "[docker-dev] sass watch + next dev (bind mounts = live reload)…"
npm run sass &
NEXT_CHILD=$!
trap 'kill "$NEXT_CHILD" 2>/dev/null; exit 0' INT TERM

echo "[docker-dev] If the browser shows 404 for /_next/static/* after a restart, run on the host: rm -rf .next && docker compose -f docker-compose.dev.yml restart web"

exec npx next dev -p 3003 -H 0.0.0.0
