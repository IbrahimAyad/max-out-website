/**
 * SHARED SUPABASE PRODUCTS SERVICE
 * This file should be identical in both the main site and admin backend
 * Last updated: 2024-08-05
 */

import { createClient } from '@/lib/supabase/client';

// Get the singleton Supabase client
const supabase = createClient();

// Product type that both projects will use
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  base_price: number;
  sale_price?: number;
  sku: string;
  shopify_id?: string;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  position: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  size?: string;
  color?: string;
  inventory_count: number;
  status: 'active' | 'out_of_stock';
  stripe_price_id?: string; // Add Stripe price ID for checkout
  stripe_product_id?: string; // Add Stripe product ID reference
}

/**
 * Fetch products with images - ALWAYS use this method
 */
export async function fetchProductsWithImages(options?: {
  category?: string;
  limit?: number;
  offset?: number;
  status?: 'active' | 'draft' | 'archived';
}) {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    if (options?.status) {
      query = query.eq('status', options.status);
    } else {
      // Default to active products only
      query = query.eq('status', 'active');
    }
    
    // Apply pagination using range (don't use both limit and range)
    if (options?.offset !== undefined && options?.limit) {
      query = query.range(options.offset, options.offset + options.limit - 1);
    } else if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    // Ensure images are sorted by position
    const productsWithSortedImages = data?.map(product => ({
      ...product,
      images: product.images?.sort((a: ProductImage, b: ProductImage) => a.position - b.position) || []
    })) || [];

    return {
      success: true,
      data: productsWithSortedImages,
      error: null
    };
  } catch (error) {
    console.error('fetchProductsWithImages error:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get single product by slug or ID
 */
export async function getProduct(slugOrId: string) {
  try {
    // First try by slug
    let { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('slug', slugOrId)
      .single();

    // If not found by slug, try by ID
    if (!data) {
      const result = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('id', slugOrId)
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) throw error;

    // Sort images by position
    if (data?.images) {
      data.images.sort((a: ProductImage, b: ProductImage) => a.position - b.position);
    }

    return {
      success: true,
      data,
      error: null
    };
  } catch (error) {
    console.error('getProduct error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get product image URL with fallback
 */
export function getProductImageUrl(product: Product, variant?: string): string {
  // Try to get primary image first
  const primaryImage = product.images?.find(img => img.is_primary);
  if (primaryImage?.url) return primaryImage.url;

  // Fall back to first image
  if (product.images && product.images.length > 0) {
    return product.images[0].url;
  }

  // Return placeholder
  return '/placeholder-product.jpg';
}

/**
 * Format price for display
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Check if product is on sale
 */
export function isOnSale(product: Product): boolean {
  return !!product.sale_price && product.sale_price < product.base_price;
}

/**
 * Get display price (sale or base)
 */
export function getDisplayPrice(product: Product): number {
  return product.sale_price || product.base_price;
}

/**
 * Get Stripe price ID for a product variant or product
 */
export function getStripePriceId(product: Product, size?: string): string | null {
  // First try to find stripe_price_id in variant for specific size
  if (size && product.variants) {
    const variant = product.variants.find(v => v.size === size);
    if (variant?.stripe_price_id) {
      return variant.stripe_price_id;
    }
  }

  // Fallback to metadata stripe_price_id
  if (product.metadata?.stripe_price_id) {
    return product.metadata.stripe_price_id;
  }

  // Legacy fallback - try to map to static stripe products
  if (product.category === 'Suits' && product.metadata?.color) {
    const colorKey = product.metadata.color.toLowerCase().replace(/\s+/g, '');
    const staticStripe = require('@/lib/services/stripeProductService').stripeProducts.suits[colorKey];
    if (staticStripe) {
      // Default to two-piece unless metadata specifies three-piece
      return product.metadata.piece_count === '3' ? staticStripe.threePiece : staticStripe.twoPiece;
    }
  }

  return null;
}

/**
 * Test connection - use this to verify Supabase is working
 */
export async function testSupabaseConnection() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // console.log('Testing Supabase connection with URL:', supabaseUrl);
    // console.log('Creating query...');
    
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    // console.log('Query response - data:', data, 'error:', error);

    if (error) throw error;

    return {
      success: true,
      message: 'Supabase connection successful',
      error: null
    };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return {
      success: false,
      message: 'Supabase connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}