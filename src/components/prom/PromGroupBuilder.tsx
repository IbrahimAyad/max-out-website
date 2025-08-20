'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { promColorCoordination, groupCoordinationOptions, promBundles } from '@/lib/data/knowledgeBank/prom-data';
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
  Camera,
  Share2,
  ShoppingBag,
  Sparkles,
  UserPlus,
  TrendingUp,
  DollarSign,
  Calendar,
  Heart
} from 'lucide-react';

interface GroupMember {
  id: string;
  name: string;
  role: 'leader' | 'member';
  colorPreference?: string;
  size?: string;
  bundle?: string;
  phoneNumber?: string;
  parentContact?: string;
}

interface PromGroupBuilderProps {
  onSave?: (groupData: any) => void;
  schoolName?: string;
  promDate?: Date;
}

const colorOptions = Object.keys(promColorCoordination);
const suitSizes = ['34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R'];

export function PromGroupBuilder({ onSave, schoolName, promDate }: PromGroupBuilderProps) {
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    {
      id: '1',
      name: '',
      role: 'leader',
      colorPreference: 'navy'
    }
  ]);
  const [groupTheme, setGroupTheme] = useState('modern');
  const [coordinationStrategy, setCoordinationStrategy] = useState('matchingAccessories');
  const [budgetRange, setBudgetRange] = useState('moderate');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const themes = Object.entries(groupCoordinationOptions.popularThemes);
  const strategies = groupCoordinationOptions.matchingStrategies;

  const addGroupMember = () => {
    const newMember: GroupMember = {
      id: Date.now().toString(),
      name: '',
      role: 'member'
    };
    setGroupMembers([...groupMembers, newMember]);
  };

  const updateMember = (id: string, updates: Partial<GroupMember>) => {
    setGroupMembers(members =>
      members.map(member =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const removeMember = (id: string) => {
    if (groupMembers.length === 1) return;
    setGroupMembers(members => members.filter(m => m.id !== id));
  };

  const getColorCompatibility = (color1: string, color2: string) => {
    const colorData = promColorCoordination[color1];
    if (!colorData) return 50;
    
    if (colorData.complementaryColors.includes(color2)) return 95;
    if (colorData.avoidWith.includes(color2)) return 20;
    return 70;
  };

  const calculateGroupHarmony = () => {
    if (groupMembers.length < 2) return 100;
    
    const colors = groupMembers
      .map(m => m.colorPreference)
      .filter(Boolean) as string[];
    
    if (colors.length < 2) return 100;
    
    let totalScore = 0;
    let comparisons = 0;
    
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        totalScore += getColorCompatibility(colors[i], colors[j]);
        comparisons++;
      }
    }
    
    return Math.round(totalScore / comparisons);
  };

  const getTotalPrice = () => {
    let total = 0;
    groupMembers.forEach(member => {
      const bundle = promBundles.find(b => b.name === member.bundle);
      total += bundle?.price || 249;
    });
    
    // Group discount
    if (groupMembers.length >= 5) {
      total = Math.round(total * 0.9); // 10% off for 5+
    }
    
    return total;
  };

  const shareGroup = () => {
    const groupData = {
      theme: groupTheme,
      members: groupMembers.length,
      harmony: calculateGroupHarmony(),
      url: `${window.location.origin}/prom/group/${Date.now()}`
    };
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Our Prom Group!',
        text: `We're coordinating our prom outfits! Group harmony: ${groupData.harmony}%`,
        url: groupData.url
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Group Theme Selection */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-gold" />
          Choose Your Group Theme
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {themes.map(([key, theme]) => (
            <InteractiveCard
              key={key}
              className={`p-4 cursor-pointer transition-all ${
                groupTheme === key ? 'ring-2 ring-gold shadow-lg' : ''
              }`}
              onClick={() => setGroupTheme(key)}
            >
              <h4 className="font-semibold mb-2">{theme.name}</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {theme.colors.map((color: string) => (
                  <Badge key={color} variant="outline" className="text-xs">
                    {color}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Formality: {theme.formality}</span>
                <span>{theme.budget}</span>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </Card>

      {/* Coordination Strategy */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold" />
          Coordination Strategy
        </h3>
        <div className="space-y-3">
          {strategies.map((strategy) => (
            <div
              key={strategy.strategy}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                coordinationStrategy === strategy.strategy 
                  ? 'border-gold bg-gold/5' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => setCoordinationStrategy(strategy.strategy)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{strategy.strategy}</h4>
                  <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{strategy.coordination}% Match</Badge>
                  <p className="text-xs text-gray-500 mt-1">Cost: {strategy.cost}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Group Members */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-gold" />
            Your Squad ({groupMembers.length} members)
          </h3>
          <Button
            onClick={addGroupMember}
            size="sm"
            className="bg-gold hover:bg-gold/90 text-black"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friend
          </Button>
        </div>

        <div className="space-y-4">
          {groupMembers.map((member, index) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 border rounded-lg"
            >
              <div className="grid md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2">
                  <Input
                    placeholder={member.role === 'leader' ? "Your name" : "Friend's name"}
                    value={member.name}
                    onChange={(e) => updateMember(member.id, { name: e.target.value })}
                    className="mb-2"
                  />
                  {member.role === 'leader' && (
                    <Badge className="bg-purple-600 text-white">
                      <Heart className="w-3 h-3 mr-1" />
                      Group Leader
                    </Badge>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-600">Color Choice</label>
                  <select
                    value={member.colorPreference || ''}
                    onChange={(e) => updateMember(member.id, { colorPreference: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select color</option>
                    {colorOptions.map(color => (
                      <option key={color} value={color}>
                        {promColorCoordination[color].primaryColor}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-600">Size</label>
                  <select
                    value={member.size || ''}
                    onChange={(e) => updateMember(member.id, { size: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select size</option>
                    {suitSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 justify-end">
                  {member.role !== 'leader' && (
                    <Button
                      onClick={() => removeMember(member.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Bundle Selection */}
              <div className="mt-3">
                <label className="text-xs text-gray-600">Package</label>
                <select
                  value={member.bundle || ''}
                  onChange={(e) => updateMember(member.id, { bundle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select package</option>
                  {promBundles.map(bundle => (
                    <option key={bundle.name} value={bundle.name}>
                      {bundle.name} - ${bundle.price} (Save ${bundle.savings})
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Group Harmony Score */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Group Color Harmony
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                How well your colors work together
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {calculateGroupHarmony()}%
              </div>
              <Badge variant="outline" className="mt-1">
                {calculateGroupHarmony() >= 80 ? 'Excellent' : 
                 calculateGroupHarmony() >= 60 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Budget Summary */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Budget Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal ({groupMembers.length} outfits)</span>
            <span className="font-semibold">${getTotalPrice() / 0.9}</span>
          </div>
          
          {groupMembers.length >= 5 && (
            <div className="flex justify-between text-green-600">
              <span>Group Discount (10% off)</span>
              <span>-${Math.round(getTotalPrice() / 0.9 * 0.1)}</span>
            </div>
          )}
          
          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold text-gold">${getTotalPrice()}</span>
          </div>
          
          <p className="text-sm text-gray-600">
            💡 Add {Math.max(0, 5 - groupMembers.length)} more friends to unlock group discount!
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => setShowPhotoUpload(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Upload Inspiration Photos
        </Button>
        
        <Button
          onClick={shareGroup}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share with Squad
        </Button>
        
        <SatisfyingButton
          onClick={() => onSave?.(groupMembers)}
          size="lg"
          className="flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Reserve Outfits
        </SatisfyingButton>
      </div>

      {/* Prom Date Reminder */}
      {promDate && (
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Prom Date</span>
            </div>
            <div>
              <span className="font-semibold">
                {new Date(promDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <Badge variant="outline" className="ml-2">
                {Math.ceil((new Date(promDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days away
              </Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}