# Fix: Awardee Images Not Showing on Production

## Why It Happens

- **Local (http://localhost:3003)** uses your current files, so images in `public/assets/img/awardees/` show.
- **Production (Coolify)** is built with **Docker**. Docker **caches** build steps. The step that copies your app (`COPY . .`) was likely cached from **before** the awardee images were in the repo, so the production image was built without those files.

Your repo and paths are correct: all 20 awardee images are tracked in Git and the app uses `/assets/img/awardees/...`.

## Fix: Force a Clean Rebuild in Coolify

You need one rebuild **without using the old cache**, so the new files are included.

### Option A: Rebuild without cache (recommended)

1. Open **Coolify** and go to your **africatradeawards.com** application.
2. Find the build/deploy settings (e.g. **Build**, **Deploy**, or **Configuration**).
3. Trigger a **clean rebuild**:
   - Look for **“Rebuild”**, **“Redeploy”**, or **“Build”**.
   - If there is **“Clear build cache”** or **“Rebuild without cache”**, use that, then start a new deploy.
   - Otherwise, start a **new deployment** and ensure Coolify is using the **latest commit** (where the awardee images exist).

### Option B: If Coolify has “Advanced” or “Build” options

1. In the application’s **Build** or **Advanced** section, look for:
   - **Build cache** → turn off or “Clear cache”, then deploy again, or  
   - **Docker build** → “No cache” / “Pull latest and rebuild”.
2. Save and run a new deployment.

After a **single** successful clean rebuild, the new image will include `public/assets/img/awardees/` and the awardee images will be served from `https://africatradeawards.com/assets/img/awardees/...`.

## Verify

1. **GitHub:** Confirm the 20 files exist under `public/assets/img/awardees/` in the repo (e.g. on GitHub).
2. **Production:** After redeploying, open:
   - `https://africatradeawards.com/awardees/`
   - Then try one image URL, e.g.  
     `https://africatradeawards.com/assets/img/awardees/prof-benedict-oramah.jpg`  
     It should load the image (not 404).
3. **Browser:** If it still looks old, do a hard refresh (e.g. Ctrl+Shift+R or Cmd+Shift+R) or test in an incognito window to avoid cache.

## Summary

- **Cause:** Production Docker image was built from a cached layer that didn’t include the awardee images.
- **Fix:** In Coolify, trigger one **rebuild without cache** (or clear build cache then deploy) so the new `public/assets/img/awardees/` files are included in the image.
- **No code changes required** – paths and repo are correct.
