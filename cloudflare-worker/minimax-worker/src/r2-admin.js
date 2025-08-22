/**
 * R2 Admin Worker for Minimax - Full R2 Access
 * Provides complete access to all R2 buckets
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const pathname = url.pathname;
      
      // Main admin endpoints
      switch (pathname) {
        case '/':
          return new Response(JSON.stringify({
            name: 'KCT R2 Admin API for Minimax',
            endpoints: {
              buckets: {
                '/buckets/list': 'List all available buckets',
                '/buckets/info': 'Get bucket information'
              },
              operations: {
                '/list': 'List objects in any bucket',
                '/get': 'Get object from any bucket',
                '/put': 'Upload to any bucket',
                '/delete': 'Delete from any bucket',
                '/copy': 'Copy between buckets',
                '/move': 'Move between buckets'
              },
              utilities: {
                '/search': 'Search across all buckets',
                '/migrate': 'Migrate data between buckets',
                '/backup': 'Backup bucket data',
                '/sync': 'Sync buckets'
              }
            }
          }), { headers: corsHeaders });

        case '/buckets/list':
          return await handleListBuckets(env, corsHeaders);
        
        case '/list':
          return await handleListObjects(request, env, corsHeaders);
        
        case '/get':
          return await handleGetObject(request, env, corsHeaders);
        
        case '/put':
          return await handlePutObject(request, env, corsHeaders);
        
        case '/delete':
          return await handleDeleteObject(request, env, corsHeaders);
        
        case '/copy':
          return await handleCopyObject(request, env, corsHeaders);
        
        case '/move':
          return await handleMoveObject(request, env, corsHeaders);
        
        case '/search':
          return await handleSearchAcrossBuckets(request, env, corsHeaders);
        
        case '/migrate':
          return await handleMigrateBucket(request, env, corsHeaders);
        
        default:
          return new Response(JSON.stringify({
            error: 'Endpoint not found',
            see: '/ for available endpoints'
          }), { 
            status: 404, 
            headers: corsHeaders 
          });
      }
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};

/**
 * List all configured buckets
 */
async function handleListBuckets(env, headers) {
  const buckets = [];
  
  // Check which buckets are configured
  if (env.MAIN_BUCKET) buckets.push({ name: 'kct-products', binding: 'MAIN_BUCKET', type: 'main' });
  if (env.BACKUP_BUCKET) buckets.push({ name: 'kct-backup', binding: 'BACKUP_BUCKET', type: 'backup' });
  if (env.STAGING_BUCKET) buckets.push({ name: 'kct-staging', binding: 'STAGING_BUCKET', type: 'staging' });
  
  return new Response(JSON.stringify({
    total: buckets.length,
    buckets: buckets,
    note: 'Add more bucket bindings in wrangler.toml to access more buckets'
  }), { headers });
}

/**
 * List objects in any bucket
 */
async function handleListObjects(request, env, headers) {
  const url = new URL(request.url);
  const bucketName = url.searchParams.get('bucket') || 'MAIN_BUCKET';
  const prefix = url.searchParams.get('prefix') || '';
  const limit = parseInt(url.searchParams.get('limit') || '100');
  
  const bucket = env[bucketName];
  if (!bucket) {
    return new Response(JSON.stringify({ 
      error: `Bucket ${bucketName} not found`,
      available: ['MAIN_BUCKET', 'BACKUP_BUCKET', 'STAGING_BUCKET']
    }), { 
      status: 404, 
      headers 
    });
  }
  
  const listed = await bucket.list({ prefix, limit });
  
  const objects = listed.objects.map(obj => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded,
    etag: obj.etag,
    httpEtag: obj.httpEtag
  }));
  
  return new Response(JSON.stringify({
    bucket: bucketName,
    prefix: prefix,
    truncated: listed.truncated,
    cursor: listed.cursor,
    objects: objects
  }), { headers });
}

/**
 * Get object from any bucket
 */
async function handleGetObject(request, env, headers) {
  const url = new URL(request.url);
  const bucketName = url.searchParams.get('bucket') || 'MAIN_BUCKET';
  const key = url.searchParams.get('key');
  
  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing key parameter' }), { 
      status: 400, 
      headers 
    });
  }
  
  const bucket = env[bucketName];
  if (!bucket) {
    return new Response(JSON.stringify({ 
      error: `Bucket ${bucketName} not found` 
    }), { 
      status: 404, 
      headers 
    });
  }
  
  const object = await bucket.get(key);
  
  if (!object) {
    return new Response(JSON.stringify({ 
      error: 'Object not found',
      bucket: bucketName,
      key: key
    }), { 
      status: 404, 
      headers 
    });
  }
  
  // Return object metadata and download URL
  return new Response(JSON.stringify({
    bucket: bucketName,
    key: key,
    size: object.size,
    uploaded: object.uploaded,
    httpMetadata: object.httpMetadata,
    customMetadata: object.customMetadata,
    downloadUrl: `https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/${key}`,
    message: 'Use downloadUrl to access the file directly'
  }), { headers });
}

/**
 * Upload object to any bucket
 */
