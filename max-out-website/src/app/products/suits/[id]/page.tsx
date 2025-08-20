import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SimpleSuitProductDetail from '@/components/products/SimpleSuitProductDetail';
import { stripeProducts } from '@/lib/services/stripeProductService';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const suitData = Object.entries(stripeProducts.suits).find(([key, suit]) => 
    suit.productId === id
  );
  
  if (!suitData) {
    return {
      title: 'Suit Not Found',
    };
  }
  
  const [color] = suitData;
  const title = `${color.charAt(0).toUpperCase() + color.slice(1)} Suit - Premium Men's Suits | KCT Menswear`;
  
  return {
    title,
    description: `Shop our premium ${color} suit available in 2-piece ($179.99) and 3-piece ($199.99) options. Perfect fit guaranteed with sizes 34-54. Free shipping on orders over $200.`,
    openGraph: {
      title,
      description: `Premium ${color} suit with expert tailoring and modern fit.`,
      images: [`/images/suits/${color}-suit-main.jpg`],
    },
  };
}

// Generate static params for all suits
export async function generateStaticParams() {
  return Object.values(stripeProducts.suits).map((suit) => ({
    id: suit.productId,
  }));
}

export default async function SuitProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Find the suit data
  const suitEntry = Object.entries(stripeProducts.suits).find(([key, suit]) => 
    suit.productId === id
  );
  
  if (!suitEntry) {
    notFound();
  }
  
  const [color, suitData] = suitEntry;
  
  return <SimpleSuitProductDetail color={color} suitData={suitData} />;
}