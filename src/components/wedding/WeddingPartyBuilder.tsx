'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Users, DollarSign, Percent, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/lib/types';

interface PartyMember {
  id: string;
  role: 'groom' | 'groomsman' | 'father' | 'other';
  name: string;
  products: Product[];
  totalCost: number;
}

interface WeddingPartyBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  availableProducts: Product[];
  onSaveParty: (party: PartyMember[]) => void;
}

export function WeddingPartyBuilder({
  isOpen,
  onClose,
  availableProducts,
  onSaveParty
}: WeddingPartyBuilderProps) {
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([
    {
      id: 'groom',
      role: 'groom',
      name: 'Groom',
      products: [],
      totalCost: 0
    }
  ]);

  const addPartyMember = () => {
    const id = Date.now().toString();
    setPartyMembers(prev => [...prev, {
      id,
      role: 'groomsman',
      name: `Groomsman ${prev.length}`,
      products: [],
      totalCost: 0
    }]);
  };

  const removePartyMember = (id: string) => {
    setPartyMembers(prev => prev.filter(member => member.id !== id));
  };

  const addProductToMember = (memberId: string, product: Product) => {
    setPartyMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const newProducts = [...member.products, product];
        return {
          ...member,
          products: newProducts,
          totalCost: newProducts.reduce((sum, p) => sum + p.price, 0)
        };
      }
      return member;
    }));
  };

  const removeProductFromMember = (memberId: string, productId: string) => {
    setPartyMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const newProducts = member.products.filter(p => p.id !== productId);
        return {
          ...member,
          products: newProducts,
          totalCost: newProducts.reduce((sum, p) => sum + p.price, 0)
        };
      }
      return member;
    }));
  };

  const updateMemberName = (memberId: string, name: string) => {
    setPartyMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, name } : member
    ));
  };

  const getTotalCost = () => {
    return partyMembers.reduce((sum, member) => sum + member.totalCost, 0);
  };

  const getGroupDiscount = () => {
    const memberCount = partyMembers.length;
    if (memberCount >= 10) return 25;
    if (memberCount >= 6) return 20;
    if (memberCount >= 4) return 15;
    if (memberCount >= 2) return 10;
    return 0;
  };

  const getDiscountedTotal = () => {
    const total = getTotalCost();
    const discount = getGroupDiscount();
    return total * (1 - discount / 100);
  };

  const handleSave = () => {
    onSaveParty(partyMembers);
    onClose();
  };

  const handleShare = async () => {
    const partyDetails = {
      memberCount: partyMembers.length,
      totalCost: getTotalCost(),
      discount: getGroupDiscount(),
      finalCost: getDiscountedTotal()
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wedding Party Configuration - KCT Menswear',
          text: `Check out our wedding party setup: ${partyMembers.length} members, ${getGroupDiscount()}% group discount!`,
          url: window.location.href
        });
      } catch (error) {

      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Wedding Party: ${partyMembers.length} members, Total: $${(getDiscountedTotal() / 100).toFixed(2)} (${getGroupDiscount()}% off)`;
      navigator.clipboard.writeText(shareText);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gold to-gold/80 p-6 text-black">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold">Wedding Party Builder</h2>
                <p className="text-black/70">Drag and drop to create your perfect party look</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-black/70">Party Size</p>
                  <p className="text-2xl font-bold">{partyMembers.length}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-[600px]">
            {/* Party Members */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Party Members</h3>
                <Button
                  onClick={addPartyMember}
                  size="sm"
                  className="bg-gold hover:bg-gold/90 text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="space-y-4">
                {partyMembers.map((member) => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMemberName(member.id, e.target.value)}
                        className="font-semibold text-lg bg-transparent border-none outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          ${(member.totalCost / 100).toFixed(2)}
                        </span>
                        {member.role !== 'groom' && (
                          <button
                            onClick={() => removePartyMember(member.id)}
                            className="w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {member.products.map((product) => (
                        <div
                          key={product.id}
                          className="relative group bg-gray-100 rounded-lg p-2 pr-8"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="text-sm font-medium">{product.name}</span>
                          </div>
                          <button
                            onClick={() => removeProductFromMember(member.id, product.id)}
                            className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {member.products.length === 0 && (
                        <p className="text-gray-500 text-sm italic">
                          Drag products here to add to {member.name}'s look
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Product Library */}
            <div className="w-80 bg-gray-50 p-6 border-l overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Available Products</h3>

              <div className="space-y-3">
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg p-3 shadow-sm border cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('product', JSON.stringify(product));
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-gold font-semibold">
                          ${(product.price / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{partyMembers.length} Members</span>
                </div>

                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-600">
                    {getGroupDiscount()}% Group Discount
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <div>
                    <span className="text-gray-500 line-through mr-2">
                      ${(getTotalCost() / 100).toFixed(2)}
                    </span>
                    <span className="font-bold text-xl text-green-600">
                      ${(getDiscountedTotal() / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-gold hover:bg-gold/90 text-black gap-2"
                >
                  Save Party Configuration
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}