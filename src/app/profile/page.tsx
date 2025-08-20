'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Settings, Heart, CreditCard, Calendar, Star, Edit, Phone, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  memberSince: Date;
  orders: number;
  favoriteItems: number;
  addressBook: {
    shipping: string;
    billing: string;
  };
  preferences: {
    size: string;
    style: string;
    notifications: boolean;
  };
}

export default function ProfilePage() {
  const [user] = useState<UserProfile>({
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    memberSince: new Date('2023-01-15'),
    orders: 12,
    favoriteItems: 8,
    addressBook: {
      shipping: '123 Main Street, Detroit, MI 48201',
      billing: '123 Main Street, Detroit, MI 48201'
    },
    preferences: {
      size: '40R',
      style: 'Modern Classic',
      notifications: true
    }
  });

  const [activeTab, setActiveTab] = useState('overview');

  const membershipTier = user.orders >= 10 ? 'Gold' : user.orders >= 5 ? 'Silver' : 'Bronze';
  const tierColor = membershipTier === 'Gold' ? 'text-yellow-600' : membershipTier === 'Silver' ? 'text-gray-500' : 'text-orange-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-charcoal/5">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gold/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-charcoal to-charcoal/80 rounded-full flex items-center justify-center text-white text-2xl font-light">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-light text-charcoal mb-1">
                  Welcome back, <span className="italic font-serif">{user.name.split(' ')[0]}</span>
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className={`w-4 h-4 ${tierColor}`} />
                    <span className={`font-medium ${tierColor}`}>{membershipTier} Member</span>
                  </div>
                  <span>•</span>
                  <span>Member since {user.memberSince.getFullYear()}</span>
                </div>
              </div>
            </div>
            
            <Button className="bg-charcoal hover:bg-charcoal/90 text-white px-6 py-3 rounded-sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-lg rounded-sm bg-white sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'orders', label: 'Order History', icon: Package },
                  { id: 'addresses', label: 'Addresses', icon: MapPin },
                  { id: 'favorites', label: 'Favorites', icon: Heart },
                  { id: 'payment', label: 'Payment Methods', icon: CreditCard },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-charcoal text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 border-0 shadow-lg rounded-sm bg-white text-center">
                    <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-3xl font-light text-charcoal mb-1">{user.orders}</div>
                    <div className="text-gray-600">Total Orders</div>
                  </Card>
                  
                  <Card className="p-6 border-0 shadow-lg rounded-sm bg-white text-center">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <div className="text-3xl font-light text-charcoal mb-1">{user.favoriteItems}</div>
                    <div className="text-gray-600">Saved Items</div>
                  </Card>
                  
                  <Card className="p-6 border-0 shadow-lg rounded-sm bg-white text-center">
                    <Star className={`w-8 h-8 ${tierColor} mx-auto mb-3`} />
                    <div className={`text-3xl font-light ${tierColor} mb-1`}>{membershipTier}</div>
                    <div className="text-gray-600">Membership</div>
                  </Card>
                </div>

                {/* Profile Information */}
                <Card className="p-8 border-0 shadow-lg rounded-sm bg-white">
                  <h2 className="text-2xl font-light text-charcoal mb-6">Profile Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Full Name</div>
                          <div className="font-medium text-charcoal">{user.name}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="font-medium text-charcoal">{user.email}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Phone</div>
                          <div className="font-medium text-charcoal">{user.phone}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Member Since</div>
                          <div className="font-medium text-charcoal">
                            {user.memberSince.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Preferred Size</div>
                          <div className="font-medium text-charcoal">{user.preferences.size}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Style Preference</div>
                          <div className="font-medium text-charcoal">{user.preferences.style}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-8 border-0 shadow-lg rounded-sm bg-gradient-to-br from-charcoal to-charcoal/90 text-white">
                  <h2 className="text-2xl font-light mb-6">Quick Actions</h2>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/account/orders">
                      <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-charcoal transition-all duration-300">
                        <Package className="w-4 h-4 mr-2" />
                        View Orders
                      </Button>
                    </Link>
                    
                    <Link href="/favorites">
                      <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-charcoal transition-all duration-300">
                        <Heart className="w-4 h-4 mr-2" />
                        Favorites
                      </Button>
                    </Link>
                    
                    <Link href="/">
                      <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-charcoal transition-all duration-300">
                        <Star className="w-4 h-4 mr-2" />
                        Shop Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Other tabs would be implemented similarly */}
            {activeTab !== 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-4">🚧</div>
                <h3 className="text-2xl font-light text-charcoal mb-2">Coming Soon</h3>
                <p className="text-gray-600">This section is under development.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}