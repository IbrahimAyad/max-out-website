/**
 * Definitive CDN URL patterns based on DEFINITIVE_CDN_URLS_FINAL_MANUAL_SCAN
 * These are the actual working CDN URLs verified against real files
 */

export const CDN_BASE = 'https://cdn.kctmenswear.com';

/**
 * URL patterns by product category
 */
export const CDN_PATTERNS = {
  // Suspender-Bowtie Sets
  'suspender-bowtie': {
    path: 'menswear-accessories/suspender-bowtie-set',
    files: ['model.webp', 'product.jpg', 'main.webp']
  },
  
  // Vest-Tie Sets
  'vest-tie': {
    path: 'menswear-accessories/vest-tie-set',
    files: ['model.webp', 'vest.jpg', 'main.webp']
  },
  
  // Tuxedos
  'tuxedo': {
    path: 'tuxedos',
    patterns: [
      'mens_tuxedos_suit_[id]_[num].webp',
      'mens_tuxedos_suit_model_[id]_[num].webp'
    ]
  },
  
  // Suits
  'suit': {
    path: 'suits',
    patterns: [
      'mens_suits_suit_[id]_[num].webp',
      'mens_suits_suit_model_[id]_[num].webp',
      'main.webp'
    ]
  },
  
  // Men's Shirts
  'shirt': {
    path: 'mens-shirts',
    files: ['main.webp', 'front.webp', 'lifestyle.webp', 'side.webp']
  },
  
  // Double-Breasted Suits
  'double-breasted': {
    path: 'double-breasted-suits',
    files: ['main.webp', 'lifestyle.jpg', 'front.webp', 'back.webp']
  },
  
  // Stretch Suits
  'stretch-suit': {
    path: 'stretch-suits',
    files: ['main.webp', 'lifestyle.webp', 'front.webp']
  },
  
  // Blazers (4 subcategories)
  'blazer': {
    path: 'blazers',
    subcategories: ['prom', 'summer', 'fall', 'formal'],
    files: ['main.webp', 'front.webp', 'back.webp', 'model.webp']
  }
};

/**
 * Get the correct CDN URL for a product based on its name and category
 */
export function getDefinitiveCDNUrl(productName: string, category?: string): string {
  const name = productName.toLowerCase();
  
  // Determine category from name if not provided
  if (!category) {
    if (name.includes('suspender') && name.includes('bowtie')) category = 'suspender-bowtie';
    else if (name.includes('vest') && (name.includes('tie') || name.includes('set'))) category = 'vest-tie';
    else if (name.includes('tuxedo')) category = 'tuxedo';
    else if (name.includes('double') && name.includes('breasted')) category = 'double-breasted';
    else if (name.includes('stretch') && name.includes('suit')) category = 'stretch-suit';
    else if (name.includes('blazer')) category = 'blazer';
    else if (name.includes('shirt')) category = 'shirt';
    else if (name.includes('suit')) category = 'suit';
  }
  
  // Generate slug from product name
  const slug = generateSlug(name, category);
  
  // Build URL based on category pattern
  switch (category) {
    case 'suspender-bowtie':
      return `${CDN_BASE}/menswear-accessories/suspender-bowtie-set/${slug}/model.webp`;
      
    case 'vest-tie':
      return `${CDN_BASE}/menswear-accessories/vest-tie-set/${slug}/model.webp`;
      
    case 'tuxedo':
      return `${CDN_BASE}/tuxedos/${slug}/main.webp`;
      
    case 'double-breasted':
      return `${CDN_BASE}/double-breasted-suits/${slug}/main.webp`;
      
    case 'stretch-suit':
      return `${CDN_BASE}/stretch-suits/${slug}/main.webp`;
      
    case 'blazer':
      // Determine blazer subcategory
      const subcategory = getBlazerSubcategory(name);
      return `${CDN_BASE}/blazers/${subcategory}/${slug}/main.webp`;
      
    case 'shirt':
      return `${CDN_BASE}/mens-shirts/${slug}/main.webp`;
      
    case 'suit':
      return `${CDN_BASE}/suits/${slug}/main.webp`;
      
    default:
      // Fallback to placeholder
      return '/placeholder-product.jpg';
  }
}

/**
 * Generate slug from product name
 */
function generateSlug(name: string, category?: string): string {
  // Clean up common suffixes
  let slug = name.toLowerCase()
    .replace(/\s*(suspender\s*)?(&?\s*)?bowtie\s*set$/i, '-suspender-bowtie-set')
    .replace(/\s*(&?\s*)?vest\s*(&?\s*)?(tie\s*)?set$/i, '-vest')
    .replace(/\s*tuxedo$/i, '-tuxedo')
    .replace(/\s*blazer$/i, '')
    .replace(/\s*suit$/i, '')
    .replace(/\s*shirt$/i, '');
  
  // Special handling for color-based products
  if (category === 'vest-tie' || category === 'suspender-bowtie') {
    // Extract color: "Hunter Green Vest" -> "hunter-green-vest"
    slug = slug.replace(/\s+/g, '-');
    if (!slug.endsWith('-vest') && category === 'vest-tie') {
      slug += '-vest';
    }
    if (!slug.endsWith('-set') && category === 'suspender-bowtie') {
      slug += '-suspender-bowtie-set';
    }
  } else {
    // General slug generation
    slug = slug.replace(/\s+/g, '-');
  }
  
  return slug;
}

/**
 * Determine blazer subcategory from name
 */
function getBlazerSubcategory(name: string): string {
  const lower = name.toLowerCase();
  
  if (lower.includes('prom') || lower.includes('floral') || lower.includes('paisley') || 
      lower.includes('velvet') || lower.includes('sparkle')) {
    return 'prom';
  }
  if (lower.includes('summer') || lower.includes('linen') || lower.includes('light')) {
    return 'summer';
  }
  if (lower.includes('fall') || lower.includes('autumn') || lower.includes('wool')) {
    return 'fall';
  }
  
  return 'formal'; // Default
}

/**
 * Fix a legacy URL to use the correct CDN pattern
 */
export function fixToCDNUrl(oldUrl: string, productName?: string): string {
  // If already a working CDN URL, return as-is
  if (oldUrl.startsWith(CDN_BASE)) {
    return oldUrl;
  }
  
  // If product name provided, generate new URL
  if (productName) {
    return getDefinitiveCDNUrl(productName);
  }
  
  // Try to extract product info from old URL
  const urlParts = oldUrl.split('/');
  const filename = urlParts[urlParts.length - 1];
  const productSlug = urlParts[urlParts.length - 2];
  
  // Rebuild with correct CDN base
  if (productSlug && filename) {
    // Determine category from URL path
    for (const part of urlParts) {
      if (part.includes('blazer')) return `${CDN_BASE}/blazers/prom/${productSlug}/${filename}`;
      if (part.includes('tuxedo')) return `${CDN_BASE}/tuxedos/${productSlug}/${filename}`;
      if (part.includes('suit')) return `${CDN_BASE}/suits/${productSlug}/${filename}`;
      if (part.includes('shirt')) return `${CDN_BASE}/mens-shirts/${productSlug}/${filename}`;
      if (part.includes('vest')) return `${CDN_BASE}/menswear-accessories/vest-tie-set/${productSlug}/${filename}`;
      if (part.includes('suspender')) return `${CDN_BASE}/menswear-accessories/suspender-bowtie-set/${productSlug}/${filename}`;
    }
  }
  
  return oldUrl; // Return original if can't fix
}