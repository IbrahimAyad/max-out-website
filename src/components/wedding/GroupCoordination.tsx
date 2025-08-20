'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, Ruler, ShoppingCart, CreditCard, CheckCircle, X, Copy, Mail, MessageSquare } from 'lucide-react';
import { Wedding, WeddingMember, Measurements } from '@/lib/types';

interface GroupCoordinationProps {
  wedding: Wedding;
  onSendInvitations: (memberIds: string[]) => void;
  onUpdateMeasurements: (memberId: string, measurements: Measurements) => void;
  onCreateGroupOrder: (memberIds: string[], items: any[]) => void;
  onInitiatePaymentSplit: (amount: number, memberIds: string[]) => void;
}

interface InvitationTemplate {
  subject: string;
  message: string;
}

export function GroupCoordination({ 
  wedding, 
  onSendInvitations, 
  onUpdateMeasurements, 
  onCreateGroupOrder,
  onInitiatePaymentSplit 
}: GroupCoordinationProps) {
  const [activeTab, setActiveTab] = useState<'invitations' | 'measurements' | 'orders' | 'payments'>('invitations');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [invitationTemplate, setInvitationTemplate] = useState<InvitationTemplate>({
    subject: `You're Invited to Join ${wedding.partyMembers.find(m => m.role === 'groom')?.name}'s Wedding Party!`,
    message: `Dear {name},\n\nYou've been selected to be part of our wedding party! We're using KCT Menswear to coordinate our suits.\n\nPlease click the link below to:\n• Submit your measurements\n• View suit options\n• Coordinate with the group\n\nLooking forward to having you as part of our special day!\n\nBest regards,\n{groom_name}`
  });

  const toggleMemberSelection = (memberId: string) => {
    const newSelection = new Set(selectedMembers);
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId);
    } else {
      newSelection.add(memberId);
    }
    setSelectedMembers(newSelection);
  };

  const selectAllMembers = () => {
    if (selectedMembers.size === wedding.partyMembers.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(wedding.partyMembers.map(m => m.id)));
    }
  };

  const pendingMembers = wedding.partyMembers.filter(m => !m.measurements);
  const completedMembers = wedding.partyMembers.filter(m => m.measurements);

  const handleSendInvitations = () => {
    onSendInvitations(Array.from(selectedMembers));
    setSelectedMembers(new Set());
  };

  const [measurementForm, setMeasurementForm] = useState<Measurements>({
    chest: 0,
    waist: 0,
    hips: 0,
    neck: 0,
    inseam: 0,
    sleeve: 0,
  });

  const handleSubmitMeasurements = () => {
    if (selectedMemberId) {
      onUpdateMeasurements(selectedMemberId, measurementForm);
      setShowMeasurementForm(false);
      setSelectedMemberId(null);
    }
  };

  const calculateGroupDiscount = () => {
    const groupSize = selectedMembers.size;
    if (groupSize >= 8) return 20;
    if (groupSize >= 6) return 15;
    if (groupSize >= 4) return 10;
    if (groupSize >= 2) return 5;
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-gold to-gold/80 p-6">
          <h2 className="text-3xl font-serif text-black mb-2">Group Coordination Tools</h2>
          <p className="text-black/70">Manage your wedding party efficiently</p>
        </div>

        <div className="border-b">
          <div className="flex gap-2 p-4">
            {(['invitations', 'measurements', 'orders', 'payments'] as const).map((tab) => {
              const icons = {
                invitations: Send,
                measurements: Ruler,
                orders: ShoppingCart,
                payments: CreditCard,
              };
              const Icon = icons[tab];
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'invitations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Bulk Invitation System</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <label className="block text-sm font-medium mb-2">Invitation Template</label>
                  <input
                    type="text"
                    value={invitationTemplate.subject}
                    onChange={(e) => setInvitationTemplate({ ...invitationTemplate, subject: e.target.value })}
                    className="w-full px-4 py-2 border rounded-sm mb-3 focus:border-gold focus:outline-none"
                    placeholder="Subject"
                  />
                  <textarea
                    value={invitationTemplate.message}
                    onChange={(e) => setInvitationTemplate({ ...invitationTemplate, message: e.target.value })}
                    className="w-full px-4 py-2 border rounded-sm focus:border-gold focus:outline-none h-32"
                    placeholder="Message"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Variables: {'{name}'}, {'{groom_name}'}, {'{wedding_date}'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Select Party Members</h4>
                    <button
                      onClick={selectAllMembers}
                      className="text-sm text-gold hover:text-gold/80 transition-colors"
                    >
                      {selectedMembers.size === wedding.partyMembers.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  {wedding.partyMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedMembers.has(member.id)}
                          onChange={() => toggleMemberSelection(member.id)}
                          className="w-4 h-4 text-gold focus:ring-gold"
                        />
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 capitalize">
                        {member.role.replace('_', ' ')}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendInvitations}
                  disabled={selectedMembers.size === 0}
                  className={`w-full mt-6 px-6 py-3 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                    selectedMembers.size > 0
                      ? 'bg-gold hover:bg-gold/90 text-black'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Send {selectedMembers.size} Invitation{selectedMembers.size !== 1 ? 's' : ''}
                </motion.button>
              </div>
            </div>
          )}

          {activeTab === 'measurements' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Size Collection Interface</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 font-medium">Completed</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-700">{completedMembers.length}</p>
                  <p className="text-sm text-green-600">Members submitted</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-700 font-medium">Pending</span>
                    <Users className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-700">{pendingMembers.length}</p>
                  <p className="text-sm text-yellow-600">Awaiting measurements</p>
                </div>
              </div>

              <div className="space-y-2">
                {wedding.partyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        member.measurements ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {member.measurements ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Ruler className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">
                          {member.measurements ? 'Measurements complete' : 'Pending measurements'}
                        </p>
                      </div>
                    </div>
                    
                    {!member.measurements && (
                      <button
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setShowMeasurementForm(true);
                        }}
                        className="px-4 py-2 bg-gold hover:bg-gold/90 text-black rounded-sm font-medium transition-colors"
                      >
                        Add Measurements
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Measurement Guide</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Share our comprehensive measurement guide with your party members to ensure accurate sizing.
                    </p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Copy Guide Link →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Group Order Management</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Selected Members</p>
                    <p className="text-2xl font-bold">{selectedMembers.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Group Discount</p>
                    <p className="text-2xl font-bold text-green-600">{calculateGroupDiscount()}%</p>
                  </div>
                </div>
                
                <div className="bg-white rounded p-4">
                  <p className="text-sm text-gray-600 mb-2">Discount Tiers:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>2-3 members</span>
                      <span className="font-medium">5% off</span>
                    </div>
                    <div className="flex justify-between">
                      <span>4-5 members</span>
                      <span className="font-medium">10% off</span>
                    </div>
                    <div className="flex justify-between">
                      <span>6-7 members</span>
                      <span className="font-medium">15% off</span>
                    </div>
                    <div className="flex justify-between">
                      <span>8+ members</span>
                      <span className="font-medium text-green-600">20% off</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCreateGroupOrder(Array.from(selectedMembers), [])}
                disabled={selectedMembers.size === 0}
                className={`w-full px-6 py-3 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  selectedMembers.size > 0
                    ? 'bg-gold hover:bg-gold/90 text-black'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Create Group Order
              </motion.button>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Payment Splitting</h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Total Order Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border rounded-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded p-4">
                    <p className="text-sm text-gray-600">Per Person</p>
                    <p className="text-xl font-bold">
                      ${selectedMembers.size > 0 ? (2000 / selectedMembers.size).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="bg-white rounded p-4">
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-xl font-bold">{selectedMembers.size}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium mb-2">Split Options</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-3 border-2 border-gold bg-gold/10 rounded-sm text-sm font-medium">
                      Equal Split
                    </button>
                    <button className="p-3 border rounded-sm text-sm hover:bg-gray-50 transition-colors">
                      Custom Split
                    </button>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onInitiatePaymentSplit(200000, Array.from(selectedMembers))}
                disabled={selectedMembers.size === 0}
                className={`w-full px-6 py-3 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  selectedMembers.size > 0
                    ? 'bg-gold hover:bg-gold/90 text-black'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Send Payment Requests
              </motion.button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showMeasurementForm && selectedMemberId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMeasurementForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Add Measurements</h3>
                <button
                  onClick={() => setShowMeasurementForm(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(measurementForm).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {key} (inches)
                    </label>
                    <input
                      type="number"
                      value={value || ''}
                      onChange={(e) => setMeasurementForm({
                        ...measurementForm,
                        [key]: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border rounded-sm focus:border-gold focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitMeasurements}
                className="w-full mt-6 bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-sm font-semibold transition-colors"
              >
                Save Measurements
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}