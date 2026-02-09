#!/usr/bin/env bash
# Build, serve the static export, and verify hero images return 200.
# Usage: ./scripts/serve-and-check.sh [PORT]
# Example: ./scripts/serve-and-check.sh 3080
# Then open http://localhost:3080 in your browser (or the port you chose).

set -e
PORT="${1:-3080}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=============================================="
echo "  Africa Trade Awards – local check"
echo "=============================================="
echo ""

echo "[1/4] Building..."
npm run build --silent 2>/dev/null || npm run build
echo "      Build OK."
echo ""

echo "[2/4] Starting static server on port $PORT..."
# Use Python if available (no extra deps), else npx serve
if command -v python3 >/dev/null 2>&1; then
  (cd out && python3 -m http.server "$PORT" 2>/dev/null) &
  SERVER_PID=$!
elif command -v python >/dev/null 2>&1; then
  (cd out && python -m http.server "$PORT" 2>/dev/null) &
  SERVER_PID=$!
else
  npx --yes serve out -l "$PORT" 2>/dev/null &
  SERVER_PID=$!
fi
sleep 3
echo "      Server running (PID $SERVER_PID)."
echo ""

echo "[3/4] Checking homepage and hero images..."
HOME_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/" 2>/dev/null || echo "000")
HERO_FILES=""
for f in out/_next/static/media/2P9A9*.jpg; do
  [ -f "$f" ] || continue
  name=$(basename "$f")
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/_next/static/media/$name" 2>/dev/null || echo "000")
  HERO_FILES="${HERO_FILES}$name:$code "
done

echo "      Homepage:        HTTP $HOME_CODE"
for f in out/_next/static/media/2P9A9*.jpg; do
  [ -f "$f" ] || continue
  name=$(basename "$f")
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/_next/static/media/$name" 2>/dev/null || echo "000")
  if [ "$code" = "200" ]; then
    echo "      $name: HTTP $code OK"
  else
    echo "      $name: HTTP $code FAIL"
  fi
done
echo ""

echo "[4/4] Summary"
if [ "$HOME_CODE" = "200" ]; then
  echo "      Homepage: OK"
else
  echo "      Homepage: FAIL (HTTP $HOME_CODE)"
fi
ALL_200=true
for f in out/_next/static/media/2P9A9*.jpg; do
  [ -f "$f" ] || continue
  name=$(basename "$f")
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/_next/static/media/$name" 2>/dev/null)
  [ "$code" = "200" ] || ALL_200=false
done
if [ "$ALL_200" = true ] && [ "$HOME_CODE" = "200" ]; then
  echo "      Hero images:     OK (all 5 return 200)"
  echo ""
  echo "=============================================="
  echo "  All checks passed."
  echo "  Open in browser: http://localhost:$PORT"
  echo "  Stop server:     kill $SERVER_PID"
  echo "=============================================="
else
  echo "      Hero images:     One or more failed."
  echo ""
  echo "  Fix the failures above, then run this script again."
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi
