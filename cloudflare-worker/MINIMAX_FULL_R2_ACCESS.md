# Full R2 Access for Minimax

## Option 1: Use Cloudflare Dashboard (Recommended)

### Give Minimax Direct R2 Access:
1. Go to Cloudflare Dashboard → R2
2. Click on your bucket (`kct-products`)
3. Go to Settings → Public Access
4. Enable public access if needed
5. Go to R2 API Tokens
6. Create new API token with:
   - **Permission**: Admin Read & Write
   - **Specify bucket**: All buckets in account
   - **TTL**: Set expiration as needed

### Share with Minimax:
- **Account ID**: `ea644c4a47a499ad4721449cbac587f4`
- **Access Key ID**: [Generated from dashboard]
- **Secret Access Key**: [Generated from dashboard]
- **R2 Endpoint**: `https://ea644c4a47a499ad4721449cbac587f4.r2.cloudflarestorage.com`

## Option 2: Deploy Admin Worker

### 1. Deploy the R2 Admin Worker
```bash
cd minimax-worker
npm install
npx wrangler deploy src/r2-admin.js --name kct-r2-admin
```

### 2. Worker will be available at:
```
https://kct-r2-admin.kctmenswear.workers.dev
```

### 3. Available Operations:

#### List All Buckets
```bash
GET https://kct-r2-admin.kctmenswear.workers.dev/buckets/list
```

#### List Objects in Any Bucket
```bash
GET https://kct-r2-admin.kctmenswear.workers.dev/list?bucket=MAIN_BUCKET&prefix=bundles/
```

#### Get Object
```bash
GET https://kct-r2-admin.kctmenswear.workers.dev/get?bucket=MAIN_BUCKET&key=path/to/file.png
```

#### Upload Object
```bash
POST https://kct-r2-admin.kctmenswear.workers.dev/put?bucket=MAIN_BUCKET&key=new/file.png
Body: [file content]
```

#### Delete Object
```bash
DELETE https://kct-r2-admin.kctmenswear.workers.dev/delete?bucket=MAIN_BUCKET&key=path/to/file.png
```

#### Copy Between Buckets
```bash
POST https://kct-r2-admin.kctmenswear.workers.dev/copy
Body: {
  "sourceBucket": "MAIN_BUCKET",
  "sourceKey": "path/to/file.png",
  "destBucket": "BACKUP_BUCKET",
  "destKey": "backup/file.png"
}
```

#### Search Across All Buckets
```bash
GET https://kct-r2-admin.kctmenswear.workers.dev/search?q=bundle
```

## Option 3: Direct S3-Compatible API Access

### Configure S3 Client (AWS SDK, boto3, etc.):
```javascript
const S3 = require('aws-sdk/clients/s3');

const s3 = new S3({
  endpoint: 'https://ea644c4a47a499ad4721449cbac587f4.r2.cloudflarestorage.com',
  accessKeyId: '[YOUR_ACCESS_KEY]',
  secretAccessKey: '[YOUR_SECRET_KEY]',
  signatureVersion: 'v4',
  region: 'auto'
});

// List buckets
s3.listBuckets((err, data) => {
  console.log(data.Buckets);
});

// List objects
s3.listObjectsV2({
  Bucket: 'kct-products',
  Prefix: 'bundles/'
}, (err, data) => {
  console.log(data.Contents);
});
```

## Option 4: Wrangler CLI Access

### Share wrangler credentials:
1. Install wrangler: `npm install -g wrangler`
2. Login: `wrangler login`
3. List R2 buckets: `wrangler r2 bucket list`
4. Upload files: `wrangler r2 object put kct-products/path/to/file.png --file ./local-file.png`
5. Download files: `wrangler r2 object get kct-products/path/to/file.png --file ./output.png`

## Current Buckets

- **kct-products**: Main product images bucket
  - Public URL: `https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev`
  - Contains: blazers, accessories, etc.

## Security Recommendations

1. **Use API tokens** with limited scope and expiration
2. **Enable logging** in Cloudflare dashboard
3. **Monitor usage** through Cloudflare Analytics
4. **Set up alerts** for unusual activity
5. **Use worker-based access** for better control

## For Minimax Team

Choose the option that best fits your workflow:
- **Option 1**: Best for programmatic access with full control
- **Option 2**: Best for REST API integration
- **Option 3**: Best if you're familiar with S3/AWS tools
- **Option 4**: Best for command-line operations

The worker approach (Option 2) gives you a REST API that's easy to integrate and doesn't require managing credentials in your code.