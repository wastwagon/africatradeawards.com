# Port Configuration Fix - Coolify Settings

## Problem Identified

The deployment is failing with:
```
Bind for 0.0.0.0:80 failed: port is already allocated
```

This happens because:
1. **Coolify's Traefik** already uses port 80 on the host to route traffic
2. **Port Mappings** (`80:80`) try to bind container port 80 directly to host port 80
3. This creates a conflict - port 80 is already taken by Traefik

## Solution: Remove Direct Port Mapping

When using Coolify with Traefik (reverse proxy), you should **NOT** map ports directly to the host. Traefik handles routing internally.

### Step 1: Navigate to Advanced Settings

1. In Coolify dashboard, go to your application
2. Click on **"Configuration"** tab
3. In the left sidebar, click **"Advanced"**

### Step 2: Update Port Configuration

In the **"Network"** section:

1. **Ports Exposes** field:
   - **Change to**: `80`
   - This tells Coolify what port the container listens on internally

2. **Ports Mappings** field:
   - **Remove/Empty the field** (leave it blank or empty)
   - **OR** if you must have something: use `80` (internal only, no mapping)
   - **DO NOT** use `80:80` (this tries to bind to host port 80, causing conflict)

### Why This Works

- **Traefik** listens on host port 80 and routes to containers internally
- Container exposes port 80 internally (via EXPOSE in Dockerfile)
- Traefik discovers the container's port and routes traffic automatically
- No direct port mapping needed - Traefik handles it via Docker networking

### Step 3: Save and Redeploy

1. Click **"Save"** button
2. Click **"Redeploy"** button
3. Deployment should succeed

## Correct Configuration

### Coolify Advanced Settings:
```
Ports Exposes: 80
Ports Mappings: (empty/blank) OR just "80" without mapping
```

### Dockerfile:
```dockerfile
EXPOSE 80
```

### nginx.conf:
```nginx
listen 80;
server_name _;
```

### How It Works:
1. Container runs and nginx listens on port 80 **inside** the container
2. Dockerfile exposes port 80 (for Docker networking)
3. Traefik discovers the container and routes traffic from host:80 → container:80
4. No direct port binding conflict!

## Alternative: If Port Mapping is Required

If Coolify requires port mapping and won't let you leave it empty:

1. **Option 1**: Use a different internal mapping
   - Ports Mappings: `8080:80` (maps host 8080 to container 80)
   - Then configure Traefik to use port 8080 for this service
   - (Not recommended - complicates routing)

2. **Option 2**: Let Coolify auto-detect
   - Remove custom port mappings
   - Let Coolify's Traefik auto-discover from EXPOSE directive
   - (Recommended)

## Summary

✅ **Ports Exposes**: `80` (tells Coolify container listens on port 80)
❌ **Ports Mappings**: Remove/empty (don't bind directly to host port 80)
✅ **Dockerfile**: `EXPOSE 80`
✅ **nginx.conf**: `listen 80;`

The key is: **Don't map ports directly when using Traefik** - let Traefik handle routing automatically!
