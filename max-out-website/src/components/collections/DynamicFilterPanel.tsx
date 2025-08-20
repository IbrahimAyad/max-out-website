'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedProductFilters, UnifiedSearchResult } from '@/types/unified-shop';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Palette,
  Tag,
  DollarSign,
  Star,
  Calendar,
  Shirt,
  Crown,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ReactNode;
  priority: number;
  collapsible: boolean;
  defaultExpanded: boolean;
}

interface DynamicCategory {
  id: string;
  name: string;
  count: number;
  image?: string;
}

interface DynamicFilterPanelProps {
  facets: UnifiedSearchResult['facets'];
  filters: UnifiedProductFilters;
  onFilterChange: (filters: Partial<UnifiedProductFilters>) => void;
  onToggleFilter: (key: keyof UnifiedProductFilters, value: any) => void;
  isFilterActive: (key: keyof UnifiedProductFilters, value: any) => boolean;
  dynamicCategories: DynamicCategory[];
  loading?: boolean;
  isMobile?: boolean;
}

const COLOR_MAPPING: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  navy: '#1E3A8A',
  burgundy: '#7C2D12',
  gray: '#6B7280',
  grey: '#6B7280',
  brown: '#92400E',
  blue: '#2563EB',
  red: '#DC2626',
  green: '#059669',
  gold: '#D97706',
  silver: '#9CA3AF',
  tan: '#D2B48C',
  beige: '#F5F5DC',
  charcoal: '#374151'
};

