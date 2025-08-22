# Cloudflare Worker - R2 to Supabase Image Sync

This Cloudflare Worker automatically syncs product images from your R2 bucket to your Supabase database.

## Features

- **List all R2 images** - Scan and catalog all images in your bucket
- **Automatic sync** - Create/update products and images in Supabase
- **Webhook support** - Auto-sync when new images are uploaded
- **Image verification** - Check and fix broken image URLs
- **Bulk import** - Import all existing R2 images at once

## Setup Instructions

### 1. Prerequisites

- Cloudflare account with R2 enabled
- Supabase project with products and product_images tables
- Node.js and npm installed locally

### 2. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 3. Configure the Worker

1. Clone or create the worker directory:
```bash
mkdir cloudflare-worker
cd cloudflare-worker
```

2. Update `wrangler.toml` with your account ID:
```toml
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
```

To find your account ID:
- Log into Cloudflare Dashboard
- Go to any domain
- Right sidebar shows "Account ID"

### 4. Set up Secrets

Add your Supabase service role key:

```bash
wrangler secret put SUPABASE_SERVICE_KEY
```

When prompted, paste your service role key from:
- Supabase Dashboard → Settings → API
- Use the "service_role" key (not anon key)

### 5. Deploy the Worker

```bash
# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy
```

Your worker will be available at:
```
https://kct-r2-supabase-sync.<your-subdomain>.workers.dev
```

## API Endpoints

### List All Images
```bash
GET /list-images

# Response:
{
  "total": 2847,
  "images": [
    {
      "path": "blazers/wedding/classic-black-tuxedo/front.webp",
      "url": "https://cdn.kctmenswear.com/blazers/wedding/classic-black-tuxedo/front.webp",
      "category": "blazers",
      "subcategory": "wedding",
      "productSlug": "classic-black-tuxedo",
      "view": "front",
      "size": 234567,
      "uploaded": "2024-01-15T..."
    }
  ]
}
```

### Bulk Import All Images
```bash
POST /bulk-import

# This will:
# 1. Scan all images in R2
# 2. Create products if they don't exist
# 3. Link all images to products
# 4. Update primary_image fields

# Response:
{
  "totalProducts": 615,
  "totalImages": 2847,
  "synced": [...],
  "failed": [...]
}
```

### Sync Specific Images
```bash
POST /sync-to-supabase
Content-Type: application/json

{
  "images": [
    {
      "path": "blazers/wedding/classic-black-tuxedo/front.webp",
      "category": "blazers",
      "subcategory": "wedding",
      "productSlug": "classic-black-tuxedo",
      "view": "front"
    }
  ],
  "updateExisting": true
}
```

### Verify Image URLs
```bash
GET /verify-images

# Checks all image URLs in database
# Automatically fixes broken URLs if image exists in R2

# Response:
{
  "total": 2847,
  "valid": [...],
  "invalid": [...],
  "fixed": [...]
}
```

## Automatic Webhook Setup (Optional)

To automatically sync new R2 uploads:

1. In Cloudflare Dashboard → R2 → Your Bucket → Settings
2. Add Event Notification:
   - Event types: Object Create
   - Destination: HTTP Webhook
   - URL: `https://your-worker.workers.dev/webhook/r2-upload`

Now every new image upload will automatically sync to Supabase!

## Testing Locally

```bash
# Start local development server
wrangler dev

# Test endpoints locally
curl http://localhost:8787/list-images
```

## Monitoring

View logs and metrics:
```bash
# Stream live logs
wrangler tail

# View in dashboard
# Cloudflare Dashboard → Workers → kct-r2-supabase-sync → Logs
```

## Troubleshooting

### Worker not deploying
- Check account_id in wrangler.toml
- Ensure you're logged in: `wrangler login`

### Images not syncing
- Verify R2 bucket name matches in wrangler.toml
- Check SUPABASE_SERVICE_KEY is set correctly
- Ensure image paths follow format: `category/subcategory/product-slug/view.webp`

### Database errors
- Verify Supabase tables exist (products, product_images)
- Check service role key has proper permissions
- Ensure column names match (primary_image, not image_url)

## Cost Optimization

- Workers: 100,000 requests/day free
- R2: 10GB storage free, 1M Class A operations/month free
- Supabase: 500MB database free

This setup should be free for most use cases!

## Support

For issues or questions:
1. Check worker logs: `wrangler tail`
2. Verify R2 bucket permissions
3. Test with single image first before bulk import