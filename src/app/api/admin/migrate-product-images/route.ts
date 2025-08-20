import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCDNUrls, fixLegacyUrl } from '@/lib/utils/cdn-url-generator';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
    }
    
    // Get all products that need image migration
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, primary_image')
      .eq('status', 'active');
    
    if (error) {
      throw error;
    }
    
    if (!products || products.length === 0) {
      return NextResponse.json({ 
        message: 'No products to migrate',
        count: 0 
      });
    }
    
    const migrationResults = [];
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        // Generate CDN URLs based on product name
        const generated = generateCDNUrls(product.name);
        
        // Check if we actually generated a valid URL (not placeholder)
        if (generated.model === '/placeholder-product.jpg') {
          // Try to fix legacy URL if available
          const fixedUrl = fixLegacyUrl(product.primary_image, product.name);
          
          if (fixedUrl && fixedUrl !== product.primary_image) {
            // Update with fixed legacy URL
            const { error: updateError } = await supabase
              .from('products')
              .update({
                primary_image: fixedUrl,
                updated_at: new Date().toISOString()
              })
              .eq('id', product.id);
            
            if (updateError) {
              errorCount++;
              migrationResults.push({
                id: product.id,
                name: product.name,
                status: 'error',
                error: updateError.message
              });
            } else {
              successCount++;
              migrationResults.push({
                id: product.id,
                name: product.name,
                status: 'fixed_legacy',
                newUrl: fixedUrl
              });
            }
          } else {
            skipCount++;
            migrationResults.push({
              id: product.id,
              name: product.name,
              status: 'skipped',
              reason: 'No pattern match and no legacy URL to fix'
            });
          }
        } else {
          // Update with generated CDN URL
          const { error: updateError } = await supabase
            .from('products')
            .update({
              primary_image: generated.model,
              updated_at: new Date().toISOString()
            })
            .eq('id', product.id);
          
          if (updateError) {
            errorCount++;
            migrationResults.push({
              id: product.id,
              name: product.name,
              status: 'error',
              error: updateError.message
            });
          } else {
            successCount++;
            migrationResults.push({
              id: product.id,
              name: product.name,
              status: 'success',
              newUrl: generated.model
            });
          }
        }
      } catch (err) {
        errorCount++;
        migrationResults.push({
          id: product.id,
          name: product.name,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      message: 'Migration completed',
      summary: {
        total: products.length,
        success: successCount,
        skipped: skipCount,
        errors: errorCount
      },
      results: migrationResults
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Product Image Migration Endpoint',
    description: 'This endpoint migrates product images to use the smart CDN URL generator',
    usage: 'Send a POST request to start migration',
    warning: 'This will update all product images in the database',
    benefits: [
      'Automatically generates correct CDN URLs based on product names',
      'Fixes legacy R2 domain URLs',
      'No need to manually update mappings for new products',
      'Consistent URL patterns across all products'
    ]
  });
}