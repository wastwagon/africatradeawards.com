#!/bin/bash
# Verify publications purple theme is served. Run with: ./scripts/verify-publications-css.sh
# Optional: pass base URL, e.g. ./scripts/verify-publications-css.sh http://127.0.0.1:3003
BASE="${1:-http://127.0.0.1:3003}"
echo "Checking $BASE ..."
echo ""
echo "1. Publications page:"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/publications/")
echo "   HTTP $STATUS"
echo ""
echo "2. main.css publication accent (should be purple #4e2b5a):"
curl -sS "$BASE/assets/css/main.css" | grep -A1 "\.publication-card .publication-card-accent" | grep background || echo "   (rule not found)"
echo ""
echo "3. FOR IMMEDIATE RELEASE label color (should be #4e2b5a, not FFBA00):"
curl -sS "$BASE/assets/css/main.css" | grep -A6 "\.press-release-header .press-release-label" | grep color
echo ""
echo "4. Inline image style in press release (should exist):"
curl -sS "$BASE/assets/css/main.css" | grep -q "press-release-inline-image" && echo "   Found .press-release-inline-image" || echo "   Not found"
echo ""
echo "Done. If you see #4e2b5a above, the server is serving the purple theme."
