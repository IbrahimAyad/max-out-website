# R2 Worker API Access for Minimax

## Worker URL
```
https://kct-r2-supabase-sync.kctmenswear.workers.dev
```

## Available Endpoints

### 1. List All Images
```bash
GET https://kct-r2-supabase-sync.kctmenswear.workers.dev/list-images?limit=100
```

Returns all images in the R2 bucket with their URLs and metadata.

### 2. Find Bundle Images
```bash
GET https://kct-r2-supabase-sync.kctmenswear.workers.dev/find-bundle-images?search=bundle
```

Searches for bundle product images across various prefixes.

### 3. Get Bundle URLs
```bash
GET https://kct-r2-supabase-sync.kctmenswear.workers.dev/bundle-urls
```

Returns formatted URLs for all bundle products.

### 4. Sync to Supabase
```bash
POST https://kct-r2-supabase-sync.kctmenswear.workers.dev/sync-to-supabase
Content-Type: application/json

{
  "images": [
    {
      "path": "bundles/...",
      "productSlug": "product-name"
    }
  ]
}
```

### 5. Bulk Import
```bash
GET https://kct-r2-supabase-sync.kctmenswear.workers.dev/bulk-import
```

Imports all R2 images to Supabase database.

## Image URL Patterns

### Public R2 URLs
```
https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/{path}
```

### CDN URLs (when configured)
```
https://cdn.kctmenswear.com/{path}
```

## Current Bucket Structure
```
kct-products/
├── blazers/
│   ├── prom/
│   ├── sparkle/
│   ├── summer/
│   └── velvet/
├── menswear-accessories/
│   ├── suspender-bowtie-set/
│   └── vest-tie-set/
└── bundles/ (to be uploaded)
    └── august-2025/
        └── bundles-01/
```

## Integration Example (JavaScript)

```javascript
// Fetch all images
async function getAllImages() {
  const response = await fetch('https://kct-r2-supabase-sync.kctmenswear.workers.dev/list-images');
  const data = await response.json();
  return data.images;
}

// Find bundle images
async function findBundleImages() {
  const response = await fetch('https://kct-r2-supabase-sync.kctmenswear.workers.dev/find-bundle-images?search=bundle');
  const data = await response.json();
  return data.foundImages;
}

// Get bundle URLs for website
async function getBundleUrls() {
  const response = await fetch('https://kct-r2-supabase-sync.kctmenswear.workers.dev/bundle-urls');
  const data = await response.json();
  return data.urls;
}
```

## Notes
- CORS is enabled for all origins
- No authentication required (currently)
- Bundle images need to be uploaded to R2 first
- Worker automatically handles image path parsing and URL generation

## Support
If you need additional endpoints or modifications, the worker can be updated to support:
- Image upload to R2
- Image transformation (WebP conversion)
- Batch operations
- Custom URL patterns