# Coolify Setup Guide - Step by Step

## Current Configuration ✅

Based on your Coolify setup screen:
- **Repository URL**: `https://github.com/wastwagon/africatradeawards.com` ✅
- **Branch**: `main` ✅
- **Base Directory**: `/` ✅
- **Application Type**: Dockerfile ✅

## Important: Dockerfile Path Configuration

Since your Dockerfile is named `Dockerfile.static` (not `Dockerfile`), you need to specify this in Coolify.

### After Clicking "Continue":

1. **Look for "Dockerfile Path" or "Dockerfile" field**
   - Set it to: `Dockerfile.static`
   - This tells Coolify which Dockerfile to use

2. **Port Configuration**
   - Port: `80` (nginx serves on port 80)
   - Coolify should auto-detect this, but verify

3. **Environment Variables**
   - **No environment variables needed** for this static site
   - You can skip this section

4. **Build Settings** (if available)
   - Build command: (leave empty - handled in Dockerfile)
   - Start command: (leave empty - handled in Dockerfile)

5. **Health Check**
   - Should be automatically configured in the Dockerfile
   - Path: `/` (root)

## Quick Reference

### Dockerfile Details:
- **File**: `Dockerfile.static`
- **Build Process**: 
  1. Installs dependencies
  2. Compiles SCSS to CSS
  3. Builds Next.js static export
  4. Serves with nginx on port 80

### What Happens During Build:
1. Coolify clones your repository
2. Runs `docker build -f Dockerfile.static`
3. Builds the static site
4. Creates nginx container
5. Deploys and serves on port 80

## Troubleshooting

### If "Dockerfile Path" field is not visible:
- Coolify might look for `Dockerfile` by default
- You may need to rename `Dockerfile.static` to `Dockerfile` temporarily
- Or check Coolify's advanced settings

### Alternative: Rename Dockerfile
If Coolify doesn't support custom Dockerfile paths, you can:
```bash
# Rename the file (locally)
mv Dockerfile.static Dockerfile
git add Dockerfile
git rm Dockerfile.static
git commit -m "rename: Dockerfile.static to Dockerfile for Coolify"
git push
```

## Next Steps After Deployment

1. **Wait for build to complete** (usually 5-10 minutes)
2. **Check build logs** for any errors
3. **Access your site** via the provided URL
4. **Configure domain** (if you have one)
5. **SSL will be automatic** via Let's Encrypt

## Expected Build Output

You should see in the build logs:
- ✅ Installing dependencies
- ✅ Compiling SCSS
- ✅ Building Next.js static export
- ✅ Copying files to nginx
- ✅ Container started successfully

## Need Help?

If you encounter issues:
1. Check build logs in Coolify
2. Verify Dockerfile path is correct
3. Ensure repository is accessible
4. Check that all files are committed and pushed
