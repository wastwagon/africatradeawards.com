# Domain Setup Guide for africatradeawards.com

This guide will help you configure your custom domain `africatradeawards.com` and `www.africatradeawards.com` in Coolify.

## Step 1: Configure Domain in Coolify Dashboard

1. **Navigate to Your Application**
   - Go to your Coolify dashboard
   - Select your application: `africatradeawards.com` (or the current app name)

2. **Access Domain Settings**
   - Click on your application
   - Look for "Domains" or "Domain Configuration" section
   - Click "Add Domain" or "Configure Domain"

3. **Add Your Domains**
   - **Primary Domain**: `africatradeawards.com`
   - **WWW Domain**: `www.africatradeawards.com`
   - Add both domains in the domain configuration

4. **Enable SSL/HTTPS**
   - Coolify will automatically provision SSL certificates via Let's Encrypt
   - Ensure "Enable SSL" or "Auto SSL" is checked
   - This will provide HTTPS for both domains

## Step 2: Configure DNS Records

You need to add DNS records at your domain registrar (where you purchased `africatradeawards.com`).

### DNS Records to Add:

1. **A Record** (for non-www domain):
   ```
   Type: A
   Name: @ (or africatradeawards.com)
   Value: [Your Coolify Server IP Address]
   TTL: 3600 (or default)
   ```

2. **CNAME Record** (for www subdomain):
   ```
   Type: CNAME
   Name: www
   Value: africatradeawards.com (or your Coolify server IP)
   TTL: 3600 (or default)
   ```

   **OR** if Coolify requires it:
   ```
   Type: A
   Name: www
   Value: [Your Coolify Server IP Address]
   TTL: 3600 (or default)
   ```

### Finding Your Coolify Server IP:

- Check your Coolify server IP address
- It should be displayed in Coolify dashboard under "Server" or "Infrastructure"
- Or check your VPS/server provider dashboard

## Step 3: Verify DNS Propagation

After adding DNS records, verify they're working:

```bash
# Check A record for main domain
dig africatradeawards.com +short

# Check www subdomain
dig www.africatradeawards.com +short

# Or use online tools:
# - https://dnschecker.org
# - https://www.whatsmydns.net
```

DNS propagation can take anywhere from a few minutes to 48 hours, but typically completes within 1-2 hours.

## Step 4: SSL Certificate Provisioning

Once DNS records are properly configured:

1. **Wait for DNS Propagation** (5 minutes to 2 hours)
2. **Trigger SSL Certificate Request**:
   - In Coolify, go to your application
   - Look for "SSL" or "Certificate" section
   - Click "Request Certificate" or "Generate SSL"
   - Coolify will automatically request certificates from Let's Encrypt

3. **Verify SSL Status**:
   - Check that both domains show as "Active" or "Valid"
   - Wait a few minutes for certificate provisioning (usually 1-5 minutes)

## Step 5: Test Your Domains

After DNS and SSL are configured:

1. **Test HTTPS Access**:
   - Visit: `https://africatradeawards.com`
   - Visit: `https://www.africatradeawards.com`
   - Both should load with valid SSL certificates

2. **Test WWW Redirect** (if configured):
   - Coolify may automatically redirect www to non-www (or vice versa)
   - Test both URLs to ensure they work

## Step 6: Update Application (If Needed)

The application code already references your domain:
- ✅ Footer already links to `https://www.africatradeawards.com`
- ✅ Contact email uses `secretariat@africatradeawards.com`
- ✅ Nginx configuration updated to accept both domains

## Troubleshooting

### Domain Not Resolving

1. **Check DNS Records**:
   ```bash
   dig africatradeawards.com
   dig www.africatradeawards.com
   ```

2. **Verify IP Address**: Ensure DNS points to correct Coolify server IP

3. **Check DNS Propagation**: Use dnschecker.org to verify globally

### SSL Certificate Issues

1. **Certificate Not Provisioning**:
   - Ensure DNS records are correct and propagated
   - Check that port 80 and 443 are open on your server
   - Verify domain ownership in Coolify

2. **Certificate Expired**:
   - Coolify should auto-renew, but check renewal settings
   - Manual renewal: Request new certificate in Coolify

### WWW Redirect Not Working

1. **Check Coolify Redirect Settings**:
   - Some Coolify versions allow you to set redirect preferences
   - Check if you want www → non-www or non-www → www

2. **Manual Nginx Redirect** (if needed):
   - We can add redirect rules in nginx.conf if needed

## Current Configuration Status

✅ **Codebase**: Already references `africatradeawards.com`
✅ **Nginx Config**: Updated to accept both domains
✅ **Dockerfile**: No changes needed
✅ **Next.js Config**: No changes needed

## Next Steps

1. Configure domains in Coolify dashboard (Step 1)
2. Add DNS records at your registrar (Step 2)
3. Wait for DNS propagation and SSL provisioning (Steps 3-4)
4. Test both domains (Step 5)

## Support

If you encounter issues:
- Check Coolify logs for domain/SSL errors
- Verify DNS records are correct
- Ensure firewall allows ports 80 and 443
- Check Coolify documentation for your version
