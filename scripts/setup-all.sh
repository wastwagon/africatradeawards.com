#!/usr/bin/env sh
# Full local setup: deps, CSS, Prisma client, Docker fullstack, optional demo users.
# Usage: from project root —  sh scripts/setup-all.sh
set -e
cd "$(dirname "$0")/.."

echo "== npm install"
npm install

echo "== Compile SCSS → public/assets/css/main.css"
npm run sass:build

echo "== Prisma generate (host)"
npx prisma generate

ENV_FILE="${ENV_FILE:-.env.coolify.example}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.coolify.yml}"

echo "== Docker: build + start ($COMPOSE_FILE, --env-file $ENV_FILE)"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

echo "== Wait for app..."
sleep 10

echo "== Demo users (all roles, password Demo_Awards_2026!)"
docker exec -e DEMO_SEED=true africa-trade-awards-app npx prisma db seed || true

echo ""
echo "Done. Open http://localhost:3003/"
echo "Demo login: entrant.demo@local.test / Demo_Awards_2026! (see prisma/seed.mjs for all emails)"
echo "Staff admin: http://localhost:3003/login/?next=/admin/"
