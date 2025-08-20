import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Men's Ties & Bowties - 80+ Colors, 4 Styles | KCT Menswear",
  description: "Shop premium silk ties and bowties in 80+ colors. Classic, Skinny, Slim & Bowtie styles. Bundle deals: Buy 4 Get 1 Free. Free shipping over $75. Detroit's premier menswear destination.",
  keywords: "mens ties, silk ties, bowties, wedding ties, skinny ties, slim ties, classic ties, tie bundles, detroit menswear, formal accessories, tie colors, navy tie, burgundy tie, black tie",
  openGraph: {
    title: "Men's Ties & Bowties Collection - 80+ Colors | KCT Menswear",
    description: "Discover our premium collection of silk ties and bowties in over 80 colors. Perfect for weddings, business, and special occasions.",
    type: 'website',
    url: 'https://kctmenswear.com/collections/ties',
    images: [
      {
        url: 'https://kctmenswear.com/images/ties-collection-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'KCT Menswear Ties Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Men's Ties & Bowties - 80+ Colors | KCT Menswear",
    description: "Premium silk ties in Classic, Skinny, Slim & Bowtie styles. Bundle deals available.",
    images: ['https://kctmenswear.com/images/ties-collection-hero.jpg']
  },
  alternates: {
    canonical: 'https://kctmenswear.com/collections/ties'
  }
};

export default function TiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}