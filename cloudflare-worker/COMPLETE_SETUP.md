# Complete Cloudflare Worker Setup Guide

## Prerequisites ✅
- ✅ Node.js v20 installed (we've done this)
- ✅ Wrangler installed (v4.30.0)
- ✅ Worker files created

## Step-by-Step Setup

### 1. Open Terminal and Navigate to Worker Directory
```bash
cd /Users/ibrahim/Desktop/Super-Admin/cloudflare-worker
```

### 2. Ensure Node v20 is Active
```bash
source ~/.nvm/nvm.sh && nvm use 20
```

### 3. Login to Cloudflare
```bash
wrangler login
```
This will:
- Open your browser
- Ask you to login to Cloudflare
- Grant permissions to Wrangler
- Show "Successfully logged in" when complete

### 4. Get Your Cloudflare Account ID
1. Go to: https://dash.cloudflare.com
2. Click on any domain you have
3. Look at the right sidebar
4. Copy the "Account ID" (looks like: `a1b2c3d4e5f6...`)

### 5. Update Configuration
Edit `wrangler.toml` and replace `YOUR_CLOUDFLARE_ACCOUNT_ID` with your actual Account ID:

```toml
account_id = "a1b2c3d4e5f6..."  # Your actual Account ID
```

Or use this command to update it automatically:
```bash
ACCOUNT_ID="your_account_id_here"
sed -i '' "s/YOUR_CLOUDFLARE_ACCOUNT_ID/$ACCOUNT_ID/" wrangler.toml
```

### 6. Add Supabase Service Key
Get your service key from Supabase:
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy the `service_role` key (starts with `eyJ...`)

Add it to your worker:
```bash
wrangler secret put SUPABASE_SERVICE_KEY
```
When prompted, paste your service key and press Enter.

### 7. Deploy the Worker
```bash
wrangler deploy
```

You'll see output like:
```
Uploading Worker...
Worker uploaded successfully!
Published kct-r2-supabase-sync
  https://kct-r2-supabase-sync.YOUR-SUBDOMAIN.workers.dev
```

## Testing Your Deployment

### Test 1: List R2 Images
```bash
curl https://kct-r2-supabase-sync.YOUR-SUBDOMAIN.workers.dev/list-images
```

Expected response:
```json
{
  "total": 2847,
  "images": [...]
}
```

### Test 2: Verify Image URLs
```bash
curl https://kct-r2-supabase-sync.YOUR-SUBDOMAIN.workers.dev/verify-images
```

### Test 3: Import All Images (The Big One!)
```bash
curl -X POST https://kct-r2-supabase-sync.YOUR-SUBDOMAIN.workers.dev/bulk-import
```

This will:
- Scan all 2,800+ images in R2
- Create ~600 products in Supabase
- Link all images to products
- Complete in 2-3 minutes

## Monitor Progress
```bash
# Watch live logs
wrangler tail

# Or check in Cloudflare Dashboard
# Workers & Pages → kct-r2-supabase-sync → Logs
```

## Troubleshooting

### "Not logged in"
Run `wrangler login` again and complete browser auth

### "Account ID not found"
Double-check the Account ID in wrangler.toml

### "Authentication error" from Supabase
Verify your service key with:
```bash
wrangler secret list
```

### "R2 bucket not found"
Check that your R2 bucket is named exactly `kct-products`

## Quick Commands Reference

```bash
# Check deployment status
wrangler deployments list

# View live logs
wrangler tail

# Update the worker
wrangler deploy

# Delete and redeploy (if needed)
wrangler delete
wrangler deploy
```

## Success Checklist

- [ ] Logged into Cloudflare via wrangler
- [ ] Account ID added to wrangler.toml
- [ ] Supabase service key added as secret
- [ ] Worker deployed successfully
- [ ] /list-images endpoint works
- [ ] Bulk import completed

## Next Steps

1. **Set up automatic sync** (optional):
   - Go to R2 bucket settings
   - Add webhook for new uploads
   - Point to: `https://your-worker.workers.dev/webhook/r2-upload`

2. **Add to admin panel**:
   - Add "Sync Images" button
   - Call bulk-import endpoint
   - Show progress to users

---

Need help? The worker URL will be shown after deployment.
Make sure to save it!