import { getProduct } from '@/lib/supabase/products';
import { bundleProductsWithImages } from '@/lib/products/bundleProductsWithImages';
import { UnifiedProduct } from '@/types/unified-shop';
import { getCoreProductById, getAllCoreProducts } from '@/lib/config/coreProducts';

// Demo products for V2 system testing
const demoProducts: UnifiedProduct[] = [
  {
    id: 'demo-premium-suit',
    sku: 'SUIT-NAVY-001',
    type: 'individual',
    name: 'Premium Navy Suit',
    description: 'Expertly tailored navy suit crafted from premium Italian wool. Features half-canvas construction and modern slim fit for the discerning gentleman.',
    imageUrl: '/placeholder-suit.jpg',
    images: ['/placeholder-suit.jpg'],
    price: 599.99,
    originalPrice: 799.99,
    category: 'suits',
    color: 'Navy',
    material: 'Italian Wool',
    occasions: ['business', 'wedding', 'formal'],
    tags: ['premium', 'suit', 'navy', 'formal'],
    trending: true,
    inStock: true,
    stripePriceId: 'price_demo_premium_suit'
  },
  {
    id: 'demo-dress-shirt',
    sku: 'SHIRT-WHITE-001',
    type: 'individual',
    name: 'Classic White Dress Shirt',
    description: 'Timeless white dress shirt in premium cotton. Available in multiple fits for the perfect silhouette.',
    imageUrl: '/placeholder-shirt.jpg',
    images: ['/placeholder-shirt.jpg'],
    price: 79.99,
    originalPrice: 99.99,
    category: 'shirts',
    color: 'White',
    material: 'Premium Cotton',
    fit: 'Multiple fits available',
    occasions: ['business', 'formal', 'casual'],
    tags: ['shirt', 'white', 'dress shirt', 'cotton'],
    inStock: true,
    stripePriceId: 'price_demo_dress_shirt'
  },
  {
    id: 'demo-silk-tie',
    sku: 'TIE-BURG-001', 
    type: 'individual',
    name: 'Burgundy Silk Tie',
    description: 'Elegant burgundy silk tie perfect for any formal occasion. Available in multiple widths and styles.',
    imageUrl: '/placeholder-tie.jpg',
    images: ['/placeholder-tie.jpg'],
    price: 24.99,
    category: 'ties',
    color: 'Burgundy',
    material: 'Pure Silk',
    occasions: ['business', 'formal', 'wedding'],
    tags: ['tie', 'silk', 'burgundy', 'formal'],
    inStock: true,
    stripePriceId: 'price_demo_silk_tie'
  },
  {
    id: 'demo-pocket-square',
    sku: 'ACC-PS-001',
    type: 'individual',
    name: 'Cotton Pocket Square',
    description: 'Classic cotton pocket square to complete your look. Available in various colors.',
    imageUrl: '/placeholder-product.svg',
    images: ['/placeholder-product.svg'],
    price: 12.99,
    category: 'accessories',
    material: 'Cotton',
    occasions: ['formal', 'business'],
    tags: ['pocket square', 'cotton', 'accessory'],
    inStock: true,
    stripePriceId: 'price_demo_pocket_square'
  }
];

/**
 * Get a unified product by ID or slug - checks core products, demo products, bundles, and Supabase products
 */
