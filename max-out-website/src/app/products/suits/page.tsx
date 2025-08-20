'use client';

import { useState, useEffect } from 'react';
import { getAllCoreProducts } from '@/lib/config/coreProducts';
import { getSuitImages } from '@/lib/data/suitImages';
import { Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Removed metadata since this is now a client component

export default function SuitsPage() {
  const [suits, setSuits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all core products and filter for suits
    const coreProducts = getAllCoreProducts();
    const suitProducts = coreProducts.filter(p => p.category === 'suits');
    
    // Group suits by color (each color has 2-piece and 3-piece)
    const suitsByColor = new Map<string, any>();
    
    suitProducts.forEach(suit => {
      // Extract color from ID (e.g., 'suit-navy-2p' -> 'navy')
      const match = suit.id.match(/suit-([^-]+)-([23]p)/);
      if (match) {
        const color = match[1];
        const type = match[2];
        
        if (!suitsByColor.has(color)) {
          // Get images for this color
          const images = getSuitImages(color);
          
          suitsByColor.set(color, {
            id: `suit-${color}`,
            color,
            name: formatColorName(color) + ' Suit',
            image: images?.main || `/placeholder-suit.jpg`,
            twoPiecePrice: 299.99,
            threePiecePrice: 349.99,
            twoPieceId: null,
            threePieceId: null,
            twoPiecePriceId: null,
            threePiecePriceId: null,
          });
        }
        
        const suitData = suitsByColor.get(color);
        if (type === '2p') {
          suitData.twoPieceId = suit.id;
          suitData.twoPiecePriceId = suit.stripe_price_id;
        } else if (type === '3p') {
          suitData.threePieceId = suit.id;
          suitData.threePiecePriceId = suit.stripe_price_id;
        }
      }
    });
    
    setSuits(Array.from(suitsByColor.values()));
    setLoading(false);
  }, []);
  
  // Helper function to format color names
  const formatColorName = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      'navy': 'Navy',
      'beige': 'Beige',
      'black': 'Black',
      'brown': 'Brown',
      'burgundy': 'Burgundy',
      'charcoal': 'Charcoal Grey',
      'darkbrown': 'Dark Brown',
      'emerald': 'Emerald',
      'hunter': 'Hunter Green',
      'indigo': 'Indigo',
      'lightgrey': 'Light Grey',
      'midnight': 'Midnight Blue',
      'sand': 'Sand',
      'tan': 'Tan',
    };
    return colorMap[color] || color.charAt(0).toUpperCase() + color.slice(1);
  };
  
  // Group suits by color family for better organization
  const colorFamilies = {
    'Classic': ['black', 'navy', 'charcoal', 'lightgrey'],
    'Earth Tones': ['tan', 'sand', 'beige', 'brown', 'darkbrown'],
    'Statement': ['burgundy', 'emerald', 'hunter', 'midnight', 'indigo'],
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gray-900 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Premium Men's Suits</h1>
          <p className="text-xl">Expertly Tailored • Perfect Fit • 14 Colors Available</p>
        </div>
      </div>
      
      {/* Benefits Bar */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center">
              <span className="font-semibold mr-2">✓</span>
              Free Shipping Over $200
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">✓</span>
              Free Alterations
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">✓</span>
              30-Day Returns
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">✓</span>
              Size 34-54 Available
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              <span>Filter</span>
            </button>
            <div className="text-sm text-gray-600">
              {suits.length} Products
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Sort by:</label>
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <span>Featured</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
        
        {/* Quick Style Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-semibold mb-3">Not sure which suit to choose?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>For Business:</strong> Navy, Charcoal Grey, or Black
            </div>
            <div>
              <strong>For Weddings:</strong> Light Grey, Tan, or Midnight Blue
            </div>
            <div>
              <strong>For Events:</strong> Burgundy, Emerald, or Indigo
            </div>
          </div>
        </div>
        
        {/* Products by Color Family */}
        {Object.entries(colorFamilies).map(([family, colors]) => (
          <div key={family} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{family}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suits
                .filter(suit => colors.includes(suit.color))
                .map((suit) => (
                  <div key={suit.id} className="group">
                    <Link href={suit.twoPieceId ? `/products/${suit.twoPieceId}` : '#'}>
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                        <Image
                          src={suit.image}
                          alt={suit.name}
                          width={300}
                          height={400}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-suit.jpg';
                          }}
                        />
                      </div>
                      <h3 className="font-medium text-lg mb-1">{suit.name}</h3>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm text-gray-600">From</span>
                        <span className="font-semibold">${suit.twoPiecePrice.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">2-Piece</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">3-Piece</span>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        ))}
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gray-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-lg mb-6">Our style experts are here to help you find the perfect suit</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
              Schedule Virtual Consultation
            </button>
            <button className="px-8 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
              Chat with Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}