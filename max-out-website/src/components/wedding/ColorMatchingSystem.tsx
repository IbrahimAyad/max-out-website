'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Eye, Heart, Sparkles, Copy, Download, Share2 } from 'lucide-react';

interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  mood: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  suitColors: string[];
  tieColors: string[];
  shirtColors: string[];
}

const weddingPalettes: ColorPalette[] = [
  {
    id: '1',
    name: 'Romantic Blush',
    description: 'Soft pinks and warm neutrals for a romantic garden wedding',
    colors: { primary: '#F8BBD9', secondary: '#E4A0B1', accent: '#D4AF37', neutral: '#F5F5F0' },
    mood: 'Romantic & Dreamy',
    season: 'spring',
    suitColors: ['#2C3E50', '#4A4A4A', '#8B7355'],
    tieColors: ['#F8BBD9', '#E4A0B1', '#D4AF37'],
    shirtColors: ['#FFFFFF', '#F5F5F0', '#FDF5F3']
  },
  {
    id: '2',
    name: 'Elegant Navy',
    description: 'Classic navy with gold accents for a timeless celebration',
    colors: { primary: '#1B365D', secondary: '#4A6FA5', accent: '#D4AF37', neutral: '#F8F8F8' },
    mood: 'Classic & Sophisticated',
    season: 'all',
    suitColors: ['#1B365D', '#2C3E50', '#4A4A4A'],
    tieColors: ['#D4AF37', '#4A6FA5', '#B8860B'],
    shirtColors: ['#FFFFFF', '#F8F8F8', '#FFF8DC']
  },
  {
    id: '3',
    name: 'Autumn Warmth',
    description: 'Rich burgundy and warm golds for a cozy fall wedding',
    colors: { primary: '#8B1538', secondary: '#CD853F', accent: '#DAA520', neutral: '#FDF5E6' },
    mood: 'Warm & Inviting',
    season: 'fall',
    suitColors: ['#2C3E50', '#8B1538', '#654321'],
    tieColors: ['#8B1538', '#CD853F', '#DAA520'],
    shirtColors: ['#FDF5E6', '#FFFFFF', '#F5F5DC']
  },
  {
    id: '4',
    name: 'Fresh Sage',
    description: 'Soft greens and ivory for a natural outdoor ceremony',
    colors: { primary: '#9CAF88', secondary: '#6B8E5A', accent: '#F4E4BC', neutral: '#FFFEF7' },
    mood: 'Natural & Fresh',
    season: 'summer',
    suitColors: ['#2C3E50', '#4A4A4A', '#6B8E5A'],
    tieColors: ['#9CAF88', '#6B8E5A', '#F4E4BC'],
    shirtColors: ['#FFFEF7', '#FFFFFF', '#F8F8F0']
  }
];

export function ColorMatchingSystem() {
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(weddingPalettes[0]);
  const [customColor, setCustomColor] = useState('#FF6B9D');
  const [viewMode, setViewMode] = useState<'palette' | 'products'>('palette');

  const generateCustomPalette = (baseColor: string) => {
    // Simple color harmony generation
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Generate complementary and analogous colors
    const complementary = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
    const analogous1 = `rgb(${Math.min(255, r + 30)}, ${Math.max(0, g - 30)}, ${b})`;
    const analogous2 = `rgb(${Math.max(0, r - 30)}, ${Math.min(255, g + 30)}, ${b})`;
    
    return {
      primary: baseColor,
      secondary: analogous1,
      accent: analogous2,
      neutral: '#F8F8F8'
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif mb-2">Wedding Color Matching</h1>
              <p className="text-purple-100">
                Create the perfect color harmony for your special day
              </p>
            </div>
            <Palette className="w-16 h-16 text-purple-200" />
          </div>
        </div>

        <div className="p-8">
          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setViewMode('palette')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                viewMode === 'palette'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Palette className="w-5 h-5 inline mr-2" />
              Color Palettes
            </button>
            <button
              onClick={() => setViewMode('products')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                viewMode === 'products'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-5 h-5 inline mr-2" />
              Product Preview
            </button>
          </div>

          {viewMode === 'palette' && (
            <>
              {/* Curated Palettes */}
              <div className="mb-12">
                <h2 className="text-2xl font-serif mb-6">Curated Wedding Palettes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {weddingPalettes.map((palette, index) => (
                    <motion.div
                      key={palette.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedPalette(palette)}
                      className={`cursor-pointer p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                        selectedPalette.id === palette.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-center mb-4">
                        <div className="flex gap-1">
                          {Object.values(palette.colors).map((color, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-center mb-2">{palette.name}</h3>
                      <p className="text-sm text-gray-600 text-center mb-3">{palette.description}</p>
                      
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-gray-100 rounded-full">{palette.mood}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full capitalize">{palette.season}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Custom Color Generator */}
              <div className="mb-12">
                <h2 className="text-2xl font-serif mb-6">Create Custom Palette</h2>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <label className="text-lg font-medium">Choose your base color:</label>
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                    />
                    <span className="text-lg font-mono">{customColor}</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(generateCustomPalette(customColor)).map(([name, color]) => (
                      <div key={name} className="text-center">
                        <div
                          className="w-20 h-20 rounded-lg border-2 border-white shadow-lg mx-auto mb-2"
                          style={{ backgroundColor: color }}
                        />
                        <div className="text-sm font-medium capitalize">{name}</div>
                        <div className="text-xs text-gray-500 font-mono">{color}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'products' && (
            <div className="space-y-8">
              {/* Selected Palette Display */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl">
                <h2 className="text-2xl font-serif mb-6">{selectedPalette.name} Collection</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Suits */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-800 rounded"></div>
                      Recommended Suits
                    </h3>
                    <div className="space-y-3">
                      {selectedPalette.suitColors.map((color, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium">Classic Suit</span>
                          <button
                            onClick={() => copyToClipboard(color)}
                            className="ml-auto p-1 hover:bg-gray-100 rounded"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ties */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-600 rounded"></div>
                      Coordinating Ties
                    </h3>
                    <div className="space-y-3">
                      {selectedPalette.tieColors.map((color, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium">Silk Tie</span>
                          <button
                            onClick={() => copyToClipboard(color)}
                            className="ml-auto p-1 hover:bg-gray-100 rounded"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shirts */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded border border-blue-300"></div>
                      Perfect Shirts
                    </h3>
                    <div className="space-y-3">
                      {selectedPalette.shirtColors.map((color, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium">Dress Shirt</span>
                          <button
                            onClick={() => copyToClipboard(color)}
                            className="ml-auto p-1 hover:bg-gray-100 rounded"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Save Palette
                </button>
                <button className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Guide
                </button>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share with Party
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}