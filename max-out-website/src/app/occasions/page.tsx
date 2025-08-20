"use client";

import { useState } from "react";
import { occasionDetails, OccasionType } from "@/lib/types/occasions";
import { OccasionBundles } from "@/components/shop/OccasionBundles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product, StockLevel } from "@/lib/types";

interface Bundle {
  id: string;
  name: string;
  occasion: string;
  description: string;
  image: string;
  savings: number;
  products: BundleProduct[];
  totalPrice: number;
}

interface BundleProduct extends Product {
  bundlePrice: number;
  required: boolean;
}

// Mock bundles data
const mockBundles: Bundle[] = [
  {
    id: 'b1',
    name: 'The Interview Pro',
    occasion: 'job-interview',
    description: 'Make the perfect first impression',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    savings: 159,
    totalPrice: 105800,
    products: [
      {
        id: 'p1',
        sku: 'INT-001',
        name: 'Navy Professional Suit',
        price: 79900,
        bundlePrice: 71900,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'],
        category: 'suits' as const,
        stock: { '40R': 10 },
        variants: [],
        required: true,
      },
      {
        id: 'p2',
        sku: 'INT-002',
        name: 'White Dress Shirt',
        price: 12900,
        bundlePrice: 11600,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'],
        category: 'shirts' as const,
        stock: { 'M': 20 },
        variants: [],
        required: true,
      },
      {
        id: 'p3',
        sku: 'INT-003',
        name: 'Conservative Tie',
        price: 5900,
        bundlePrice: 5300,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/3a52e2df-c817-46b2-6a35-bed7ca57ea00/public'],
        category: 'accessories' as const,
        stock: { 'OS': 30 },
        variants: [],
        required: false,
      },
      {
        id: 'p4',
        sku: 'INT-004',
        name: 'Leather Dress Shoes',
        price: 19900,
        bundlePrice: 17900,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'],
        category: 'shoes' as const,
        stock: { '10': 15 },
        variants: [],
        required: true,
      },
    ],
  },
  {
    id: 'b2',
    name: 'The Wedding Guest',
    occasion: 'wedding',
    description: 'Perfect for celebrating love',
    image: 'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800&q=80',
    savings: 194,
    totalPrice: 129300,
    products: [
      {
        id: 'p5',
        sku: 'WED-001',
        name: 'Light Grey Suit',
        price: 89900,
        bundlePrice: 80900,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/aa23aaf9-ea00-430e-4436-15b8ad71db00/public'],
        category: 'suits' as const,
        stock: { '40R': 8 },
        variants: [],
        required: true,
      },
      {
        id: 'p6',
        sku: 'WED-002',
        name: 'Blush Pink Shirt',
        price: 14900,
        bundlePrice: 13400,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'],
        category: 'shirts' as const,
        stock: { 'M': 15 },
        variants: [],
        required: true,
      },
      {
        id: 'p7',
        sku: 'WED-003',
        name: 'Patterned Silk Tie',
        price: 6900,
        bundlePrice: 6200,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/0e796052-e8ae-40a0-045c-652028d2df00/public'],
        category: 'accessories' as const,
        stock: { 'OS': 25 },
        variants: [],
        required: false,
      },
      {
        id: 'p8',
        sku: 'WED-004',
        name: 'Brown Oxford Shoes',
        price: 17900,
        bundlePrice: 16100,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'],
        category: 'shoes' as const,
        stock: { '10': 12 },
        variants: [],
        required: true,
      },
    ],
  },
  {
    id: 'b3',
    name: 'The Black Tie',
    occasion: 'black-tie',
    description: 'Ultimate formal elegance',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80',
    savings: 265,
    totalPrice: 176400,
    products: [
      {
        id: 'p9',
        sku: 'BT-001',
        name: 'Black Tuxedo',
        price: 119900,
        bundlePrice: 107900,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/3859e360-f63d-40d5-35ec-223ffc67f000/public'],
        category: 'suits' as const,
        stock: { '40R': 5 },
        variants: [],
        required: true,
      },
      {
        id: 'p10',
        sku: 'BT-002',
        name: 'Formal Wing Collar Shirt',
        price: 16900,
        bundlePrice: 15200,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'],
        category: 'shirts' as const,
        stock: { 'M': 10 },
        variants: [],
        required: true,
      },
      {
        id: 'p11',
        sku: 'BT-003',
        name: 'Black Silk Bow Tie',
        price: 4900,
        bundlePrice: 4400,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'],
        category: 'accessories' as const,
        stock: { 'OS': 20 },
        variants: [],
        required: true,
      },
      {
        id: 'p12',
        sku: 'BT-004',
        name: 'Patent Leather Shoes',
        price: 22900,
        bundlePrice: 20600,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'],
        category: 'shoes' as const,
        stock: { '10': 8 },
        variants: [],
        required: true,
      },
      {
        id: 'p13',
        sku: 'BT-005',
        name: 'Cufflinks & Studs Set',
        price: 9900,
        bundlePrice: 8900,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'],
        category: 'accessories' as const,
        stock: { 'OS': 15 },
        variants: [],
        required: false,
      },
    ],
  },
];

