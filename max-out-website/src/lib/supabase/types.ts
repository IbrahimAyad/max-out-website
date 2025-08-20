import { Database } from './database.types'

// Database table types
export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert']
export type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update']

export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductImageInsert = Database['public']['Tables']['product_images']['Insert']
export type ProductImageUpdate = Database['public']['Tables']['product_images']['Update']

export type Collection = Database['public']['Tables']['collections']['Row']
export type CollectionInsert = Database['public']['Tables']['collections']['Insert']
export type CollectionUpdate = Database['public']['Tables']['collections']['Update']

export type ProductCollection = Database['public']['Tables']['product_collections']['Row']
export type ProductCollectionInsert = Database['public']['Tables']['product_collections']['Insert']
export type ProductCollectionUpdate = Database['public']['Tables']['product_collections']['Update']

// Enhanced product types with relations
export interface ProductWithVariants extends Product {
  product_variants: ProductVariant[]
  product_images: ProductImage[]
}

export interface ProductWithImages extends Product {
  product_images: ProductImage[]
}

export interface ProductWithCollections extends Product {
  product_collections: {
    collection_id: string
    collections: Collection
  }[]
}

// Frontend-friendly product interface
export interface EnhancedProduct {
  id: string
  name: string
  description: string | null
  category: string | null
  vendor: string
  productType: string
  sku: string | null
  handle: string | null
  price: number // base_price in cents
  compareAtPrice: number | null
  weight: number | null
  status: string
  visibility: boolean
  featured: boolean
  requiresShipping: boolean
  taxable: boolean
  trackInventory: boolean
  tags: string[]
  metaTitle: string | null
  metaDescription: string | null
  seoTitle: string | null
  seoDescription: string | null
  images: string[] // Array of image URLs from product_images
  primaryImage: string | null
  variants: EnhancedVariant[]
  additionalInfo: Record<string, any> | null
  viewCount: number
  createdAt: string
  updatedAt: string
  inStock: boolean
  totalInventory: number
  isFeatured: boolean
  brand: string | null
}

export interface EnhancedVariant {
  id: string
  productId: string
  title: string
  price: number
  compareAtPrice: number | null
  costPrice: number | null
  sku: string | null
  barcode: string | null
  inventoryQuantity: number
  allowBackorders: boolean
  weight: number | null
  option1: string | null
  option2: string | null
  option3: string | null
  available: boolean
}

// Product filters and search
export interface ProductFilters {
  category?: string
  categories?: string[]
  collections?: string[]
  priceRange?: { min: number; max: number }
  minPrice?: number
  maxPrice?: number
  color?: string
  colors?: string[]
  vendor?: string
  vendors?: string[]
  tags?: string[]
  inStock?: boolean
  available?: boolean
  featured?: boolean
  search?: string
}

export interface ProductSortOptions {
  field: 'name' | 'title' | 'price' | 'base_price' | 'created_at' | 'view_count'
  direction: 'asc' | 'desc'
}

export interface ProductSearchParams {
  filters?: ProductFilters
  sort?: ProductSortOptions
  page?: number
  limit?: number
}

// Product categories based on your database
export const PRODUCT_CATEGORIES = [
  'Vest & Tie Sets',
  'Sparkle Vest Sets',
  'Suspender & Bowtie Sets'
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]

// Helper function to convert database product to enhanced product
export function toEnhancedProduct(product: ProductWithVariants): EnhancedProduct {
  // Handle both formats: product_images (old) and images (shared service)
  let images: string[] = []
  
  if (product.product_images) {
    // Old format
    images = product.product_images
      .sort((a, b) => a.position - b.position)
      .map(img => img.image_url) || []
  } else if ((product as any).images) {
    // Shared service format
    const productImages = (product as any).images
    if (Array.isArray(productImages)) {
      images = productImages
        .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
        .map((img: any) => img.url || img.image_url) || []
    }
  }

  const primaryImage = images[0] || null

  // Calculate inventory from variants
  const variants = product.product_variants || (product as any).variants || []
  const totalInventory = variants.reduce((sum: number, v: any) => {
    return sum + (v.inventory_quantity || 0)
  }, 0)
  
  // Check if product is in stock (has inventory or doesn't track inventory)
  const inStock = product.track_inventory === false || 
    totalInventory > 0 || 
    variants.some((v: any) => v.available && (!v.inventory_quantity || v.inventory_quantity > 0))

  // Get compare at price from first variant if available
  const compareAtPrice = variants.length > 0 && variants[0].compare_at_price 
    ? variants[0].compare_at_price 
    : null

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    vendor: product.vendor,
    productType: product.product_type,
    sku: product.sku,
    handle: product.handle,
    price: product.base_price,
    compareAtPrice,
    weight: product.weight,
    status: product.status,
    visibility: product.visibility,
    featured: product.featured,
    requiresShipping: product.requires_shipping,
    taxable: product.taxable,
    trackInventory: product.track_inventory,
    tags: product.tags || [],
    metaTitle: product.meta_title,
    metaDescription: product.meta_description,
    seoTitle: product.seo_title,
    seoDescription: product.seo_description,
    images,
    primaryImage,
    variants: variants.map((v: any) => ({
      id: v.id,
      productId: v.product_id,
      title: v.title,
      price: v.price,
      compareAtPrice: v.compare_at_price,
      costPrice: v.cost_price,
      sku: v.sku,
      barcode: v.barcode,
      inventoryQuantity: v.inventory_quantity || 0,
      allowBackorders: v.allow_backorders || false,
      weight: v.weight,
      option1: v.option1,
      option2: v.option2,
      option3: v.option3,
      available: v.available !== false
    })),
    additionalInfo: product.additional_info as Record<string, any> | null,
    viewCount: product.view_count,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    inStock,
    totalInventory,
    isFeatured: product.featured,
    brand: product.vendor
  }
}