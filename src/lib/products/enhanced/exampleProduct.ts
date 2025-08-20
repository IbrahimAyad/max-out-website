// Example Enhanced Product - Demonstrates the new system structure
import { EnhancedProduct } from './types';

export const exampleEnhancedProduct: EnhancedProduct = {
  id: 'example-enhanced-navy-suit',
  name: 'Premium Navy Wool Suit - Enhanced',
  slug: 'premium-navy-wool-suit-enhanced',
  category: 'suits',
  subcategory: 'business',
  brand: 'KCT Menswear',
  
  // Core pricing - $399.99 used for checkout
  base_price: 399.99,
  currency: 'USD',
  
  // 20-tier pricing system for display/organization
  pricing_tiers: [
    {
      tier_id: 1,
      tier_name: 'Value',
      price_range: { min: 0, max: 99.99 },
      description: 'Essential quality at budget-friendly prices',
      target_segment: 'students'
    },
    {
      tier_id: 5,
      tier_name: 'Standard',
      price_range: { min: 200, max: 299.99 },
      description: 'Quality pieces for everyday wear',
      target_segment: 'professionals'
    },
    {
      tier_id: 8,
      tier_name: 'Premium',
      price_range: { min: 350, max: 499.99 },
      description: 'Superior materials and craftsmanship',
      target_segment: 'executives'
    },
    {
      tier_id: 12,
      tier_name: 'Luxury',
      price_range: { min: 500, max: 799.99 },
      description: 'Finest fabrics with expert tailoring',
      target_segment: 'luxury buyers'
    },
    {
      tier_id: 16,
      tier_name: 'Elite',
      price_range: { min: 800, max: 1199.99 },
      description: 'Exclusive designs with premium customization',
      target_segment: 'VIP clients'
    },
    {
      tier_id: 20,
      tier_name: 'Bespoke',
      price_range: { min: 1200, max: 2999.99 },
      description: 'Fully custom, handcrafted pieces',
      target_segment: 'ultra-luxury'
    }
  ],
  
  // Enhanced image system with JSONB structure
  images: {
    primary: {
      id: 'primary-navy-suit-001',
      url: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
      cdn_url: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/primary.webp',
      alt_text: 'Premium Navy Wool Suit - Front View',
      width: 1200,
      height: 1600,
      format: 'webp',
      file_size: 156000,
      color_dominant: '#1e3a8a',
      tags: ['suit', 'navy', 'wool', 'business'],
      sort_order: 1,
      responsive_urls: {
        thumbnail: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/primary-150.webp',
        small: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/primary-300.webp',
        medium: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/primary-600.webp',
        large: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/primary-1200.webp',
        xl: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/primary-2400.webp'
      }
    },
    gallery: [
      {
        id: 'gallery-navy-suit-002',
        url: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-3-main.jpg',
        cdn_url: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/side-view.webp',
        alt_text: 'Premium Navy Wool Suit - Side Profile',
        width: 1200,
        height: 1600,
        format: 'webp',
        sort_order: 2,
        responsive_urls: {
          thumbnail: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/side-150.webp',
          small: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/side-300.webp',
          medium: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/side-600.webp',
          large: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/side-1200.webp',
          xl: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/side-2400.webp'
        }
      },
      {
        id: 'gallery-navy-suit-003',
        url: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/back-view.webp',
        cdn_url: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/back-view.webp',
        alt_text: 'Premium Navy Wool Suit - Back View',
        width: 1200,
        height: 1600,
        format: 'webp',
        sort_order: 3,
        responsive_urls: {
          thumbnail: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/back-150.webp',
          small: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/back-300.webp',
          medium: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/back-600.webp',
          large: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/back-1200.webp',
          xl: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/back-2400.webp'
        }
      }
    ],
    variants: [
      {
        variant_id: 'navy-color-variant',
        variant_name: 'Navy Blue',
        variant_type: 'color',
        images: [
          {
            id: 'navy-variant-001',
            url: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/navy-swatch.webp',
            cdn_url: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/navy-swatch.webp',
            alt_text: 'Navy Blue Fabric Swatch',
            width: 400,
            height: 400,
            format: 'webp',
            sort_order: 1,
            responsive_urls: {
              thumbnail: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/navy-swatch-150.webp',
              small: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/navy-swatch-300.webp',
              medium: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/navy-swatch-400.webp',
              large: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/navy-swatch-400.webp',
              xl: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/navy-swatch-400.webp'
            }
          }
        ]
      }
    ],
    lifestyle: [
      {
        id: 'lifestyle-001',
        url: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/lifestyle-office.webp',
        cdn_url: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/lifestyle-office.webp',
        alt_text: 'Professional wearing navy suit in office setting',
        width: 1600,
        height: 1200,
        format: 'webp',
        sort_order: 1,
        tags: ['lifestyle', 'office', 'professional'],
        responsive_urls: {
          thumbnail: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/lifestyle-office-150.webp',
          small: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/lifestyle-office-300.webp',
          medium: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/lifestyle-office-600.webp',
          large: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/lifestyle-office-1200.webp',
          xl: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/lifestyle-office-1600.webp'
        }
      }
    ],
    detail_shots: [
      {
        id: 'detail-buttons',
        url: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/detail-buttons.webp',
        cdn_url: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/detail-buttons.webp',
        alt_text: 'Close-up of suit jacket buttons and lapel',
        width: 800,
        height: 600,
        format: 'webp',
        sort_order: 1,
        tags: ['detail', 'buttons', 'lapel'],
        responsive_urls: {
          thumbnail: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/detail-buttons-150.webp',
          small: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/detail-buttons-300.webp',
          medium: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/detail-buttons-600.webp',
          large: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/detail-buttons-800.webp',
          xl: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/detail-buttons-800.webp'
        }
      }
    ]
  },
  
  // Rich product information
  description: 'Expertly crafted from premium Italian wool, this navy suit represents the perfect balance of modern style and timeless elegance. The enhanced fabric blend offers superior drape and comfort while maintaining a sharp, professional appearance throughout the day.',
  short_description: 'Premium navy wool suit with modern cut and superior comfort',
  features: [
    'Italian wool blend fabric',
    'Half-canvas construction',
    'Notched lapel design',
    'Two-button closure',
    'Side vents for mobility',
    'Fully lined with premium silk',
    'Interior chest pocket',
    'Surgeon\'s cuffs with working buttons',
    'Modern slim fit',
    'Dry clean only'
  ],
  care_instructions: [
    'Dry clean only - do not machine wash',
    'Hang on shaped hangers to maintain form',
    'Steam lightly to remove wrinkles',
    'Store in breathable garment bag',
    'Rotate wearing to extend fabric life',
    'Professional pressing recommended'
  ],
  
  // Product specifications
  specifications: {
    material: '100% Premium Italian Wool',
    fabric_blend: ['Wool 100%'],
    care_instructions: ['Dry clean only'],
    country_of_origin: 'Italy',
    
    size_chart: {
      chart_type: 'suits',
      sizes: [
        {
          size_code: '40R',
          display_name: '40 Regular',
          measurements: {
            chest: 40,
            waist: 34,
            length: 31,
            shoulder: 18
          },
          availability: true,
          stock_count: 5
        },
        {
          size_code: '42R',
          display_name: '42 Regular',
          measurements: {
            chest: 42,
            waist: 36,
            length: 31,
            shoulder: 18.5
          },
          availability: true,
          stock_count: 8
        },
        {
          size_code: '44R',
          display_name: '44 Regular',
          measurements: {
            chest: 44,
            waist: 38,
            length: 31,
            shoulder: 19
          },
          availability: true,
          stock_count: 3
        }
      ],
      measurement_guide: 'https://cdn.kctmenswear.com/size-guides/suits-measurement-guide.pdf'
    },
    
    fit_type: 'slim',
    
    style_details: {
      lapel_style: 'Notched',
      button_count: 2,
      vents: 'side',
      closure_type: 'Two-button',
      pattern: 'Solid',
      texture: 'Smooth',
      season: ['Fall', 'Winter', 'Spring'],
      formality_level: 'business'
    },
    
    customizable: true,
    customization_options: [
      {
        option_id: 'lapel-style',
        option_name: 'Lapel Style',
        option_type: 'style',
        available_choices: [
          {
            choice_id: 'notched',
            choice_name: 'Notched Lapel',
            display_value: 'Classic notched lapel (included)',
            price_modifier: 0,
            availability: true
          },
          {
            choice_id: 'peaked',
            choice_name: 'Peaked Lapel',
            display_value: 'Formal peaked lapel (+$50)',
            price_modifier: 50,
            availability: true
          }
        ],
        required: true
      },
      {
        option_id: 'monogram',
        option_name: 'Monogram',
        option_type: 'monogram',
        available_choices: [
          {
            choice_id: 'none',
            choice_name: 'No Monogram',
            price_modifier: 0,
            availability: true
          },
          {
            choice_id: 'initials',
            choice_name: 'Custom Initials',
            display_value: 'Interior jacket monogram (+$25)',
            price_modifier: 25,
            availability: true
          }
        ],
        required: false
      }
    ]
  },
  
  // Inventory and availability
  inventory: {
    total_stock: 16,
    reserved_stock: 0,
    available_stock: 16,
    variant_inventory: [
      {
        variant_id: '40R',
        variant_type: 'size',
        variant_value: '40 Regular',
        stock_count: 5,
        reserved_count: 0,
        available_count: 5
      },
      {
        variant_id: '42R',
        variant_type: 'size',
        variant_value: '42 Regular',
        stock_count: 8,
        reserved_count: 0,
        available_count: 8
      },
      {
        variant_id: '44R',
        variant_type: 'size',
        variant_value: '44 Regular',
        stock_count: 3,
        reserved_count: 0,
        available_count: 3
      }
    ],
    low_stock_threshold: 5,
    allow_backorder: false,
    sku: 'KCT-SUIT-NAVY-PREM-001',
    barcode: '123456789012',
    supplier_sku: 'IT-WOOL-NAVY-SL'
  },
  
  // SEO and marketing
  seo: {
    meta_title: 'Premium Navy Wool Suit - Italian Craftsmanship | KCT Menswear',
    meta_description: 'Shop our premium navy wool suit crafted from Italian fabric. Modern slim fit with half-canvas construction. Perfect for business and formal occasions.',
    meta_keywords: ['navy suit', 'italian wool', 'business suit', 'slim fit', 'premium menswear'],
    og_title: 'Premium Navy Wool Suit - KCT Menswear',
    og_description: 'Expertly crafted Italian wool suit with modern styling and superior comfort.',
    og_image: 'https://cdn.kctmenswear.com/products/suits/premium-navy-wool/og-image.webp',
    schema_type: 'Product',
    canonical_url: 'https://kctmenswear.com/products/premium-navy-wool-suit-enhanced'
  },
  
  // Product status
  status: 'active',
  featured: true,
  trending: false,
  
  // Timestamps (would be set by database)
  created_at: '2025-01-15T10:00:00Z',
  updated_at: '2025-01-15T10:00:00Z',
  
  // Metadata for extensibility
  metadata: {
    created_by: 'admin',
    last_updated_by: 'admin',
    source_migration: 'new_enhanced_system',
    quality_score: 95,
    seo_optimized: true,
    images_optimized: true,
    mobile_friendly: true
  }
};

// Export pricing tier information for reference
export const EXAMPLE_PRICING_TIERS = exampleEnhancedProduct.pricing_tiers;

// Export for testing hybrid system
export const exampleHybridProductResult = {
  source: 'enhanced' as const,
  legacy_product: undefined,
  enhanced_product: exampleEnhancedProduct
};