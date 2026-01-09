# Bad Gateway Error - Fixed

## Problem
"Bad Gateway" error when accessing the application through Coolify.

## Root Cause
The `nginx.conf` had a restrictive `server_name` that only accepted specific domain names:
```
server_name africatradeawards.com www.africatradeawards.com;
```

When Coolify's reverse proxy forwards requests to the container, it uses internal hostnames (like `pkk0kgskogg848o4wwo4w444.31.97.57.75.sslip.io`), which didn't match the configured server_name, causing nginx to reject the requests.

## Solution
Changed `server_name` to accept any hostname:
```
server_name _;
```

The `_` is a catch-all that accepts any hostname. This is safe because:
- Coolify's reverse proxy handles domain routing
- Our nginx just needs to serve static files
- The domain names are still valid and work correctly

## Additional Troubleshooting Steps

If you still experience issues after deploying this fix:

### 1. Verify Port Configuration in Coolify
- Go to your application settings in Coolify
- Check the **Port** configuration
- Should be set to **80** (matching the Dockerfile EXPOSE)
- Coolify should auto-detect this, but verify it's correct

### 2. Check Container Status
In Coolify dashboard:
- Verify container is **Running** (not stopped or crashed)
- Check container logs for any errors
- Verify healthcheck is passing

### 3. Verify Domain Configuration
If using custom domain:
- DNS records must be correctly configured
- DNS propagation may take time (check with `dig africatradeawards.com`)
- Domain must be added in Coolify dashboard

### 4. Check Network Configuration
- Ensure container network is properly configured
- Verify Coolify's reverse proxy can reach the container
- Check firewall rules allow traffic on port 80

### 5. Test Direct Container Access (if possible)
If you have SSH access to the server:
```bash
# Check if container is running
docker ps | grep pkk0kgskogg848o4wwo4w444

# Check container logs
docker logs <container-name>

# Test nginx directly (if port is exposed)
curl http://localhost:80
```

## Deployment

After fixing `nginx.conf`, commit and push:
```bash
git add nginx.conf
git commit -m "fix: allow any hostname in nginx for Coolify reverse proxy"
git push
```

Coolify will automatically redeploy, and the Bad Gateway error should be resolved.

## Why This Works

- **Before**: Nginx only accepted requests with Host header matching `africatradeawards.com` or `www.africatradeawards.com`
- **After**: Nginx accepts requests with any Host header (using `_` catch-all)
- **Coolify**: Routes traffic based on domain at the reverse proxy level, then forwards to container with internal hostname
- **Result**: Container accepts all requests, Coolify handles domain routing

## Notes

- The domain names `africatradeawards.com` and `www.africatradeawards.com` will still work correctly
- SSL/HTTPS is handled by Coolify's reverse proxy, not by nginx in the container
- This is the standard configuration for containerized applications behind a reverse proxy
