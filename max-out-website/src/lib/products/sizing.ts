/**
 * Smart sizing functions for different product categories
 */

export type SizeCategory = 'suits' | 'shirts' | 'sweaters' | 'shoes' | 'accessories'

export interface SizeTemplate {
  category: SizeCategory
  displayType: 'grid' | 'dropdown' | 'two-step' | 'slider'
  sizes: string[]
  popularSizes?: string[]
  sizeGuideUrl?: string
}

export interface TwoStepSize {
  neck: string[]
  sleeve: string[]
}

export interface UserMeasurements {
  chest?: number
  waist?: number
  neck?: number
  sleeve?: number
  shoe?: number
}

// Popular sizes based on sales data
const POPULAR_SIZES = {
  suits: ['40R', '42R', '44R', '38R'],
  shirts: { neck: ['15.5', '16', '16.5'], sleeve: ['34/35', '32/33'] },
  sweaters: ['L', 'XL', 'M'],
  shoes: ['10', '10.5', '11', '9.5'],
}

// Size templates for different categories
export function getSizeTemplate(category: string): SizeTemplate {
  const normalizedCategory = category?.toLowerCase()
  
  switch (normalizedCategory) {
    case 'suits':
    case 'blazers':
    case 'suit jackets':
    case 'tuxedos':
      return {
        category: 'suits',
        displayType: 'grid',
        sizes: [
          '36S', '36R', '36L',
          '38S', '38R', '38L',
          '40S', '40R', '40L',
          '42S', '42R', '42L',
          '44S', '44R', '44L',
          '46S', '46R', '46L',
          '48R', '48L',
          '50R', '50L',
          '52R', '52L',
        ],
        popularSizes: POPULAR_SIZES.suits,
        sizeGuideUrl: '/size-guide/suits'
      }
      
    case 'dress shirts':
    case 'shirts':
      return {
        category: 'shirts',
        displayType: 'two-step',
        sizes: [], // Not used for two-step
        sizeGuideUrl: '/size-guide/shirts'
      }
      
    case 'sweaters':
    case 'knitwear':
    case 'pullovers':
      return {
        category: 'sweaters',
        displayType: 'dropdown',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        popularSizes: POPULAR_SIZES.sweaters,
        sizeGuideUrl: '/size-guide/sweaters'
      }
      
    case 'shoes':
    case 'footwear':
    case 'dress shoes':
      return {
        category: 'shoes',
        displayType: 'dropdown',
        sizes: [
          '7', '7.5', '8', '8.5', '9', '9.5',
          '10', '10.5', '11', '11.5', '12', '12.5',
          '13', '14', '15'
        ],
        popularSizes: POPULAR_SIZES.shoes,
        sizeGuideUrl: '/size-guide/shoes'
      }
      
    default:
      return {
        category: 'accessories',
        displayType: 'dropdown',
        sizes: ['One Size', 'S', 'M', 'L', 'XL'],
        sizeGuideUrl: '/size-guide'
      }
  }
}

// Get dress shirt size options
export function getShirtSizeOptions(): TwoStepSize {
  return {
    neck: [
      '14', '14.5', '15', '15.5', '16', '16.5', 
      '17', '17.5', '18', '18.5', '19', '19.5', '20'
    ],
    sleeve: [
      '30/31', '32/33', '34/35', '36/37', '38/39'
    ]
  }
}

// Combine neck and sleeve for shirt size
export function formatShirtSize(neck: string, sleeve: string): string {
  return `${neck}/${sleeve}`
}

// Parse combined shirt size
export function parseShirtSize(size: string): { neck: string; sleeve: string } | null {
  const match = size.match(/^(\d+\.?\d*)\/(\d+\/\d+)$/)
  if (match) {
    return { neck: match[1], sleeve: match[2] }
  }
  return null
}

// Get size recommendation based on user measurements
export function getSizeRecommendation(
  category: string, 
  measurements: UserMeasurements
): string | null {
  const normalizedCategory = category?.toLowerCase()
  
  switch (normalizedCategory) {
    case 'suits':
    case 'blazers':
      if (measurements.chest) {
        // Simple chest-to-jacket size mapping
        const jacketSize = measurements.chest - 6
        const sizes = ['S', 'R', 'L']
        // Default to R (regular) for now
        return `${jacketSize}R`
      }
      break
      
    case 'dress shirts':
    case 'shirts':
      if (measurements.neck && measurements.sleeve) {
        const neckSize = measurements.neck.toString()
        const sleeveSize = measurements.sleeve <= 33 ? '32/33' : 
                          measurements.sleeve <= 35 ? '34/35' : '36/37'
        return formatShirtSize(neckSize, sleeveSize)
      }
      break
      
    case 'sweaters':
      if (measurements.chest) {
        if (measurements.chest < 36) return 'S'
        if (measurements.chest < 40) return 'M'
        if (measurements.chest < 44) return 'L'
        if (measurements.chest < 48) return 'XL'
        return 'XXL'
      }
      break
      
    case 'shoes':
      if (measurements.shoe) {
        return measurements.shoe.toString()
      }
      break
  }
  
  return null
}

// Check if a size is popular
export function isPopularSize(category: string, size: string): boolean {
  const normalizedCategory = category?.toLowerCase()
  
  switch (normalizedCategory) {
    case 'suits':
    case 'blazers':
      return POPULAR_SIZES.suits.includes(size)
      
    case 'dress shirts':
    case 'shirts':
      const parsed = parseShirtSize(size)
      if (parsed) {
        return POPULAR_SIZES.shirts.neck.includes(parsed.neck) ||
               POPULAR_SIZES.shirts.sleeve.includes(parsed.sleeve)
      }
      break
      
    case 'sweaters':
      return POPULAR_SIZES.sweaters.includes(size)
      
    case 'shoes':
      return POPULAR_SIZES.shoes.includes(size)
  }
  
  return false
}

// Sort sizes with popular ones first
export function sortSizesWithPopular(category: string, sizes: string[]): string[] {
  return sizes.sort((a, b) => {
    const aPopular = isPopularSize(category, a)
    const bPopular = isPopularSize(category, b)
    
    if (aPopular && !bPopular) return -1
    if (!aPopular && bPopular) return 1
    
    // For shoes, sort numerically
    if (category === 'shoes') {
      return parseFloat(a) - parseFloat(b)
    }
    
    return 0
  })
}