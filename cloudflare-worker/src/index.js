/**
 * Cloudflare Worker for R2 to Supabase Image Sync
 * Manages product images stored in R2 and syncs with Supabase
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers for API access
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Content-Type': 'application/json'
    };
    
    // Optional API key check (uncomment to enable)
    /*
    const apiKey = request.headers.get('X-API-Key');
    if (apiKey !== env.WORKER_API_KEY) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }
    */

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      switch (url.pathname) {
        case '/list-images':
          return await handleListImages(env, corsHeaders);
        
        case '/sync-to-supabase':
          return await handleSyncToSupabase(request, env, corsHeaders);
        
        case '/webhook/r2-upload':
          return await handleR2Upload(request, env, corsHeaders);
        
        case '/verify-images':
          return await handleVerifyImages(request, env, corsHeaders);
        
        case '/bulk-import':
          return await handleBulkImport(env, corsHeaders);
        
        case '/migrate':
          return await handleMigrate(request, env, corsHeaders);
        
        case '/migrate-status':
          return await handleMigrateStatus(env, corsHeaders);
        
        case '/batch-rename':
          return await handleBatchRename(request, env, corsHeaders);
        
        case '/bundle-urls':
          return await handleBundleUrls(request, env, corsHeaders);
        
        case '/bundle-urls-webp':
          return await handleBundleUrlsWebP(request, env, corsHeaders);
        
        case '/convert-to-webp':
          return await handleConvertToWebP(request, env, corsHeaders);
        
        case '/batch-convert-webp':
          return await handleBatchConvertWebP(request, env, corsHeaders);
        
        case '/migrate-bundles-to-main':
          return await handleMigrateBundlesToMain(request, env, corsHeaders);
        
        case '/find-bundle-images':
          return await handleFindBundleImages(request, env, corsHeaders);
        
        default:
          return new Response(JSON.stringify({
            error: 'Not Found',
            availableEndpoints: [
              '/list-images - List all images in R2',
              '/sync-to-supabase - Sync specific images to database',
              '/webhook/r2-upload - Handle new R2 uploads',
              '/verify-images - Verify all image URLs',
              '/bulk-import - Import all R2 images to Supabase',
              '/migrate - Migrate images between R2 buckets',
              '/migrate-status - Check migration progress',
              '/batch-rename - Rename images in bulk',
              '/bundle-urls - Get all bundle product URLs',
              '/bundle-urls-webp - Get bundle URLs with WebP format',
              '/convert-to-webp - Convert specific images to WebP',
              '/batch-convert-webp - Batch convert all images to WebP',
              '/migrate-bundles-to-main - Move bundle images to main bucket'
            ]
          }), { 
            status: 404, 
            headers: corsHeaders 
          });
      }
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message 
      }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};

/**
 * List all images in R2 bucket
 */
