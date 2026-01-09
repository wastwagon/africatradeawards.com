# Coolify Deployment Guide for Africa Trade Awards

This guide will help you deploy the Africa Trade Awards static website to your VPS using Coolify.

## Prerequisites

- VPS with Coolify installed and configured
- Git repository access
- Domain name (optional but recommended)

## Deployment Steps

### Option 1: Using Dockerfile (Recommended)

1. **In Coolify Dashboard:**
   - Click "New Resource" → "Docker Compose" or "Dockerfile"
   - Connect your Git repository
   - Set the following:
     - **Dockerfile Path**: `Dockerfile.static`
     - **Port**: `80` (or let Coolify auto-detect)
     - **Build Command**: (leave empty, handled in Dockerfile)
     - **Start Command**: (leave empty, handled in Dockerfile)

2. **Environment Variables:**
   - No environment variables required for static site
   - You can add `NEXT_TELEMETRY_DISABLED=1` if desired

3. **Deploy:**
   - Click "Deploy" and wait for the build to complete
   - The site will be available at your configured domain or IP

### Option 2: Using Build Pack (Alternative)

If Coolify supports build packs:

1. **In Coolify Dashboard:**
   - Select "Static Site" as the application type
   - Connect your Git repository
   - Set **Build Command**: `npm install && npm run sass:build && npm run build`
   - Set **Publish Directory**: `out`
   - Set **Port**: `80` or `3000` (depending on Coolify's static site server)

### Build Process

The build process includes:
1. Installing Node.js dependencies
2. Compiling SCSS to CSS (`npm run sass:build`)
3. Building Next.js static export (`npm run build`)
4. Serving the `out` directory with Nginx

## Post-Deployment

### SSL/HTTPS Setup

Coolify should automatically handle SSL certificates via Let's Encrypt if you've configured a domain.

### Custom Domain

1. In Coolify, go to your application settings
2. Add your domain name
3. Configure DNS records as instructed by Coolify
4. SSL will be automatically provisioned

### Health Checks

The Dockerfile includes a health check that monitors the nginx server. Coolify will automatically restart the container if it becomes unhealthy.

## Troubleshooting

### Build Fails

- Check that `sass` is installed: `npm list sass`
- Verify SCSS files are present in `public/assets/scss/`
- Check build logs in Coolify dashboard

### 404 Errors

- Ensure `trailingSlash: true` is set in `next.config.mjs`
- Verify nginx configuration is correct
- Check that `out` directory contains all files

### Assets Not Loading

- Verify `public/assets/` directory is copied correctly
- Check nginx configuration for static file serving
- Clear browser cache

## File Structure

```
out/                    # Static export output (served by nginx)
├── index.html
├── about/
├── awards-structure/
├── assets/
└── ...
```

## Performance Optimization

The nginx configuration includes:
- Gzip compression for text files
- Long-term caching for static assets (1 year)
- Security headers
- Proper 404 handling

## Monitoring

Monitor your deployment through:
- Coolify dashboard logs
- Application health checks
- Server resource usage

## Rollback

If you need to rollback:
1. Go to Coolify dashboard
2. Select your application
3. Use the "Rollback" feature to previous deployment

## Support

For issues specific to:
- **Coolify**: Check Coolify documentation
- **Next.js Build**: Check Next.js static export documentation
- **Nginx**: Check nginx configuration logs
