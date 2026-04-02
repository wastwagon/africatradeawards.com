#!/usr/bin/env sh
# Create the first SUPER_ADMIN (only when the User table is empty).
# Requires BOOTSTRAP_ADMIN_SECRET to match the value in your .env / Docker env.
#
# Example (Docker on port 3003):
#   export BOOTSTRAP_ADMIN_SECRET='replace_with_bootstrap_secret'
#   ./scripts/bootstrap-local-admin.sh
#
# Example (custom URL / email):
#   BASE_URL=http://127.0.0.1:3003 ADMIN_EMAIL=you@test.com ADMIN_PASSWORD='AtLeast10chars' ./scripts/bootstrap-local-admin.sh

set -e

BASE_URL="${BASE_URL:-http://localhost:3003}"
EMAIL="${ADMIN_EMAIL:-admin@local.test}"
PASSWORD="${ADMIN_PASSWORD:-ChangeMe_Local_12345}"
FULL_NAME="${ADMIN_FULL_NAME:-Local Super Admin}"

if [ -z "$BOOTSTRAP_ADMIN_SECRET" ]; then
  echo "Set BOOTSTRAP_ADMIN_SECRET to the same value as in your environment (e.g. .env.coolify.example / Coolify vars)." >&2
  exit 1
fi

curl -sS -X POST "${BASE_URL}/api/auth/bootstrap" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\",\"fullName\":\"${FULL_NAME}\",\"bootstrapSecret\":\"${BOOTSTRAP_ADMIN_SECRET}\"}"

echo ""
