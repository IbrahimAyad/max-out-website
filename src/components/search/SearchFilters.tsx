"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProductCategory } from "@/lib/types";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  productCount?: number;
}

export interface FilterState {
  categories: ProductCategory[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  sort: string;
}

const categoryOptions: FilterOption[] = [
  { label: "Suits", value: "suits" },
  { label: "Shirts", value: "shirts" },
  { label: "Accessories", value: "accessories" },
  { label: "Shoes", value: "shoes" },
];

const sizeOptions: FilterOption[] = [
  { label: "36R", value: "36R" },
  { label: "38R", value: "38R" },
  { label: "40R", value: "40R" },
  { label: "42R", value: "42R" },
  { label: "44R", value: "44R" },
  { label: "46R", value: "46R" },
];

const colorOptions: FilterOption[] = [
  { label: "Black", value: "black" },
  { label: "Navy", value: "navy" },
  { label: "Gray", value: "gray" },
  { label: "Blue", value: "blue" },
  { label: "Brown", value: "brown" },
  { label: "White", value: "white" },
];

const sortOptions: FilterOption[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

export function SearchFilters({ onFilterChange, productCount = 0 }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 2000],
    sizes: [],
    colors: [],
    sort: "featured",
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["category", "size", "color"])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleCategoryToggle = (category: ProductCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    handleFilterChange({ categories: newCategories });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    handleFilterChange({ sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    handleFilterChange({ colors: newColors });
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      priceRange: [0, 2000],
      sizes: [],
      colors: [],
      sort: "featured",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 2000;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gold hover:text-gold/80"
            >
              Clear all
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{productCount} products</p>
      </div>

      {/* Sort By */}
      <div className="p-4 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange({ sort: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("category")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Category</span>
          {expandedSections.has("category") ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        {expandedSections.has("category") && (
          <div className="px-4 pb-4 space-y-2">
            {categoryOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(option.value as ProductCategory)}
                  onChange={() => handleCategoryToggle(option.value as ProductCategory)}
                  className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("size")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Size</span>
          {expandedSections.has("size") ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        {expandedSections.has("size") && (
          <div className="px-4 pb-4 grid grid-cols-3 gap-2">
            {sizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSizeToggle(option.value)}
                className={`
                  px-3 py-2 text-sm rounded-md border
                  ${filters.sizes.includes(option.value)
                    ? "bg-gold text-black border-gold"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("color")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Color</span>
          {expandedSections.has("color") ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        {expandedSections.has("color") && (
          <div className="px-4 pb-4 space-y-2">
            {colorOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.colors.includes(option.value)}
                  onChange={() => handleColorToggle(option.value)}
                  className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="p-4">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Price Range
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) =>
              handleFilterChange({
                priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]],
              })
            }
            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md"
            placeholder="Min"
          />
          <span className="text-gray-500">–</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handleFilterChange({
                priceRange: [filters.priceRange[0], parseInt(e.target.value) || 2000],
              })
            }
            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
}