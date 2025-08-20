import { Metadata } from 'next';
import MasterCollectionsGrid from '@/components/collections/MasterCollectionsGrid';

export const metadata: Metadata = {
  title: 'Shop All Collections | KCT Menswear',
  description: 'Explore our complete collection of premium menswear including suits, shirts, accessories, and complete outfit bundles for every occasion.',
  openGraph: {
    title: 'Shop All Collections | KCT Menswear',
    description: 'Discover premium suits, tuxedos, dress shirts, and accessories for weddings, prom, business, and special occasions.',
    images: [
      {
        url: 'https://kctmenswear.com/og-collections.jpg',
        width: 1200,
        height: 630,
        alt: 'KCT Menswear Collections'
      }
    ],
    type: 'website',
    siteName: 'KCT Menswear',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Collections | KCT Menswear',
    description: 'Premium menswear for every occasion',
    images: ['https://kctmenswear.com/og-collections.jpg']
  },
  alternates: {
    canonical: 'https://kctmenswear.com/collections'
  },
  keywords: [
    'mens suits',
    'dress shirts',
    'tuxedos',
    'wedding suits',
    'prom tuxedos',
    'business suits',
    'mens accessories',
    'complete outfits',
    'formal wear',
    'KCT Menswear'
  ].join(', ')
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'KCT Menswear Collections',
  description: 'Browse all menswear collections',
  url: 'https://kctmenswear.com/collections',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: 18,
    itemListElement: [
      'Suits', 'Shirts', 'Vests', 'Jackets', 'Pants', 'Knitwear',
      'Accessories', 'Shoes', 'Velvet Blazers', 'Vest & Tie Sets',
      'Complete Looks', 'Wedding Guest', 'Business', 'Black Tie',
      'Prom 2025', 'Cocktail Party', 'Suspender Bowtie', 'Date Night'
    ].map((name, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: name
    }))
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://kctmenswear.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: 'https://kctmenswear.com/collections'
      }
    ]
  }
};

export default function CollectionsOverviewPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Main Content */}
      <main className="min-h-screen bg-white">
        <div className="py-12 md:py-16">
          <MasterCollectionsGrid />
        </div>
      </main>
    </>
  );
}