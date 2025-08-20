import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import HomePageClient from "@/components/home/HomePageClient";
import HomePageHero from "@/components/home/HomePageHero";
import HomePageServices from "@/components/home/HomePageServices";

// Optimized hero image component for server-side rendering
const HeroImage = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1920&q=85"
        alt="KCT Menswear - Premium Men's Formal Wear"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
    </div>
  );
};

// Server-side function to fetch initial products
async function getInitialProducts() {
  // In a real application, this would fetch from your API
  // For now, return demo products for server-side rendering
  return [
    {
      id: 1, 
      name: "Classic Navy Suit", 
      category: "suits", 
      base_price: 599.99,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80",
      description: "Timeless elegance for the modern gentleman"
    },
    {
      id: 2, 
      name: "Black Tuxedo", 
      category: "tuxedos", 
      base_price: 799.99,
      image: "https://images.unsplash.com/photo-1521505772811-d7e4ec1b5c7b?w=500&q=80",
      description: "Perfect for special occasions"
    },
    {
      id: 3, 
      name: "Charcoal Business Suit", 
      category: "suits", 
      base_price: 549.99,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
      description: "Professional excellence"
    },
    {
      id: 4, 
      name: "Wedding Vest Set", 
      category: "accessories", 
      base_price: 199.99,
      image: "https://images.unsplash.com/photo-1621976360623-004223992275?w=500&q=80",
      description: "Complete your wedding look"
    },
    {
      id: 5, 
      name: "Prom Tuxedo", 
      category: "tuxedos", 
      base_price: 699.99,
      image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=80",
      description: "Make your night memorable"
    },
    {
      id: 6, 
      name: "Oxford Dress Shoes", 
      category: "shoes", 
      base_price: 299.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
      description: "Handcrafted Italian leather"
    }
  ];
}


export default async function HomePage() {
  // Server-side data fetching
  const initialProducts = await getInitialProducts();

  return (
    <main className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <HomePageHero>
        <HeroImage className="absolute inset-0 w-full h-full opacity-90" />
      </HomePageHero>

      {/* Dynamic Client-Side Content */}
      <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
        <HomePageClient initialProducts={initialProducts} />
      </Suspense>

      {/* Services and Contact Sections */}
      <HomePageServices />
    </main>
  );
}