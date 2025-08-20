'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colorCoordinationMatrix } from '@/lib/data/knowledgeBank/wedding-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InteractiveCard, SatisfyingButton } from '@/components/ui/micro-interactions';
import { 
  Users, 
  Plus, 
  Trash2, 
  Palette, 
  Check, 
  AlertCircle,
  Download,
  Share2,
  ShoppingBag,
  Sparkles,
  UserPlus,
  Mail
} from 'lucide-react';

interface PartyMember {
  id: string;
  name: string;
  role: string;
  email: string;
  suitColor?: string;
  shirtColor?: string;
  tieColor?: string;
  size?: string;
  status: 'pending' | 'confirmed' | 'ordered';
}

interface WeddingPartyCoordinatorProps {
  weddingId?: string;
  groomName?: string;
  onSave?: (partyData: any) => void;
}

const roles = [
  'Groom',
  'Best Man',
  'Groomsman',
  'Father of the Groom',
  'Father of the Bride',
  'Ring Bearer',
  'Usher'
];

const suitSizes = ['36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R'];

export function WeddingPartyCoordinator({ weddingId, groomName = 'Groom', onSave }: WeddingPartyCoordinatorProps) {
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([
    {
      id: '1',
      name: groomName,
      role: 'Groom',
      email: '',
      status: 'confirmed'
    }
  ]);
  const [coordinationMode, setCoordinationMode] = useState<'identical' | 'coordinated' | 'custom'>('coordinated');
  const [primarySuitColor, setPrimarySuitColor] = useState('navy');
  const [showAddMember, setShowAddMember] = useState(false);

  const coordinationModes = [
    {
      id: 'identical',
      name: 'Identical Match',
      description: 'Everyone wears the same exact outfit',
      icon: '👔',
      coordination: 100
    },
    {
      id: 'coordinated',
      name: 'Coordinated Colors',
      description: 'Complementary colors that work together',
      icon: '🎨',
      coordination: 85
    },
    {
      id: 'custom',
      name: 'Custom per Person',
      description: 'Each person chooses their own style',
      icon: '✨',
      coordination: 60
    }
  ];

  const suitColors = Object.keys(colorCoordinationMatrix);

  const addPartyMember = () => {
    const newMember: PartyMember = {
      id: Date.now().toString(),
      name: '',
      role: 'Groomsman',
      email: '',
      status: 'pending'
    };
    setPartyMembers([...partyMembers, newMember]);
    setShowAddMember(false);
  };

  const updateMember = (id: string, updates: Partial<PartyMember>) => {
    setPartyMembers(members =>
      members.map(member =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const removeMember = (id: string) => {
    if (partyMembers.find(m => m.id === id)?.role === 'Groom') return;
    setPartyMembers(members => members.filter(m => m.id !== id));
  };

  const generateCoordinatedColors = () => {
    if (coordinationMode === 'identical') {
      // Everyone gets the same colors
      const colors = colorCoordinationMatrix[primarySuitColor as keyof typeof colorCoordinationMatrix];
      const outfit = {
        suitColor: primarySuitColor,
        shirtColor: colors.perfectMatches.shirts[0],
        tieColor: colors.perfectMatches.ties[0]
      };

      setPartyMembers(members =>
        members.map(member => ({ ...member, ...outfit }))
      );
    } else if (coordinationMode === 'coordinated') {
      // Groom gets primary, others get variations
      const primaryColors = colorCoordinationMatrix[primarySuitColor as keyof typeof colorCoordinationMatrix];

      setPartyMembers(members =>
        members.map((member, index) => {
          if (member.role === 'Groom') {
            return {
              ...member,
              suitColor: primarySuitColor,
              shirtColor: primaryColors.perfectMatches.shirts[0],
              tieColor: primaryColors.perfectMatches.ties[0]
            };
          } else {
            // Groomsmen get coordinated variations
            return {
              ...member,
              suitColor: primarySuitColor,
              shirtColor: primaryColors.perfectMatches.shirts[index % primaryColors.perfectMatches.shirts.length],
              tieColor: primaryColors.perfectMatches.ties[(index + 1) % primaryColors.perfectMatches.ties.length]
            };
          }
        })
      );
    }
  };

  const sendInvitations = () => {
    // In a real app, this would send emails
    const pendingMembers = partyMembers.filter(m => m.status === 'pending' && m.email);

    // Update status to show invitations sent
    setPartyMembers(members =>
      members.map(member =>
        member.status === 'pending' && member.email
          ? { ...member, status: 'confirmed' as const }
          : member
      )
    );
  };

  const exportCoordinationPlan = () => {
    const plan = {
      weddingId,
      coordinationMode,
      members: partyMembers,
      generatedDate: new Date().toISOString()
    };

    // Create downloadable file
    const dataStr = JSON.stringify(plan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `wedding-party-${weddingId || 'plan'}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getTotalPrice = () => {
    // Mock pricing calculation
    const basePrice = coordinationMode === 'identical' ? 299 : 349;
    return partyMembers.length * basePrice;
  };

  return (
    <div className="space-y-6">
      {/* Coordination Mode Selection */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-gold" />
          Coordination Style
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {coordinationModes.map((mode) => (
            <InteractiveCard
              key={mode.id}
              className={`p-4 cursor-pointer transition-all ${
                coordinationMode === mode.id ? 'ring-2 ring-gold shadow-lg' : ''
              }`}
              onClick={() => setCoordinationMode(mode.id as any)}
            >
              <div className="text-center space-y-2">
                <div className="text-3xl">{mode.icon}</div>
                <h4 className="font-semibold">{mode.name}</h4>
                <p className="text-xs text-gray-600">{mode.description}</p>
                <Badge variant="outline" className="text-xs">
                  {mode.coordination}% Coordination
                </Badge>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </Card>

      {/* Primary Color Selection */}
      {coordinationMode !== 'custom' && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Primary Suit Color</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {suitColors.map((color) => (
              <InteractiveCard
                key={color}
                className={`p-3 cursor-pointer transition-all ${
                  primarySuitColor === color ? 'ring-2 ring-gold shadow-lg' : ''
                }`}
                onClick={() => setPrimarySuitColor(color)}
              >
                <p className="text-sm font-medium text-center capitalize">{color}</p>
              </InteractiveCard>
            ))}
          </div>
          <div className="mt-4 text-center">
            <SatisfyingButton onClick={generateCoordinatedColors}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Coordinated Outfits
            </SatisfyingButton>
          </div>
        </Card>
      )}

      {/* Party Members List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-gold" />
            Wedding Party ({partyMembers.length} members)
          </h3>
          <Button
            onClick={() => setShowAddMember(true)}
            size="sm"
            className="bg-gold hover:bg-gold/90 text-black"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        <div className="space-y-4">
          {partyMembers.map((member) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg"
            >
              <div className="grid md:grid-cols-6 gap-4 items-center">
                {/* Basic Info */}
                <div className="md:col-span-2">
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, { name: e.target.value })}
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => updateMember(member.id, { role: e.target.value })}
                      className="flex-1 px-3 py-1 border rounded-md text-sm"
                      disabled={member.role === 'Groom'}
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <Badge
                      variant={member.status === 'ordered' ? 'default' : 'outline'}
                      className={
                        member.status === 'ordered' ? 'bg-green-600' :
                        member.status === 'confirmed' ? 'bg-blue-600' : ''
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="md:col-span-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">Suit</label>
                      <Badge variant="outline" className="w-full justify-center">
                        {member.suitColor || 'Not set'}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">Shirt</label>
                      <Badge variant="outline" className="w-full justify-center">
                        {member.shirtColor || 'Not set'}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">Tie</label>
                      <Badge variant="outline" className="w-full justify-center">
                        {member.tieColor || 'Not set'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  {member.role !== 'Groom' && (
                    <Button
                      onClick={() => removeMember(member.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Email and Size */}
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={member.email}
                  onChange={(e) => updateMember(member.id, { email: e.target.value })}
                />
                <select
                  value={member.size || ''}
                  onChange={(e) => updateMember(member.id, { size: e.target.value })}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Select size</option>
                  {suitSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Member Form */}
        <AnimatePresence>
          {showAddMember && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex gap-2">
                <Button onClick={addPartyMember} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <Button
                  onClick={() => setShowAddMember(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Actions */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div>
            <h4 className="font-semibold text-lg">Total Estimated Cost</h4>
            <p className="text-3xl font-bold text-gold">${getTotalPrice()}</p>
            <p className="text-sm text-gray-600">
              Group discount available for 5+ members
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={sendInvitations}
              variant="outline"
              disabled={!partyMembers.some(m => m.status === 'pending' && m.email)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Invitations
            </Button>

            <Button
              onClick={exportCoordinationPlan}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Plan
            </Button>

            <SatisfyingButton onClick={() => onSave?.(partyMembers)}>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Proceed to Order
            </SatisfyingButton>
          </div>
        </div>

        {/* Coordination Score */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Coordination Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                  style={{ width: `${coordinationMode === 'identical' ? 100 : coordinationMode === 'coordinated' ? 85 : 60}%` }}
                />
              </div>
              <span className="font-semibold">
                {coordinationMode === 'identical' ? 100 : coordinationMode === 'coordinated' ? 85 : 60}%
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {coordinationMode === 'identical' 
              ? 'Perfect match! Your wedding party will look unified and elegant.'
              : coordinationMode === 'coordinated'
              ? 'Great coordination! Complementary colors create visual harmony.'
              : 'Individual style! Each member can express their personality.'}
          </p>
        </div>
      </Card>
    </div>
  );
}