export default function OccasionsPage() {
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType | null>(null);
  const [showBundles, setShowBundles] = useState(false);

  const handleAddToCart = (bundle: any, selectedProducts: any[]) => {

    // Implement cart functionality
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl"></div>

        <div className="container-main text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 text-gold mb-6">
              <div className="h-px w-12 bg-gold"></div>
              <span className="text-sm font-semibold tracking-widest uppercase">Curated Collections</span>
              <div className="h-px w-12 bg-gold"></div>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 leading-tight">
              Dressed for Every
              <span className="block text-gold mt-2">Occasion</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Expertly curated outfits for life's important moments. 
              Save time and look your best with our premium occasion-based bundles.
            </p>
            <Button 
              size="lg" 
              onClick={() => setShowBundles(!showBundles)}
              className="bg-gold hover:bg-gold/90 text-black px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-gold/20 transition-all duration-300 transform hover:scale-105"
            >
              {showBundles ? 'Hide Bundles' : 'View All Bundles'}
            </Button>
          </div>
        </div>
      </section>

      {/* Occasion Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Choose Your Occasion</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select from our expertly curated collections designed for life's special moments
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(Object.entries(occasionDetails) as [OccasionType, typeof occasionDetails[OccasionType]][]).map(
              ([key, details]) => (
                <Card
                  key={key}
                  className={cn(
                    "p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0 bg-white",
                    selectedOccasion === key && "ring-2 ring-gold shadow-xl"
                  )}
                  onClick={() => setSelectedOccasion(key)}
                >
                  <div className="text-5xl mb-6 transform transition-transform duration-300 hover:scale-110">
                    {details.icon}
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3">{details.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{details.description}</p>
                  <Link href={`/occasions/${key}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group border-gold/30 hover:border-gold hover:bg-gold/10 transition-all duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Outfits
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-2" />
                    </Button>
                  </Link>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container-main">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-gold mb-6">
              <div className="h-px w-12 bg-gold"></div>
              <span className="text-sm font-semibold tracking-widest uppercase">Simple Process</span>
              <div className="h-px w-12 bg-gold"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gold text-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110">
                1
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Choose Your Occasion</h3>
              <p className="text-gray-600 leading-relaxed">
                Select from our curated list of events and occasions
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gold text-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110">
                2
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Customize Your Look</h3>
              <p className="text-gray-600 leading-relaxed">
                Swap items, choose sizes, and make it your own
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gold text-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110">
                3
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Save & Ship</h3>
              <p className="text-gray-600 leading-relaxed">
                Get 15% off bundles and free shipping over $500
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Occasion Bundles Component */}
      {showBundles && (
        <section className="py-16 bg-gray-50">
          <OccasionBundles
            bundles={mockBundles}
            onAddToCart={handleAddToCart}
          />
        </section>
      )}

      {/* Popular Bundles Preview */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-main">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-gold mb-6">
              <div className="h-px w-12 bg-gold"></div>
              <span className="text-sm font-semibold tracking-widest uppercase">Best Sellers</span>
              <div className="h-px w-12 bg-gold"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Popular Bundles</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our most loved combinations, perfected through thousands of satisfied customers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Job Interview Bundle */}
            <div className="group">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                  alt="Job Interview Bundle"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-sm text-sm font-semibold shadow-md">
                  Best Seller
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-gold transition-colors">The Interview Pro</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Navy suit, white shirt, conservative tie, leather shoes
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold">$899</span>
                  <span className="text-gray-500 line-through ml-2">$1,058</span>
                  <span className="block text-sm text-green-600 font-semibold">Save $159</span>
                </div>
                <Button size="sm" className="bg-black hover:bg-gray-900 text-white transition-all duration-300 hover:scale-105">View Bundle</Button>
              </div>
            </div>

            {/* Wedding Guest Bundle */}
            <div className="group">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800&q=80"
                  alt="Wedding Guest Bundle"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-rose-600 text-white px-4 py-2 rounded-sm text-sm font-semibold shadow-md">
                  Wedding Season
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-gold transition-colors">The Wedding Guest</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Light grey suit, blush shirt, patterned tie, brown shoes
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold">$1,099</span>
                  <span className="text-gray-500 line-through ml-2">$1,293</span>
                  <span className="block text-sm text-green-600 font-semibold">Save $194</span>
                </div>
                <Button size="sm" className="bg-black hover:bg-gray-900 text-white transition-all duration-300 hover:scale-105">View Bundle</Button>
              </div>
            </div>

            {/* Black Tie Bundle */}
            <div className="group">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80"
                  alt="Black Tie Bundle"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black text-gold px-4 py-2 rounded-sm text-sm font-semibold shadow-md">
                  Luxury
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-gold transition-colors">The Black Tie</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Tuxedo, formal shirt, bow tie, patent leather shoes, cufflinks
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold">$1,499</span>
                  <span className="text-gray-500 line-through ml-2">$1,764</span>
                  <span className="block text-sm text-green-600 font-semibold">Save $265</span>
                </div>
                <Button size="sm" className="bg-black hover:bg-gray-900 text-white transition-all duration-300 hover:scale-105">View Bundle</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl"></div>

        <div className="container-main text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
              Need Help
              <span className="block text-gold mt-2">Choosing?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our style experts are here to help you find the perfect outfit for any occasion
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-black px-10 py-6 text-lg backdrop-blur-sm transition-all duration-300">
                Book a Consultation
              </Button>
              <Link href="/style-quiz">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-black px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-gold/20 transition-all duration-300 transform hover:scale-105">
                  Try Style Finder
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}