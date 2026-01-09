#!/bin/bash

# Test script to verify deployment readiness
set -e

echo "=== Testing Deployment Readiness ==="
echo ""

# 1. Check Next.js config
echo "1. Checking next.config.mjs..."
if grep -q "output: 'export'" next.config.mjs; then
    echo "   ✓ next.config.mjs has output: 'export'"
else
    echo "   ✗ ERROR: next.config.mjs does not have output: 'export'"
    exit 1
fi

# 2. Check Dockerfile
echo "2. Checking Dockerfile..."
if grep -q "RUN apk add --no-cache wget" Dockerfile; then
    echo "   ✓ Dockerfile installs wget for healthcheck"
else
    echo "   ✗ ERROR: Dockerfile does not install wget"
    exit 1
fi

if grep -q "COPY --from=builder /app/out" Dockerfile; then
    echo "   ✓ Dockerfile copies from /app/out"
else
    echo "   ✗ ERROR: Dockerfile does not copy from /app/out"
    exit 1
fi

# 3. Check nginx.conf
echo "3. Checking nginx.conf..."
if grep -q "listen 80" nginx.conf; then
    echo "   ✓ nginx.conf listens on port 80"
else
    echo "   ✗ ERROR: nginx.conf does not listen on port 80"
    exit 1
fi

if grep -q "root /usr/share/nginx/html" nginx.conf; then
    echo "   ✓ nginx.conf has correct root directory"
else
    echo "   ✗ ERROR: nginx.conf root directory incorrect"
    exit 1
fi

# 4. Test build
echo "4. Testing Next.js build..."
if npm run build 2>&1 | grep -q "Generating static pages"; then
    echo "   ✓ Next.js build completed successfully"
else
    echo "   ✗ ERROR: Next.js build failed"
    exit 1
fi

# 5. Check output directory
echo "5. Checking output directory..."
if [ -d "out" ] && [ -f "out/index.html" ]; then
    echo "   ✓ out directory exists with index.html"
    echo "   ✓ Found $(find out -type f | wc -l | xargs) files in out directory"
else
    echo "   ✗ ERROR: out directory or index.html missing"
    exit 1
fi

# 6. Verify package.json build script
echo "6. Checking package.json..."
if grep -q "\"build\": \"npm run sass:build && next build\"" package.json; then
    echo "   ✓ package.json build script includes sass:build"
else
    echo "   ✗ ERROR: package.json build script missing sass:build"
    exit 1
fi

echo ""
echo "=== All checks passed! ==="
echo ""
echo "The application is ready for deployment to Coolify."
echo ""
echo "Summary of fixes applied:"
echo "  ✓ next.config.mjs configured for static export"
echo "  ✓ Dockerfile installs wget for healthcheck"
echo "  ✓ Dockerfile healthcheck has 10s start period"
echo "  ✓ Build process creates /app/out directory"
echo "  ✓ nginx.conf properly configured for static files"
echo ""