export async function getUnifiedProduct(idOrSlug: string): Promise<UnifiedProduct | null> {
  // First, check if it's a core product
  const coreProduct = getCoreProductById(idOrSlug);
  if (coreProduct) {
    return {
      id: coreProduct.id,
      sku: coreProduct.id,
      type: 'individual',
      name: coreProduct.name,
      description: coreProduct.description || `Premium ${coreProduct.name} from our core collection`,
      imageUrl: coreProduct.image || '/placeholder-product.svg',
      images: coreProduct.images || (coreProduct.image ? [coreProduct.image] : ['/placeholder-product.svg']),
      price: coreProduct.price / 100, // Convert cents to dollars
      category: coreProduct.category,
      stripePriceId: coreProduct.stripe_price_id,
      occasions: ['business', 'formal', 'wedding'],
      tags: [coreProduct.category, 'core', 'premium'],
      inStock: true,
      stockLevel: 100
    };
  }

  // Then, check if it's a demo product
  const demoProduct = demoProducts.find(p => p.id === idOrSlug);
  if (demoProduct) {
    return demoProduct;
  }

  // Then, check if it's a bundle (bundles use ID)
  const bundle = bundleProductsWithImages.bundles.find(b => b.id === idOrSlug);
  
  if (bundle) {
    // Convert bundle to UnifiedProduct format
    return {
      id: bundle.id,
      name: bundle.name,
      description: bundle.description,
      price: bundle.price,
      originalPrice: bundle.originalPrice,
      imageUrl: bundle.components[0]?.image || '/placeholder.jpg',
      images: bundle.components.map(c => c.image).filter(Boolean),
      category: bundle.category,
      color: bundle.components[0]?.color,
      size: bundle.components[0]?.sizes,
      material: bundle.components[0]?.material,
      trending: bundle.trending || false,
      inStock: bundle.inStock !== false,
      isBundle: true,
      bundleComponents: bundle.components.map(c => ({
        type: c.type,
        name: c.name,
        color: c.color,
        material: c.material,
        image: c.image,
        sizes: c.sizes
      })),
      aiScore: bundle.aiScore || 85,
      slug: bundle.id,
      tags: bundle.tags || [],
      occasionSuitability: bundle.occasionSuitability || {},
      stockLevel: bundle.stockLevel || 'in-stock'
    };
  }

  // Check enhanced products first (they use slug or enhanced_id format)
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  
  if (supabase) {
    // Handle both enhanced_[id] format and direct slug
    let searchValue = idOrSlug;
    if (idOrSlug.startsWith('enhanced_')) {
      // Extract the actual ID from enhanced_[id] format
      const actualId = idOrSlug.replace('enhanced_', '');
      // First try to find by ID
      const { data: enhancedById, error: byIdError } = await supabase
        .from('products_enhanced')
        .select('*')
        .eq('id', actualId)
        .eq('status', 'active')
        .single();
      
      if (enhancedById && !byIdError) {
        searchValue = enhancedById.slug;
      }
    }
    
    // Try to find in enhanced products table by slug
    const { data: enhancedProduct, error: enhancedError } = await supabase
      .from('products_enhanced')
      .select('*')
      .eq('slug', searchValue)
      .eq('status', 'active')
      .single();
    
    if (enhancedProduct && !enhancedError) {
      // Convert enhanced product to UnifiedProduct format
      let imageUrl = '/placeholder-product.jpg';
      let images: string[] = [];
      
      // Extract ALL images from JSONB structure in order
      if (enhancedProduct.images) {
        // Primary/Hero image first
        if (enhancedProduct.images.hero?.url) {
          imageUrl = enhancedProduct.images.hero.url;
          images.push(enhancedProduct.images.hero.url);
        } else if (enhancedProduct.images.primary?.url) {
          imageUrl = enhancedProduct.images.primary.url;
          images.push(enhancedProduct.images.primary.url);
        }
        
        // Add flat image if different from primary
        if (enhancedProduct.images.flat?.url && 
            !images.includes(enhancedProduct.images.flat.url)) {
          if (images.length === 0) {
            imageUrl = enhancedProduct.images.flat.url;
          }
          images.push(enhancedProduct.images.flat.url);
        }
        
        // Add all other named images (side, back, detail, etc.)
        const namedImages = ['side', 'back', 'detail', 'close', 'model'];
        namedImages.forEach(imageName => {
          if (enhancedProduct.images[imageName]?.url && 
              !images.includes(enhancedProduct.images[imageName].url)) {
            images.push(enhancedProduct.images[imageName].url);
          }
        });
        
        // Add gallery images
        if (enhancedProduct.images.gallery && Array.isArray(enhancedProduct.images.gallery)) {
          enhancedProduct.images.gallery.forEach((img: any) => {
            if (img?.url && !images.includes(img.url)) {
              images.push(img.url);
            }
          });
        }
        
        // If still no images, try to extract any image objects
        if (images.length === 0) {
          Object.values(enhancedProduct.images).forEach((img: any) => {
            if (img?.url && !images.includes(img.url)) {
              if (images.length === 0) imageUrl = img.url;
              images.push(img.url);
            }
          });
        }
      }
      
      // Ensure we have at least one image
      if (images.length === 0) {
        images = ['/placeholder-product.jpg'];
      }
      
      return {
        id: `enhanced_${enhancedProduct.id}`,
        sku: enhancedProduct.sku || `SKU-${enhancedProduct.id}`,
        type: 'individual',
        name: enhancedProduct.name,
        description: enhancedProduct.description || '',
        imageUrl: imageUrl,
        images: images,
        price: enhancedProduct.base_price / 100, // Convert cents to dollars
        originalPrice: enhancedProduct.compare_at_price ? enhancedProduct.compare_at_price / 100 : undefined,
        category: 'blazers',
        color: enhancedProduct.color || undefined,
        material: enhancedProduct.material || undefined,
        tags: enhancedProduct.tags || [],
        trending: true, // Enhanced products are featured
        inStock: true,
        stripePriceId: enhancedProduct.stripe_price_id || undefined,
        occasions: ['business', 'formal', 'wedding', 'prom'],
        slug: enhancedProduct.slug,
        stockLevel: 100,
        enhanced: true,
        pricingTier: enhancedProduct.price_tier || undefined
      };
    }
  }
  
  // If not enhanced, check regular products by ID first, then by handle/slug
  let product = await getProduct(idOrSlug);
  
  // If not found by ID, try to find by handle (slug)
  if (!product && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          image_url,
          alt_text,
          position,
          image_type
        )
      `)
      .eq('handle', idOrSlug)
      .single();
    
    if (data && !error) {
      // Convert to the format expected by getProduct
      const { getProductById } = await import('@/lib/supabase/products');
      product = await getProductById(data.id);
    }
  }
  
  if (product) {
    // Convert Supabase product to UnifiedProduct format
    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price / 100, // Convert cents to dollars
      originalPrice: product.compareAtPrice ? product.compareAtPrice / 100 : undefined,
      imageUrl: product.primaryImage || product.images[0] || '/placeholder.jpg',
      images: product.images,
      category: product.category || product.productType || 'product',
      color: product.colorFamily,
      size: product.variants?.map(v => v.size).filter(Boolean),
      material: product.materials?.[0],
      trending: product.isFeatured || false,
      inStock: product.inStock,
      isBundle: false,
      aiScore: 75,
      slug: product.handle || product.id,
      tags: product.tags || [],
      occasionSuitability: {},
      stockLevel: product.inStock ? 'in-stock' : 'out-of-stock'
    };
  }

  return null;
}

/**
 * Get related products for a unified product
 */
export async function getRelatedUnifiedProducts(
  productId: string, 
  category?: string,
  limit: number = 4
): Promise<UnifiedProduct[]> {
  const relatedProducts: UnifiedProduct[] = [];
  
  // Get related core products first
  if (category) {
    const coreProducts = getAllCoreProducts();
    const relatedCoreProducts = coreProducts
      .filter(p => p.category === category && p.id !== productId)
      .slice(0, limit)
      .map(coreProduct => ({
        id: coreProduct.id,
        sku: coreProduct.id,
        type: 'individual' as const,
        name: coreProduct.name,
        description: coreProduct.description || `Premium ${coreProduct.name}`,
        imageUrl: coreProduct.image || '/placeholder-product.svg',
        images: coreProduct.image ? [coreProduct.image] : ['/placeholder-product.svg'],
        price: coreProduct.price / 100,
        category: coreProduct.category,
        stripePriceId: coreProduct.stripe_price_id,
        occasions: ['business', 'formal', 'wedding'],
        tags: [coreProduct.category, 'core', 'premium'],
        inStock: true,
        stockLevel: 100
      }));
    relatedProducts.push(...relatedCoreProducts);
  }
  
  // If we need more, get related demo products
  if (relatedProducts.length < limit && category) {
    const relatedDemoProducts = demoProducts
      .filter(p => p.category === category && p.id !== productId)
      .slice(0, limit - relatedProducts.length);
    relatedProducts.push(...relatedDemoProducts);
  }
  
  // If we need more products, get related bundles from the same category
  if (relatedProducts.length < limit && category) {
    const relatedBundles = bundleProductsWithImages.bundles
      .filter(b => b.category === category && b.id !== productId)
      .slice(0, Math.floor(limit / 2))
      .map(bundle => ({
        id: bundle.id,
        name: bundle.name,
        description: bundle.description,
        price: bundle.price,
        originalPrice: bundle.originalPrice,
        imageUrl: bundle.components[0]?.image || '/placeholder.jpg',
        images: bundle.components.map(c => c.image).filter(Boolean),
        category: bundle.category,
        color: bundle.components[0]?.color,
        size: bundle.components[0]?.sizes,
        material: bundle.components[0]?.material,
        trending: bundle.trending || false,
        inStock: bundle.inStock !== false,
        isBundle: true,
        bundleComponents: bundle.components.map(c => ({
          type: c.type,
          name: c.name,
          color: c.color,
          material: c.material,
          image: c.image,
          sizes: c.sizes
        })),
        aiScore: bundle.aiScore || 85,
        slug: bundle.id,
        tags: bundle.tags || [],
        occasionSuitability: bundle.occasionSuitability || {},
        stockLevel: bundle.stockLevel || 'in-stock'
      }));
    
    relatedProducts.push(...relatedBundles);
  }
  
  // TODO: Also fetch related individual products from Supabase
  // For now, just return the bundles
  
  return relatedProducts;
}