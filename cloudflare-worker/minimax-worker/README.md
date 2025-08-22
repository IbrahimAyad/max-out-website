# KCT Minimax API Worker

A dedicated Cloudflare Worker for Minimax to access KCT Menswear data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Deploy the worker:
```bash
npm run deploy
```

## API Endpoints

### Base URL
```
https://kct-minimax-api.kctmenswear.workers.dev
```

### Available Endpoints

#### 1. Get All Products
```
GET /products
```
Returns all products from the database.

#### 2. Get Bundle Products
```
GET /products/bundles
```
Returns categorized bundle products.

#### 3. Search Products
```
GET /products/search?q=navy&category=suits
```
Search products by query and optional category.

#### 4. List All Images
```
GET /images
```
Returns all images from R2 bucket.

#### 5. Get Bundle Images
```
GET /images/bundles
```
Returns bundle-specific images.

#### 6. Customer Data Structure
```
GET /customer-data
```
Returns the database structure for customer profiles.

#### 7. Wedding Categories
```
GET /wedding-categories
```
Returns wedding-specific product categories and themes.

## Example Usage

### JavaScript/React
```javascript
// Get all products
const response = await fetch('https://kct-minimax-api.kctmenswear.workers.dev/products');
const data = await response.json();
console.log(data.products);

// Get wedding categories
const weddingResponse = await fetch('https://kct-minimax-api.kctmenswear.workers.dev/wedding-categories');
const categories = await weddingResponse.json();
console.log(categories);
```

### With Authentication (if enabled)
```javascript
const response = await fetch('https://kct-minimax-api.kctmenswear.workers.dev/products', {
  headers: {
    'X-API-Key': 'your-api-key-here'
  }
});
```

## Development

Run locally:
```bash
npm run dev
```

The worker will be available at `http://localhost:8787`

## Environment Variables

Set these in Cloudflare dashboard or wrangler.toml:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key (for Minimax)
- `CDN_URL` - CDN base URL for images

## Security Notes

- CORS is enabled for all origins
- Add API key authentication if needed
- Only read access to R2 bucket
- Uses Supabase anon key (limited permissions)