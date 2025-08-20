'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, ShoppingCart, CheckCircle, Clock, AlertCircle, Plus, Minus, DollarSign } from 'lucide-react';
import { Product } from '@/lib/types';

interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: 'groom' | 'best_man' | 'groomsman' | 'father' | 'other';
  size?: string;
  status: 'invited' | 'responded' | 'ordered' | 'completed';
  selectedProducts: { productId: string; size: string; quantity: number }[];
}

interface GroupOrderingSystemProps {
  weddingId: string;
  groomName: string;
  weddingDate: Date;
}

export function GroupOrderingSystem({ weddingId, groomName, weddingDate }: GroupOrderingSystemProps) {
  const [members, setMembers] = useState<GroupMember[]>([
    {
      id: '1',
      name: groomName,
      email: 'groom@example.com',
      role: 'groom',
      status: 'responded',
      selectedProducts: []
    }
  ]);
  
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'premium' | 'luxury'>('basic');
  const [showGroupDiscount, setShowGroupDiscount] = useState(false);

  const packages = {
    basic: { name: 'Classic Wedding Package', price: 299, items: ['Suit', 'Shirt', 'Tie', 'Pocket Square'] },
    premium: { name: 'Premium Wedding Package', price: 449, items: ['Designer Suit', 'Premium Shirt', 'Silk Tie', 'Cufflinks', 'Pocket Square'] },
    luxury: { name: 'Luxury Wedding Package', price: 649, items: ['Luxury Suit', 'Italian Shirt', 'Silk Tie & Bow Tie', 'Gold Cufflinks', 'Pocket Square', 'Suspenders'] }
  };

  const getGroupDiscount = () => {
    const size = members.length;
    if (size >= 8) return 20;
    if (size >= 6) return 15;
    if (size >= 4) return 10;
    return 0;
  };

  const addMember = () => {
    if (!newMemberEmail) return;
    
    const newMember: GroupMember = {
      id: Date.now().toString(),
      name: '',
      email: newMemberEmail,
      role: 'groomsman',
      status: 'invited',
      selectedProducts: []
    };
    
    setMembers([...members, newMember]);
    setNewMemberEmail('');
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const getTotalCost = () => {
    const baseTotal = members.length * packages[selectedPackage].price;
    const discount = getGroupDiscount();
    return baseTotal * (1 - discount / 100);
  };

  const getRoleIcon = (role: GroupMember['role']) => {
    switch (role) {
      case 'groom': return '👨‍💼';
      case 'best_man': return '🎩';
      case 'groomsman': return '👔';
      case 'father': return '👨‍🦳';
      default: return '👤';
    }
  };

  const getStatusColor = (status: GroupMember['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'ordered': return 'text-blue-600 bg-blue-100';
      case 'responded': return 'text-yellow-600 bg-yellow-100';
      case 'invited': return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif mb-2">Group Ordering System</h1>
              <p className="text-rose-100">
                Wedding: {new Date(weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{members.length}</div>
              <div className="text-rose-200 text-sm">Party Members</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Package Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif mb-6">Select Package</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(packages).map(([key, pkg]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedPackage(key as any)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPackage === key
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-rose-600 mb-4">${pkg.price}</div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {pkg.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Group Discount Display */}
          {getGroupDiscount() > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl mb-8 border border-green-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-800">Group Discount Active!</h3>
                    <p className="text-green-600">Save {getGroupDiscount()}% with {members.length} members</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-700">{getGroupDiscount()}% OFF</div>
                  <div className="text-green-600 text-sm">Total Savings: ${(members.length * packages[selectedPackage].price * getGroupDiscount() / 100).toFixed(2)}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Add Member */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif mb-6">Invite Party Members</h2>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter email address"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={addMember}
                className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Invite
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif mb-6">Party Members ({members.length})</h2>
            <div className="space-y-4">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{getRoleIcon(member.role)}</div>
                    <div>
                      <div className="font-semibold">{member.name || member.email}</div>
                      <div className="text-sm text-gray-600 capitalize">{member.role.replace('_', ' ')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status.replace('_', ' ')}
                    </span>
                    
                    {member.role !== 'groom' && (
                      <button
                        onClick={() => removeMember(member.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl">
            <h2 className="text-2xl font-serif mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg">
                <span>Package: {packages[selectedPackage].name}</span>
                <span>${packages[selectedPackage].price} × {members.length}</span>
              </div>
              
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span>${(members.length * packages[selectedPackage].price).toFixed(2)}</span>
              </div>
              
              {getGroupDiscount() > 0 && (
                <div className="flex justify-between text-lg text-green-600">
                  <span>Group Discount ({getGroupDiscount()}%)</span>
                  <span>-${(members.length * packages[selectedPackage].price * getGroupDiscount() / 100).toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-rose-600">${getTotalCost().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-lg font-semibold rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg">
              Send Invitations & Start Group Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}