'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface BundleFiltersProps {
  categories: Array<{ id: string; name: string; count?: number }>;
  occasions: Array<{ id: string; name: string }>;
  selectedCategory: string;
  selectedOccasion: string;
  onCategoryChange: (category: string) => void;
  onOccasionChange: (occasion: string) => void;
  onClose: () => void;
}

export default function BundleFilters({
  categories,
  occasions,
  selectedCategory,
  selectedOccasion,
  onCategoryChange,
  onOccasionChange,
  onClose,
}: BundleFiltersProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters Content */}
          <div className="p-6 space-y-8 overflow-y-auto h-[calc(100%-80px)]">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                CATEGORIES
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-black text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {selectedCategory === category.id && (
                        <Check className="w-4 h-4" />
                      )}
                      {category.name}
                    </span>
                    {category.count && (
                      <span className="text-sm opacity-70">
                        ({category.count})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                OCCASIONS
              </h3>
              <div className="space-y-2">
                {occasions.map((occasion) => (
                  <button
                    key={occasion.id}
                    onClick={() => onOccasionChange(occasion.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedOccasion === occasion.id
                        ? 'bg-black text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {selectedOccasion === occasion.id && (
                        <Check className="w-4 h-4" />
                      )}
                      {occasion.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range (Future Enhancement) */}
            <div className="opacity-50 pointer-events-none">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                PRICE RANGE
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>$500</span>
                  <span>$800+</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full relative">
                  <div className="absolute inset-y-0 left-1/4 right-1/4 bg-black rounded-full" />
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Coming Soon
                </p>
              </div>
            </div>

            {/* Season Filter (Future Enhancement) */}
            <div className="opacity-50 pointer-events-none">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                SEASON
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['Spring', 'Summer', 'Fall', 'Winter'].map((season) => (
                  <button
                    key={season}
                    className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
                    disabled
                  >
                    {season}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Coming Soon
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onCategoryChange('all');
                  onOccasionChange('all');
                }}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}