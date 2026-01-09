# Deployment Checklist for Coolify

## Pre-Deployment Review

### ✅ Project Configuration
- [x] Next.js configured for static export (`output: 'export'` in `next.config.mjs`)
- [x] SCSS compilation included in build process
- [x] All assets properly referenced in `public/` directory
- [x] No server-side dependencies required

### ✅ Build Process
- [x] `package.json` build script includes `sass:build`
- [x] Static files export to `out/` directory
- [x] All dependencies listed in `package.json`

### ✅ Docker Configuration
- [x] `Dockerfile.static` created for nginx-based static serving
- [x] `nginx.conf` configured with proper routing and caching
- [x] `.dockerignore` excludes unnecessary files
- [x] Health checks configured

### ✅ Files Created
- [x] `Dockerfile.static` - Production Dockerfile for static site
- [x] `nginx.conf` - Nginx configuration for static serving
- [x] `.dockerignore` - Excludes build artifacts and dev files
- [x] `COOLIFY_DEPLOYMENT.md` - Deployment guide

### ✅ Files to Review/Remove
- [ ] `render.yaml` - Can be removed or kept for reference
- [ ] `Dockerfile` - Old Dockerfile (for Node.js server, not needed for static)
- [ ] `Dockerfile.dev` - Development Dockerfile (optional)
- [ ] `docker-compose.yml` - Can be removed if not using Docker Compose

## Coolify Setup Steps

1. **Connect Repository**
   - [ ] Add Git repository to Coolify
   - [ ] Select branch (usually `main`)

2. **Configure Application**
   - [ ] Choose "Dockerfile" deployment type
   - [ ] Set Dockerfile path: `Dockerfile.static`
   - [ ] Set port: `80` (or auto-detect)
   - [ ] No environment variables needed

3. **Domain Configuration**
   - [ ] Add your domain name
   - [ ] Configure DNS records
   - [ ] Enable SSL (automatic with Let's Encrypt)

4. **Deploy**
   - [ ] Trigger initial deployment
   - [ ] Monitor build logs
   - [ ] Verify site is accessible

5. **Post-Deployment**
   - [ ] Test all pages load correctly
   - [ ] Verify assets (images, CSS, JS) load
   - [ ] Check mobile responsiveness
   - [ ] Test form submissions (if any)
   - [ ] Verify SSL certificate is active

## Testing Checklist

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Images and logos display properly
- [ ] CSS styles are applied correctly
- [ ] JavaScript interactions work
- [ ] Mobile menu functions
- [ ] All pages are accessible
- [ ] 404 page works for invalid routes
- [ ] Performance is acceptable

## Rollback Plan

- [ ] Know how to access previous deployments in Coolify
- [ ] Have backup of working deployment
- [ ] Document any custom configurations

## Maintenance

- [ ] Set up monitoring/alerts in Coolify
- [ ] Configure automatic deployments (optional)
- [ ] Document any custom nginx rules needed
- [ ] Keep dependencies updated

## Notes

- The static site requires no runtime environment variables
- All assets are bundled in the `out` directory
- Nginx serves the site with optimized caching
- Health checks ensure automatic recovery
