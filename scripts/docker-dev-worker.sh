#!/bin/sh
set -e

echo "[docker-dev worker] prisma generate…"
npx prisma generate

echo "[docker-dev worker] starting broadcast worker…"
exec npm run worker:broadcast
