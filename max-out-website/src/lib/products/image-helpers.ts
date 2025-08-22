/**
 * Universal Image Helpers for Enhanced Products
 * Provides consistent image extraction from enhanced products JSONB structure
 */

export interface ProductImage {
  url: string;
  alt: string;
}

/**
 * Extracts all images from an enhanced product in a consistent format
 * @param product - Enhanced product with JSONB images field
 * @returns Array of ProductImage objects
 */
export function extractProductImages(product: any): ProductImage[] {
  const images: ProductImage[] = [];
  
  if (!product) return images;

  // Handle JSONB images structure from enhanced products
  if (product.images && typeof product.images === 'object') {
    // 1. Add hero image first (highest priority)
    if (product.images.hero) {
      const heroUrl = product.images.hero.url || product.images.hero.cdn_url;
      if (heroUrl) {
        images.push({
          url: heroUrl,
          alt: product.images.hero.alt || product.name || 'Product image'
        });
      }
    }

    // 2. Add primary image if different from hero
    if (product.images.primary) {
      const primaryUrl = product.images.primary.cdn_url || product.images.primary.url;
      if (primaryUrl && !images.some(img => img.url === primaryUrl)) {
        images.push({
          url: primaryUrl,
          alt: product.images.primary.alt_text || product.name || 'Product image'
        });
      }
    }

    // 3. Add gallery images
    if (product.images.gallery && Array.isArray(product.images.gallery)) {
      product.images.gallery.forEach((img: any) => {
        const galleryUrl = img.cdn_url || img.url;
        if (galleryUrl && !images.some(existing => existing.url === galleryUrl)) {
          images.push({
            url: galleryUrl,
            alt: img.alt_text || product.name || 'Product image'
          });
        }
      });
    }

    // 4. Add lifestyle images if available
    if (product.images.lifestyle && Array.isArray(product.images.lifestyle)) {
      product.images.lifestyle.forEach((img: any) => {
        const lifestyleUrl = img.cdn_url || img.url;
        if (lifestyleUrl && !images.some(existing => existing.url === lifestyleUrl)) {
          images.push({
            url: lifestyleUrl,
            alt: img.alt_text || `${product.name} lifestyle` || 'Product lifestyle'
          });
        }
      });
    }

    // 5. Add detail shots if available
    if (product.images.detail_shots && Array.isArray(product.images.detail_shots)) {
      product.images.detail_shots.forEach((img: any) => {
        const detailUrl = img.cdn_url || img.url;
        if (detailUrl && !images.some(existing => existing.url === detailUrl)) {
          images.push({
            url: detailUrl,
            alt: img.alt_text || `${product.name} detail` || 'Product detail'
          });
        }
      });
    }
  }

  // Fallback for core products with direct image URL
  if (images.length === 0 && product.image) {
    images.push({
      url: product.image,
      alt: product.name || 'Product image'
    });
  }

  // Return placeholder if no images found
  if (images.length === 0) {
    images.push({
      url: '/placeholder-product.svg',
      alt: 'No image available'
    });
  }

  return images;
}

/**
 * Gets the primary image URL from a product
 * @param product - Enhanced product
 * @returns Primary image URL or placeholder
 */
export function getPrimaryImageUrl(product: any): string {
  const images = extractProductImages(product);
  return images[0]?.url || '/placeholder-product.svg';
}

/**
 * Gets the secondary image URL for hover effect
 * @param product - Enhanced product
 * @returns Secondary image URL or null if only one image
 */
export function getSecondaryImageUrl(product: any): string | null {
  const images = extractProductImages(product);
  return images.length > 1 ? images[1].url : null;
}

/**
 * Checks if product has multiple images for hover effect
 * @param product - Enhanced product
 * @returns Boolean indicating if hover effect is available
 */
export function hasMultipleImages(product: any): boolean {
  const images = extractProductImages(product);
  return images.length > 1;
}