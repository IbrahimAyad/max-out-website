"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin,
  Home,
  Building,
  Plus,
  Edit3,
  Trash2,
  Star,
  Copy,
  Check,
  Clock,
  Truck,
  Shield,
  Navigation,
  Phone,
  User,
  X,
  Save,
  Map,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

import { enhancedUserProfileService, type SmartAddress } from '@/lib/services/enhancedUserProfileService';

interface SmartAddressesSectionProps {
  addresses?: SmartAddress[];
  onAddressesChange?: (addresses: SmartAddress[]) => void;
}

export default function SmartAddressesSection({ addresses: initialAddresses, onAddressesChange }: SmartAddressesSectionProps) {
  const [addresses, setAddresses] = useState<SmartAddress[]>(initialAddresses || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SmartAddress | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<SmartAddress | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialAddresses) {
      setAddresses(initialAddresses);
    }
  }, [initialAddresses]);

  const handleAddAddress = async (addressData: Omit<SmartAddress, 'id' | 'created_at' | 'updated_at' | 'usage_count' | 'delivery_success_rate'>) => {
    setLoading(true);
    try {
      const success = await enhancedUserProfileService.addAddress(addressData);
      if (success) {
        // Refresh addresses from service
        const profile = await enhancedUserProfileService.getProfile();
        if (profile?.address_book) {
          setAddresses(profile.address_book);
          onAddressesChange?.(profile.address_book);
        }
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to add address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (addressId: string, updates: Partial<SmartAddress>) => {
    setLoading(true);
    try {
      const success = await enhancedUserProfileService.updateAddress(addressId, updates);
      if (success) {
        const updatedAddresses = addresses.map(addr =>
          addr.id === addressId ? { ...addr, ...updates } : addr
        );
        setAddresses(updatedAddresses);
        onAddressesChange?.(updatedAddresses);
        setEditingAddress(null);
      }
    } catch (error) {
      console.error('Failed to update address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    setLoading(true);
    try {
      const success = await enhancedUserProfileService.deleteAddress(addressId);
      if (success) {
        const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
        setAddresses(updatedAddresses);
        onAddressesChange?.(updatedAddresses);
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (addressId: string, type: 'shipping' | 'billing') => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      [`is_default_${type}`]: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
    onAddressesChange?.(updatedAddresses);
    
    // Update in service
    await handleUpdateAddress(addressId, {
      [`is_default_${type}`]: true
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <AddressesHeader 
        totalAddresses={addresses.length}
        onAddNew={() => setShowAddForm(true)}
      />

      {/* Address Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => setEditingAddress(address)}
              onDelete={() => handleDeleteAddress(address.id)}
              onSetDefault={setDefaultAddress}
              onSelect={() => setSelectedAddress(address)}
              isSelected={selectedAddress?.id === address.id}
            />
          ))}
        </AnimatePresence>
        
        {/* Add New Address Card */}
        {addresses.length < 5 && (
          <AddNewAddressCard onClick={() => setShowAddForm(true)} />
        )}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <EmptyAddressState onAddNew={() => setShowAddForm(true)} />
      )}

      {/* Address Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <AddressFormModal
            onClose={() => setShowAddForm(false)}
            onSave={handleAddAddress}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Edit Address Modal */}
      <AnimatePresence>
        {editingAddress && (
          <AddressFormModal
            address={editingAddress}
            onClose={() => setEditingAddress(null)}
            onSave={(addressData) => handleUpdateAddress(editingAddress.id, addressData)}
            loading={loading}
            isEditing
          />
        )}
      </AnimatePresence>

      {/* Address Detail Modal */}
      <AnimatePresence>
        {selectedAddress && (
          <AddressDetailModal
            address={selectedAddress}
            onClose={() => setSelectedAddress(null)}
            onEdit={() => {
              setEditingAddress(selectedAddress);
              setSelectedAddress(null);
            }}
            onDelete={() => {
              handleDeleteAddress(selectedAddress.id);
              setSelectedAddress(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Addresses Header Component
function AddressesHeader({ totalAddresses, onAddNew }: {
  totalAddresses: number;
  onAddNew: () => void;
}) {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#8B2635] rounded-2xl">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Address Book</h1>
            <p className="text-gray-600">
              Manage your shipping and billing addresses ({totalAddresses}/5)
            </p>
          </div>
        </div>
        
        <motion.button
          onClick={onAddNew}
          className="flex items-center space-x-2 bg-[#8B2635] hover:bg-[#6B1C28] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={totalAddresses >= 5}
        >
          <Plus className="w-5 h-5" />
          <span>Add Address</span>
        </motion.button>
      </div>
      
      {totalAddresses >= 5 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-2 text-amber-800">
            <Info className="w-4 h-4" />
            <span className="text-sm">You've reached the maximum of 5 addresses. Delete one to add another.</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Address Card Component
function AddressCard({ address, onEdit, onDelete, onSetDefault, onSelect, isSelected }: {
  address: SmartAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: (addressId: string, type: 'shipping' | 'billing') => void;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const getAddressTypeIcon = () => {
    switch (address.address_type) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'office': return <Building className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const copyAddress = () => {
    const fullAddress = `${address.address_line_1}${address.address_line_2 ? ', ' + address.address_line_2 : ''}, ${address.city}, ${address.state} ${address.postal_code}`;
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = () => {
    return `${address.address_line_1}${address.address_line_2 ? ', ' + address.address_line_2 : ''}`;
  };

  const getDeliveryRating = () => {
    const rate = address.delivery_success_rate || 100;
    if (rate >= 95) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (rate >= 85) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  };

  const deliveryRating = getDeliveryRating();

  return (
    <motion.div
      className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all cursor-pointer group ${
        isSelected 
          ? 'border-[#8B2635] shadow-lg transform scale-105' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Default Badge */}
      {(address.is_default_shipping || address.is_default_billing) && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-[#8B2635] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Star className="w-3 h-3" />
            <span>Default</span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
              {getAddressTypeIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{address.label}</h3>
              <p className="text-sm text-gray-500 capitalize">{address.address_type}</p>
            </div>
          </div>
          
          {/* Verification Status */}
          <div className="flex items-center space-x-2">
            {address.is_verified ? (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs">Verified</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-yellow-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">Unverified</span>
              </div>
            )}
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-2 mb-4">
          <p className="font-medium text-gray-900">{address.name}</p>
          <p className="text-gray-600 text-sm">{formatAddress()}</p>
          <p className="text-gray-600 text-sm">
            {address.city}, {address.state} {address.postal_code}
          </p>
          {address.phone && (
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <Phone className="w-3 h-3" />
              <span>{address.phone}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Used</p>
            <p className="font-semibold text-gray-900">{address.usage_count || 0}x</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${deliveryRating.bg} ${deliveryRating.color}`}>
              {deliveryRating.label}
            </div>
          </div>
        </div>

        {/* Map Preview */}
        <div className="mb-4 aspect-video bg-gray-100 rounded-xl overflow-hidden relative group">
          {address.coordinates ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Map Preview</p>
                <p className="text-xs text-gray-500">
                  {address.coordinates.latitude.toFixed(3)}, {address.coordinates.longitude.toFixed(3)}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Navigation className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Location not mapped</p>
              </div>
            </div>
          )}
          
          {/* Map overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm">
              View on Map
            </button>
          </div>
        </div>

        {/* Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100 pt-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyAddress();
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                  
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="flex space-x-1">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetDefault(address.id, 'shipping');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      address.is_default_shipping
                        ? 'bg-[#8B2635] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Truck className="w-3 h-3 inline mr-1" />
                    Ship
                  </motion.button>
                  
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetDefault(address.id, 'billing');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      address.is_default_billing
                        ? 'bg-[#8B2635] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Shield className="w-3 h-3 inline mr-1" />
                    Bill
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Add New Address Card Component
function AddNewAddressCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-[#8B2635] hover:bg-[#8B2635]/5 transition-all group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="p-4 rounded-2xl bg-gray-200 group-hover:bg-[#8B2635] transition-colors">
          <Plus className="w-8 h-8 text-gray-400 group-hover:text-white" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-gray-700 group-hover:text-[#8B2635]">Add New Address</h3>
          <p className="text-sm text-gray-500 mt-1">Create a new shipping or billing address</p>
        </div>
      </div>
    </motion.div>
  );
}

// Empty State Component
function EmptyAddressState({ onAddNew }: { onAddNew: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
        <MapPin className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">No addresses yet</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Add your first address to enable faster checkout and accurate shipping estimates.
      </p>
      <motion.button
        onClick={onAddNew}
        className="inline-flex items-center space-x-2 bg-[#8B2635] hover:bg-[#6B1C28] text-white px-8 py-4 rounded-xl font-semibold text-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-6 h-6" />
        <span>Add Your First Address</span>
      </motion.button>
    </motion.div>
  );
}

// Address Form Modal Component
function AddressFormModal({ address, onClose, onSave, loading, isEditing = false }: {
  address?: SmartAddress;
  onClose: () => void;
  onSave: (address: any) => void;
  loading: boolean;
  isEditing?: boolean;
}) {
  const [formData, setFormData] = useState({
    label: address?.label || '',
    name: address?.name || '',
    company: address?.company || '',
    address_line_1: address?.address_line_1 || '',
    address_line_2: address?.address_line_2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postal_code: address?.postal_code || '',
    country: address?.country || 'US',
    phone: address?.phone || '',
    address_type: address?.address_type || 'home' as const,
    is_default_shipping: address?.is_default_shipping || false,
    is_default_billing: address?.is_default_billing || false,
    delivery_instructions: address?.delivery_instructions || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEditing ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Label & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Label *
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
                placeholder="Home, Office, etc."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Type
              </label>
              <select
                value={formData.address_type}
                onChange={(e) => setFormData({ ...formData, address_type: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Name & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company (Optional)
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
                placeholder="Company Name"
              />
            </div>
          </div>

          {/* Address Lines */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.address_line_1}
              onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635] mb-3"
              placeholder="123 Main Street"
              required
            />
            <input
              type="text"
              value={formData.address_line_2}
              onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
                placeholder="New York"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
                placeholder="NY"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
                placeholder="10001"
                required
              />
            </div>
          </div>

          {/* Phone & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Instructions
              </label>
              <input
                type="text"
                value={formData.delivery_instructions}
                onChange={(e) => setFormData({ ...formData, delivery_instructions: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
                placeholder="Leave at front door"
              />
            </div>
          </div>

          {/* Default Options */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_default_shipping}
                onChange={(e) => setFormData({ ...formData, is_default_shipping: e.target.checked })}
                className="w-4 h-4 text-[#8B2635] border-gray-300 rounded focus:ring-[#8B2635]"
              />
              <span className="text-sm text-gray-700">Set as default shipping address</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_default_billing}
                onChange={(e) => setFormData({ ...formData, is_default_billing: e.target.checked })}
                className="w-4 h-4 text-[#8B2635] border-gray-300 rounded focus:ring-[#8B2635]"
              />
              <span className="text-sm text-gray-700">Set as default billing address</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-[#8B2635] hover:bg-[#6B1C28] text-white px-8 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Update Address' : 'Save Address'}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Address Detail Modal Component (simplified for brevity)
function AddressDetailModal({ address, onClose, onEdit, onDelete }: {
  address: SmartAddress;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{address.label}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <p className="font-medium text-gray-900">{address.name}</p>
            <p className="text-gray-600">{address.address_line_1}</p>
            <p className="text-gray-600">{address.city}, {address.state} {address.postal_code}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onEdit}
            className="flex-1 bg-[#8B2635] text-white py-3 px-4 rounded-lg font-medium"
          >
            Edit Address
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}