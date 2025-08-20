// Image helper utilities

export const FALLBACK_PRODUCT_IMAGE = '/placeholder-product.jpg';

// Reliable fallback images using Unsplash (category-specific)
export const CDN_FALLBACKS = {
  suit: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&auto=format',
  shirt: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop&auto=format',
  tie: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=600&fit=crop&auto=format',
  bundle: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop&auto=format',
  tuxedo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&auto=format',
  blazer: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop&auto=format',
  accessories: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=600&fit=crop&auto=format',
  default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&auto=format',
};

// Map broken R2 URLs to working CDN URLs
const R2_TO_CDN_MAP: Record<string, string> = {
  // Bundle images
  'kct-prodcuts/Bundles-Augest-2025': 'products/bundles',
  'kct-prodcuts/Dress%20Shirts': 'products/shirts',
  'kct-prodcuts/Bow%3ATie': 'products/ties',
  'kct-prodcuts/suits': 'products/suits',
};

export function getProductImageUrl(imageUrl: string | undefined | null, category?: string): string {
  if (!imageUrl) return category ? CDN_FALLBACKS[category as keyof typeof CDN_FALLBACKS] || CDN_FALLBACKS.default : CDN_FALLBACKS.default;
  
  // Check for broken CDN images - immediately redirect to fallback
  if (imageUrl.includes('cdn.kctmenswear.com')) {
    console.warn(`CDN image detected (known to be down): ${imageUrl}, using fallback`);
    return category ? CDN_FALLBACKS[category as keyof typeof CDN_FALLBACKS] || CDN_FALLBACKS.default : CDN_FALLBACKS.default;
  }
  
  // Fix broken R2 URLs
  if (imageUrl.includes('pub-46371bda6faf4910b74631159fc2dfd4.r2.dev')) {
    console.warn(`Broken R2 URL detected: ${imageUrl}, using fallback`);
    return category ? CDN_FALLBACKS[category as keyof typeof CDN_FALLBACKS] || CDN_FALLBACKS.default : CDN_FALLBACKS.default;
  }
  
  // Handle relative URLs
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // Handle absolute URLs - but check for known broken domains
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Check for other known broken domains
    const brokenDomains = ['cdn.kctmenswear.com', 'pub-46371bda6faf4910b74631159fc2dfd4.r2.dev'];
    if (brokenDomains.some(domain => imageUrl.includes(domain))) {
      console.warn(`Broken domain detected: ${imageUrl}, using fallback`);
      return category ? CDN_FALLBACKS[category as keyof typeof CDN_FALLBACKS] || CDN_FALLBACKS.default : CDN_FALLBACKS.default;
    }
    return imageUrl;
  }
  
  // Handle Cloudflare Images
  if (imageUrl.includes('imagedelivery.net')) {
    return imageUrl;
  }
  
  // Handle other working R2/S3 URLs
  if (imageUrl.includes('.r2.dev') || imageUrl.includes('amazonaws.com')) {
    return imageUrl;
  }
  
  // Default to treating as relative path
  return `/${imageUrl}`;
}

export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>, category?: string) {
  const img = event.currentTarget;
  const currentSrc = img.src;
  
  console.warn(`Image failed to load: ${currentSrc}`);
  
  // Try category-specific fallback first
  if (category && CDN_FALLBACKS[category as keyof typeof CDN_FALLBACKS]) {
    const categoryFallback = CDN_FALLBACKS[category as keyof typeof CDN_FALLBACKS];
    if (currentSrc !== categoryFallback) {

      img.src = categoryFallback;
      return;
    }
  }
  
  // Try default Unsplash fallback
  if (currentSrc !== CDN_FALLBACKS.default) {
    console.log(`Trying default fallback: ${CDN_FALLBACKS.default}`);
    img.src = CDN_FALLBACKS.default;
    return;
  }
  
  // Final fallback to local placeholder
  if (currentSrc !== FALLBACK_PRODUCT_IMAGE) {
    console.log(`Trying local fallback: ${FALLBACK_PRODUCT_IMAGE}`);
    img.src = FALLBACK_PRODUCT_IMAGE;
    img.onerror = null; // Prevent further errors
  }
}

// Add a function to get the appropriate category from product type
export function getCategoryFromProductType(productType?: string): string {
  if (!productType) return 'default';
  
  const type = productType.toLowerCase();
  
  if (type.includes('suit') || type.includes('tuxedo')) return 'suit';
  if (type.includes('shirt')) return 'shirt';
  if (type.includes('tie') || type.includes('bowtie')) return 'tie';
  if (type.includes('blazer')) return 'blazer';
  if (type.includes('bundle') || type.includes('set')) return 'bundle';
  if (type.includes('accessor')) return 'accessories';
  
  return 'default';
}