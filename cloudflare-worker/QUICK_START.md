# Quick Start Guide - R2 to Supabase Sync

## 5-Minute Setup

### Step 1: Install and Configure (2 min)

```bash
# Install Cloudflare CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Navigate to worker directory
cd cloudflare-worker
```

### Step 2: Get Your Credentials (1 min)

1. **Cloudflare Account ID**:
   - Go to: https://dash.cloudflare.com
   - Select any domain
   - Copy Account ID from right sidebar

2. **Supabase Service Key**:
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Settings → API → service_role key (starts with `eyJ...`)

### Step 3: Configure Worker (1 min)

Edit `wrangler.toml`:
```toml
account_id = "YOUR_ACCOUNT_ID_HERE"  # Replace this
```

Add Supabase key:
```bash
wrangler secret put SUPABASE_SERVICE_KEY
# Paste your service key when prompted
```

### Step 4: Deploy (1 min)

```bash
wrangler deploy
```

You'll get a URL like:
```
https://kct-r2-supabase-sync.YOUR-SUBDOMAIN.workers.dev
```

## Testing Your Setup

### Quick Test - List Images
```bash
curl https://your-worker-url.workers.dev/list-images
```

### Import All Images
```bash
curl -X POST https://your-worker-url.workers.dev/bulk-import
```

## What Happens Next?

The bulk import will:
1. ✅ Scan all images in your R2 bucket
2. ✅ Create products for new items
3. ✅ Link images to products
4. ✅ Set primary images
5. ✅ Update your Supabase database

Expected results:
- ~2,800 images processed
- ~600 products created/updated
- Complete in 2-3 minutes

## Monitor Progress

```bash
# Watch live logs
wrangler tail

# Or view in browser
# https://dash.cloudflare.com → Workers → Logs
```

## Troubleshooting

### "Authentication Error"
→ Check SUPABASE_SERVICE_KEY is set correctly

### "R2 Bucket Not Found"
→ Verify bucket name in wrangler.toml matches your R2 bucket

### "No Images Found"
→ Check images follow format: `category/subcategory/product/view.webp`

## Success Checklist

- [ ] Worker deployed successfully
- [ ] /list-images returns your R2 images
- [ ] /bulk-import creates products in Supabase
- [ ] Products appear in your admin panel

## Need Help?

1. Check worker logs: `wrangler tail`
2. Test single image first before bulk import
3. Verify Supabase tables exist (products, product_images)