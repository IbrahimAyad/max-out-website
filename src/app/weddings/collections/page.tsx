'use client';

import { useState } from 'react';
import { WeddingCollections } from '@/components/wedding/WeddingCollections';
import { Product } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mock wedding themes
const mockThemes = [
  {
    id: 'rustic',
    name: 'Rustic Romance',
    description: 'Natural textures and warm earth tones',
    colorPalette: {
      primary: '#8B4513',
      secondary: '#D2691E',
      accent: '#F4A460',
    },
    image: '/api/placeholder/400/500',
    products: {
      groom: [
        {
          id: 'g1',
          sku: 'WG-001',
          name: 'Brown Tweed Three-Piece',
          price: 89900,
          images: ['/api/placeholder/400/500'],
          category: 'suits' as const,
          stock: { '40R': 5 },
          variants: [],
        },
      ],
      groomsmen: [
        {
          id: 'gm1',
          sku: 'WGM-001',
          name: 'Tan Linen Suit',
          price: 69900,
          images: ['/api/placeholder/400/500'],
          category: 'suits' as const,
          stock: { '40R': 10 },
          variants: [],
        },
      ],
      accessories: [
        {
          id: 'a1',
          sku: 'WA-001',
          name: 'Burgundy Bow Tie Set',
          price: 4900,
          images: ['/api/placeholder/400/500'],
          category: 'accessories' as const,
          stock: { 'OS': 20 },
          variants: [],
        },
      ],
    },
  },
  {
    id: 'beach',
    name: 'Beach Elegance',
    description: 'Light fabrics and ocean-inspired hues',
    colorPalette: {
      primary: '#87CEEB',
      secondary: '#F0E68C',
      accent: '#FFF8DC',
    },
    image: '/api/placeholder/400/500',
    products: {
      groom: [
        {
          id: 'g2',
          sku: 'WG-002',
          name: 'Ivory Linen Suit',
          price: 79900,
          images: ['/api/placeholder/400/500'],
          category: 'suits' as const,
          stock: { '40R': 5 },
          variants: [],
        },
      ],
      groomsmen: [
        {
          id: 'gm2',
          sku: 'WGM-002',
          name: 'Light Blue Linen Suit',
          price: 69900,
          images: ['/api/placeholder/400/500'],
          category: 'suits' as const,
          stock: { '40R': 10 },
          variants: [],
        },
      ],
      accessories: [
        {
          id: 'a2',
          sku: 'WA-002',
          name: 'Coral Pocket Square Set',
          price: 3900,
          images: ['/api/placeholder/400/500'],
          category: 'accessories' as const,
          stock: { 'OS': 20 },
          variants: [],
        },
      ],
    },
  },
  {
    id: 'classic',
    name: 'Classic Black Tie',
    description: 'Timeless formal elegance',
    colorPalette: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#D4AF37',
    },
    image: '/api/placeholder/400/500',
    products: {
      groom: [
        {
          id: 'g3',
          sku: 'WG-003',
          name: 'Black Peak Lapel Tuxedo',
          price: 109900,
          images: ['/api/placeholder/400/500'],
          category: 'suits' as const,
          stock: { '40R': 5 },
          variants: [],
        },
      ],
      groomsmen: [
        {
          id: 'gm3',
          sku: 'WGM-003',
          name: 'Black Classic Tuxedo',
          price: 89900,
          images: ['/api/placeholder/400/500'],
          category: 'suits' as const,
          stock: { '40R': 10 },
          variants: [],
        },
      ],
      accessories: [
        {
          id: 'a3',
          sku: 'WA-003',
          name: 'Black Silk Bow Tie Set',
          price: 5900,
          images: ['/api/placeholder/400/500'],
          category: 'accessories' as const,
          stock: { 'OS': 20 },
          variants: [],
        },
      ],
    },
  },
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean lines and contemporary style',
    colorPalette: {
      primary: '#2C3E50',
      secondary: '#95A5A6',
      accent: '#E74C3C',
    },
    image: '/api/placeholder/400/500',
    products: {
      groom: [
        {
          id: 'g4',
          sku: 'WG-004',
          name: 'Midnight Blue Slim Suit',
          price: 99900,
          images: ['/api/placeholder/400/500'],
          category: 'suits' as const,
          stock: { '40R': 5 },
          variants: [],
        },
      ],
      groomsmen: [
        {
          id: 'gm4',
          sku: 'WGM-004',
          name: 'Charcoal Slim Suit',
          price: 79900,
          images: ['/api/placeholder/400/500'],
          category: 'suits' as const,
          stock: { '40R': 10 },
          variants: [],
        },
      ],
      accessories: [
        {
          id: 'a4',
          sku: 'WA-004',
          name: 'Silver Tie Bar Set',
          price: 4900,
          images: ['/api/placeholder/400/500'],
          category: 'accessories' as const,
          stock: { 'OS': 20 },
          variants: [],
        },
      ],
    },
  },
];

export default function WeddingCollectionsPage() {
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleThemeSelect = (theme: any) => {

  };

  const handleAddToCart = (products: Product[]) => {

  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/weddings" className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
              <ArrowLeft className="h-4 w-4" />
              Back to Wedding Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Wedding Collections */}
      <WeddingCollections
        themes={mockThemes}
        onThemeSelect={handleThemeSelect}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}