async function handlePutObject(request, env, headers) {
  const url = new URL(request.url);
  const bucketName = url.searchParams.get('bucket') || 'MAIN_BUCKET';
  const key = url.searchParams.get('key');
  
  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing key parameter' }), { 
      status: 400, 
      headers 
    });
  }
  
  const bucket = env[bucketName];
  if (!bucket) {
    return new Response(JSON.stringify({ 
      error: `Bucket ${bucketName} not found` 
    }), { 
      status: 404, 
      headers 
    });
  }
  
  const body = await request.arrayBuffer();
  
  await bucket.put(key, body, {
    httpMetadata: {
      contentType: request.headers.get('content-type') || 'application/octet-stream'
    },
    customMetadata: {
      uploadedBy: 'minimax-api',
      uploadedAt: new Date().toISOString()
    }
  });
  
  return new Response(JSON.stringify({
    success: true,
    bucket: bucketName,
    key: key,
    size: body.byteLength
  }), { headers });
}

/**
 * Delete object from any bucket
 */
async function handleDeleteObject(request, env, headers) {
  const url = new URL(request.url);
  const bucketName = url.searchParams.get('bucket') || 'MAIN_BUCKET';
  const key = url.searchParams.get('key');
  
  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing key parameter' }), { 
      status: 400, 
      headers 
    });
  }
  
  const bucket = env[bucketName];
  if (!bucket) {
    return new Response(JSON.stringify({ 
      error: `Bucket ${bucketName} not found` 
    }), { 
      status: 404, 
      headers 
    });
  }
  
  await bucket.delete(key);
  
  return new Response(JSON.stringify({
    success: true,
    bucket: bucketName,
    key: key,
    deleted: true
  }), { headers });
}

/**
 * Copy object between buckets
 */
async function handleCopyObject(request, env, headers) {
  const { sourceBucket, sourceKey, destBucket, destKey } = await request.json();
  
  const source = env[sourceBucket || 'MAIN_BUCKET'];
  const dest = env[destBucket || 'MAIN_BUCKET'];
  
  if (!source || !dest) {
    return new Response(JSON.stringify({ 
      error: 'Invalid bucket names' 
    }), { 
      status: 404, 
      headers 
    });
  }
  
  const object = await source.get(sourceKey);
  if (!object) {
    return new Response(JSON.stringify({ 
      error: 'Source object not found' 
    }), { 
      status: 404, 
      headers 
    });
  }
  
  const body = await object.arrayBuffer();
  await dest.put(destKey || sourceKey, body, {
    httpMetadata: object.httpMetadata,
    customMetadata: {
      ...object.customMetadata,
      copiedFrom: `${sourceBucket}/${sourceKey}`,
      copiedAt: new Date().toISOString()
    }
  });
  
  return new Response(JSON.stringify({
    success: true,
    source: `${sourceBucket}/${sourceKey}`,
    destination: `${destBucket}/${destKey || sourceKey}`
  }), { headers });
}

/**
 * Move object between buckets
 */
async function handleMoveObject(request, env, headers) {
  const { sourceBucket, sourceKey, destBucket, destKey } = await request.json();
  
  // First copy
  const copyResponse = await handleCopyObject(request, env, headers);
  const copyResult = await copyResponse.json();
  
  if (copyResult.success) {
    // Then delete from source
    const source = env[sourceBucket || 'MAIN_BUCKET'];
    await source.delete(sourceKey);
    
    return new Response(JSON.stringify({
      success: true,
      moved: true,
      from: `${sourceBucket}/${sourceKey}`,
      to: `${destBucket}/${destKey || sourceKey}`
    }), { headers });
  }
  
  return copyResponse;
}

/**
 * Search across all buckets
 */
async function handleSearchAcrossBuckets(request, env, headers) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  
  const results = {
    query: query,
    matches: []
  };
  
  // Search in all configured buckets
  const buckets = [
    { name: 'MAIN_BUCKET', bucket: env.MAIN_BUCKET },
    { name: 'BACKUP_BUCKET', bucket: env.BACKUP_BUCKET },
    { name: 'STAGING_BUCKET', bucket: env.STAGING_BUCKET }
  ].filter(b => b.bucket);
  
  for (const { name, bucket } of buckets) {
    const listed = await bucket.list({ limit: 1000 });
    
    for (const object of listed.objects) {
      if (object.key.toLowerCase().includes(query.toLowerCase())) {
        results.matches.push({
          bucket: name,
          key: object.key,
          size: object.size,
          uploaded: object.uploaded
        });
      }
    }
  }
  
  return new Response(JSON.stringify(results), { headers });
}

/**
 * Migrate entire bucket
 */
async function handleMigrateBucket(request, env, headers) {
  const { sourceBucket, destBucket, prefix = '', dryRun = true } = await request.json();
  
  const source = env[sourceBucket || 'MAIN_BUCKET'];
  const dest = env[destBucket];
  
  if (!source || !dest) {
    return new Response(JSON.stringify({ 
      error: 'Invalid bucket names' 
    }), { 
      status: 404, 
      headers 
    });
  }
  
  const results = {
    sourceBucket,
    destBucket,
    dryRun,
    migrated: [],
    failed: []
  };
  
  const listed = await source.list({ prefix, limit: 100 });
  
  for (const object of listed.objects) {
    try {
      if (!dryRun) {
        const file = await source.get(object.key);
        const body = await file.arrayBuffer();
        
        await dest.put(object.key, body, {
          httpMetadata: file.httpMetadata,
          customMetadata: {
            ...file.customMetadata,
            migratedFrom: sourceBucket,
            migratedAt: new Date().toISOString()
          }
        });
      }
      
      results.migrated.push(object.key);
    } catch (error) {
      results.failed.push({
        key: object.key,
        error: error.message
      });
    }
  }
  
  return new Response(JSON.stringify(results), { headers });
}