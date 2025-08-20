import { MetadataRoute } from 'next';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// Define the base URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kctmenswear.com';

// Static pages that always exist
const staticPages = [
  '',
  '/about',
  '/contact',
  '/locations',
  '/products',
  '/collections',
  '/bundles',
  '/blog',
  '/faq',
  '/privacy-policy',
  '/terms-of-service',
  '/returns',
  '/shipping',
  '/size-guide',
  '/alterations',
  '/rental',
];

// Collection pages
const collections = [
  '/collections/suits',
  '/collections/tuxedos',
  '/collections/wedding',
  '/collections/prom',
  '/collections/business',
  '/collections/shirts',
  '/collections/ties',
  '/collections/accessories',
  '/collections/shoes',
  '/collections/vests',
  '/collections/blazers',
  '/collections/pants',
  '/collections/formal',
  '/collections/casual',
  '/collections/new-arrivals',
  '/collections/sale',
];

// Service pages
const services = [
  '/services/wedding',
  '/services/prom',
  '/services/rental',
  '/services/custom-tailoring',
  '/services/alterations',
  '/services/group-orders',
];

// Blog categories
const blogCategories = [
  '/blog/style-guides',
  '/blog/wedding-tips',
  '/blog/prom-trends',
  '/blog/fashion-news',
  '/blog/seasonal-looks',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch dynamic product data (you'll need to implement this based on your data source)
    const products = await fetchProducts();
    const blogPosts = await fetchBlogPosts();
    
    // Generate static page entries
    const staticEntries = staticPages.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'daily' as const : 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    }));
    
    // Generate collection entries
    const collectionEntries = collections.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
    
    // Generate service entries
    const serviceEntries = services.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    
    // Generate blog category entries
    const blogCategoryEntries = blogCategories.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
    
    // Generate product entries
    const productEntries = products.map((product: any) => ({
      url: `${BASE_URL}/products/${product.slug || product.handle || product.id}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    
    // Generate blog post entries
    const blogEntries = blogPosts.map((post: any) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
    
    // Combine all entries
    return [
      ...staticEntries,
      ...collectionEntries,
      ...serviceEntries,
      ...blogCategoryEntries,
      ...productEntries,
      ...blogEntries,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return at least static pages if dynamic fetch fails
    return staticPages.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    }));
  }
}

// Helper function to fetch products (implement based on your data source)
async function fetchProducts() {
  try {
    // If using Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      
      if (supabase) {
        const { data: products } = await supabase
          .from('products')
          .select('id, handle, updated_at')
          .eq('status', 'active')
          .eq('visibility', true)
          .limit(500);
        
        const { data: enhancedProducts } = await supabase
          .from('products_enhanced')
          .select('id, slug, updated_at')
          .eq('status', 'active')
          .limit(100);
        
        return [
          ...(products || []).map(p => ({
            id: p.id,
            slug: p.handle,
            updatedAt: p.updated_at
          })),
          ...(enhancedProducts || []).map(p => ({
            id: `enhanced_${p.id}`,
            slug: p.slug,
            updatedAt: p.updated_at
          }))
        ];
      }
    }
    
    // Fallback to empty array if no data source
    return [];
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

// Helper function to fetch blog posts (implement based on your data source)
async function fetchBlogPosts() {
  try {
    // If you have blog posts in Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      
      if (supabase) {
        const { data: posts } = await supabase
          .from('blog_posts')
          .select('id, slug, updated_at')
          .eq('published', true)
          .limit(100);
        
        return posts || [];
      }
    }
    
    // Static blog posts as fallback
    return [
      { slug: 'best-wedding-tuxedos-for-2025', updatedAt: new Date('2025-01-15') },
      { slug: '2025-prom-sneakers-style-guide', updatedAt: new Date('2025-02-01') },
      { slug: 'how-to-choose-the-perfect-suit', updatedAt: new Date('2025-01-20') },
      { slug: 'wedding-suit-vs-tuxedo', updatedAt: new Date('2025-01-25') },
      { slug: 'prom-2025-trends', updatedAt: new Date('2025-02-10') },
    ];
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
}