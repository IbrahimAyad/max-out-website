# Migration & Rename Usage Guide

## Your Current Script Analysis

✅ **Good Features:**
- Migration between buckets (copy/move)
- Batch rename capabilities
- Multiple rename patterns
- Dry run mode for testing
- Metadata preservation

⚠️ **Required Setup:**
1. Create destination bucket in Cloudflare R2
2. Update `wrangler.toml` with destination bucket name
3. Redeploy the worker

## Setup Steps

### 1. Create Destination Bucket
Go to Cloudflare Dashboard → R2 → Create Bucket
Name it: `kct-products-migrated` (or your preferred name)

### 2. Update Configuration
Edit `wrangler.toml` and change:
```toml
[[r2_buckets]]
binding = "R2_BUCKET_DESTINATION"
bucket_name = "your-actual-destination-bucket-name"  # Update this!
```

### 3. Redeploy
```bash
source ~/.nvm/nvm.sh && nvm use 20
wrangler deploy
```

## Migration Examples

### 1. Copy Images (Keep Originals)
```bash
# Copy all images
curl "https://your-worker.workers.dev/migrate?mode=copy"

# Copy specific category
curl "https://your-worker.workers.dev/migrate?mode=copy&prefix=blazers/"

# Copy with limit
curl "https://your-worker.workers.dev/migrate?mode=copy&limit=100"
```

### 2. Move Images (Delete Originals)
```bash
# Move all images
curl "https://your-worker.workers.dev/migrate?mode=move"

# Move specific category
curl "https://your-worker.workers.dev/migrate?mode=move&prefix=suits/"
```

### 3. Migrate with Renaming
```bash
# Standardize all paths to lowercase
curl "https://your-worker.workers.dev/migrate?mode=copy&rename=standardize"

# Remove spaces from filenames
curl "https://your-worker.workers.dev/migrate?mode=copy&rename=remove-spaces"

# Clean special characters
curl "https://your-worker.workers.dev/migrate?mode=copy&rename=clean-special-chars"
```

## Rename Patterns Available

### `standardize`
Converts to: `category/subcategory/product-slug/view.webp`
- All lowercase
- Consistent structure
- WebP format

**Before:** `Blazers/Wedding/Mens-Black-Tuxedo/FRONT.jpg`
**After:** `blazers/wedding/mens-black-tuxedo/front.webp`

### `lowercase`
Converts entire path to lowercase

**Before:** `Blazers/Wedding/Classic-Tuxedo/Front.webp`
**After:** `blazers/wedding/classic-tuxedo/front.webp`

### `remove-spaces`
Replaces spaces with hyphens

**Before:** `blazers/wedding/classic black tuxedo/front view.webp`
**After:** `blazers/wedding/classic-black-tuxedo/front-view.webp`

### `clean-special-chars`
Removes special characters

**Before:** `blazers/wedding/tuxedo@2024!/front#1.webp`
**After:** `blazers/wedding/tuxedo2024/front1.webp`

### `add-prefix`
Adds version prefix to filename

**Before:** `blazers/wedding/tuxedo/front.webp`
**After:** `blazers/wedding/tuxedo/v2-front.webp`

### `organize-by-date`
Reorganizes by year/month

**Before:** `blazers/wedding/tuxedo/front.webp`
**After:** `2024/08/blazers/wedding/tuxedo/front.webp`

### `flatten`
Flattens directory structure

**Before:** `blazers/wedding/tuxedo/front.webp`
**After:** `blazers-wedding-tuxedo-front.webp`

## Batch Rename (In-Place)

### Test with Dry Run First
```bash
curl -X POST https://your-worker.workers.dev/batch-rename \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "standardize",
    "prefix": "blazers/",
    "dryRun": true
  }'
```

### Apply Rename
```bash
curl -X POST https://your-worker.workers.dev/batch-rename \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "standardize",
    "prefix": "blazers/",
    "dryRun": false
  }'
```

## Check Migration Status
```bash
curl https://your-worker.workers.dev/migrate-status
```

Response:
```json
{
  "source": {
    "bucket": "kct-products",
    "connected": true,
    "sampleObject": "blazers/wedding/tuxedo/front.webp"
  },
  "destination": {
    "bucket": "kct-products-migrated",
    "connected": true,
    "sampleObject": "blazers/wedding/tuxedo/front.webp"
  },
  "lastMigration": {
    "migrated": 1500,
    "failed": 0,
    "renamed": 1500
  }
}
```

## Best Practices

### 1. Always Test First
- Use `dryRun: true` for batch renames
- Test with small `prefix` before full migration
- Check `/migrate-status` after operations

### 2. Migration Strategy
```bash
# Step 1: Test with one category
curl "https://your-worker.workers.dev/migrate?mode=copy&prefix=accessories/&limit=10"

# Step 2: Check results
curl https://your-worker.workers.dev/migrate-status

# Step 3: Full migration
curl "https://your-worker.workers.dev/migrate?mode=copy&rename=standardize"
```

### 3. Handle Pagination
If you have >1000 images, use the cursor:
```bash
# First batch
curl "https://your-worker.workers.dev/migrate?mode=copy&limit=1000"
# Returns: { "nextCursor": "abc123", "hasMore": true }

# Next batch
curl "https://your-worker.workers.dev/migrate?mode=copy&limit=1000&cursor=abc123"
```

## Troubleshooting

### "Destination bucket not configured"
- Check `wrangler.toml` has `R2_BUCKET_DESTINATION`
- Ensure bucket exists in R2
- Redeploy after changes: `wrangler deploy`

### "Migration failed"
- Check worker logs: `wrangler tail`
- Verify bucket permissions
- Try smaller batches with `limit` parameter

### Tracking Progress
For large migrations, monitor in real-time:
```bash
# Terminal 1: Start migration
curl "https://your-worker.workers.dev/migrate?mode=copy"

# Terminal 2: Watch logs
wrangler tail

# Terminal 3: Check status periodically
watch -n 5 'curl -s https://your-worker.workers.dev/migrate-status | jq'
```

## Cost Estimates

For 2,847 images:
- **Copy operations**: ~2,847 Class A writes = $0.01
- **Move operations**: ~5,694 operations (read + write) = $0.03
- **Storage**: Temporarily double if copying = ~$0.05/month

Total cost: < $0.10 for complete migration

## Recovery

If migration fails midway:
- Original files remain intact (if using copy mode)
- Re-run with same parameters - duplicates are skipped
- Use `prefix` to resume from specific point