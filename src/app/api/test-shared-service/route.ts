import { NextResponse } from 'next/server';
import { 
  testSupabaseConnection, 
  fetchProductsWithImages,
  getProduct,
  getProductImageUrl,
  formatPrice
} from '@/lib/shared/supabase-products';

export async function GET() {
  try {
    // 1. Test connection
    const connectionTest = await testSupabaseConnection();
    
    // 2. Fetch products with images
    const productsResult = await fetchProductsWithImages({ limit: 3 });
    
    // 3. Test single product fetch if we have products
    let singleProductTest = null;
    if (productsResult.success && productsResult.data.length > 0) {
      const firstProduct = productsResult.data[0];
      singleProductTest = await getProduct(firstProduct.id);
    }
    
    // 4. Test image URL generation
    const imageUrls = productsResult.data.map(product => ({
      productName: product.name,
      imageUrl: getProductImageUrl(product),
      hasImages: product.images?.length > 0
    }));
    
    return NextResponse.json({
      connection: connectionTest,
      productsWithImages: {
        success: productsResult.success,
        count: productsResult.data.length,
        firstProduct: productsResult.data[0] ? {
          name: productsResult.data[0].name,
          price: formatPrice(productsResult.data[0].base_price),
          imageCount: productsResult.data[0].images?.length || 0,
          variantCount: productsResult.data[0].variants?.length || 0
        } : null
      },
      singleProductFetch: singleProductTest ? {
        success: singleProductTest.success,
        productName: singleProductTest.data?.name
      } : null,
      imageUrls,
      summary: {
        allTestsPassed: connectionTest.success && productsResult.success,
        readyForProduction: connectionTest.success && productsResult.success && imageUrls.length > 0
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}