export function DynamicFilterPanel({
  facets,
  filters,
  onFilterChange,
  onToggleFilter,
  isFilterActive,
  dynamicCategories,
  loading = false,
  isMobile = false
}: DynamicFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categories', 'colors', 'price'])
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 1000
  ]);

  // Toggle section expansion
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Handle price range change
  const handlePriceChange = useCallback((value: [number, number]) => {
    setPriceRange(value);
    onFilterChange({
      minPrice: value[0],
      maxPrice: value[1]
    });
  }, [onFilterChange]);

  // Get unique occasions from facets
  const occasions = useMemo(() => {
    return facets.occasions || [];
  }, [facets.occasions]);

  // Get available bundle tiers
  const bundleTiers = useMemo(() => {
    return facets.bundleTiers || [];
  }, [facets.bundleTiers]);

  // Create color chips component
  const ColorChip = ({ color, count, isActive, onClick }: {
    color: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
  }) => {
    const colorHex = COLOR_MAPPING[color.toLowerCase()] || '#9CA3AF';
    
    return (
      <motion.button
        onClick={onClick}
        className={cn(
          "relative flex items-center space-x-2 p-2 rounded-lg border-2 transition-all",
          isActive 
            ? "border-burgundy bg-burgundy/5" 
            : "border-gray-200 hover:border-gray-300"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
          style={{ backgroundColor: colorHex }}
        />
        <span className="text-sm font-medium capitalize">{color}</span>
        <span className="text-xs text-gray-500">({count})</span>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-burgundy text-white rounded-full p-0.5"
          >
            <Check className="w-3 h-3" />
          </motion.div>
        )}
      </motion.button>
    );
  };

  // Create filter sections
  const filterSections: FilterSection[] = [
    {
      id: 'categories',
      title: 'Categories',
      icon: Shirt,
      priority: 1,
      collapsible: true,
      defaultExpanded: true,
      component: (
        <div className="space-y-2">
          {dynamicCategories.map(category => {
            const isActive = isFilterActive('category', category.id);
            return (
              <motion.button
                key={category.id}
                onClick={() => onToggleFilter('category', category.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                  isActive 
                    ? "border-burgundy bg-burgundy/5 text-burgundy" 
                    : "border-gray-200 hover:border-gray-300"
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center space-x-3">
                  {category.image && (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-sm text-gray-500">({category.count})</span>
              </motion.button>
            );
          })}
        </div>
      )
    },
    {
      id: 'colors',
      title: 'Colors',
      icon: Palette,
      priority: 2,
      collapsible: true,
      defaultExpanded: true,
      component: (
        <div className="grid grid-cols-1 gap-2">
          {facets.colors.map(color => (
            <ColorChip
              key={color.name}
              color={color.name}
              count={color.count}
              isActive={isFilterActive('color', color.name)}
              onClick={() => onToggleFilter('color', color.name)}
            />
          ))}
        </div>
      )
    },
    {
      id: 'price',
      title: 'Price Range',
      icon: DollarSign,
      priority: 3,
      collapsible: true,
      defaultExpanded: true,
      component: (
        <div className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">${priceRange[0]}</span>
            <span className="font-medium">${priceRange[1]}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {facets.priceRanges.map(range => {
              const isActive = filters.minPrice === range.min && filters.maxPrice === range.max;
              return (
                <Button
                  key={`${range.min}-${range.max}`}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriceChange([range.min, range.max])}
                  className={cn(
                    "text-xs",
                    isActive && "bg-burgundy hover:bg-burgundy-700"
                  )}
                >
                  {range.label}
                </Button>
              );
            })}
          </div>
        </div>
      )
    },
    {
      id: 'occasions',
      title: 'Occasions',
      icon: Calendar,
      priority: 4,
      collapsible: true,
      defaultExpanded: false,
      component: (
        <div className="space-y-2">
          {occasions.map(occasion => {
            const isActive = isFilterActive('occasions', occasion.name);
            return (
              <motion.button
                key={occasion.name}
                onClick={() => onToggleFilter('occasions', occasion.name)}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-lg border transition-all",
                  isActive 
                    ? "border-burgundy bg-burgundy/5 text-burgundy" 
                    : "border-gray-200 hover:border-gray-300"
                )}
                whileHover={{ scale: 1.01 }}
              >
                <span className="capitalize font-medium">{occasion.name}</span>
                <span className="text-sm text-gray-500">({occasion.count})</span>
              </motion.button>
            );
          })}
        </div>
      )
    },
    {
      id: 'bundle-tiers',
      title: 'Bundle Tiers',
      icon: Crown,
      priority: 5,
      collapsible: true,
      defaultExpanded: false,
      component: (
        <div className="space-y-2">
          {bundleTiers.map(tier => {
            const isActive = isFilterActive('bundleTier', tier.tier);
            return (
              <motion.button
                key={tier.tier}
                onClick={() => onToggleFilter('bundleTier', tier.tier)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                  isActive 
                    ? "border-burgundy bg-burgundy/5 text-burgundy" 
                    : "border-gray-200 hover:border-gray-300"
                )}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4" />
                  <span className="capitalize font-medium">{tier.tier}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">${tier.price}</div>
                  <div className="text-xs text-gray-500">({tier.count})</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )
    },
    {
      id: 'special',
      title: 'Special Filters',
      icon: Sparkles,
      priority: 6,
      collapsible: true,
      defaultExpanded: false,
      component: (
        <div className="space-y-3">
          <motion.button
            onClick={() => onToggleFilter('trending', true)}
            className={cn(
              "w-full flex items-center space-x-3 p-3 rounded-lg border transition-all",
              isFilterActive('trending', true)
                ? "border-burgundy bg-burgundy/5 text-burgundy" 
                : "border-gray-200 hover:border-gray-300"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Trending Now</span>
          </motion.button>
          
          <motion.button
            onClick={() => onToggleFilter('newArrivals', true)}
            className={cn(
              "w-full flex items-center space-x-3 p-3 rounded-lg border transition-all",
              isFilterActive('newArrivals', true)
                ? "border-burgundy bg-burgundy/5 text-burgundy" 
                : "border-gray-200 hover:border-gray-300"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">New Arrivals</span>
          </motion.button>
          
          <motion.button
            onClick={() => onToggleFilter('onSale', true)}
            className={cn(
              "w-full flex items-center space-x-3 p-3 rounded-lg border transition-all",
              isFilterActive('onSale', true)
                ? "border-red-500 bg-red-50 text-red-600" 
                : "border-gray-200 hover:border-gray-300"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <Tag className="w-5 h-5" />
            <span className="font-medium">On Sale</span>
          </motion.button>
        </div>
      )
    }
  ];

  // Sort sections by priority and filter out empty ones
  const activeSections = filterSections
    .filter(section => {
      if (section.id === 'categories') return dynamicCategories.length > 0;
      if (section.id === 'colors') return facets.colors.length > 0;
      if (section.id === 'occasions') return occasions.length > 0;
      if (section.id === 'bundle-tiers') return bundleTiers.length > 0;
      return true;
    })
    .sort((a, b) => a.priority - b.priority);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map(j => (
                <div key={j} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("h-full overflow-y-auto", isMobile ? "p-4" : "p-6")}>
      <div className="space-y-6">
        {activeSections.map(section => {
          const isExpanded = expandedSections.has(section.id);
          const Icon = section.icon;
          
          return (
            <motion.div
              key={section.id}
              className="border border-gray-200 rounded-xl bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: section.priority * 0.1 }}
            >
              {section.collapsible ? (
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors rounded-t-xl focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-inset"
                  aria-expanded={isExpanded}
                  aria-controls={`filter-section-${section.id}`}
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${section.title} filters`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-burgundy" />
                    <span className="font-semibold text-gray-900">{section.title}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>
              ) : (
                <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
                  <Icon className="w-5 h-5 text-burgundy" />
                  <span className="font-semibold text-gray-900">{section.title}</span>
                </div>
              )}
              
              <AnimatePresence>
                {(isExpanded || !section.collapsible) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="p-4 pt-0"
                      id={`filter-section-${section.id}`}
                      role="region"
                      aria-labelledby={`filter-header-${section.id}`}
                    >
                      {section.component}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}