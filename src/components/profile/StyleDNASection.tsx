"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Star, 
  TrendingUp,
  Heart,
  DollarSign,
  Target,
  Zap,
  Eye,
  Coffee,
  Briefcase,
  Calendar,
  Music,
  Crown,
  Sparkles,
  Award,
  Settings,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  Minus,
  RotateCcw,
  Save,
  Shuffle
} from 'lucide-react';

import { enhancedUserProfileService, type StyleDNA, type ColorPreference } from '@/lib/services/enhancedUserProfileService';

interface StyleDNASectionProps {
  onSave?: (styleDNA: Partial<StyleDNA>) => void;
  initialData?: StyleDNA;
}

export default function StyleDNASection({ onSave, initialData }: StyleDNASectionProps) {
  const [styleDNA, setStyleDNA] = useState<Partial<StyleDNA>>(initialData || {});
  const [activeSection, setActiveSection] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [quizMode, setQuizMode] = useState(false);

  const sections = [
    { id: 'colors', name: 'Color Palette', icon: Palette, color: 'from-pink-500 to-rose-500' },
    { id: 'archetype', name: 'Style Archetype', icon: Crown, color: 'from-purple-500 to-indigo-500' },
    { id: 'occasions', name: 'Lifestyle', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
    { id: 'preferences', name: 'Preferences', icon: Heart, color: 'from-green-500 to-emerald-500' },
    { id: 'budget', name: 'Investment', icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
    { id: 'review', name: 'Your Style DNA', icon: Sparkles, color: 'from-[#8B2635] to-[#D4AF37]' }
  ];

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(styleDNA);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateStyleScore = () => {
    let score = 0;
    if (styleDNA.signature_colors?.length) score += 20;
    if (styleDNA.style_archetypes?.length) score += 25;
    if (styleDNA.occasion_priorities?.length) score += 20;
    if (styleDNA.budget_ranges?.length) score += 15;
    if (styleDNA.pattern_preferences?.length) score += 10;
    if (styleDNA.preferred_brands?.length) score += 10;
    return Math.min(score, 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <StyleDNAHeader 
        styleScore={calculateStyleScore()}
        confidenceLevel={styleDNA.style_confidence_level || 0}
        quizMode={quizMode}
        onToggleQuiz={() => setQuizMode(!quizMode)}
      />

      {/* Section Navigation */}
      <SectionNavigation 
        sections={sections}
        activeSection={activeSection}
        onSectionClick={setActiveSection}
        completionStatus={getCompletionStatus(styleDNA)}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Form Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeSection === 0 && (
              <ColorPaletteStep 
                styleDNA={styleDNA}
                setStyleDNA={setStyleDNA}
              />
            )}
            
            {activeSection === 1 && (
              <StyleArchetypeStep
                styleDNA={styleDNA}
                setStyleDNA={setStyleDNA}
                quizMode={quizMode}
              />
            )}
            
            {activeSection === 2 && (
              <LifestyleStep
                styleDNA={styleDNA}
                setStyleDNA={setStyleDNA}
              />
            )}
            
            {activeSection === 3 && (
              <PreferencesStep
                styleDNA={styleDNA}
                setStyleDNA={setStyleDNA}
              />
            )}
            
            {activeSection === 4 && (
              <BudgetStep
                styleDNA={styleDNA}
                setStyleDNA={setStyleDNA}
              />
            )}
            
            {activeSection === 5 && (
              <StyleDNAReview
                styleDNA={styleDNA}
                onSave={handleSave}
                isSaving={isSaving}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Style Personality Radar */}
          <StylePersonalityRadar styleDNA={styleDNA} />
          
          {/* Color Harmony Preview */}
          <ColorHarmonyPreview colors={styleDNA.signature_colors || []} />
          
          {/* Style Tips */}
          <StyleTips styleDNA={styleDNA} />
          
          {/* AI Recommendations */}
          <AIStyleRecommendations styleDNA={styleDNA} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
          disabled={activeSection === 0}
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Previous</span>
        </motion.button>
        
        <div className="text-sm text-gray-500">
          Section {activeSection + 1} of {sections.length}
        </div>
        
        <motion.button
          onClick={() => {
            if (activeSection === sections.length - 1) {
              handleSave();
            } else {
              setActiveSection(Math.min(sections.length - 1, activeSection + 1));
            }
          }}
          className="flex items-center space-x-2 bg-[#8B2635] hover:bg-[#6B1C28] text-white px-6 py-3 rounded-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{activeSection === sections.length - 1 ? 'Save Style DNA' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}

// Style DNA Header Component
function StyleDNAHeader({ styleScore, confidenceLevel, quizMode, onToggleQuiz }: {
  styleScore: number;
  confidenceLevel: number;
  quizMode: boolean;
  onToggleQuiz: () => void;
}) {
  return (
    <motion.div 
      className="bg-gradient-to-br from-[#8B2635] via-[#6B1C28] to-black rounded-2xl p-8 text-white relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-[#D4AF37]/10 to-transparent" />
      
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Sparkles className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Style DNA</h1>
            <p className="text-white/90">Discover and define your unique fashion identity</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Style Score */}
          <div className="text-center">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="white"
                  strokeWidth="6"
                  opacity="0.2"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - styleScore / 100)}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 35 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 35 * (1 - styleScore / 100) }}
                  transition={{ duration: 1.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{styleScore}</span>
                <span className="text-xs opacity-80">DNA</span>
              </div>
            </div>
          </div>
          
          {/* Quiz Mode Toggle */}
          <motion.button
            onClick={onToggleQuiz}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              quizMode 
                ? 'bg-[#D4AF37] text-black' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <Target className="w-4 h-4" />
            <span>Quiz Mode</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Section Navigation Component
function SectionNavigation({ sections, activeSection, onSectionClick, completionStatus }: {
  sections: any[];
  activeSection: number;
  onSectionClick: (index: number) => void;
  completionStatus: boolean[];
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
      <div className="flex items-center space-x-4 min-w-max">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center">
            <motion.button
              onClick={() => onSectionClick(index)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                index === activeSection
                  ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                  : completionStatus[index]
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              disabled={index > activeSection + 1}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.name}</span>
              {completionStatus[index] && <Check className="w-4 h-4" />}
            </motion.button>
            
            {index < sections.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Color Palette Step Component
function ColorPaletteStep({ styleDNA, setStyleDNA }: {
  styleDNA: Partial<StyleDNA>;
  setStyleDNA: (dna: Partial<StyleDNA>) => void;
}) {
  const colorCategories = {
    signature: {
      title: 'Signature Colors',
      description: 'Your go-to colors that make you feel confident',
      colors: [
        { name: 'Midnight Black', hex: '#000000', category: 'primary' as const },
        { name: 'Charcoal Gray', hex: '#36454F', category: 'neutral' as const },
        { name: 'Deep Navy', hex: '#1e3a8a', category: 'primary' as const },
        { name: 'Rich Brown', hex: '#8B4513', category: 'primary' as const },
        { name: 'Burgundy Wine', hex: '#8B2635', category: 'primary' as const },
        { name: 'Forest Green', hex: '#228B22', category: 'secondary' as const },
        { name: 'Royal Blue', hex: '#4169E1', category: 'secondary' as const },
        { name: 'Deep Purple', hex: '#6A0DAD', category: 'secondary' as const }
      ]
    },
    accent: {
      title: 'Accent Colors',
      description: 'Colors for ties, pocket squares, and statement pieces',
      colors: [
        { name: 'Crimson Red', hex: '#DC143C', category: 'accent' as const },
        { name: 'Emerald Green', hex: '#50C878', category: 'accent' as const },
        { name: 'Sapphire Blue', hex: '#0F52BA', category: 'accent' as const },
        { name: 'Golden Yellow', hex: '#D4AF37', category: 'accent' as const },
        { name: 'Coral Pink', hex: '#FF7F7F', category: 'accent' as const },
        { name: 'Turquoise', hex: '#40E0D0', category: 'accent' as const },
        { name: 'Lavender', hex: '#E6E6FA', category: 'accent' as const },
        { name: 'Burnt Orange', hex: '#FF8C69', category: 'accent' as const }
      ]
    },
    neutral: {
      title: 'Neutral Foundation',
      description: 'Your wardrobe staples and versatile basics',
      colors: [
        { name: 'Pure White', hex: '#FFFFFF', category: 'neutral' as const },
        { name: 'Ivory Cream', hex: '#FFFFF0', category: 'neutral' as const },
        { name: 'Light Gray', hex: '#D3D3D3', category: 'neutral' as const },
        { name: 'Medium Gray', hex: '#808080', category: 'neutral' as const },
        { name: 'Beige', hex: '#F5F5DC', category: 'neutral' as const },
        { name: 'Taupe', hex: '#483C32', category: 'neutral' as const },
        { name: 'Sand', hex: '#C2B280', category: 'neutral' as const },
        { name: 'Stone', hex: '#A8A8A8', category: 'neutral' as const }
      ]
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<'signature' | 'accent' | 'neutral'>('signature');

  const toggleColor = (color: any, categoryKey: string) => {
    const currentColors = styleDNA[`${categoryKey}_colors` as keyof StyleDNA] as ColorPreference[] || [];
    const exists = currentColors.some(c => c.hex === color.hex);
    
    const newColors = exists
      ? currentColors.filter(c => c.hex !== color.hex)
      : [...currentColors, {
          name: color.name,
          hex: color.hex,
          category: color.category,
          confidence: 80,
          occasions: [],
          season_suitability: ['spring', 'summer', 'fall', 'winter'] as const
        }];
    
    setStyleDNA({
      ...styleDNA,
      [`${categoryKey}_colors`]: newColors
    });
  };

  const isColorSelected = (color: any, categoryKey: string) => {
    const currentColors = styleDNA[`${categoryKey}_colors` as keyof StyleDNA] as ColorPreference[] || [];
    return currentColors.some(c => c.hex === color.hex);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Category Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Color Palette Discovery</h2>
        
        <div className="flex space-x-4 mb-8">
          {Object.entries(colorCategories).map(([key, category]) => (
            <motion.button
              key={key}
              onClick={() => setSelectedCategory(key as any)}
              className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
                selectedCategory === key
                  ? 'border-[#8B2635] bg-[#8B2635]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-semibold text-gray-900">{category.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Color Swatches */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {colorCategories[selectedCategory].colors.map((color) => (
            <motion.button
              key={color.hex}
              onClick={() => toggleColor(color, selectedCategory)}
              className={`relative group aspect-square rounded-2xl shadow-md transition-all ${
                isColorSelected(color, selectedCategory)
                  ? 'ring-4 ring-[#8B2635] ring-offset-2 scale-110'
                  : 'hover:scale-105 hover:shadow-lg'
              }`}
              style={{ backgroundColor: color.hex }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Color overlay for light colors */}
              {color.hex === '#FFFFFF' || color.hex === '#FFFFF0' || color.hex === '#F5F5DC' ? (
                <div className="absolute inset-0 border border-gray-300 rounded-2xl" />
              ) : null}
              
              {/* Selection indicator */}
              {isColorSelected(color, selectedCategory) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-[#8B2635]" />
                  </div>
                </motion.div>
              )}
              
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {color.name}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected Colors Preview */}
        <SelectedColorsPreview 
          signatureColors={styleDNA.signature_colors || []}
          accentColors={styleDNA.accent_colors || []}
          neutralColors={styleDNA.neutral_colors || []}
        />
      </div>
    </motion.div>
  );
}

// Selected Colors Preview Component
function SelectedColorsPreview({ signatureColors, accentColors, neutralColors }: {
  signatureColors: ColorPreference[];
  accentColors: ColorPreference[];
  neutralColors: ColorPreference[];
}) {
  const totalColors = signatureColors.length + accentColors.length + neutralColors.length;
  
  if (totalColors === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 bg-gray-50 rounded-2xl"
    >
      <h3 className="font-semibold text-gray-900 mb-4">Your Color Palette ({totalColors} colors)</h3>
      
      <div className="space-y-4">
        {signatureColors.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Signature Colors</p>
            <div className="flex space-x-2">
              {signatureColors.map((color) => (
                <div
                  key={color.hex}
                  className="w-8 h-8 rounded-lg shadow-sm border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
        
        {accentColors.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Accent Colors</p>
            <div className="flex space-x-2">
              {accentColors.map((color) => (
                <div
                  key={color.hex}
                  className="w-8 h-8 rounded-lg shadow-sm border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
        
        {neutralColors.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Neutral Colors</p>
            <div className="flex space-x-2">
              {neutralColors.map((color) => (
                <div
                  key={color.hex}
                  className="w-8 h-8 rounded-lg shadow-sm border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Style Archetype Step Component
function StyleArchetypeStep({ styleDNA, setStyleDNA, quizMode }: {
  styleDNA: Partial<StyleDNA>;
  setStyleDNA: (dna: Partial<StyleDNA>) => void;
  quizMode: boolean;
}) {
  const archetypes = [
    {
      name: 'Classic Gentleman',
      description: 'Timeless elegance meets traditional sophistication',
      traits: ['Traditional', 'Refined', 'Quality-focused', 'Conservative'],
      examples: ['Navy suits', 'White dress shirts', 'Silk ties', 'Leather dress shoes'],
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Modern Professional',
      description: 'Contemporary business attire with a fresh perspective',
      traits: ['Innovative', 'Confident', 'Versatile', 'Progressive'],
      examples: ['Slim-fit suits', 'Patterned shirts', 'Statement accessories', 'Modern cuts'],
      color: 'from-gray-500 to-gray-700'
    },
    {
      name: 'Fashion Forward',
      description: 'Bold choices and trend-setting style statements',
      traits: ['Creative', 'Bold', 'Trendy', 'Experimental'],
      examples: ['Designer pieces', 'Unique patterns', 'Statement colors', 'Avant-garde cuts'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Minimalist',
      description: 'Clean lines and understated luxury',
      traits: ['Simple', 'Clean', 'Quality-driven', 'Purposeful'],
      examples: ['Monochrome palette', 'Clean cuts', 'Quality basics', 'Subtle details'],
      color: 'from-gray-400 to-gray-600'
    },
    {
      name: 'Creative Professional',
      description: 'Artistic flair meets business appropriateness',
      traits: ['Artistic', 'Expressive', 'Unique', 'Thoughtful'],
      examples: ['Textured fabrics', 'Interesting details', 'Creative accessories', 'Mix & match'],
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Luxury Connoisseur',
      description: 'Premium quality and exclusive craftsmanship',
      traits: ['Luxurious', 'Exclusive', 'Status-conscious', 'Detail-oriented'],
      examples: ['Designer labels', 'Premium fabrics', 'Bespoke tailoring', 'Rare pieces'],
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const toggleArchetype = (archetype: any) => {
    const currentArchetypes = styleDNA.style_archetypes || [];
    const exists = currentArchetypes.some(a => a.name === archetype.name);
    
    const newArchetypes = exists
      ? currentArchetypes.filter(a => a.name !== archetype.name)
      : [...currentArchetypes, {
          name: archetype.name,
          description: archetype.description,
          weight: 80,
          key_pieces: archetype.examples,
          inspiration_icons: []
        }];
    
    setStyleDNA({
      ...styleDNA,
      style_archetypes: newArchetypes
    });
  };

  const isArchetypeSelected = (archetype: any) => {
    return styleDNA.style_archetypes?.some(a => a.name === archetype.name) || false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Style Archetype</h2>
          <p className="text-gray-600 mt-1">Choose the style personalities that resonate with you</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Shuffle className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Select multiple</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {archetypes.map((archetype, index) => (
          <motion.div
            key={archetype.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <motion.button
              onClick={() => toggleArchetype(archetype)}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left group ${
                isArchetypeSelected(archetype)
                  ? 'border-[#8B2635] bg-[#8B2635]/5 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${archetype.color}`}>
                  <Crown className="w-6 h-6 text-white" />
                </div>
                
                {isArchetypeSelected(archetype) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-[#8B2635] rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{archetype.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{archetype.description}</p>
              
              {/* Traits */}
              <div className="flex flex-wrap gap-2 mb-4">
                {archetype.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {trait}
                  </span>
                ))}
              </div>
              
              {/* Examples */}
              <div className="text-xs text-gray-500">
                <p className="font-medium mb-1">Key pieces:</p>
                <p>{archetype.examples.join(' • ')}</p>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Style Confidence Level */}
      <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Style Confidence Level</h3>
          <span className="text-2xl font-bold text-[#8B2635]">{styleDNA.style_confidence_level || 50}%</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={styleDNA.style_confidence_level || 50}
          onChange={(e) => setStyleDNA({
            ...styleDNA,
            style_confidence_level: parseInt(e.target.value)
          })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Conservative</span>
          <span>Confident</span>
        </div>
      </div>
    </motion.div>
  );
}

// Placeholder for other step components - keeping response concise
function LifestyleStep({ styleDNA, setStyleDNA }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Lifestyle & Occasions</h2>
      <p className="text-gray-600">Occasion preferences and lifestyle requirements section...</p>
    </motion.div>
  );
}

function PreferencesStep({ styleDNA, setStyleDNA }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Style Preferences</h2>
      <p className="text-gray-600">Pattern, texture, and fabric preferences section...</p>
    </motion.div>
  );
}

function BudgetStep({ styleDNA, setStyleDNA }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Investment & Budget</h2>
      <p className="text-gray-600">Budget ranges and value priorities section...</p>
    </motion.div>
  );
}

function StyleDNAReview({ styleDNA, onSave, isSaving }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Style DNA</h2>
      <p className="text-gray-600">Complete style profile review and save section...</p>
    </motion.div>
  );
}

// Sidebar Components (simplified for brevity)
function StylePersonalityRadar({ styleDNA }: { styleDNA: Partial<StyleDNA> }) {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="font-semibold text-gray-900 mb-4">Style Personality</h3>
      <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center">
        <TrendingUp className="w-12 h-12 text-gray-400" />
      </div>
    </motion.div>
  );
}

function ColorHarmonyPreview({ colors }: { colors: ColorPreference[] }) {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="font-semibold text-gray-900 mb-4">Color Harmony</h3>
      <div className="flex space-x-1 h-8 rounded-lg overflow-hidden">
        {colors.slice(0, 5).map((color, index) => (
          <div
            key={index}
            className="flex-1"
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function StyleTips({ styleDNA }: { styleDNA: Partial<StyleDNA> }) {
  return (
    <motion.div 
      className="bg-gradient-to-br from-[#8B2635]/10 to-[#D4AF37]/10 rounded-2xl p-6"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-[#8B2635]" />
        <h3 className="font-semibold text-gray-900">Style Tip</h3>
      </div>
      <p className="text-sm text-gray-700">
        Based on your selections, consider adding more texture variety to create visual interest in your outfits.
      </p>
    </motion.div>
  );
}

function AIStyleRecommendations({ styleDNA }: { styleDNA: Partial<StyleDNA> }) {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
        <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">Perfect suit match found</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">5 new arrivals match your style</p>
        </div>
      </div>
    </motion.div>
  );
}

// Helper Functions
function getCompletionStatus(styleDNA: Partial<StyleDNA>): boolean[] {
  return [
    !!(styleDNA.signature_colors?.length || styleDNA.accent_colors?.length),
    !!(styleDNA.style_archetypes?.length),
    !!(styleDNA.occasion_priorities?.length),
    !!(styleDNA.pattern_preferences?.length),
    !!(styleDNA.budget_ranges?.length),
    true // Review is always accessible
  ];
}