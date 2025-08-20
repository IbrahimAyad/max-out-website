import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { getUnifiedProduct, getRelatedUnifiedProducts } from '@/lib/services/unifiedProductDetail'
import { EnhancedUnifiedDetail } from './EnhancedUnifiedDetail'
import UnifiedProductGrid from '@/components/products/UnifiedProductGrid'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getUnifiedProduct(id)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const ogImage = product.imageUrl || product.images?.[0] || '/placeholder-product.svg'

  return {
    title: `${product.name} | KCT Menswear`,
    description: product.description || `Shop ${product.name} from our premium collection`,
    keywords: product.tags?.join(', ') || `${product.category}, menswear, suits, formal wear`,
    openGraph: {
      title: product.name,
      description: product.description || `Premium ${product.category}`,
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: product.name,
      }],
      type: 'website',
      siteName: 'KCT Menswear',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Premium ${product.category}`,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getUnifiedProduct(id)

  if (!product) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [product.imageUrl],
    brand: {
      '@type': 'Brand',
      name: 'KCT Menswear',
    },
    offers: {
      '@type': 'Offer',
      url: `https://kct-menswear.vercel.app/products/${id}`,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '124',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <EnhancedUnifiedDetail product={product} />
      
      {/* Related Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <UnifiedProductGrid 
          products={await getRelatedUnifiedProducts(product.id, product.category, 4)} 
          gridLayout="standard"
        />
      </div>
    </>
  )
}