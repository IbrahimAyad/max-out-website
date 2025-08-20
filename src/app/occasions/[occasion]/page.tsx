"use client";

import { useState } from "react";
import { usePathname, notFound } from "next/navigation";
import { occasionDetails, OccasionType, OccasionBundle } from "@/lib/types/occasions";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import { ArrowLeft, Check, ShoppingBag, Sparkles, Tag } from "lucide-react";
import Link from "next/link";

// Mock bundle data - in production this would come from API
const getDefaultBundle = (occasion: OccasionType): OccasionBundle => ({
  id: `${occasion}-1`,
  name: `${occasionDetails[occasion].title} Essential`,
  description: `Perfect outfit for ${occasionDetails[occasion].title.toLowerCase()}`,
  occasion,
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  price: 99900,
  discount: 15,
  features: [
    "Premium suit",
    "Dress shirt",
    "Silk tie",
    "Leather shoes",
    "Matching accessories"
  ],
  products: []
});

const mockBundles: Record<OccasionType, OccasionBundle[]> = {
  "job-interview": [
    {
      id: "ji-1",
      name: "The Interview Pro",
      description: "Classic navy suit with crisp white shirt for a professional first impression",
      occasion: "job-interview",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      price: 89900,
      discount: 15,
      features: [
        "Navy wool suit",
        "White cotton dress shirt", 
        "Conservative silk tie",
        "Black leather oxford shoes",
        "Matching belt"
      ],
      products: []
    }
  ],
  "wedding-guest": [
    {
      id: "wg-1",
      name: "Summer Wedding Guest",
      description: "Light and elegant for outdoor ceremonies",
      occasion: "wedding-guest",
      image: "https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800&q=80",
      price: 109900,
      discount: 15,
      features: [
        "Light grey linen suit",
        "Soft pink dress shirt",
        "Patterned silk tie", 
        "Brown leather loafers",
        "Pocket square"
      ],
      products: []
    }
  ],
  "black-tie": [
    {
      id: "bt-1", 
      name: "The Black Tie Essential",
      description: "Complete formal attire for galas and special events",
      occasion: "black-tie",
      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80",
      price: 149900,
      discount: 15,
      features: [
        "Black tuxedo with satin lapels",
        "Formal white dress shirt",
        "Black bow tie",
        "Patent leather shoes",
        "Cufflinks & studs set"
      ],
      products: []
    }
  ],
  "wedding-party": [getDefaultBundle("wedding-party")],
  "business": [getDefaultBundle("business")],
  "cocktail": [getDefaultBundle("cocktail")],
  "prom": [getDefaultBundle("prom")],
  "graduation": [getDefaultBundle("graduation")]
};

export default function OccasionDetailPage() {
  const pathname = usePathname();
  const occasion = pathname.split('/').pop() as OccasionType;
  
  const [selectedBundle, setSelectedBundle] = useState<OccasionBundle | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  
  const { products } = useProducts();
  const { addToCart } = useCart();

  // Validate occasion type
  if (!occasionDetails[occasion]) {
    notFound();
  }

  const details = occasionDetails[occasion];
  const bundles = mockBundles[occasion] || [];

  // Map products to bundles
  const bundlesWithProducts = bundles.map(bundle => ({
    ...bundle,
    products: products.slice(0, 4).map((product, index) => ({
      product,
      category: ["suit", "shirt", "tie", "shoes"][index] as any,
      required: true
    }))
  }));

  const handleAddBundleToCart = () => {
    if (!selectedBundle) return;

    // Add each product in the bundle to cart
    selectedBundle.products.forEach(({ product }) => {
      const size = selectedSizes[product.id];
      if (size) {
        addToCart(product, size);
      }
    });
  };

  const calculateBundlePrice = (bundle: OccasionBundle) => {
    const originalPrice = bundle.products.reduce((sum, { product }) => sum + product.price, 0);
    const discountedPrice = Math.round(originalPrice * (1 - bundle.discount / 100));
    return { originalPrice, discountedPrice };
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className={cn("py-20", details.color)}>
        <div className="container-main">
          <Link 
            href="/occasions"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Occasions
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{details.icon}</span>
            <h1 className="text-4xl md:text-5xl font-serif">{details.title}</h1>
          </div>
          <p className="text-xl text-gray-700">{details.description}</p>
        </div>
      </section>

      {/* Bundles */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-2xl font-semibold mb-8">Curated Outfits</h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {bundlesWithProducts.map((bundle) => {
              const { originalPrice, discountedPrice } = calculateBundlePrice(bundle);
              const isSelected = selectedBundle?.id === bundle.id;

              return (
                <Card
                  key={bundle.id}
                  className={cn(
                    "overflow-hidden cursor-pointer transition-all",
                    isSelected && "ring-2 ring-gold"
                  )}
                  onClick={() => setSelectedBundle(bundle)}
                >
                  <div className="relative aspect-[3/4] bg-gray-100">
                    <Image
                      src={bundle.image}
                      alt={bundle.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-sm text-sm font-bold">
                      {bundle.discount}% OFF
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{bundle.name}</h3>
                    <p className="text-gray-600 mb-4">{bundle.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {bundle.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-2xl font-bold">
                          {formatPrice(discountedPrice)}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(originalPrice)}
                        </div>
                      </div>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBundle(bundle);
                        }}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected Bundle Details */}
      {selectedBundle && (
        <section className="py-16 bg-gray-50">
          <div className="container-main">
            <h2 className="text-2xl font-semibold mb-8">Customize Your Bundle</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Products in Bundle */}
              <div className="space-y-4">
                {selectedBundle.products.map(({ product, category }) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-32 bg-gray-100 rounded-sm overflow-hidden">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{category}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {product.variants.map((variant) => (
                            <button
                              key={variant.size}
                              onClick={() => setSelectedSizes({
                                ...selectedSizes,
                                [product.id]: variant.size
                              })}
                              disabled={variant.stock === 0}
                              className={cn(
                                "px-3 py-1 text-sm border rounded transition-colors",
                                variant.stock === 0 && "opacity-50 cursor-not-allowed",
                                selectedSizes[product.id] === variant.size
                                  ? "border-gold bg-gold text-black"
                                  : "border-gray-300 hover:border-gray-400"
                              )}
                            >
                              {variant.size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div>
                <Card className="p-6 sticky top-24">
                  <h3 className="text-xl font-semibold mb-4">Bundle Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    {selectedBundle.products.map(({ product }) => {
                      const size = selectedSizes[product.id];
                      return (
                        <div key={product.id} className="flex justify-between text-sm">
                          <span>
                            {product.name}
                            {size && <span className="text-gray-500"> ({size})</span>}
                          </span>
                          <span>{formatPrice(product.price)}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>{formatPrice(calculateBundlePrice(selectedBundle).originalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-green-600 mb-2">
                      <span>Bundle Discount ({selectedBundle.discount}%)</span>
                      <span>
                        -{formatPrice(
                          calculateBundlePrice(selectedBundle).originalPrice - 
                          calculateBundlePrice(selectedBundle).discountedPrice
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>{formatPrice(calculateBundlePrice(selectedBundle).discountedPrice)}</span>
                    </div>
                  </div>
                  
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleAddBundleToCart}
                    disabled={selectedBundle.products.some(({ product }) => !selectedSizes[product.id])}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add Bundle to Cart
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Free shipping on orders over $500
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}