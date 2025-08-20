'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Package, Footprints, Watch, ShoppingBag, RefreshCw } from 'lucide-react';
import { Product, ProductCategory } from '@/lib/types';

interface OutfitItem {
  category: ProductCategory;
  product: Product | null;
}

interface PersonalizedOutfitBuilderProps {
  products: Product[];
  onAddOutfitToCart: (outfit: Product[]) => void;
}

const categoryIcons = {
  suits: Package,
  shirts: Shirt,
  shoes: Footprints,
  accessories: Watch,
};

export function PersonalizedOutfitBuilder({ products, onAddOutfitToCart }: PersonalizedOutfitBuilderProps) {
  const [outfit, setOutfit] = useState<Record<ProductCategory, Product | null>>({
    suits: null,
    shirts: null,
    shoes: null,
    accessories: null,
  });

  const [activeCategory, setActiveCategory] = useState<ProductCategory>('suits');

  const categoryProducts = products.filter(p => p.category === activeCategory);

  const selectProduct = (product: Product) => {
    setOutfit(prev => ({
      ...prev,
      [activeCategory]: product,
    }));
  };

  const randomizeCategory = (category: ProductCategory) => {
    const categoryItems = products.filter(p => p.category === category);
    if (categoryItems.length > 0) {
      const randomProduct = categoryItems[Math.floor(Math.random() * categoryItems.length)];
      setOutfit(prev => ({
        ...prev,
        [category]: randomProduct,
      }));
    }
  };

  const randomizeOutfit = () => {
    Object.keys(outfit).forEach(category => {
      randomizeCategory(category as ProductCategory);
    });
  };

  const outfitTotal = Object.values(outfit)
    .filter(Boolean)
    .reduce((total, product) => total + (product?.price || 0), 0);

  const outfitComplete = Object.values(outfit).every(item => item !== null);

  const handleAddToCart = () => {
    const outfitItems = Object.values(outfit).filter(Boolean) as Product[];
    onAddOutfitToCart(outfitItems);
  };

  if (allImages.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">No outfit images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
          {allImages.slice(0, 8).map((image, index) => (
            <motion.div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg"
              animate={{
                opacity: index === currentImageIndex ? 1 : 0.7,
                scale: index === currentImageIndex ? 1.05 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={image}
                alt={`Outfit ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-suit.jpg';
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}