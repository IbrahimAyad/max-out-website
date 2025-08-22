/**
 * Script to fix bundle product URLs and migrate them properly
 * Handles the special case of bundle products in subdirectories
 */

// Configuration
const WORKER_URL = 'https://kct-r2-supabase-sync.workers.dev'; // Update with your actual worker URL
const PUBLIC_R2_URL = 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev';
const CDN_URL = 'https://cdn.kctmenswear.com';

// Bundle categories found in your R2
const BUNDLE_PATHS = [
  'Bow-Tie/',
  'Bundles-Augest-2025/',
  'Dress Shirts/',
  'Fall Wedding Bundles/',
  'Spring Wedding Bundles/',
  'Summer Wedding Bundles/',
  'Tuxedo-Bundles/',
  'casual-bundles/'
];

/**
 * Generate correct CDN URLs for all bundle images
 */
async function generateBundleUrls() {
  console.log('Generating CDN URLs for bundle products...\n');
  
  const bundleUrls = {};
  
  // Process each bundle category
  for (const bundlePath of BUNDLE_PATHS) {
    const cleanPath = bundlePath.replace(/\/$/, ''); // Remove trailing slash
    const categoryKey = cleanPath.toLowerCase().replace(/\s+/g, '-');
    
    bundleUrls[categoryKey] = {
      category: cleanPath,
      path: `suitshirttie/kct-products/${cleanPath}/`,
      publicUrl: `${PUBLIC_R2_URL}/kct-products/${cleanPath}/`,
      cdnUrl: `${CDN_URL}/bundles/${categoryKey}/`,
      images: []
    };
  }
  
  // Special handling for Bundles-August-2025 with subdirectories
  bundleUrls['bundles-august-2025'] = {
    category: 'Bundles-Augest-2025',
    subfolders: [
      'Bundles-01',
      'Bundles-02',
      'Bundles-03',
      // Add more if they exist
    ],
    images: []
  };
  
  return bundleUrls;
}

/**
 * List all bundle images from your worker
 */
async function listBundleImages() {
  try {
    const response = await fetch(`${WORKER_URL}/list-images`);
    const data = await response.json();
    
    // Filter for bundle products
    const bundleImages = data.images.filter(img => 
      img.path.includes('Bundles') || 
      img.path.includes('bundle') || 
      img.path.includes('Bow-Tie') ||
      img.path.includes('Dress Shirts') ||
      img.path.includes('Tuxedo')
    );
    
    console.log(`Found ${bundleImages.length} bundle images\n`);
    return bundleImages;
  } catch (error) {
    console.error('Error listing images:', error);
    return [];
  }
}

/**
 * Transform bundle image URLs to proper CDN format
 */
function transformBundleUrls(images) {
  const transformed = [];
  
  for (const image of images) {
    // Parse the current path
    const parts = image.path.split('/');
    
    // Handle different bundle structures
    let cdnUrl;
    let productInfo = {};
    
    if (image.path.includes('Bundles-Augest-2025')) {
      // Special case: suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/image.png
      const bundleNumber = parts[3]; // Bundles-01, Bundles-02, etc.
      const imageName = parts[4];
      
      cdnUrl = `${CDN_URL}/bundles/august-2025/${bundleNumber.toLowerCase()}/${imageName}`;
      
      productInfo = {
        category: 'bundles',
        subcategory: 'august-2025',
        bundle: bundleNumber.toLowerCase(),
        productSlug: imageName.replace(/\.(png|jpg|webp)$/, '').replace(/\s+/g, '-'),
        imageName: imageName
      };
      
    } else if (image.path.includes('Bow-Tie')) {
      const imageName = parts[parts.length - 1];
      cdnUrl = `${CDN_URL}/bundles/bow-tie/${imageName}`;
      
      productInfo = {
        category: 'bundles',
        subcategory: 'bow-tie',
        productSlug: imageName.replace(/\.(png|jpg|webp)$/, '').replace(/\s+/g, '-'),
        imageName: imageName
      };
      
    } else if (image.path.includes('Dress Shirts')) {
      const imageName = parts[parts.length - 1];
      cdnUrl = `${CDN_URL}/bundles/dress-shirts/${imageName}`;
      
      productInfo = {
        category: 'bundles',
        subcategory: 'dress-shirts',
        productSlug: imageName.replace(/\.(png|jpg|webp)$/, '').replace(/\s+/g, '-'),
        imageName: imageName
      };
      
    } else {
      // Generic bundle handling
      const bundleType = parts[2].toLowerCase().replace(/\s+/g, '-');
      const imageName = parts[parts.length - 1];
      
      cdnUrl = `${CDN_URL}/bundles/${bundleType}/${imageName}`;
      
      productInfo = {
        category: 'bundles',
        subcategory: bundleType,
        productSlug: imageName.replace(/\.(png|jpg|webp)$/, '').replace(/\s+/g, '-'),
        imageName: imageName
      };
    }
    
    transformed.push({
      originalPath: image.path,
      publicR2Url: `${PUBLIC_R2_URL}/${image.path}`,
      cdnUrl: cdnUrl,
      ...productInfo
    });
  }
  
  return transformed;
}

