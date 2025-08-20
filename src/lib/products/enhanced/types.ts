// Enhanced Products System Types
// New system for individual products with 20-tier pricing and JSONB images

export interface EnhancedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  brand?: string;
  
  // Core pricing - base_price used for checkout
  base_price: number;
  currency: 'USD';
  
  // 20-tier pricing system for display/organization
  pricing_tiers: PricingTier[];
  
  // Enhanced image system with JSONB structure
  images: ProductImageGallery;
  
  // Rich product information
  description: string;
  short_description?: string;
  features: string[];
  care_instructions?: string[];
  
  // Product specifications
  specifications: ProductSpecifications;
  
  // Inventory and availability
  inventory: InventoryData;
  
  // SEO and marketing
  seo: SEOData;
  
  // Product status
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  trending: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Metadata
  metadata?: Record<string, any>;
}

export interface PricingTier {
  tier_id: number; // 1-20
  tier_name: string; // e.g., "Budget", "Standard", "Premium", "Luxury"
  price_range: {
    min: number;
    max: number;
  };
  description?: string;
  target_segment?: string; // e.g., "students", "professionals", "executives"
}

export interface ProductImageGallery {
  // Main product images
  primary: ProductImage;
  gallery: ProductImage[];
  
  // Variant-specific images (colors, styles, etc.)
  variants?: VariantImageSet[];
  
  // Lifestyle and context images
  lifestyle?: ProductImage[];
  detail_shots?: ProductImage[];
  size_guide?: ProductImage[];
  
  // 360° and AR support
  three_sixty?: ProductImage[];
  ar_model?: string; // URL to 3D model
}

export interface ProductImage {
  id: string;
  url: string;
  cdn_url?: string; // New CDN: cdn.kctmenswear.com
  alt_text: string;
  width: number;
  height: number;
  format: 'webp' | 'jpg' | 'png';
  file_size?: number;
  
  // Image metadata
  color_dominant?: string;
  tags?: string[];
  sort_order: number;
  
  // Responsive versions
  responsive_urls?: {
    thumbnail: string; // 150x150
    small: string;     // 300x300
    medium: string;    // 600x600
    large: string;     // 1200x1200
    xl: string;        // 2400x2400
  };
}

export interface VariantImageSet {
  variant_id: string;
  variant_name: string; // e.g., "Navy Blue", "Slim Fit"
  variant_type: 'color' | 'style' | 'size' | 'material';
  images: ProductImage[];
}

export interface ProductSpecifications {
  // Clothing-specific specs
  material?: string;
  fabric_blend?: string[];
  care_instructions?: string[];
  country_of_origin?: string;
  
  // Sizing information
  size_chart?: SizeChart;
  fit_type?: 'slim' | 'regular' | 'relaxed' | 'oversized';
  measurements?: Measurements;
  
  // Style details
  style_details?: StyleDetails;
  
  // Customization options
  customizable?: boolean;
  customization_options?: CustomizationOption[];
}

export interface SizeChart {
  chart_type: 'suits' | 'shirts' | 'ties' | 'shoes' | 'accessories';
  sizes: SizeOption[];
  measurement_guide?: string; // URL to size guide image/PDF
}

export interface SizeOption {
  size_code: string; // e.g., "42R", "L", "16.5"
  display_name: string;
  measurements: {
    chest?: number;
    waist?: number;
    length?: number;
    inseam?: number;
    neck?: number;
    sleeve?: number;
    [key: string]: number | undefined;
  };
  availability: boolean;
  stock_count?: number;
}

export interface Measurements {
  unit: 'inches' | 'cm';
  chest?: number;
  waist?: number;
  length?: number;
  shoulder?: number;
  sleeve?: number;
  inseam?: number;
  rise?: number;
  [key: string]: number | string | undefined;
}

export interface StyleDetails {
  lapel_style?: string; // e.g., "Notched", "Peaked", "Shawl"
  button_count?: number;
  vents?: 'none' | 'center' | 'side' | 'double';
  closure_type?: string;
  collar_style?: string;
  pattern?: string;
  texture?: string;
  season?: string[];
  formality_level?: 'casual' | 'business' | 'formal' | 'black_tie';
}

export interface CustomizationOption {
  option_id: string;
  option_name: string;
  option_type: 'color' | 'material' | 'style' | 'monogram' | 'alteration';
  available_choices: CustomizationChoice[];
  price_modifier?: number; // Additional cost for this option
  required?: boolean;
}

export interface CustomizationChoice {
  choice_id: string;
  choice_name: string;
  display_value?: string;
  image_url?: string;
  price_modifier?: number;
  availability: boolean;
}

export interface InventoryData {
  total_stock: number;
  reserved_stock: number;
  available_stock: number;
  
  // Size/variant specific inventory
  variant_inventory?: VariantInventory[];
  
  // Inventory management
  low_stock_threshold: number;
  allow_backorder: boolean;
  estimated_restock_date?: string;
  
  // Tracking
  sku?: string;
  barcode?: string;
  supplier_sku?: string;
}

export interface VariantInventory {
  variant_id: string;
  variant_type: 'size' | 'color' | 'style';
  variant_value: string;
  stock_count: number;
  reserved_count: number;
  available_count: number;
}

export interface SEOData {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  
  // Open Graph
  og_title?: string;
  og_description?: string;
  og_image?: string;
  
  // Schema.org structured data
  schema_type: 'Product';
  schema_data?: Record<string, any>;
  
  // URL and canonicals
  canonical_url?: string;
  alternate_urls?: string[];
}

// Enhanced Product Query Types
export interface EnhancedProductQuery {
  // Basic filters
  category?: string;
  subcategory?: string;
  brand?: string;
  status?: EnhancedProduct['status'];
  
  // Price filtering (using base_price)
  min_price?: number;
  max_price?: number;
  
  // Tier filtering
  pricing_tier?: number | number[];
  
  // Feature flags
  featured?: boolean;
  trending?: boolean;
  customizable?: boolean;
  
  // Inventory filters
  in_stock_only?: boolean;
  available_sizes?: string[];
  
  // Search
  search_term?: string;
  
  // Sorting
  sort_by?: 'name' | 'price' | 'created_at' | 'popularity' | 'rating';
  sort_order?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
}

export interface EnhancedProductResponse {
  products: EnhancedProduct[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
  has_more: boolean;
}

// Image fallback system for migration
export interface ImageFallbackConfig {
  // New CDN (preferred)
  primary_cdn: 'cdn.kctmenswear.com';
  
  // Fallback R2 buckets (existing)
  fallback_buckets: {
    bucket_1: 'pub-46371bda6faf4910b74631159fc2dfd4.r2.dev';
    bucket_2: 'pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev';
  };
  
  // Image optimization
  auto_webp: boolean;
  quality: number; // 1-100
  progressive: boolean;
}

// Hybrid system types - for querying both old and new products
export type UnifiedProductSource = 'legacy' | 'enhanced';

export interface HybridProductResult {
  source: UnifiedProductSource;
  legacy_product?: import('../allProducts').UnifiedProduct;
  enhanced_product?: EnhancedProduct;
}

export interface HybridProductQuery {
  // Standard filters that work across both systems
  category?: string;
  min_price?: number;
  max_price?: number;
  search_term?: string;
  in_stock_only?: boolean;
  
  // Source preference
  prefer_source?: UnifiedProductSource;
  include_legacy?: boolean;
  include_enhanced?: boolean;
  
  // Results
  sort_by?: 'relevance' | 'price' | 'name' | 'date_added';
  limit?: number;
  offset?: number;
}