'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, DollarSign, Calendar, MapPin, Palette, Camera, Share2, MessageSquare } from 'lucide-react';

interface PromGroup {
  id: string;
  schoolName: string;
  promDate: Date;
  groupSize: number;
  theme: string;
  colors: string[];
  budget: { min: number; max: number };
  style: 'classic' | 'modern' | 'trendy' | 'unique';
}

interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'member';
  packageSelection?: string;
  measurements?: {
    chest: number;
    waist: number;
    height: number;
  };
  status: 'invited' | 'joined' | 'measured' | 'ordered';
}

export function EnhancedPromGroupBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [groupInfo, setGroupInfo] = useState<PromGroup>({
    id: '',
    schoolName: '',
    promDate: new Date(),
    groupSize: 1,
    theme: '',
    colors: [],
    budget: { min: 200, max: 500 },
    style: 'classic'
  });
  
  const [members, setMembers] = useState<GroupMember[]>([{
    id: '1',
    name: '',
    email: '',
    role: 'organizer',
    status: 'joined'
  }]);

  const packages = [
    {
      id: 'starter',
      name: 'Starter Package',
      price: 199,
      items: ['Classic Tuxedo', 'White Shirt', 'Black Bow Tie', 'Cummerbund'],
      popular: false
    },
    {
      id: 'popular',
      name: 'Popular Package',
      price: 299,
      items: ['Premium Tuxedo', 'Designer Shirt', 'Silk Bow Tie', 'Cufflinks', 'Pocket Square'],
      popular: true
    },
    {
      id: 'luxury',
      name: 'Luxury Package',
      price: 449,
      items: ['Designer Tuxedo', 'Italian Shirt', 'Silk Tie Set', 'Gold Cufflinks', 'Suspenders', 'Shoes'],
      popular: false
    }
  ];

  const themes = [
    { name: 'Enchanted Garden', colors: ['#2E8B57', '#98FB98', '#F0FFF0'], icon: '🌿' },
    { name: 'Midnight Glamour', colors: ['#191970', '#4169E1', '#B0C4DE'], icon: '✨' },
    { name: 'Rose Gold Romance', colors: ['#E91E63', '#FFC0CB', '#FFD700'], icon: '🌹' },
    { name: 'Classic Elegance', colors: ['#000000', '#FFFFFF', '#C0C0C0'], icon: '🎩' }
  ];

  const getGroupDiscount = () => {
    if (members.length >= 10) return 25;
    if (members.length >= 6) return 20;
    if (members.length >= 4) return 15;
    if (members.length >= 2) return 10;
    return 0;
  };

  const addMember = () => {
    const newMember: GroupMember = {
      id: Date.now().toString(),
      name: '',
      email: '',
      role: 'member',
      status: 'invited'
    };
    setMembers([...members, newMember]);
  };

  const updateMember = (id: string, field: keyof GroupMember, value: any) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-serif mb-4">Let's Get Started</h2>
              <p className="text-gray-600">Tell us about your prom group to get personalized recommendations</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold mb-3">School Name</label>
                <input
                  type="text"
                  placeholder="Enter your school name"
                  value={groupInfo.schoolName}
                  onChange={(e) => setGroupInfo({...groupInfo, schoolName: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-lg font-semibold mb-3">Prom Date</label>
                <input
                  type="date"
                  value={groupInfo.promDate.toISOString().split('T')[0]}
                  onChange={(e) => setGroupInfo({...groupInfo, promDate: new Date(e.target.value)})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-lg font-semibold mb-3">Expected Group Size</label>
                <select
                  value={groupInfo.groupSize}
                  onChange={(e) => setGroupInfo({...groupInfo, groupSize: parseInt(e.target.value)})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {[2, 4, 6, 8, 10, 12, 15, 20].map(size => (
                    <option key={size} value={size}>{size} people</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-lg font-semibold mb-3">Style Preference</label>
                <select
                  value={groupInfo.style}
                  onChange={(e) => setGroupInfo({...groupInfo, style: e.target.value as any})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="classic">Classic & Timeless</option>
                  <option value="modern">Modern & Sleek</option>
                  <option value="trendy">Trendy & Fashion-Forward</option>
                  <option value="unique">Unique & Statement-Making</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-serif mb-4">Choose Your Theme</h2>
              <p className="text-gray-600">Select a theme that matches your prom's aesthetic</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes.map((theme) => (
                <motion.div
                  key={theme.name}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setGroupInfo({...groupInfo, theme: theme.name, colors: theme.colors})}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    groupInfo.theme === theme.name
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{theme.icon}</span>
                    <h3 className="text-xl font-semibold">{theme.name}</h3>
                  </div>
                  
                  <div className="flex gap-2">
                    {theme.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-serif mb-4">Build Your Group</h2>
              <p className="text-gray-600">Add your friends and get group discounts</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-purple-800">Group Discount Active!</h3>
                  <p className="text-purple-600">Save {getGroupDiscount()}% with {members.length} members</p>
                </div>
                <div className="text-3xl font-bold text-purple-700">{getGroupDiscount()}% OFF</div>
              </div>
            </div>
            
            <div className="space-y-4">
              {members.map((member, index) => (
                <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl">{index === 0 ? '👑' : '👤'}</span>
                  <input
                    type="text"
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={member.email}
                    onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                  />
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {member.role === 'organizer' ? 'Organizer' : 'Member'}
                  </span>
                </div>
              ))}
              
              <button
                onClick={addMember}
                className="w-full py-4 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:bg-purple-50 transition-colors"
              >
                + Add Friend
              </button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-serif mb-4">Select Packages</h2>
              <p className="text-gray-600">Choose the perfect package for your group</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    pkg.popular
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-4">
                    ${Math.round(pkg.price * (1 - getGroupDiscount() / 100))}
                    {getGroupDiscount() > 0 && (
                      <span className="text-lg text-gray-400 line-through ml-2">${pkg.price}</span>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {pkg.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Select Package
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-serif">Prom Group Builder</h1>
            <div className="text-right">
              <div className="text-sm text-purple-200">Step {currentStep} of 4</div>
              <div className="w-32 bg-purple-400 rounded-full h-2 mt-1">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {renderStep()}
          
          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {currentStep === 4 ? 'Complete Setup' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}