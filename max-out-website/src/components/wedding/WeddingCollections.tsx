'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Eye, ShoppingBag, Users, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';

interface WeddingTheme {
  id: string;
  name: string;
  description: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  image: string;
  products: {
    groom: Product[];
    groomsmen: Product[];
    accessories: Product[];
  };
}

interface PartyMemberOutfit {
  role: 'groom' | 'best_man' | 'groomsman';
  name: string;
  products: Product[];
}

interface WeddingCollectionsProps {
  themes: WeddingTheme[];
  onThemeSelect: (theme: WeddingTheme) => void;
  onAddToCart: (products: Product[]) => void;
}

export function WeddingCollections({ themes, onThemeSelect, onAddToCart }: WeddingCollectionsProps) {
  const [selectedTheme, setSelectedTheme] = useState<WeddingTheme | null>(null);
  const [partyVisualization, setPartyVisualization] = useState<PartyMemberOutfit[]>([]);
  const [activeRole, setActiveRole] = useState<'groom' | 'groomsmen'>('groom');
  const [colorCoordination, setColorCoordination] = useState({
    matchingLevel: 'coordinated' as 'identical' | 'coordinated' | 'complementary',
    customColors: false,
  });

  const handleThemeSelect = (theme: WeddingTheme) => {
    setSelectedTheme(theme);
    onThemeSelect(theme);
    generatePartyVisualization(theme);
  };

  const generatePartyVisualization = (theme: WeddingTheme) => {
    const visualization: PartyMemberOutfit[] = [
      {
        role: 'groom',
        name: 'Groom',
        products: theme.products.groom,
      },
      {
        role: 'best_man',
        name: 'Best Man',
        products: theme.products.groomsmen.slice(0, 3),
      },
      ...Array.from({ length: 3 }, (_, i) => ({
        role: 'groomsman' as const,
        name: `Groomsman ${i + 1}`,
        products: theme.products.groomsmen.slice(0, 3),
      })),
    ];
    setPartyVisualization(visualization);
  };

  const getMatchingDescription = () => {
    switch (colorCoordination.matchingLevel) {
      case 'identical':
        return 'Everyone wears the exact same suit for perfect uniformity';
      case 'coordinated':
        return 'Groom stands out with unique elements while party coordinates';
      case 'complementary':
        return 'Each member has variety while maintaining cohesive style';
    }
  };

  const calculateTotalPrice = () => {
    return partyVisualization.reduce((total, member) => {
      return total + member.products.reduce((sum, product) => sum + product.price, 0);
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-4">Wedding Collections</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Expertly curated collections for every wedding style. Ensure your entire party looks cohesive and sophisticated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleThemeSelect(theme)}
            className="cursor-pointer group"
          >
            <div className="relative h-64 rounded-lg overflow-hidden mb-4">
              <img
                src={theme.image}
                alt={theme.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-serif text-white mb-1">{theme.name}</h3>
                <p className="text-sm text-white/80">{theme.description}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colorPalette.primary }}
              />
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colorPalette.secondary }}
              />
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colorPalette.accent }}
              />
            </div>
            
            <button className="text-sm text-gold hover:text-gold/80 font-medium transition-colors">
              Explore Collection →
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedTheme && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-black to-gray-800 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-serif mb-2">{selectedTheme.name} Collection</h3>
                  <p className="text-white/80">{selectedTheme.description}</p>
                </div>
                <div className="flex gap-3">
                  {Object.entries(selectedTheme.colorPalette).map(([key, color]) => (
                    <div key={key} className="text-center">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-white/50 mb-1"
                        style={{ backgroundColor: color }}
                      />
                      <p className="text-xs text-white/60 capitalize">{key}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4">Party Visualization</h4>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {partyVisualization.map((member, index) => (
                    <motion.div
                      key={`${member.role}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex-shrink-0 w-48"
                    >
                      <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <div className="w-32 h-40 bg-gray-300 rounded-lg mx-auto mb-3 relative overflow-hidden">
                          {member.products[0] && (
                            <img
                              src={member.products[0].images[0]}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {member.role === 'groom' && (
                            <div className="absolute top-2 right-2 bg-gold text-black text-xs px-2 py-1 rounded-full font-semibold">
                              Groom
                            </div>
                          )}
                        </div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">${member.products.reduce((sum, p) => sum + p.price, 0) / 100}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4">Color Coordination</h4>
                  <div className="space-y-3">
                    {(['identical', 'coordinated', 'complementary'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setColorCoordination({ ...colorCoordination, matchingLevel: level })}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          colorCoordination.matchingLevel === level
                            ? 'border-gold bg-gold/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium capitalize">{level}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {level === 'identical' && 'Perfect uniformity'}
                              {level === 'coordinated' && 'Groom distinction'}
                              {level === 'complementary' && 'Stylish variety'}
                            </p>
                          </div>
                          {colorCoordination.matchingLevel === level && (
                            <Sparkles className="w-5 h-5 text-gold" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{getMatchingDescription()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-4">Mix & Match Options</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Groom Style</label>
                      <select className="w-full px-4 py-2 border rounded-sm focus:border-gold focus:outline-none">
                        <option>Classic Black Tuxedo</option>
                        <option>Navy Three-Piece Suit</option>
                        <option>Charcoal Modern Fit</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Groomsmen Style</label>
                      <select className="w-full px-4 py-2 border rounded-sm focus:border-gold focus:outline-none">
                        <option>Matching Groom (Black)</option>
                        <option>Coordinated Navy</option>
                        <option>Complementary Charcoal</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Accessories</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" className="text-gold focus:ring-gold" defaultChecked />
                          <span className="text-sm">Matching Ties</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" className="text-gold focus:ring-gold" defaultChecked />
                          <span className="text-sm">Pocket Squares</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" className="text-gold focus:ring-gold" />
                          <span className="text-sm">Boutonnieres</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" className="text-gold focus:ring-gold" />
                          <span className="text-sm">Cufflinks</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total for {partyVisualization.length} Members</p>
                    <p className="text-3xl font-bold">${(calculateTotalPrice() / 100).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Per Person Average</p>
                    <p className="text-xl font-semibold">
                      ${(calculateTotalPrice() / partyVisualization.length / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddToCart(partyVisualization.flatMap(m => m.products))}
                    className="flex-1 bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add Complete Collection
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white rounded-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    Preview
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}