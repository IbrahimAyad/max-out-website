/**
 * Test script for Cloudflare Worker endpoints
 * Run after deployment to verify everything works
 */

const WORKER_URL = 'https://kct-r2-supabase-sync.workers.dev'; // Update with your actual URL

async function testEndpoints() {
  console.log('Testing Cloudflare Worker Endpoints...\n');

  // Test 1: List Images
  console.log('1. Testing /list-images endpoint...');
  try {
    const response = await fetch(`${WORKER_URL}/list-images`);
    const data = await response.json();
    console.log(`   ✓ Found ${data.total} images in R2`);
    if (data.images && data.images.length > 0) {
      console.log(`   ✓ Sample image: ${data.images[0].url}`);
    }
  } catch (error) {
    console.log(`   ✗ Error: ${error.message}`);
  }

  // Test 2: Verify Images
  console.log('\n2. Testing /verify-images endpoint...');
  try {
    const response = await fetch(`${WORKER_URL}/verify-images`);
    const data = await response.json();
    console.log(`   ✓ Verified ${data.total} images`);
    console.log(`   ✓ Valid: ${data.valid.length}, Invalid: ${data.invalid.length}`);
    if (data.fixed && data.fixed.length > 0) {
      console.log(`   ✓ Fixed ${data.fixed.length} broken URLs`);
    }
  } catch (error) {
    console.log(`   ✗ Error: ${error.message}`);
  }

  // Test 3: Sync Single Image
  console.log('\n3. Testing /sync-to-supabase endpoint...');
  try {
    const testImage = {
      path: 'blazers/wedding/test-product/front.webp',
      category: 'blazers',
      subcategory: 'wedding',
      productSlug: 'test-product',
      view: 'front',
      url: 'https://cdn.kctmenswear.com/blazers/wedding/test-product/front.webp'
    };

    const response = await fetch(`${WORKER_URL}/sync-to-supabase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        images: [testImage],
        updateExisting: true
      })
    });

    const data = await response.json();
    console.log(`   ✓ Sync completed`);
    console.log(`   ✓ Synced: ${data.synced.length}, Failed: ${data.failed.length}`);
  } catch (error) {
    console.log(`   ✗ Error: ${error.message}`);
  }

  console.log('\n✅ Testing complete!');
  console.log('\nNext steps:');
  console.log('1. Run bulk import: POST /bulk-import');
  console.log('2. Set up R2 webhook for automatic sync');
  console.log('3. Monitor with: wrangler tail');
}

// Run tests
testEndpoints().catch(console.error);