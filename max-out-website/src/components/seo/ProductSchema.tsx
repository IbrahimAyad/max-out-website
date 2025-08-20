import Script from 'next/script';

interface ProductSchemaProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number | string;
    imageUrl?: string;
    images?: string[] | { src: string }[];
    sku?: string;
    brand?: string;
    category?: string;
    availability?: 'in-stock' | 'out-of-stock' | 'pre-order';
    rating?: number;
    reviewCount?: number;
    color?: string;
    size?: string | string[];
    material?: string;
    productType?: string;
    originalPrice?: number;
  };
  url: string;
}

export default function ProductSchema({ product, url }: ProductSchemaProps) {
  // Handle different image formats
  const getImages = () => {
    if (product.images && Array.isArray(product.images)) {
      return product.images.map(img => 
        typeof img === 'string' ? img : img.src
      ).filter(Boolean);
    }
    if (product.imageUrl) {
      return [product.imageUrl];
    }
    return [];
  };

  const images = getImages();
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  
  // Map availability status
  const getAvailability = () => {
    switch (product.availability) {
      case 'in-stock':
        return 'https://schema.org/InStock';
      case 'out-of-stock':
        return 'https://schema.org/OutOfStock';
      case 'pre-order':
        return 'https://schema.org/PreOrder';
      default:
        return 'https://schema.org/InStock';
    }
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': url,
    name: product.name,
    description: product.description,
    image: images,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'KCT Menswear'
    },
    category: product.category || product.productType || 'Menswear',
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: 'USD',
      price: price.toFixed(2),
      availability: getAvailability(),
      seller: {
        '@type': 'Organization',
        name: 'KCT Menswear',
        url: 'https://kctmenswear.com'
      },
      ...(product.originalPrice && product.originalPrice > price ? {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      } : {})
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
        bestRating: '5',
        worstRating: '1'
      }
    }),
    ...(product.color && {
      color: product.color
    }),
    ...(product.size && {
      size: Array.isArray(product.size) ? product.size.join(', ') : product.size
    }),
    ...(product.material && {
      material: product.material
    }),
    additionalProperty: [
      ...(product.color ? [{
        '@type': 'PropertyValue',
        name: 'Color',
        value: product.color
      }] : []),
      ...(product.material ? [{
        '@type': 'PropertyValue',
        name: 'Material',
        value: product.material
      }] : []),
      {
        '@type': 'PropertyValue',
        name: 'Product Type',
        value: product.productType || product.category || 'Menswear'
      }
    ],
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'US',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn'
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency: 'USD'
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'US'
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 1,
          unitCode: 'DAY'
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 2,
          maxValue: 5,
          unitCode: 'DAY'
        }
      }
    }
  };

  return (
    <Script
      id={`product-schema-${product.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}