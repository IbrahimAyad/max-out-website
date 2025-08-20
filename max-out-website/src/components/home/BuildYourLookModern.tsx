'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

interface OutfitItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Outfit {
  id: string;
  name: string;
  suit: OutfitItem;
  shirt: OutfitItem;
  tie: OutfitItem;
  totalPrice: number;
  bundlePrice: number;
  savings: number;
  description: string;
}

interface BuildYourLookModernProps {
  outfits: Outfit[];
}

export function BuildYourLookModern({ outfits }: BuildYourLookModernProps) {
  const [selectedOutfit, setSelectedOutfit] = useState(outfits[0]);
  const [activePanel, setActivePanel] = useState<'suit' | 'shirt' | 'tie'>('suit');

  // Extract all unique items by category
  const allSuits = outfits.map(outfit => outfit.suit);
  const allShirts = outfits.map(outfit => outfit.shirt);
  const allTies = outfits.map(outfit => outfit.tie);

  const handleItemSelect = (category: 'suit' | 'shirt' | 'tie', item: OutfitItem) => {
    // Find if there's a predefined outfit with this combination
    const matchingOutfit = outfits.find(outfit => 
      outfit[category].id === item.id
    );
    
    if (matchingOutfit) {
      setSelectedOutfit(matchingOutfit);
    } else {
      // Create custom combination
      const newOutfit: Outfit = {
        ...selectedOutfit,
        id: 'custom',
        name: 'Custom Look',
        [category]: item,
        totalPrice: selectedOutfit.suit.price + selectedOutfit.shirt.price + selectedOutfit.tie.price,
        bundlePrice: Math.round((selectedOutfit.suit.price + selectedOutfit.shirt.price + selectedOutfit.tie.price) * 0.85),
        savings: Math.round((selectedOutfit.suit.price + selectedOutfit.shirt.price + selectedOutfit.tie.price) * 0.15),
        description: 'Your personalized style combination'
      };
      setSelectedOutfit(newOutfit);
    }
  };

  return (
    <div className="container-main">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="font-serif text-5xl md:text-6xl font-light mb-6 tracking-tight">
          Build Your Look
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
          Create the perfect ensemble with our interactive styling tool.
          Mix and match premium pieces to discover your signature style.
        </p>
      </motion.div>

      {/* Interactive Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
        {/* Left Side - Item Selection Panels */}
        <div className="lg:col-span-3 space-y-8">
          {/* Suit Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif font-medium">Choose Your Suit</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Step 1</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {allSuits.map((suit) => (
                <motion.div
                  key={suit.id}
                  className={`relative cursor-pointer group border-2 transition-all duration-300 ${
                    selectedOutfit.suit.id === suit.id 
                      ? 'border-burgundy shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleItemSelect('suit', suit)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={suit.image}
                      alt={suit.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {selectedOutfit.suit.id === suit.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-burgundy rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="font-medium text-sm mb-1">{suit.name}</h4>
                    <p className="text-burgundy font-semibold">${suit.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Shirt Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif font-medium">Select Your Shirt</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Step 2</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {allShirts.map((shirt) => (
                <motion.div
                  key={shirt.id}
                  className={`relative cursor-pointer group border-2 transition-all duration-300 ${
                    selectedOutfit.shirt.id === shirt.id 
                      ? 'border-burgundy shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleItemSelect('shirt', shirt)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={shirt.image}
                      alt={shirt.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {selectedOutfit.shirt.id === shirt.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-burgundy rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="font-medium text-sm mb-1">{shirt.name}</h4>
                    <p className="text-burgundy font-semibold">${shirt.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tie Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif font-medium">Pick Your Tie</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Step 3</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {allTies.map((tie) => (
                <motion.div
                  key={tie.id}
                  className={`relative cursor-pointer group border-2 transition-all duration-300 ${
                    selectedOutfit.tie.id === tie.id 
                      ? 'border-burgundy shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleItemSelect('tie', tie)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={tie.image}
                      alt={tie.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {selectedOutfit.tie.id === tie.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-burgundy rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="font-medium text-sm mb-1">{tie.name}</h4>
                    <p className="text-burgundy font-semibold">${tie.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Summary & CTA */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="lg:col-span-1"
        >
          <div className="bg-gray-50 p-8 sticky top-8">
            <h3 className="text-xl font-serif font-medium mb-6">Your Complete Look</h3>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedOutfit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 mb-8"
              >
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">{selectedOutfit.suit.name}</span>
                  <span className="font-semibold">${selectedOutfit.suit.price}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">{selectedOutfit.shirt.name}</span>
                  <span className="font-semibold">${selectedOutfit.shirt.price}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">{selectedOutfit.tie.name}</span>
                  <span className="font-semibold">${selectedOutfit.tie.price}</span>
                </div>
                
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 line-through">Total: ${selectedOutfit.totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Bundle Price:</span>
                    <span className="text-burgundy">${selectedOutfit.bundlePrice}</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    Save ${selectedOutfit.savings}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full bg-burgundy hover:bg-burgundy-700 text-white transition-colors duration-300"
              >
                Complete This Look - ${selectedOutfit.bundlePrice}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Link href="/products">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                >
                  Browse All Items
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              {selectedOutfit.description}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}