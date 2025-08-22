# R2 Bucket Migration Guide

## Overview
This enhanced worker can now migrate images between R2 buckets in addition to syncing with Supabase.

## Setup for Migration

### 1. Create Destination Bucket
First, create your destination R2 bucket in Cloudflare Dashboard:
1. Go to R2 → Create Bucket
2. Name it (e.g., `kct-products-new`)

### 2. Update Configuration
Edit `wrangler-migration.toml`:
```toml
# Change destination bucket name
[[r2_buckets]]
binding = "DEST_BUCKET"
bucket_name = "your-destination-bucket-name"  # Update this
```

### 3. Deploy Migration Worker
```bash
# Deploy with migration config
wrangler deploy -c wrangler-migration.toml
```

## Migration Endpoints

### 1. Copy Single Image
```bash
curl -X POST https://kct-migration.workers.dev/migrate/copy \
  -H "Content-Type: application/json" \
  -d '{
    "sourcePath": "blazers/wedding/classic-tuxedo/front.webp",
    "destinationPath": "blazers/wedding/classic-tuxedo/front.webp"
  }'
```

### 2. Move Single Image (Copy + Delete)
```bash
curl -X POST https://kct-migration.workers.dev/migrate/move \
  -H "Content-Type: application/json" \
  -d '{
    "sourcePath": "blazers/wedding/classic-tuxedo/front.webp",
    "destinationPath": "new-path/front.webp"
  }'
```

### 3. Bulk Copy All Images
```bash
# Copy everything
curl -X POST https://kct-migration.workers.dev/migrate/bulk-copy \
  -H "Content-Type: application/json" \
  -d '{
    "prefix": "",
    "batchSize": 50,
    "continueOnError": true
  }'

# Copy specific category only
curl -X POST https://kct-migration.workers.dev/migrate/bulk-copy \
  -H "Content-Type: application/json" \
  -d '{
    "prefix": "blazers/",
    "batchSize": 50
  }'
```

### 4. Bulk Move All Images
⚠️ **WARNING**: This will DELETE from source after copying!
```bash
curl -X POST https://kct-migration.workers.dev/migrate/bulk-move \
  -H "Content-Type: application/json" \
  -d '{
    "prefix": "",
    "batchSize": 50
  }'
```

### 5. Check Migration Status
```bash
curl -X POST https://kct-migration.workers.dev/migrate/status \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 6. List Configured Buckets
```bash
curl https://kct-migration.workers.dev/migrate/list-buckets
```

## Migration Strategies

### Strategy 1: Safe Copy First
1. **Copy all images** to new bucket
2. **Verify** everything copied correctly
3. **Update** your CDN/application to point to new bucket
4. **Delete** old bucket when confirmed working

```bash
# Step 1: Copy all
curl -X POST https://your-worker.workers.dev/migrate/bulk-copy \
  -d '{"continueOnError": true}'

# Step 2: Verify
curl -X POST https://your-worker.workers.dev/migrate/status

# Step 3: Update your app configuration
# Step 4: Delete old bucket manually in Cloudflare Dashboard
```

### Strategy 2: Incremental Migration
Migrate by category to minimize risk:

```bash
# Migrate blazers first
curl -X POST https://your-worker.workers.dev/migrate/bulk-copy \
  -d '{"prefix": "blazers/"}'

# Then suits
curl -X POST https://your-worker.workers.dev/migrate/bulk-copy \
  -d '{"prefix": "suits/"}'

# Continue for each category...
```

### Strategy 3: Direct Move (Risky)
Only if you're confident and have backups:

```bash
# Move everything at once
curl -X POST https://your-worker.workers.dev/migrate/bulk-move \
  -d '{"batchSize": 100}'
```

## Features

### Batch Processing
- Processes images in configurable batch sizes
- Default: 50 images at a time
- Prevents timeouts for large migrations

### Error Handling
- `continueOnError: true` - Skip failed files and continue
- `continueOnError: false` - Stop on first error
- All errors are logged in response

### Duplicate Detection
- Automatically skips files that already exist with same size
- Overwrites if sizes differ

### Metadata Preservation
- Preserves all R2 metadata during copy
- Includes custom metadata and HTTP headers

## Monitoring Progress

### Watch Live Logs
```bash
wrangler tail -c wrangler-migration.toml
```

### Check Progress
```bash
# See how many files in each bucket
curl -X POST https://your-worker.workers.dev/migrate/status
```

## Example: Complete Migration

```bash
# 1. Deploy migration worker
wrangler deploy -c wrangler-migration.toml

# 2. Check current status
curl -X POST https://kct-migration.workers.dev/migrate/status

# 3. Copy all images (safe, non-destructive)
curl -X POST https://kct-migration.workers.dev/migrate/bulk-copy \
  -d '{"batchSize": 100, "continueOnError": true}'

# 4. Verify migration
curl -X POST https://kct-migration.workers.dev/migrate/status

# Response will show:
# {
#   "source": {
#     "estimatedCount": "2847",
#     "sample": [...]
#   },
#   "destination": {
#     "estimatedCount": "2847",
#     "sample": [...]
#   }
# }
```

## Cost Considerations

### R2 Pricing (as of 2024)
- **Storage**: $0.015 per GB/month
- **Class A operations** (write): $4.50 per million
- **Class B operations** (read): $0.36 per million

### Migration Costs
- Copying 2,847 images ≈ 5,694 operations
- Estimated cost: < $0.03

## Rollback Plan

If something goes wrong:
1. Original bucket remains untouched (if using copy)
2. Re-run with different parameters
3. Worker automatically skips already-migrated files

## Security Notes

- Worker requires access to both buckets
- Uses Cloudflare's internal network (fast & free)
- No data leaves Cloudflare's infrastructure
- All operations are logged

## Troubleshooting

### "Destination bucket not configured"
- Check `wrangler-migration.toml` has correct bucket name
- Ensure bucket exists in your Cloudflare account

### "Timeout" errors
- Reduce `batchSize` (try 25 instead of 50)
- Use prefix to migrate in smaller chunks

### "Permission denied"
- Verify Account ID is correct
- Check bucket names match exactly

## Next Steps

After successful migration:
1. Update your application to use new bucket
2. Update CDN configuration if needed
3. Test thoroughly
4. Delete old bucket (after confirmation)