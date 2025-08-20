import Script from 'next/script';

export function TiesCollectionSEO() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Men's Ties & Bowties Collection - 80+ Colors | KCT Menswear",
    "description": "Shop our premium collection of men's silk ties and bowties in over 80 colors. Available in Classic (3.25\"), Skinny (2.75\"), Slim (2.25\"), and Bowtie styles. Bundle deals available.",
    "url": "https://kctmenswear.com/collections/ties",
    "isPartOf": {
      "@type": "WebSite",
      "name": "KCT Menswear",
      "url": "https://kctmenswear.com"
    },
    "mainEntity": {
      "@type": "ProductCollection",
      "name": "Ties & Bowties",
      "description": "Premium silk ties and bowties in 80+ colors and 4 styles",
      "numberOfItems": 320,
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Classic Silk Ties",
          "description": "Traditional 3.25\" width ties in premium silk",
          "offers": {
            "@type": "Offer",
            "price": "24.99",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "Product",
          "name": "Skinny Ties",
          "description": "Modern 2.75\" width ties for contemporary styling",
          "offers": {
            "@type": "Offer",
            "price": "24.99",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "Product",
          "name": "Slim Ties",
          "description": "Fashion-forward 2.25\" width ties",
          "offers": {
            "@type": "Offer",
            "price": "24.99",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "Product",
          "name": "Pre-tied Bowties",
          "description": "Adjustable bowties for formal occasions",
          "offers": {
            "@type": "Offer",
            "price": "24.99",
            "priceCurrency": "USD"
          }
        }
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://kctmenswear.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Collections",
          "item": "https://kctmenswear.com/collections"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Ties & Bowties",
          "item": "https://kctmenswear.com/collections/ties"
        }
      ]
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What tie width should I choose?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Classic (3.25\") is perfect for traditional formal wear. Skinny (2.75\") offers a modern professional look. Slim (2.25\") is ideal for fashion-forward styling. Choose based on your lapel width and personal style."
        }
      },
      {
        "@type": "Question",
        "name": "How do I match my tie color?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For formal events, match your tie to your date's dress or wedding colors. For business, stick to classic colors like navy, burgundy, or charcoal. For casual wear, experiment with patterns and brighter colors."
        }
      },
      {
        "@type": "Question",
        "name": "Can I mix different styles in a bundle?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our bundle builder lets you mix and match any combination of colors and styles. Choose from Classic, Skinny, Slim, or Bowtie styles in any of our 80+ colors."
        }
      },
      {
        "@type": "Question",
        "name": "What material are your ties made from?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All our ties are crafted from premium quality silk with a luxurious finish. They feature a durable interlining for the perfect knot and drape."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="ties-collection-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <Script
        id="ties-collection-faq-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData)
        }}
      />
    </>
  );
}