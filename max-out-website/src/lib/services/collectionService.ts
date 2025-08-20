/**
 * COLLECTION SERVICE
 * Unified service for fetching products by collection/category from Supabase
 * Replaces hardcoded product arrays with dynamic data fetching
 */

import { fetchProductsWithImages, getProductImageUrl, type Product } from '@/lib/shared/supabase-products';

export interface CollectionProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  description?: string;
  images?: string[];
  sizes?: string[];
  sku?: string;
  sale_price?: number;
}

export interface CategoryInfo {
  id: string;
  name: string;
  count: number;
  image: string | null;
  bgColor?: string;
}

/**
 * Convert Supabase product to collection product format
 */
function convertToCollectionProduct(product: Product): CollectionProduct {
  return {
    id: product.id,
    name: product.name,
    price: Math.round((product.sale_price || product.base_price) / 100), // Convert from cents to dollars
    image: getProductImageUrl(product),
    category: product.category || 'general',
    subcategory: product.subcategory,
    description: product.description || undefined,
    images: product.images?.map(img => img.url) || [getProductImageUrl(product)],
    sizes: extractSizesFromVariants(product),
    sku: product.sku || undefined,
    sale_price: product.sale_price ? Math.round(product.sale_price / 100) : undefined
  };
}

/**
 * Extract available sizes from product variants
 */
function extractSizesFromVariants(product: Product): string[] {
  if (!product.variants || product.variants.length === 0) {
    // Default sizes for suits, blazers, shirts
    if (['suits', 'blazers', 'dress-shirts', 'shirts'].includes(product.category || '')) {
      return ['36', '38', '40', '42', '44', '46', '48'];
    }
    // Default for accessories
    return ['One Size'];
  }
  
  // Extract unique sizes from variants
  const sizes = product.variants
    .filter(variant => variant.size)
    .map(variant => variant.size!)
    .filter((size, index, self) => self.indexOf(size) === index)
    .sort();
    
  return sizes.length > 0 ? sizes : ['One Size'];
}

/**
 * Fetch products for suits collection
 */
