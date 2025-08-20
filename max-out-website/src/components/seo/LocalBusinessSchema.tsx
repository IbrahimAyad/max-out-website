import Script from 'next/script';

export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': 'https://kctmenswear.com/#organization',
    name: 'KCT Menswear',
    image: 'https://kctmenswear.com/logo.png',
    logo: 'https://kctmenswear.com/logo.png',
    url: 'https://kctmenswear.com',
    telephone: '+1-313-255-2211',
    priceRange: '$$-$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '28449 W 7 Mile Rd',
      addressLocality: 'Livonia',
      addressRegion: 'MI',
      postalCode: '48152',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 42.3748,
      longitude: -83.3502
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '19:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '12:00',
        closes: '17:00'
      }
    ],
    sameAs: [
      'https://www.facebook.com/kctmenswear',
      'https://www.instagram.com/kctmenswear',
      'https://twitter.com/kctmenswear',
      'https://www.youtube.com/kctmenswear',
      'https://www.linkedin.com/company/kct-menswear'
    ],
    department: [
      {
        '@type': 'ClothingStore',
        name: 'Suits & Tuxedos',
        telephone: '+1-313-255-2211',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '10:00',
            closes: '19:00'
          }
        ]
      },
      {
        '@type': 'ClothingStore',
        name: 'Wedding Services',
        telephone: '+1-313-255-2211',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '10:00',
            closes: '18:00'
          }
        ]
      },
      {
        '@type': 'ClothingStore',
        name: 'Prom & Special Events',
        telephone: '+1-313-255-2211',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '10:00',
            closes: '19:00'
          }
        ]
      }
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Detroit',
        '@id': 'https://en.wikipedia.org/wiki/Detroit'
      },
      {
        '@type': 'City',
        name: 'Livonia',
        '@id': 'https://en.wikipedia.org/wiki/Livonia,_Michigan'
      },
      {
        '@type': 'City',
        name: 'Dearborn',
        '@id': 'https://en.wikipedia.org/wiki/Dearborn,_Michigan'
      },
      {
        '@type': 'City',
        name: 'Farmington Hills',
        '@id': 'https://en.wikipedia.org/wiki/Farmington_Hills,_Michigan'
      },
      {
        '@type': 'State',
        name: 'Michigan',
        '@id': 'https://en.wikipedia.org/wiki/Michigan'
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Menswear Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Suit Rental',
            description: 'Premium suit rentals for weddings, proms, and special events'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tuxedo Rental',
            description: 'Elegant tuxedo rentals with complete accessories'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Tailoring',
            description: 'Professional alterations and custom fitting services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wedding Party Outfitting',
            description: 'Complete wedding party coordination and styling'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Prom Styling',
            description: 'Trendy prom suits and tuxedos with modern styling'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '324',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        author: {
          '@type': 'Person',
          name: 'Michael Johnson'
        },
        datePublished: '2025-07-15',
        reviewBody: 'Excellent service and quality suits. The staff was incredibly helpful in finding the perfect fit for my wedding.'
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        author: {
          '@type': 'Person',
          name: 'David Chen'
        },
        datePublished: '2025-06-20',
        reviewBody: 'Best menswear store in Detroit! Great selection and professional alterations.'
      }
    ],
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://kctmenswear.com/appointment',
        inLanguage: 'en-US',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/IOSPlatform',
          'http://schema.org/AndroidPlatform'
        ]
      },
      result: {
        '@type': 'Reservation',
        name: 'Appointment'
      }
    },
    makesOffer: [
      {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceCurrency: 'USD',
          price: '299-999'
        },
        itemOffered: {
          '@type': 'Product',
          name: 'Men\'s Suits',
          category: 'Suits'
        }
      },
      {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceCurrency: 'USD',
          price: '399-1299'
        },
        itemOffered: {
          '@type': 'Product',
          name: 'Tuxedos',
          category: 'Formal Wear'
        }
      }
    ],
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    currenciesAccepted: 'USD',
    slogan: 'Elevating Men\'s Fashion Since 1985',
    foundingDate: '1985',
    keywords: 'mens suits, tuxedo rental, wedding suits, prom tuxedos, formal wear, Detroit menswear, custom tailoring, suit alterations'
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}