async function handleListImages(env, headers) {
  try {
    const bucket = env.R2_BUCKET;
    const listed = await bucket.list({ limit: 1000 });
    
    const images = [];
    for (const object of listed.objects) {
      const parsed = parseImagePath(object.key);
      if (parsed) {
        images.push({
          path: object.key,
          url: `${env.CDN_URL}${object.key}`,
          ...parsed,
          size: object.size,
          uploaded: object.uploaded
        });
      }
    }

    // Handle pagination if needed
    let truncated = listed.truncated;
    let cursor = listed.cursor;
    
    while (truncated) {
      const next = await bucket.list({ 
        limit: 1000, 
        cursor: cursor 
      });
      
      for (const object of next.objects) {
        const parsed = parseImagePath(object.key);
        if (parsed) {
          images.push({
            path: object.key,
            url: `${env.CDN_URL}${object.key}`,
            ...parsed,
            size: object.size,
            uploaded: object.uploaded
          });
        }
      }
      
      truncated = next.truncated;
      cursor = next.cursor;
    }

    return new Response(JSON.stringify({
      total: images.length,
      images: images
    }), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Failed to list images: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Sync images to Supabase
 */
async function handleSyncToSupabase(request, env, headers) {
  try {
    const { images, updateExisting = true } = await request.json();
    
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_KEY;
    
    const results = {
      synced: [],
      failed: [],
      skipped: []
    };

    for (const image of images || []) {
      try {
        // First, check if product exists
        const productSlug = image.productSlug || parseImagePath(image.path)?.productSlug;
        
        const productResponse = await fetch(
          `${supabaseUrl}/rest/v1/products?handle=eq.${productSlug}`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const products = await productResponse.json();
        
        if (products.length === 0) {
          // Create new product
          const newProduct = {
            handle: productSlug,
            name: formatProductName(productSlug),
            category: image.category,
            primary_image: image.url || `${env.CDN_URL}${image.path}`,
            status: 'active',
            base_price: 0, // Will need to be updated
            sku: generateSKU(productSlug),
            additional_info: {
              subcategory: image.subcategory,
              imported_from_r2: true,
              import_date: new Date().toISOString()
            }
          };

          const createResponse = await fetch(
            `${supabaseUrl}/rest/v1/products`,
            {
              method: 'POST',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
              },
              body: JSON.stringify(newProduct)
            }
          );

          if (createResponse.ok) {
            const created = await createResponse.json();
            
            // Add to product_images table
            await createProductImage(
              env, 
              created[0].id, 
              image.url || `${env.CDN_URL}${image.path}`,
              image.view || 'front'
            );
            
            results.synced.push({
              productSlug,
              action: 'created',
              productId: created[0].id
            });
          } else {
            throw new Error(`Failed to create product: ${await createResponse.text()}`);
          }
          
        } else if (updateExisting) {
          // Update existing product
          const product = products[0];
          
          // Add image to product_images table
          await createProductImage(
            env, 
            product.id, 
            image.url || `${env.CDN_URL}${image.path}`,
            image.view || 'front'
          );
          
          // Update primary_image if this is a front view
          if (image.view === 'front' || !product.primary_image) {
            await fetch(
              `${supabaseUrl}/rest/v1/products?id=eq.${product.id}`,
              {
                method: 'PATCH',
                headers: {
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  primary_image: image.url || `${env.CDN_URL}${image.path}`
                })
              }
            );
          }
          
          results.synced.push({
            productSlug,
            action: 'updated',
            productId: product.id
          });
        } else {
          results.skipped.push({
            productSlug,
            reason: 'Product exists and updateExisting is false'
          });
        }
        
      } catch (error) {
        results.failed.push({
          image: image.path,
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify(results), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Sync failed: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Handle R2 upload webhook
 */
async function handleR2Upload(request, env, headers) {
  try {
    const { object } = await request.json();
    
    if (!object || !object.key) {
      return new Response(JSON.stringify({ 
        error: 'Invalid webhook payload' 
      }), { 
        status: 400, 
        headers 
      });
    }

    const parsed = parseImagePath(object.key);
    if (!parsed) {
      return new Response(JSON.stringify({ 
        message: 'Not a product image, skipping' 
      }), { headers });
    }

    // Sync this single image to Supabase
    const result = await handleSyncToSupabase(
      new Request(request.url, {
        method: 'POST',
        headers: request.headers,
        body: JSON.stringify({
          images: [{
            path: object.key,
            ...parsed,
            url: `${env.CDN_URL}${object.key}`
          }],
          updateExisting: true
        })
      }),
      env,
      headers
    );

    return result;
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Webhook processing failed: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Verify all image URLs are accessible
 */
async function handleVerifyImages(request, env, headers) {
  try {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_KEY;
    
    // Get all product images from Supabase
    const response = await fetch(
      `${supabaseUrl}/rest/v1/product_images`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );

    const images = await response.json();
    const results = {
      total: images.length,
      valid: [],
      invalid: [],
      fixed: []
    };

    for (const image of images) {
      try {
        const checkResponse = await fetch(image.image_url, {
          method: 'HEAD'
        });
        
        if (checkResponse.ok) {
          results.valid.push(image.image_url);
        } else {
          results.invalid.push({
            url: image.image_url,
            status: checkResponse.status,
            productId: image.product_id
          });
          
          // Try to fix by checking R2
          const path = image.image_url.replace(env.CDN_URL, '');
          const r2Object = await env.R2_BUCKET.head(path);
          
          if (r2Object) {
            // Object exists in R2, URL might be incorrect
            const correctUrl = `${env.CDN_URL}${path}`;
            
            await fetch(
              `${supabaseUrl}/rest/v1/product_images?id=eq.${image.id}`,
              {
                method: 'PATCH',
                headers: {
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  image_url: correctUrl
                })
              }
            );
            
            results.fixed.push({
              old: image.image_url,
              new: correctUrl
            });
          }
        }
      } catch (error) {
        results.invalid.push({
          url: image.image_url,
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify(results), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Verification failed: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Bulk import all R2 images to Supabase
 */
async function handleBulkImport(env, headers) {
  try {
    // First, get all images from R2
    const listResponse = await handleListImages(env, {});
    const { images } = await listResponse.json();
    
    // Group images by product
    const productMap = new Map();
    
    for (const image of images) {
      if (!productMap.has(image.productSlug)) {
        productMap.set(image.productSlug, []);
      }
      productMap.get(image.productSlug).push(image);
    }

    const results = {
      totalProducts: productMap.size,
      totalImages: images.length,
      synced: [],
      failed: []
    };

    // Process each product
    for (const [productSlug, productImages] of productMap) {
      try {
        // Find the primary (front) image
        const frontImage = productImages.find(img => img.view === 'front') || productImages[0];
        
        // Sync all images for this product
        const syncResult = await handleSyncToSupabase(
          new Request('', {
            method: 'POST',
            body: JSON.stringify({
              images: productImages,
              updateExisting: true
            })
          }),
          env,
          {}
        );
        
        const syncData = await syncResult.json();
        results.synced.push({
          productSlug,
          imageCount: productImages.length,
          ...syncData
        });
        
      } catch (error) {
        results.failed.push({
          productSlug,
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify(results), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Bulk import failed: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Migrate images between R2 buckets with optional renaming
 */
async function handleMigrate(request, env, headers) {
  try {
    const url = new URL(request.url);
    const mode = url.searchParams.get('mode') || 'copy'; // 'copy' or 'move'
    const prefix = url.searchParams.get('prefix') || ''; // optional path prefix
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const renamePattern = url.searchParams.get('rename'); // 'standardize', 'lowercase', etc.
    const cursor = url.searchParams.get('cursor'); // For pagination
    
    if (!env.R2_BUCKET_DESTINATION) {
      return new Response(JSON.stringify({ 
        error: 'Destination bucket not configured. Add R2_BUCKET_DESTINATION to wrangler.toml' 
      }), { 
        status: 400, 
        headers 
      });
    }

    const results = {
      mode: mode,
      renamePattern: renamePattern,
      started: new Date().toISOString(),
      migrated: [],
      failed: [],
      skipped: [],
      renamed: []
    };

    // List objects with optional prefix and cursor
    const listOptions = { 
      prefix: prefix,
      limit: limit
    };
    
    if (cursor) {
      listOptions.cursor = cursor;
    }
    
    const listed = await env.R2_BUCKET.list(listOptions);

    for (const object of listed.objects) {
      try {
        let newKey = object.key;
        
        // Apply renaming based on pattern
        if (renamePattern) {
          newKey = applyRenamePattern(object.key, renamePattern);
          
          if (newKey !== object.key) {
            results.renamed.push({
              original: object.key,
              renamed: newKey
            });
          }
        }

        // Check if already exists in destination
        const existingObject = await env.R2_BUCKET_DESTINATION.head(newKey);
        
        if (existingObject && mode === 'copy') {
          results.skipped.push({
            key: object.key,
            newKey: newKey,
            reason: 'Already exists in destination'
          });
          continue;
        }

        // Get the object from source bucket
        const file = await env.R2_BUCKET.get(object.key);
        
        if (file) {
          // Put it in destination bucket with new name
          await env.R2_BUCKET_DESTINATION.put(newKey, file.body, {
            httpMetadata: file.httpMetadata,
            customMetadata: {
              ...file.customMetadata,
              originalPath: object.key,
              migratedFrom: 'kct-products',
              migratedAt: new Date().toISOString(),
              renamed: newKey !== object.key
            }
          });
          
          // If mode is 'move', delete from source
          if (mode === 'move') {
            await env.R2_BUCKET.delete(object.key);
          }
          
          results.migrated.push({
            originalKey: object.key,
            newKey: newKey,
            size: object.size,
            action: mode,
            renamed: newKey !== object.key
          });
        }
      } catch (error) {
        results.failed.push({
          key: object.key,
          error: error.message
        });
      }
    }

    // Handle pagination if there are more objects
    if (listed.truncated) {
      results.hasMore = true;
      results.nextCursor = listed.cursor;
      results.message = `Migrated ${results.migrated.length} objects. More objects available - use cursor: ${listed.cursor}`;
    }

    results.completed = new Date().toISOString();
    results.duration = Date.now() - new Date(results.started).getTime();

    // Store migration status for tracking
    if (env.MIGRATION_STATUS) {
      await env.MIGRATION_STATUS.put('lastMigration', JSON.stringify(results));
    }

    return new Response(JSON.stringify(results), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Migration failed: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Check migration status
 */
async function handleMigrateStatus(env, headers) {
  try {
    // Compare source and destination buckets
    const sourceList = await env.R2_BUCKET.list({ limit: 1 });
    const destList = env.R2_BUCKET_DESTINATION 
      ? await env.R2_BUCKET_DESTINATION.list({ limit: 1 })
      : null;

    const status = {
      source: {
        bucket: 'kct-products',
        connected: true,
        sampleObject: sourceList.objects[0]?.key || 'No objects found'
      },
      destination: {
        bucket: env.R2_BUCKET_DESTINATION ? 'configured' : 'not configured',
        connected: !!destList,
        sampleObject: destList?.objects[0]?.key || 'No objects found'
      }
    };

    // Get last migration status if available
    if (env.MIGRATION_STATUS) {
      try {
        const lastMigration = await env.MIGRATION_STATUS.get('lastMigration');
        if (lastMigration) {
          status.lastMigration = JSON.parse(lastMigration);
        }
      } catch (e) {
        // KV might not be configured
      }
    }

    return new Response(JSON.stringify(status), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Status check failed: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Batch rename images in R2 (without migration)
 */
async function handleBatchRename(request, env, headers) {
  try {
    const { pattern, prefix = '', dryRun = true } = await request.json();
    
    const results = {
      pattern: pattern,
      dryRun: dryRun,
      renamed: [],
      failed: [],
      unchanged: []
    };
    
    const listed = await env.R2_BUCKET.list({ prefix });
    
    for (const object of listed.objects) {
      try {
        const newKey = applyRenamePattern(object.key, pattern);
        
        if (newKey === object.key) {
          results.unchanged.push(object.key);
          continue;
        }
        
        if (!dryRun) {
          // Get the object
          const file = await env.R2_BUCKET.get(object.key);
          
          if (file) {
            // Put with new name
            await env.R2_BUCKET.put(newKey, file.body, {
              httpMetadata: file.httpMetadata,
              customMetadata: {
                ...file.customMetadata,
                originalPath: object.key,
                renamedAt: new Date().toISOString()
              }
            });
            
            // Delete old
            await env.R2_BUCKET.delete(object.key);
          }
        }
        
        results.renamed.push({
          old: object.key,
          new: newKey,
          applied: !dryRun
        });
        
      } catch (error) {
        results.failed.push({
          key: object.key,
          error: error.message
        });
      }
    }
    
    return new Response(JSON.stringify(results), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Batch rename failed: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Handle bundle URLs - Generate proper URLs for all bundle products
 */
async function handleBundleUrls(request, env, headers) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category'); // Optional filter by category
    
    const PUBLIC_R2_URL = 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev';
    const CDN_URL = env.CDN_URL || 'https://cdn.kctmenswear.com';
    
    // Bundle categories and their mappings
    const bundleCategories = {
      'bow-tie': {
        path: 'kct-products/Bow-Tie/',
        cdnPath: 'bundles/bow-tie/'
      },
      'bundles-august-2025': {
        path: 'kct-products/Bundles-Augest-2025/',
        cdnPath: 'bundles/august-2025/',
        subfolders: ['Bundles-01', 'Bundles-02', 'Bundles-03']
      },
      'dress-shirts': {
        path: 'kct-products/Dress Shirts/',
        cdnPath: 'bundles/dress-shirts/'
      },
      'fall-wedding': {
        path: 'kct-products/Fall Wedding Bundles/',
        cdnPath: 'bundles/fall-wedding/'
      },
      'spring-wedding': {
        path: 'kct-products/Spring Wedding Bundles/',
        cdnPath: 'bundles/spring-wedding/'
      },
      'summer-wedding': {
        path: 'kct-products/Summer Wedding Bundles/',
        cdnPath: 'bundles/summer-wedding/'
      },
      'tuxedo-bundles': {
        path: 'kct-products/Tuxedo-Bundles/',
        cdnPath: 'bundles/tuxedo/'
      },
      'casual-bundles': {
        path: 'kct-products/casual-bundles/',
        cdnPath: 'bundles/casual/'
      }
    };
    
    // List actual bundle images from R2
    const results = {
      totalBundles: 0,
      categories: {},
      urls: []
    };
    
    // Get images from R2
    const bucket = env.R2_BUCKET;
    
    for (const [catKey, catConfig] of Object.entries(bundleCategories)) {
      if (category && category !== catKey) continue;
      
      results.categories[catKey] = {
        name: catKey,
        path: catConfig.path,
        cdnPath: catConfig.cdnPath,
        images: []
      };
      
      // Handle subfolders for Bundles-August-2025
      if (catConfig.subfolders) {
        for (const subfolder of catConfig.subfolders) {
          const prefix = `suitshirttie/${catConfig.path}${subfolder}/`;
          const listed = await bucket.list({ prefix, limit: 100 });
          
          for (const object of listed.objects) {
            const filename = object.key.split('/').pop();
            const cleanName = filename.toLowerCase().replace(/\s+/g, '-');
            
            const urlData = {
              originalPath: object.key,
              filename: filename,
              publicR2Url: `${PUBLIC_R2_URL}/${catConfig.path}${subfolder}/${encodeURIComponent(filename)}`,
              cdnUrl: `${CDN_URL}/${catConfig.cdnPath}${subfolder.toLowerCase()}/${cleanName}`,
              category: catKey,
              subfolder: subfolder.toLowerCase(),
              size: object.size
            };
            
            results.categories[catKey].images.push(urlData);
            results.urls.push(urlData);
            results.totalBundles++;
          }
        }
      } else {
        // Handle regular bundle categories
        const prefix = `suitshirttie/${catConfig.path}`;
        const listed = await bucket.list({ prefix, limit: 100 });
        
        for (const object of listed.objects) {
          const filename = object.key.split('/').pop();
          const cleanName = filename.toLowerCase().replace(/\s+/g, '-');
          
          const urlData = {
            originalPath: object.key,
            filename: filename,
            publicR2Url: `${PUBLIC_R2_URL}/${catConfig.path}${encodeURIComponent(filename)}`,
            cdnUrl: `${CDN_URL}/${catConfig.cdnPath}${cleanName}`,
            category: catKey,
            size: object.size
          };
          
          results.categories[catKey].images.push(urlData);
          results.urls.push(urlData);
          results.totalBundles++;
        }
      }
    }
    
    // Special handling for the example Bundle-01 images
    if (!category || category === 'bundles-august-2025') {
      const bundle01Images = [
        'black-suit-3p-red.png',
        'Navy-2p-pink-navy.png',
        'black-2-white-black.png',
        'black-3p-white-black.png',
        'black-suit-2p-burnt-orange.png',
        'black-suit-3p-emerald-green.png',
        'black-suit-3p-hunter-green.png',
        'black-suit-3p-royal-blue-.png',
        'black-suit-black-shirt-Hunter Green.png',
        'black-suit-black-shirt-black.png',
        'black-suit-black-shirt-burnt-orange.png',
        'black-suit-black-shirt-fuschia.png',
        'brown-pink-navy.png',
        'burgundy-black-black.png',
        'burgundy-black-fusicia.png',
        'burgundy-black-mustrard.png',
        'dark-grey-white-pink.png',
        'dark-grey-white-silver.png',
        'emerlad-green-white-burnt-orange.png',
        'indigo-2p-white-dusty-pink.png',
        'indigo-2p-white-red.png',
        'indigo-2p-white-sage-green.png',
        'light-grey-2p-coral.png',
        'light-grey-2p-light-blue.png',
        'light-grey-2p-pink.png'
      ];
      
      // Add known Bundle-01 images if not already found
      const existingBundle01 = results.categories['bundles-august-2025']?.images || [];
      const existingFilenames = existingBundle01.map(img => img.filename);
      
      for (const imageName of bundle01Images) {
        if (!existingFilenames.includes(imageName)) {
          const cleanName = imageName.toLowerCase().replace(/\s+/g, '-');
          const urlData = {
            filename: imageName,
            publicR2Url: `${PUBLIC_R2_URL}/kct-products/Bundles-Augest-2025/Bundles-01/${encodeURIComponent(imageName)}`,
            cdnUrl: `${CDN_URL}/bundles/august-2025/bundles-01/${cleanName}`,
            category: 'bundles-august-2025',
            subfolder: 'bundles-01',
            verified: false // Mark as not verified from actual R2 listing
          };
          
          if (!results.categories['bundles-august-2025']) {
            results.categories['bundles-august-2025'] = {
              name: 'bundles-august-2025',
              images: []
            };
          }
          
          results.categories['bundles-august-2025'].images.push(urlData);
          results.urls.push(urlData);
          results.totalBundles++;
        }
      }
    }
    
    return new Response(JSON.stringify(results), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Failed to get bundle URLs: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Handle bundle URLs with WebP format - Convert PNG URLs to WebP
 */
async function handleBundleUrlsWebP(request, env, headers) {
  try {
    // Get the original bundle URLs
    const originalResponse = await handleBundleUrls(request, env, {});
    const data = await originalResponse.json();
    
    // Convert all PNG URLs to WebP
    const convertToWebP = (url) => {
      return url
        .replace(/\.png$/i, '.webp')
        .replace(/\.jpg$/i, '.webp')
        .replace(/\.jpeg$/i, '.webp');
    };
    
    // Process all categories and convert URLs
    for (const category in data.categories) {
      if (data.categories[category].images) {
        data.categories[category].images = data.categories[category].images.map(img => ({
          ...img,
          originalFormat: img.filename.split('.').pop().toLowerCase(),
          filename: img.filename.replace(/\.(png|jpg|jpeg)$/i, '.webp'),
          publicR2Url: convertToWebP(img.publicR2Url),
          cdnUrl: convertToWebP(img.cdnUrl),
          webpUrl: convertToWebP(img.publicR2Url), // Explicit WebP URL
          originalUrl: img.publicR2Url // Keep original PNG URL for reference
        }));
      }
    }
    
    // Update the flat URLs array
    data.urls = data.urls.map(img => ({
      ...img,
      originalFormat: img.filename.split('.').pop().toLowerCase(),
      filename: img.filename.replace(/\.(png|jpg|jpeg)$/i, '.webp'),
      publicR2Url: convertToWebP(img.publicR2Url),
      cdnUrl: convertToWebP(img.cdnUrl),
      webpUrl: convertToWebP(img.publicR2Url),
      originalUrl: img.publicR2Url
    }));
    
    // Add metadata about format conversion
    data.format = 'webp';
    data.note = 'URLs have been converted to WebP format. Original PNG/JPG URLs are preserved in originalUrl field.';
    data.conversionEndpoint = '/bundle-urls for original formats';
    
    return new Response(JSON.stringify(data), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Failed to get WebP bundle URLs: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Convert specific images to WebP format
 */
async function handleConvertToWebP(request, env, headers) {
  try {
    const url = new URL(request.url);
    const imagePath = url.searchParams.get('path'); // Specific image path
    const quality = parseInt(url.searchParams.get('quality') || '80'); // WebP quality 0-100
    const dryRun = url.searchParams.get('dryrun') === 'true';
    
    if (!imagePath) {
      return new Response(JSON.stringify({ 
        error: 'Missing path parameter. Example: /convert-to-webp?path=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-red.png' 
      }), { 
        status: 400, 
        headers 
      });
    }

    const results = {
      path: imagePath,
      quality: quality,
      dryRun: dryRun,
      converted: [],
      failed: [],
      skipped: []
    };

    // Get the original image from R2
    const originalObject = await env.R2_BUCKET.get(imagePath);
    
    if (!originalObject) {
      return new Response(JSON.stringify({ 
        error: `Image not found: ${imagePath}` 
      }), { 
        status: 404, 
        headers 
      });
    }

    // Check if it's a PNG/JPG file
    const isConvertible = /\.(png|jpg|jpeg)$/i.test(imagePath);
    if (!isConvertible) {
      results.skipped.push({
        path: imagePath,
        reason: 'Not a PNG/JPG file'
      });
      return new Response(JSON.stringify(results), { headers });
    }

    // Generate WebP path
    const webpPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    // Check if WebP version already exists
    const existingWebP = await env.R2_BUCKET.head(webpPath);
    if (existingWebP && !dryRun) {
      results.skipped.push({
        path: imagePath,
        webpPath: webpPath,
        reason: 'WebP version already exists'
      });
      return new Response(JSON.stringify(results), { headers });
    }

    if (dryRun) {
      results.converted.push({
        originalPath: imagePath,
        webpPath: webpPath,
        originalSize: originalObject.size,
        action: 'would convert (dry run)'
      });
      return new Response(JSON.stringify(results), { headers });
    }

    // Convert image to WebP using Canvas API
    const imageBuffer = await originalObject.arrayBuffer();
    const webpBuffer = await convertImageToWebP(imageBuffer, quality);
    
    // Upload WebP version to R2
    await env.R2_BUCKET.put(webpPath, webpBuffer, {
      httpMetadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000' // 1 year cache
      },
      customMetadata: {
        originalFile: imagePath,
        convertedAt: new Date().toISOString(),
        quality: quality.toString(),
        originalSize: originalObject.size.toString()
      }
    });

    results.converted.push({
      originalPath: imagePath,
      webpPath: webpPath,
      originalSize: originalObject.size,
      webpSize: webpBuffer.byteLength,
      savings: Math.round(((originalObject.size - webpBuffer.byteLength) / originalObject.size) * 100),
      quality: quality
    });

    return new Response(JSON.stringify(results), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Conversion failed: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Batch convert all bundle images to WebP
 */
async function handleBatchConvertWebP(request, env, headers) {
  try {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') || 'suitshirttie/kct-products/';
    const quality = parseInt(url.searchParams.get('quality') || '80');
    const maxFiles = parseInt(url.searchParams.get('limit') || '50'); // Limit to prevent timeouts
    const dryRun = url.searchParams.get('dryrun') === 'true';
    const skipExisting = url.searchParams.get('skipexisting') !== 'false'; // Default true
    
    const results = {
      prefix: prefix,
      quality: quality,
      maxFiles: maxFiles,
      dryRun: dryRun,
      skipExisting: skipExisting,
      processed: 0,
      converted: [],
      failed: [],
      skipped: [],
      summary: {}
    };

    // List images with the prefix
    const listed = await env.R2_BUCKET.list({ prefix, limit: maxFiles });
    
    for (const object of listed.objects) {
      if (results.processed >= maxFiles) break;
      
      const imagePath = object.key;
      
      // Only process PNG/JPG files
      const isConvertible = /\.(png|jpg|jpeg)$/i.test(imagePath);
      if (!isConvertible) {
        results.skipped.push({
          path: imagePath,
          reason: 'Not a PNG/JPG file'
        });
        results.processed++;
        continue;
      }

      // Generate WebP path
      const webpPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      
      // Skip if WebP already exists (unless explicitly requested)
      if (skipExisting) {
        const existingWebP = await env.R2_BUCKET.head(webpPath);
        if (existingWebP) {
          results.skipped.push({
            path: imagePath,
            webpPath: webpPath,
            reason: 'WebP version already exists'
          });
          results.processed++;
          continue;
        }
      }

      if (dryRun) {
        results.converted.push({
          originalPath: imagePath,
          webpPath: webpPath,
          originalSize: object.size,
          action: 'would convert (dry run)'
        });
        results.processed++;
        continue;
      }

      try {
        // Get the original image
        const originalObject = await env.R2_BUCKET.get(imagePath);
        if (!originalObject) {
          results.failed.push({
            path: imagePath,
            error: 'Failed to fetch original image'
          });
          results.processed++;
          continue;
        }

        // Convert to WebP
        const imageBuffer = await originalObject.arrayBuffer();
        const webpBuffer = await convertImageToWebP(imageBuffer, quality);
        
        // Upload WebP version
        await env.R2_BUCKET.put(webpPath, webpBuffer, {
          httpMetadata: {
            contentType: 'image/webp',
            cacheControl: 'public, max-age=31536000'
          },
          customMetadata: {
            originalFile: imagePath,
            convertedAt: new Date().toISOString(),
            quality: quality.toString(),
            originalSize: object.size.toString()
          }
        });

        results.converted.push({
          originalPath: imagePath,
          webpPath: webpPath,
          originalSize: object.size,
          webpSize: webpBuffer.byteLength,
          savings: Math.round(((object.size - webpBuffer.byteLength) / object.size) * 100),
          quality: quality
        });

      } catch (error) {
        results.failed.push({
          path: imagePath,
          error: error.message
        });
      }
      
      results.processed++;
    }

    // Calculate summary
    results.summary = {
      totalProcessed: results.processed,
      converted: results.converted.length,
      failed: results.failed.length,
      skipped: results.skipped.length,
      totalSavings: results.converted.reduce((sum, item) => sum + (item.originalSize - item.webpSize), 0),
      averageSavings: results.converted.length > 0 
        ? Math.round(results.converted.reduce((sum, item) => sum + item.savings, 0) / results.converted.length)
        : 0
    };

    // Add pagination info if there are more files
    if (listed.truncated) {
      results.hasMore = true;
      results.nextCursor = listed.cursor;
      results.message = `Processed ${results.processed} files. More files available - use cursor parameter to continue.`;
    }

    return new Response(JSON.stringify(results), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Batch conversion failed: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Migrate bundle images from public bucket to main bucket under /bundles/ folder
 */
async function handleMigrateBundlesToMain(request, env, headers) {
  try {
    const url = new URL(request.url);
    const dryRun = url.searchParams.get('dryrun') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '25');
    const category = url.searchParams.get('category'); // Optional: specific category
    
    const PUBLIC_R2_URL = 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev';
    
    const results = {
      dryRun: dryRun,
      limit: limit,
      migrated: [],
      failed: [],
      skipped: [],
      processed: 0
    };

    // Bundle images to migrate
    const bundleImages = [
      // Bundle-01
      'kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-red.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/Navy-2p-pink-navy.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/black-2-white-black.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/black-3p-white-black.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/black-suit-2p-burnt-orange.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-emerald-green.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-hunter-green.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-royal-blue-.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-Hunter Green.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-burnt-orange.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-fuschia.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/brown-pink-navy.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/burgundy-black-black.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/burgundy-black-fusicia.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/burgundy-black-mustrard.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/dark-grey-white-pink.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/dark-grey-white-silver.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/emerlad-green-white-burnt-orange.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/indigo-2p-white-dusty-pink.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/indigo-2p-white-red.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/indigo-2p-white-sage-green.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/light-grey-2p-coral.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/light-grey-2p-light-blue.png',
      'kct-products/Bundles-Augest-2025/Bundles-01/light-grey-2p-pink.png'
    ];

    // Filter by category if specified
    let imagesToProcess = bundleImages;
    if (category === 'bundles-01') {
      imagesToProcess = bundleImages.filter(path => path.includes('Bundles-01'));
    }
    
    // Limit the number of images to process
    imagesToProcess = imagesToProcess.slice(0, limit);

    for (const imagePath of imagesToProcess) {
      if (results.processed >= limit) break;
      
      try {
        // Generate new path in main bucket: bundles/august-2025/bundles-01/filename.png
        // imagePath example: kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-red.png
        const pathParts = imagePath.split('/');
        const filename = pathParts[pathParts.length - 1]; // black-suit-3p-red.png
        const subFolder = pathParts[pathParts.length - 2]; // Bundles-01
        
        const newPath = `bundles/august-2025/${subFolder.toLowerCase()}/${filename}`;
        
        // Check if already exists in main bucket
        const existingFile = await env.R2_BUCKET.head(newPath);
        if (existingFile) {
          results.skipped.push({
            publicPath: imagePath,
            newPath: newPath,
            reason: 'Already exists in main bucket'
          });
          results.processed++;
          continue;
        }

        if (dryRun) {
          results.migrated.push({
            publicUrl: `${PUBLIC_R2_URL}/${imagePath}`,
            newPath: newPath,
            newCdnUrl: `${env.CDN_URL}${newPath}`,
            action: 'would migrate (dry run)'
          });
          results.processed++;
          continue;
        }

        // Download from public bucket
        const publicUrl = `${PUBLIC_R2_URL}/${imagePath}`;
        const response = await fetch(publicUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const imageData = await response.arrayBuffer();
        
        // Upload to main bucket
        await env.R2_BUCKET.put(newPath, imageData, {
          httpMetadata: {
            contentType: 'image/png',
            cacheControl: 'public, max-age=31536000'
          },
          customMetadata: {
            originalPath: imagePath,
            migratedFrom: 'public-bucket',
            migratedAt: new Date().toISOString(),
            source: 'bundle-migration'
          }
        });

        results.migrated.push({
          publicUrl: publicUrl,
          newPath: newPath,
          newCdnUrl: `${env.CDN_URL}${newPath}`,
          size: imageData.byteLength,
          filename: filename
        });

      } catch (error) {
        results.failed.push({
          publicPath: imagePath,
          error: error.message
        });
      }
      
      results.processed++;
    }

    // Add summary
    results.summary = {
      totalProcessed: results.processed,
      migrated: results.migrated.length,
      failed: results.failed.length,
      skipped: results.skipped.length
    };

    return new Response(JSON.stringify(results), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Migration failed: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Convert image buffer to WebP using Canvas API
 */
async function convertImageToWebP(imageBuffer, quality = 80) {
  // Create an image from the buffer
  const image = new Image();
  const imageBlob = new Blob([imageBuffer]);
  const imageUrl = URL.createObjectURL(imageBlob);
  
  return new Promise((resolve, reject) => {
    image.onload = () => {
      try {
        // Create canvas
        const canvas = new OffscreenCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        
        // Draw image to canvas
        ctx.drawImage(image, 0, 0);
        
        // Convert to WebP
        canvas.convertToBlob({
          type: 'image/webp',
          quality: quality / 100
        }).then(blob => {
          blob.arrayBuffer().then(buffer => {
            URL.revokeObjectURL(imageUrl);
            resolve(buffer);
          });
        }).catch(reject);
        
      } catch (error) {
        URL.revokeObjectURL(imageUrl);
        reject(error);
      }
    };
    
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Failed to load image'));
    };
    
    image.src = imageUrl;
  });
}

/**
 * Apply rename pattern to image path
 */
function applyRenamePattern(originalPath, pattern) {
  const parsed = parseImagePath(originalPath);
  
  if (!parsed) {
    // Not a standard product image path, apply basic patterns
    switch (pattern) {
      case 'lowercase':
        return originalPath.toLowerCase();
      case 'remove-spaces':
        return originalPath.replace(/\s+/g, '-');
      default:
        return originalPath;
    }
  }

  // For product images, apply specific patterns
  let newPath = originalPath;
  
  switch (pattern) {
    case 'standardize':
      // Standardize to: category/subcategory/product-slug/view.webp
      newPath = `${parsed.category.toLowerCase()}/${parsed.subcategory.toLowerCase()}/${parsed.productSlug.toLowerCase()}/${parsed.view.toLowerCase()}.webp`;
      break;
      
    case 'lowercase':
      // Convert entire path to lowercase
      newPath = originalPath.toLowerCase();
      break;
      
    case 'remove-spaces':
      // Replace spaces with hyphens
      newPath = originalPath.replace(/\s+/g, '-');
      break;
      
    case 'clean-special-chars':
      // Remove special characters, keep only alphanumeric and hyphens
      newPath = originalPath.replace(/[^a-zA-Z0-9\-\/\.]/g, '');
      break;
      
    case 'add-prefix':
      // Add prefix to filename (useful for versioning)
      const parts = originalPath.split('/');
      const filename = parts[parts.length - 1];
      parts[parts.length - 1] = `v2-${filename}`;
      newPath = parts.join('/');
      break;
      
    case 'organize-by-date':
      // Reorganize by year/month: 2024/08/category/subcategory/product/view.webp
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      newPath = `${year}/${month}/${originalPath}`;
      break;
      
    case 'flatten':
      // Flatten structure: category-subcategory-product-view.webp
      if (parsed) {
        newPath = `${parsed.category}-${parsed.subcategory}-${parsed.productSlug}-${parsed.view}.${parsed.extension}`;
      }
      break;
      
    default:
      // Custom pattern could be implemented here
      break;
  }
  
  return newPath;
}

/**
 * Helper: Parse image path to extract metadata
 */
function parseImagePath(path) {
  // Expected format: category/subcategory/product-slug/view.webp
  const regex = /^([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\.]+)\.(webp|jpg|jpeg|png)$/;
  const match = path.match(regex);
  
  if (!match) return null;
  
  return {
    category: match[1],
    subcategory: match[2],
    productSlug: match[3],
    view: match[4],
    extension: match[5]
  };
}

/**
 * Helper: Format product name from slug
 */
function formatProductName(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Helper: Generate SKU from slug
 */
function generateSKU(slug) {
  const parts = slug.split('-');
  const prefix = parts.slice(0, 2)
    .map(part => part.substring(0, 3).toUpperCase())
    .join('');
  const suffix = Date.now().toString().slice(-6);
  return `${prefix}-${suffix}`;
}

/**
 * Helper: Create product image record
 */
async function createProductImage(env, productId, imageUrl, imageType) {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_KEY;
  
  // Check if image already exists
  const checkResponse = await fetch(
    `${supabaseUrl}/rest/v1/product_images?product_id=eq.${productId}&image_url=eq.${imageUrl}`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }
  );
  
  const existing = await checkResponse.json();
  
  if (existing.length > 0) {
    return existing[0];
  }
  
  // Create new image record
  const response = await fetch(
    `${supabaseUrl}/rest/v1/product_images`,
    {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        product_id: productId,
        image_url: imageUrl,
        image_type: imageType,
        position: imageType === 'front' ? 1 : 2,
        alt_text: `Product image - ${imageType} view`
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to create image record: ${await response.text()}`);
  }
  
  return await response.json();
}

/**
 * Find bundle images in various possible locations
 */
async function handleFindBundleImages(request, env, headers) {
  try {
    const url = new URL(request.url);
    const searchFor = url.searchParams.get('search') || 'Bundles-01';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    // Try various possible prefixes
    const prefixes = [
      'suitshirttie/kct-products/Bundles-Augest-2025/',
      'kct-products/Bundles-Augest-2025/',
      'Bundles-Augest-2025/',
      'suitshirttie/Bundles-Augest-2025/',
      'bundles/',
      '',  // Search entire bucket
    ];
    
    const results = {
      searchFor: searchFor,
      foundImages: [],
      prefixesSearched: [],
      totalFound: 0
    };
    
    const bucket = env.R2_BUCKET;
    
    for (const prefix of prefixes) {
      try {
        const listed = await bucket.list({ 
          prefix: prefix, 
          limit: limit 
        });
        
        results.prefixesSearched.push({
          prefix: prefix,
          objectsFound: listed.objects.length
        });
        
        for (const object of listed.objects) {
          // Check if this matches what we're looking for
          if (object.key.toLowerCase().includes(searchFor.toLowerCase()) ||
              object.key.includes('bundle') || 
              object.key.includes('Bundle')) {
            
            const filename = object.key.split('/').pop();
            results.foundImages.push({
              key: object.key,
              filename: filename,
              size: object.size,
              uploaded: object.uploaded,
              publicR2Url: `https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/${object.key}`,
              cdnUrl: `https://cdn.kctmenswear.com/${object.key}`
            });
            results.totalFound++;
          }
        }
        
        // If we found images, we can stop searching
        if (results.totalFound > 0) {
          break;
        }
      } catch (error) {
        console.log(`Error searching prefix ${prefix}: ${error.message}`);
      }
    }
    
    return new Response(JSON.stringify(results), { headers });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Failed to find bundle images: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}