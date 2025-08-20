export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

// Complete product image mappings for all products - Updated to correct CDN domain structure
const productImageMappings: Record<string, { model: string; product: string }> = {
  // Vest & Tie Sets - Using correct CDN structure
  'Turquoise Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/turquoise-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/turquoise-vest/main.webp'
  },
  'Blush Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/blush-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/blush-vest/main.webp'
  },
  'Burnt Orange Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/burnt-orange-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/burnt-orange-vest/main.webp'
  },
  'Canary Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/canary-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/canary-vest/main.webp'
  },
  'Carolina Blue Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/carolina-blue-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/carolina-blue-vest/main.webp'
  },
  'Chocolate Brown Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/chocolate-brown-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/chocolate-brown-vest/main.webp'
  },
  'Coral Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/coral-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/coral-vest/main.webp'
  },
  'Dark Burgundy Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dark-burgundy-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dark-burgundy-vest/main.webp'
  },
  'Dusty Rose Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-rose-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-rose-vest/main.webp'
  },
  'Dusty Sage Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-sage-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-sage-vest/main.webp'
  },
  'Emerald Green Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/emerald-green-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/emerald-green-vest/main.webp'
  },
  'Fuchsia Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/fuchsia-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/fuchsia-vest/main.webp'
  },
  'Gold Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/gold-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/gold-vest/main.webp'
  },
  'Grey Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/grey-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/grey-vest/main.webp'
  },
  'Hunter Green Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/hunter-green-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/hunter-green-vest/main.webp'
  },
  'Lilac Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/lilac-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/lilac-vest/main.webp'
  },
  'Mint Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/mint-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/mint-vest/main.webp'
  },
  'Peach Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/peach-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/peach-vest/main.webp'
  },
  'Pink Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/pink-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/pink-vest/main.webp'
  },
  'Plum Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/plum-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/plum-vest/main.webp'
  },
  'Powder Blue Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/powder-blue-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/powder-blue-vest/main.webp'
  },
  'Red Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/red-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/red-vest/main.webp'
  },
  'Rose Gold Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/rose-gold-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/rose-gold-vest/main.webp'
  },
  'Royal Blue Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/royal-blue-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/royal-blue-vest/main.webp'
  },
  'Wine Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/wine-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/wine-vest/main.webp'
  },
  
  // Suspender & Bowtie Sets - Using correct CDN structure
  'Powder Blue Suspender & Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/powder-blue-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/powder-blue-suspender-bowtie-set/main.webp'
  },
  'Orange Suspender & Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/orange-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/orange-suspender-bowtie-set/main.webp'
  },
  'Medium Red Suspender & Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/medium-red-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/medium-red-suspender-bowtie-set/main.webp'
  },
  'Hunter Green Suspender & Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/hunter-green-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/hunter-green-suspender-bowtie-set/main.webp'
  },
  'Gold Suspender & Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/gold-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/gold-suspender-bowtie-set/main.webp'
  },
  'Fuchsia Suspender & Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/fuchsia-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/fuchsia-suspender-bowtie-set/main.webp'
  },
  'Dusty Rose Suspender & Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/dusty-rose-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/dusty-rose-suspender-bowtie-set/main.webp'
  },
  'Burnt Orange Suspender & Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/burnt-orange-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/burnt-orange-suspender-bowtie-set/main.webp'
  },
  'Brown Suspender & Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/brown-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/brown-suspender-bowtie-set/main.webp'
  },
  'Black Suspender & Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/black-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/black-suspender-bowtie-set/main.webp'
  }
}

// Default images for products without specific mappings
const defaultImages = {
  model: 'https://cdn.kctmenswear.com/placeholder/model.webp',
  product: 'https://cdn.kctmenswear.com/placeholder/main.webp'
}

// Function to fix product images in Supabase
async function fixProductImages() {
  const fixedIds: string[] = []
  
  try {
    // Get all products that need image fixes
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .eq('status', 'active')
      .eq('visibility', true)
    
    if (error) {

      throw error
    }
    
    if (!products || products.length === 0) {

      return fixedIds
    }
    
    // Process each product
    for (const product of products) {
      const mapping = productImageMappings[product.name]
      
      if (mapping) {
        // Update product with correct image URLs
        const { error: updateError } = await supabaseAdmin
          .from('products')
          .update({
            image_url: mapping.model,
            additional_images: [mapping.product],
            updated_at: new Date().toISOString()
          })
          .eq('id', product.id)
        
        if (updateError) {

        } else {

          fixedIds.push(product.id)
        }
      } else {

      }
    }
    
    return fixedIds
  } catch (error) {

    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
    }

    const fixedIds = await fixProductImages()
    
    return NextResponse.json({ 
      success: true,
      message: `Fixed ${fixedIds.length} products`,
      fixedProducts: fixedIds
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fix product images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}