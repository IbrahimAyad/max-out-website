import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

// Vest & Tie products data with Cloudflare R2 URLs
const vestProducts = [
  {
    name: 'Turquoise Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/Turquoise-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/Turquoise-vest.jpg',
    colorFamily: 'Blue'
  },
  {
    name: 'Blush Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/blush-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/blush-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Burnt Orange Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/burnt-orange-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/burnt-orange-vest.jpg',
    colorFamily: 'Orange'
  },
  {
    name: 'Canary Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/canary-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/canary-vest.jpg',
    colorFamily: 'Yellow'
  },
  {
    name: 'Carolina Blue Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/carolina-blue-men-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/carolina-blue-men-vest.jpg',
    colorFamily: 'Blue'
  },
  {
    name: 'Chocolate Brown Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/chocolate-brown-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/chocolate-brown-vest.jpg',
    colorFamily: 'Brown'
  },
  {
    name: 'Coral Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/coral-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/coral-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Dark Burgundy Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dark-burgundy-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dar-burgundy-vest.jpg',
    colorFamily: 'Red'
  },
  {
    name: 'Dusty Rose Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-rose-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-rose-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Dusty Sage Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-sage-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-sage-vest.png',
    colorFamily: 'Green'
  },
  {
    name: 'Emerald Green Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/emerald-green=model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/emerald-green-vest.jpg',
    colorFamily: 'Green'
  },
  {
    name: 'Fuchsia Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/fuchsia-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/fuchsia-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Gold Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/gold-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/gold-vest.jpg',
    colorFamily: 'Yellow'
  },
  {
    name: 'Grey Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/grey-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/grey-vest.jpg',
    colorFamily: 'Grey'
  },
  {
    name: 'Hunter Green Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/hunter-green-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/hunter-green-model.jpg',
    colorFamily: 'Green'
  },
  {
    name: 'Lilac Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/lilac-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/lilac-vest.jpg',
    colorFamily: 'Purple'
  },
  {
    name: 'Mint Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/mint-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/mint-vest.jpg',
    colorFamily: 'Green'
  },
  {
    name: 'Peach Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/peach-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/peach-vest.jpg',
    colorFamily: 'Orange'
  },
  {
    name: 'Pink Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/pink-vest-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/pink-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Plum Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/plum-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/plum-vest.jpg',
    colorFamily: 'Purple'
  },
  {
    name: 'Powder Blue Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/powder-blue-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/powder-blue-vest.jpg',
    colorFamily: 'Blue'
  },
  {
    name: 'Red Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/red-vest-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/red-vest.jpg',
    colorFamily: 'Red'
  },
  {
    name: 'Rose Gold Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/rose-gold-vest.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/rose-gold-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Royal Blue Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/royal-blue-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/royal-blue-model.jpg',
    colorFamily: 'Blue'
  },
  {
    name: 'Wine Vest & Tie Set',
    modelImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/wine-model.png',
    productImage: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/wine-veset.jpg',
    colorFamily: 'Red'
  }
]

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
    }

    await updateVestTieProducts()
    
    return NextResponse.json({ 
      success: true,
      message: 'Vest and tie products updated successfully'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to update vest and tie products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}