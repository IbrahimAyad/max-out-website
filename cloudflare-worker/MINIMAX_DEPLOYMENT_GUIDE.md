# Deployment Guide for Minimax

## Prerequisites
1. Node.js v20+ installed
2. Access to this repository

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env` file:
```env
CLOUDFLARE_ACCOUNT_ID=ea644c4a47a499ad4721449cbac587f4
SUPABASE_URL=https://gvcswimqaxvylgxbklbz.supabase.co
SUPABASE_SERVICE_KEY=[Contact admin for key]
```

### 3. Deploy Worker
```bash
npx wrangler deploy
```

## Testing Locally
```bash
npx wrangler dev
```

Worker will be available at: http://localhost:8787

## Updating the Worker

### Edit Main File
`src/index.js` - Contains all endpoints and logic

### Add New Endpoint
1. Add case in switch statement
2. Create handler function
3. Deploy with `npx wrangler deploy`

## Current Configuration
- **Worker Name**: kct-r2-supabase-sync
- **R2 Bucket**: kct-products
- **URL**: https://kct-r2-supabase-sync.kctmenswear.workers.dev

## Available Commands
```bash
# Deploy to production
npx wrangler deploy

# Test locally
npx wrangler dev

# View logs
npx wrangler tail

# Check worker status
npx wrangler whoami
```