/**
 * Minimax API Worker for KCT Menswear
 * Provides access to product data and customer information
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers for API access
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const pathname = url.pathname;
      
      switch (pathname) {
        case '/':
          return new Response(JSON.stringify({
            name: 'KCT Minimax API',
            version: env.API_VERSION || '1.0.0',
            endpoints: [
              '/products - List all products',
              '/products/bundles - Get bundle products',
              '/products/search - Search products',
              '/images - List all images',
              '/images/bundles - Get bundle images',
              '/customer-data - Get customer data structure',
              '/wedding-categories - Get wedding product categories'
            ]
          }), { headers: corsHeaders });

        case '/products':
          return await handleGetProducts(env, corsHeaders);
        
        case '/products/bundles':
          return await handleGetBundles(env, corsHeaders);
        
        case '/products/search':
          return await handleSearchProducts(request, env, corsHeaders);
        
        case '/images':
          return await handleGetImages(env, corsHeaders);
        
        case '/images/bundles':
          return await handleGetBundleImages(env, corsHeaders);
        
        case '/customer-data':
          return await handleCustomerDataStructure(env, corsHeaders);
        
        case '/wedding-categories':
          return await handleWeddingCategories(env, corsHeaders);
        
        default:
          return new Response(JSON.stringify({
            error: 'Endpoint not found',
            available: ['/products', '/images', '/customer-data', '/wedding-categories']
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
 * Get all products from Supabase
 */
async function handleGetProducts(env, headers) {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/products?select=*`,
      {
        headers: {
          'apikey': env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`
        }
      }
    );
    
    const products = await response.json();
    
    return new Response(JSON.stringify({
      total: products.length,
      products: products
    }), { headers });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Failed to fetch products: ${error.message}` 
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * Get bundle products
 */
async function handleGetBundles(env, headers) {
  const bundleData = {
    categories: {
      'bundles-01': {
        name: 'August 2025 Bundle 01',
        products: [
          'black-suit-3p-red',
          'navy-2p-pink-navy',
          'black-2-white-black',
          'black-3p-white-black',
          'black-suit-2p-burnt-orange',
          'black-suit-3p-emerald-green',
          'black-suit-3p-hunter-green',
          'black-suit-3p-royal-blue',
          'black-suit-black-shirt-hunter-green',
          'black-suit-black-shirt-black',
          'black-suit-black-shirt-burnt-orange',
          'black-suit-black-shirt-fuschia',
          'brown-pink-navy',
          'burgundy-black-black',
          'burgundy-black-fusicia',
          'burgundy-black-mustrard',
          'dark-grey-white-pink',
          'dark-grey-white-silver',
          'emerlad-green-white-burnt-orange',
          'indigo-2p-white-dusty-pink',
          'indigo-2p-white-red',
          'indigo-2p-white-sage-green',
          'light-grey-2p-coral',
          'light-grey-2p-light-blue',
          'light-grey-2p-pink'
        ]
      },
      'tuxedo-bundles': {
        name: 'Tuxedo Bundles',
        products: []
      },
      'wedding-bundles': {
        name: 'Wedding Bundles',
        subcategories: ['fall', 'spring', 'summer']
      }
    }
  };
  
  return new Response(JSON.stringify(bundleData), { headers });
}

/**
 * Search products
 */
async function handleSearchProducts(request, env, headers) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category');
  
  // This would connect to Supabase with proper search
  return new Response(JSON.stringify({
    query: query,
    category: category,
    results: [],
    message: 'Search endpoint ready for implementation'
  }), { headers });
}

/**
 * Get all images from R2
 */
async function handleGetImages(env, headers) {
  try {
    const listed = await env.R2_BUCKET.list({ limit: 100 });
    
    const images = listed.objects.map(obj => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
      url: `${env.CDN_URL}${obj.key}`
    }));
    
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
 * Get bundle images specifically
 */
async function handleGetBundleImages(env, headers) {
  const bundleImages = {
    message: 'Bundle images will be available once uploaded to R2',
    expectedPath: 'bundles/august-2025/bundles-01/',
    sampleUrls: [
      'https://cdn.kctmenswear.com/bundles/august-2025/bundles-01/black-suit-3p-red.png',
      'https://cdn.kctmenswear.com/bundles/august-2025/bundles-01/navy-2p-pink-navy.png'
    ]
  };
  
  return new Response(JSON.stringify(bundleImages), { headers });
}

/**
 * Get customer data structure for Minimax
 */
async function handleCustomerDataStructure(env, headers) {
  const structure = {
    customers_table: {
      id: 'uuid',
      email: 'text',
      full_name: 'text',
      phone: 'text',
      stripe_customer_id: 'text',
      created_at: 'timestamp',
      updated_at: 'timestamp',
      metadata: 'jsonb - for custom fields',
      is_guest: 'boolean',
      address: 'jsonb'
    },
    orders_table: {
      id: 'uuid',
      customer_id: 'uuid (foreign key)',
      order_number: 'text',
      status: 'text',
      total_amount: 'integer (cents)',
      items: 'jsonb',
      shipping_address: 'jsonb',
      created_at: 'timestamp'
    },
    wedding_profile_extension: {
      customer_id: 'uuid (foreign key)',
      wedding_date: 'date',
      venue: 'text',
      party_size: 'integer',
      theme_colors: 'jsonb',
      groomsmen: 'jsonb array',
      notes: 'text',
      coordinator_name: 'text',
      coordinator_email: 'text'
    }
  };
  
  return new Response(JSON.stringify(structure), { headers });
}

/**
 * Get wedding-specific product categories
 */
async function handleWeddingCategories(env, headers) {
  const categories = {
    groom: {
      suits: ['black', 'navy', 'grey', 'burgundy', 'brown'],
      tuxedos: ['classic-black', 'midnight-blue', 'white-dinner'],
      accessories: ['bowties', 'neckties', 'pocket-squares', 'cufflinks']
    },
    groomsmen: {
      suits: ['matching', 'mix-and-match'],
      vests: ['colors', 'patterns'],
      accessories: ['suspenders', 'bowties', 'neckties']
    },
    bundles: {
      'complete-wedding': ['groom + 5 groomsmen', 'groom + 8 groomsmen'],
      'groom-packages': ['3-piece-suit', 'tuxedo-complete'],
      'groomsmen-sets': ['vest-tie-sets', 'suspender-bowtie-sets']
    },
    themes: {
      'classic': ['black-white', 'navy-silver'],
      'rustic': ['brown-tan', 'burgundy-gold'],
      'beach': ['light-grey', 'tan-blue'],
      'garden': ['sage-green', 'dusty-blue']
    }
  };
  
  return new Response(JSON.stringify(categories), { headers });
}