export async function getSuitsCollection(): Promise<{
  categories: CategoryInfo[];
  products: CollectionProduct[];
  error?: string;
}> {
  try {
    const result = await fetchProductsWithImages({
      category: 'suits',
      status: 'active',
      limit: 100
    });

    if (!result.success || !result.data) {
      return {
        categories: getDefaultSuitsCategories(),
        products: [],
        error: result.error || 'Failed to fetch suits'
      };
    }

    const products = result.data.map(convertToCollectionProduct);
    const categories = generateSuitsCategories(products);

    return {
      categories,
      products,
    };
  } catch (error) {
    console.error('Error fetching suits collection:', error);
    return {
      categories: getDefaultSuitsCategories(),
      products: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch products for blazers collection
 */
export async function getBlazersCollection(): Promise<{
  categories: CategoryInfo[];
  products: CollectionProduct[];
  error?: string;
}> {
  try {
    const result = await fetchProductsWithImages({
      category: 'blazers',
      status: 'active',
      limit: 100
    });

    if (!result.success || !result.data) {
      return {
        categories: getDefaultBlazersCategories(),
        products: [],
        error: result.error || 'Failed to fetch blazers'
      };
    }

    const products = result.data.map(convertToCollectionProduct);
    const categories = generateBlazersCategories(products);

    return {
      categories,
      products,
    };
  } catch (error) {
    console.error('Error fetching blazers collection:', error);
    return {
      categories: getDefaultBlazersCategories(),
      products: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch products for accessories collection
 */
export async function getAccessoriesCollection(): Promise<{
  categories: CategoryInfo[];
  products: CollectionProduct[];
  error?: string;
}> {
  try {
    const result = await fetchProductsWithImages({
      category: 'accessories',
      status: 'active',
      limit: 250
    });

    if (!result.success || !result.data) {
      return {
        categories: getDefaultAccessoriesCategories(),
        products: [],
        error: result.error || 'Failed to fetch accessories'
      };
    }

    const products = result.data.map(convertToCollectionProduct);
    const categories = generateAccessoriesCategories(products);

    return {
      categories,
      products,
    };
  } catch (error) {
    console.error('Error fetching accessories collection:', error);
    return {
      categories: getDefaultAccessoriesCategories(),
      products: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch products for knitwear collection
 */
export async function getKnitwearCollection(): Promise<{
  categories: CategoryInfo[];
  products: CollectionProduct[];
  error?: string;
}> {
  try {
    const result = await fetchProductsWithImages({
      category: 'knitwear',
      status: 'active',
      limit: 100
    });

    if (!result.success || !result.data) {
      return {
        categories: getDefaultKnitwearCategories(),
        products: [],
        error: result.error || 'Failed to fetch knitwear'
      };
    }

    const products = result.data.map(convertToCollectionProduct);
    const categories = generateKnitwearCategories(products);

    return {
      categories,
      products,
    };
  } catch (error) {
    console.error('Error fetching knitwear collection:', error);
    return {
      categories: getDefaultKnitwearCategories(),
      products: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate dynamic categories based on actual products
 */
function generateSuitsCategories(products: CollectionProduct[]): CategoryInfo[] {
  const subcategoryCounts = products.reduce((acc, product) => {
    const subcat = product.subcategory || 'classic-suits';
    acc[subcat] = (acc[subcat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories: CategoryInfo[] = [
    {
      id: 'all',
      name: 'All Suits',
      count: products.length,
      image: null,
      bgColor: 'from-gray-900 to-gray-700'
    }
  ];

  // Add categories that have products
  const categoryMapping = {
    'classic-suits': { name: 'Classic Suits', image: null },
    'summer-suits': { name: 'Summer Suits', image: null },
    'wedding-suits': { name: 'Wedding Suits', image: null },
    'luxury-suits': { name: 'Luxury Suits', image: null },
    'double-breasted': { name: 'Double Breasted', image: null },
    'three-piece': { name: 'Three Piece', image: null },
    'tuxedos': { name: 'Tuxedos', image: null }
  };

  Object.entries(subcategoryCounts).forEach(([subcat, count]) => {
    const mapping = categoryMapping[subcat as keyof typeof categoryMapping];
    if (mapping && count > 0) {
      categories.push({
        id: subcat,
        name: mapping.name,
        count,
        image: mapping.image
      });
    }
  });

  return categories;
}

function generateBlazersCategories(products: CollectionProduct[]): CategoryInfo[] {
  const subcategoryCounts = products.reduce((acc, product) => {
    const subcat = product.subcategory || 'classic-blazers';
    acc[subcat] = (acc[subcat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    {
      id: 'all',
      name: 'All Blazers',
      count: products.length,
      image: null,
      bgColor: 'from-navy-900 to-burgundy-800'
    },
    ...Object.entries(subcategoryCounts).map(([subcat, count]) => ({
      id: subcat,
      name: formatCategoryName(subcat),
      count,
      image: null
    }))
  ];
}

function generateAccessoriesCategories(products: CollectionProduct[]): CategoryInfo[] {
  const subcategoryCounts = products.reduce((acc, product) => {
    const subcat = product.subcategory || 'general';
    acc[subcat] = (acc[subcat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    {
      id: 'all',
      name: 'All Accessories',
      count: products.length,
      image: null,
      bgColor: 'from-zinc-900 to-zinc-700'
    },
    ...Object.entries(subcategoryCounts).map(([subcat, count]) => ({
      id: subcat,
      name: formatCategoryName(subcat),
      count,
      image: null
    }))
  ];
}

function generateKnitwearCategories(products: CollectionProduct[]): CategoryInfo[] {
  const subcategoryCounts = products.reduce((acc, product) => {
    const subcat = product.subcategory || 'sweaters';
    acc[subcat] = (acc[subcat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    {
      id: 'all',
      name: 'All Knitwear',
      count: products.length,
      image: null,
      bgColor: 'from-emerald-900 to-teal-800'
    },
    ...Object.entries(subcategoryCounts).map(([subcat, count]) => ({
      id: subcat,
      name: formatCategoryName(subcat),
      count,
      image: null
    }))
  ];
}

/**
 * Format category name for display
 */
function formatCategoryName(subcategory: string): string {
  return subcategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Default fallback categories if Supabase fails
 */
function getDefaultSuitsCategories(): CategoryInfo[] {
  return [
    { id: 'all', name: 'All Suits', count: 0, image: null, bgColor: 'from-gray-900 to-gray-700' },
    { id: 'classic-suits', name: 'Classic Suits', count: 0, image: null },
    { id: 'wedding-suits', name: 'Wedding Suits', count: 0, image: null },
    { id: 'tuxedos', name: 'Tuxedos', count: 0, image: null }
  ];
}

function getDefaultBlazersCategories(): CategoryInfo[] {
  return [
    { id: 'all', name: 'All Blazers', count: 0, image: null, bgColor: 'from-navy-900 to-burgundy-800' },
    { id: 'classic-blazers', name: 'Classic Blazers', count: 0, image: null },
    { id: 'sport-coats', name: 'Sport Coats', count: 0, image: null }
  ];
}

function getDefaultAccessoriesCategories(): CategoryInfo[] {
  return [
    { id: 'all', name: 'All Accessories', count: 0, image: null, bgColor: 'from-zinc-900 to-zinc-700' },
    { id: 'ties', name: 'Ties', count: 0, image: null },
    { id: 'belts', name: 'Belts', count: 0, image: null }
  ];
}

function getDefaultKnitwearCategories(): CategoryInfo[] {
  return [
    { id: 'all', name: 'All Knitwear', count: 0, image: null, bgColor: 'from-emerald-900 to-teal-800' },
    { id: 'sweaters', name: 'Sweaters', count: 0, image: null },
    { id: 'cardigans', name: 'Cardigans', count: 0, image: null }
  ];
}

/**
 * Filter products by subcategory
 */
export function filterProductsByCategory(
  products: CollectionProduct[], 
  selectedCategory: string
): CollectionProduct[] {
  if (selectedCategory === 'all') {
    return products;
  }
  return products.filter(product => product.subcategory === selectedCategory);
}