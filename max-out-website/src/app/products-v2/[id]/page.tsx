import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { getUnifiedProduct, getRelatedUnifiedProducts } from '@/lib/services/unifiedProductDetail'
import ProductDetailBase from '@/components/products/detail-v2/ProductDetailBase'

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
    title: `${product.name} | KCT Menswear V2`,
    description: product.description || `Shop ${product.name} from our premium collection - New V2 Experience`,
    keywords: product.tags?.join(', ') || `${product.category}, menswear, suits, formal wear`,
    openGraph: {
      title: `${product.name} - V2`,
      description: product.description || `Premium ${product.category} - Enhanced Shopping Experience`,
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: product.name,
      }],
      type: 'website',
      siteName: 'KCT Menswear V2',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - V2`,
      description: product.description || `Premium ${product.category} - Enhanced Experience`,
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

export default async function ProductPageV2({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getUnifiedProduct(id)

  if (!product) {
    notFound()
  }

  // Get related products
  const relatedProducts = await getRelatedUnifiedProducts(product.id, product.category, 4)

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
      url: `https://kct-menswear.vercel.app/products-v2/${id}`,
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
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Version',
        value: 'V2 Enhanced Experience'
      },
      {
        '@type': 'PropertyValue',
        name: 'Category',
        value: product.category || 'menswear'
      }
    ]
  }

  return (
    <>
      {/* V2 Development Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 text-center">
        <p className="text-sm font-medium">
          🚀 You're viewing the new V2 Product Detail System - Enhanced modular experience!
        </p>
      </div>

      <Script
        id="product-structured-data-v2"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <ProductDetailBase 
        product={product} 
        relatedProducts={relatedProducts}
        className="min-h-screen"
      />
      
      {/* V2 System Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg text-xs max-w-xs">
          <h4 className="font-bold mb-1">V2 Debug Info</h4>
          <p>Product ID: {product.id}</p>
          <p>Category: {product.category}</p>
          <p>Template: Auto-detected</p>
          <p>Modules: Dynamic loading</p>
        </div>
      )}
    </>
  )
}