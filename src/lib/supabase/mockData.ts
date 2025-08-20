import { EnhancedProduct } from './types'

export const mockProducts: EnhancedProduct[] = [
  {
    id: 'mock-1',
    name: 'Classic Black Tuxedo',
    description: 'Elegant black tuxedo perfect for formal occasions',
    category: 'Formal Wear',
    vendor: 'KCT Premium',
    productType: 'Tuxedo',
    sku: 'TUX-BLK-001',
    handle: 'classic-black-tuxedo',
    price: 59900, // $599.00 in cents
    compareAtPrice: 89900,
    weight: null,
    status: 'active',
    visibility: true,
    featured: true,
    requiresShipping: true,
    taxable: true,
    trackInventory: true,
    tags: ['formal', 'tuxedo', 'wedding', 'black-tie'],
    metaTitle: null,
    metaDescription: null,
    seoTitle: null,
    seoDescription: null,
    images: ['/placeholder-product.svg'],
    primaryImage: '/placeholder-product.svg',
    variants: [
      { 
        id: 'v1', 
        productId: 'mock-1', 
        title: '38R', 
        option1: '38R', 
        option2: null, 
        option3: null, 
        price: 59900, 
        compareAtPrice: null, 
        costPrice: null, 
        sku: 'TUX-BLK-001-38R', 
        barcode: null, 
        inventoryQuantity: 5, 
        allowBackorders: false, 
        weight: null, 
        available: true 
      },
      { 
        id: 'v2', 
        productId: 'mock-1', 
        title: '40R', 
        option1: '40R', 
        option2: null, 
        option3: null, 
        price: 59900, 
        compareAtPrice: null, 
        costPrice: null, 
        sku: 'TUX-BLK-001-40R', 
        barcode: null, 
        inventoryQuantity: 8, 
        allowBackorders: false, 
        weight: null, 
        available: true 
      }
    ],
    additionalInfo: null,
    viewCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    inStock: true,
    totalInventory: 13,
    isFeatured: true,
    brand: 'KCT Premium'
  }
]