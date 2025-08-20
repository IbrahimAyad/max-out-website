import { createClient } from './client'
import { supabaseAdmin } from './client'
import { fetchProductsWithImages } from '@/lib/shared/supabase-products'
import { 
  Product, 
  ProductWithVariants, 
  EnhancedProduct, 
  ProductFilters, 
  ProductSortOptions,
  ProductSearchParams,
  toEnhancedProduct 
} from './types'

/**
 * Get all products with optional filtering and sorting
 */
export async function getProducts(params: ProductSearchParams = {}) {
  const { filters = {}, sort = { field: 'created_at', direction: 'desc' }, page = 1, limit = 50 } = params

  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      throw new Error('Supabase client not configured')
    }

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        product_variants (
          id,
          sku,
          size,
          color,
          inventory_quantity,
          price
        )
      `)
      .eq('status', 'active')
      .eq('visibility', true)

    // Apply filters
    if (filters.category) {
      query = query.eq('product_type', filters.category)
    }
    if (filters.vendor) {
      query = query.eq('vendor', filters.vendor)
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice * 100) // Convert to cents
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice * 100) // Convert to cents
    }
    if (filters.inStock) {
      query = query.gt('total_inventory', 0)
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Apply sorting
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }

    const products = (data || []).map(toEnhancedProduct)

    return {
      products,
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error in getProducts:', error)
    throw error
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<EnhancedProduct | null> {
  try {
    // Import the shared service getProduct function
    const { getProduct: getProductFromShared } = await import('@/lib/shared/supabase-products')
    
    // Use the optimized single product query
    const result = await getProductFromShared(id)
    
    if (!result.success || !result.data) {
      console.error('Error fetching product:', result.error)
      return null
    }

    // Convert to enhanced product format
    return toEnhancedProduct({
      ...result.data,
      product_variants: result.data.variants || [],
      product_images: result.data.images || []
    } as any)
  } catch (error) {
    console.error('Error in getProductById:', error)
    return null
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string, limit = 20) {
  return getProducts({
    filters: { category },
    sort: { field: 'created_at', direction: 'desc' },
    limit
  })
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 8) {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase client not configured')
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        product_variants (
          id,
          sku,
          size,
          color,
          inventory_quantity,
          price
        )
      `)
      .eq('status', 'active')
      .eq('visibility', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured products:', error)
      throw error
    }

    return (data || []).map(toEnhancedProduct)
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error)
    return []
  }
}

/**
 * Get product recommendations
 */
export async function getProductRecommendations(productId: string, limit = 4) {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase client not configured')
    }

    // First get the current product to know its category
    const currentProduct = await getProductById(productId)
    if (!currentProduct) return []

    // Get similar products from the same category
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        product_variants (
          id,
          sku,
          size,
          color,
          inventory_quantity,
          price
        )
      `)
      .eq('status', 'active')
      .eq('visibility', true)
      .eq('product_type', currentProduct.productType)
      .neq('id', productId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recommendations:', error)
      throw error
    }

    return (data || []).map(toEnhancedProduct)
  } catch (error) {
    console.error('Error in getProductRecommendations:', error)
    return []
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string, limit = 20) {
  return getProducts({
    filters: { search: query },
    limit
  })
}

/**
 * Get product categories
 */
export async function getProductCategories() {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase client not configured')
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('product_type')
      .eq('status', 'active')
      .eq('visibility', true)
      .not('product_type', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    // Extract unique categories
    const categories = [...new Set(data?.map((p: any) => p.product_type) || [])]
    return categories.filter(Boolean)
  } catch (error) {
    console.error('Error in getProductCategories:', error)
    return []
  }
}

/**
 * Get a single product (alias for getProductById)
 */
export async function getProduct(id: string) {
  return getProductById(id)
}

/**
 * Get product vendors
 */
export async function getProductVendors() {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase client not configured')
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('vendor')
      .eq('status', 'active')
      .eq('visibility', true)
      .not('vendor', 'is', null)

    if (error) {
      console.error('Error fetching vendors:', error)
      throw error
    }

    // Extract unique vendors
    const vendors = [...new Set(data?.map((p: any) => p.vendor) || [])]
    return vendors.filter(Boolean)
  } catch (error) {
    console.error('Error in getProductVendors:', error)
    return []
  }
}

/**
 * Get product colors
 */
export async function getProductColors() {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase client not configured')
    }

    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .select('color')
      .not('color', 'is', null)

    if (error) {
      console.error('Error fetching colors:', error)
      throw error
    }

    // Extract unique colors
    const colors = [...new Set(data?.map((v: any) => v.color) || [])]
    return colors.filter(Boolean)
  } catch (error) {
    console.error('Error in getProductColors:', error)
    return []
  }
}

/**
 * Get product price range
 */
export async function getProductPriceRange() {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase client not configured')
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('price')
      .eq('status', 'active')
      .eq('visibility', true)
      .not('price', 'is', null)

    if (error) {
      console.error('Error fetching price range:', error)
      throw error
    }

    const prices = data?.map((p: any) => p.price) || []
    if (prices.length === 0) {
      return { min: 0, max: 100000 } // Default range in cents
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  } catch (error) {
    console.error('Error in getProductPriceRange:', error)
    return { min: 0, max: 100000 } // Default range in cents
  }
}