/**
 * Generate a CSV file with all bundle URLs
 */
function generateCSV(bundleData) {
  let csv = 'Original Path,Public R2 URL,CDN URL,Category,Subcategory,Product Slug\n';
  
  for (const bundle of bundleData) {
    csv += `"${bundle.originalPath}","${bundle.publicR2Url}","${bundle.cdnUrl}","${bundle.category}","${bundle.subcategory}","${bundle.productSlug}"\n`;
  }
  
  return csv;
}

/**
 * Migrate bundles to proper structure
 */
async function migrateBundles(dryRun = true) {
  console.log('Starting bundle migration process...\n');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'ACTUAL MIGRATION'}\n`);
  
  // Step 1: Generate URL mappings
  const bundleUrls = await generateBundleUrls();
  console.log('Bundle categories identified:', Object.keys(bundleUrls).join(', '));
  
  // Step 2: List actual images
  const images = await listBundleImages();
  
  // Step 3: Transform URLs
  const transformed = transformBundleUrls(images);
  
  // Step 4: Generate output
  console.log('\n=== Bundle URL Mappings ===\n');
  
  // Group by category for better readability
  const grouped = {};
  for (const item of transformed) {
    if (!grouped[item.subcategory]) {
      grouped[item.subcategory] = [];
    }
    grouped[item.subcategory].push(item);
  }
  
  // Display grouped results
  for (const [category, items] of Object.entries(grouped)) {
    console.log(`\n${category.toUpperCase()} (${items.length} images):`);
    console.log('-'.repeat(50));
    
    for (const item of items.slice(0, 3)) { // Show first 3 of each category
      console.log(`\nProduct: ${item.productSlug}`);
      console.log(`Current: ${item.publicR2Url}`);
      console.log(`New CDN: ${item.cdnUrl}`);
    }
    
    if (items.length > 3) {
      console.log(`... and ${items.length - 3} more`);
    }
  }
  
  // Step 5: Generate CSV
  const csv = generateCSV(transformed);
  const fs = require('fs').promises;
  await fs.writeFile('bundle-urls.csv', csv);
  console.log('\n✅ CSV file saved as: bundle-urls.csv');
  
  // Step 6: Migration commands
  if (!dryRun) {
    console.log('\n=== Starting Migration ===\n');
    
    for (const item of transformed) {
      const migrationUrl = `${WORKER_URL}/migrate?mode=copy&rename=custom`;
      console.log(`Migrating: ${item.productSlug}`);
      
      // Call your worker to migrate with proper structure
      // This would need custom logic in your worker to handle the rename
    }
  } else {
    console.log('\n=== Migration Commands (DRY RUN) ===\n');
    console.log('To migrate these bundles with proper structure, run:');
    console.log('\n1. Copy with new structure:');
    console.log(`curl "${WORKER_URL}/migrate?mode=copy&prefix=suitshirttie/kct-products/Bundles-Augest-2025/"`);
    
    console.log('\n2. Sync to Supabase:');
    console.log(`curl -X POST "${WORKER_URL}/sync-to-supabase" -d '{"updateExisting": true}'`);
  }
  
  return transformed;
}

/**
 * Quick fix: Generate all URLs for Bundles-August-2025/Bundles-01
 */
function quickFixBundle01() {
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
  
  console.log('\n=== Bundle-01 Direct URLs ===\n');
  
  const urls = bundle01Images.map(image => {
    const publicUrl = `${PUBLIC_R2_URL}/kct-products/Bundles-Augest-2025/Bundles-01/${image}`;
    const cdnUrl = `${CDN_URL}/bundles/august-2025/bundles-01/${image}`;
    
    return {
      image: image,
      publicR2: publicUrl,
      cdn: cdnUrl
    };
  });
  
  // Display as table
  console.log('Image Name | Public R2 URL | CDN URL');
  console.log('-'.repeat(100));
  
  for (const url of urls) {
    console.log(`${url.image.padEnd(40)} | ${url.publicR2} | ${url.cdn}`);
  }
  
  return urls;
}

// Run the script
async function main() {
  console.log('Bundle URL Fix Script');
  console.log('='.repeat(50));
  
  // Quick fix for Bundle-01
  const bundle01Urls = quickFixBundle01();
  
  // Full migration analysis
  await migrateBundles(true); // Dry run first
  
  console.log('\n=== Summary ===');
  console.log('1. All bundle URLs have been generated');
  console.log('2. CSV file created: bundle-urls.csv');
  console.log('3. To apply migration, run: node fix-bundles.js --migrate');
}

// Check if running with --migrate flag
const shouldMigrate = process.argv.includes('--migrate');
if (shouldMigrate) {
  migrateBundles(false);
} else {
  main();
}