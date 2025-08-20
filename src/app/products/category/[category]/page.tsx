'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Filter, Grid, List, SlidersHorizontal, ArrowLeft, 
  Sparkles, TrendingUp, Award, Users, Bot, Search
} from 'lucide-react';

const categoryData = {
  'suits': {
    title: 'Suits',
    description: 'Premium suits crafted for the modern gentleman',
    filters: ['Style', 'Color', 'Fabric', 'Occasion', 'Size', 'Price'],
    styles: ['Business', 'Wedding', 'Casual', 'Black Tie'],
    aiInsights: {
      trending: 'Navy suits up 34% this month',
      seasonal: 'Perfect for wedding season',
      knowledge: 'Based on 10,000+ wedding analysis'
    }
  },
  'shirts': {
    title: 'Dress Shirts',
    description: 'Egyptian cotton shirts with perfect fit',
    filters: ['Collar', 'Fit', 'Color', 'Pattern', 'Size', 'Price'],
    styles: ['Slim Fit', 'Classic', 'French Cuff', 'Casual'],
    aiInsights: {
      trending: 'White shirts remain #1 choice',
      seasonal: 'Light blues popular for spring',
      knowledge: 'AI recommends based on suit pairings'
    }
  },
  'ties': {
    title: 'Ties & Accessories',
    description: 'Silk ties and accessories to complete your look',
    filters: ['Pattern', 'Color', 'Material', 'Width', 'Price'],
    styles: ['Solid', 'Striped', 'Paisley', 'Bow Ties'],
    aiInsights: {
      trending: 'Burgundy ties trending for fall',
      seasonal: 'Floral patterns for spring weddings',
      knowledge: 'Perfect matches suggested by AI'
    }
  }
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const categoryInfo = categoryData[category as keyof typeof categoryData];
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(false);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Category Not Found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-black">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-600 hover:text-black">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-black capitalize">{category}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-serif mb-2">{categoryInfo.title}</h1>
              <p className="text-gray-600 text-lg">{categoryInfo.description}</p>
            </div>
            
            {/* AI Insights */}
            <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 lg:max-w-md">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-gold" />
                AI Style Insights
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>{categoryInfo.aiInsights.trending}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold" />
                  <span>{categoryInfo.aiInsights.seasonal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span>{categoryInfo.aiInsights.knowledge}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Style Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge className="cursor-pointer hover:bg-gold/20 transition-colors">
              All {categoryInfo.title}
            </Badge>
            {categoryInfo.styles.map((style) => (
              <Badge 
                key={style} 
                variant="outline" 
                className="cursor-pointer hover:bg-gold/10 hover:border-gold transition-colors"
              >
                {style}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="py-6 bg-gray-50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {Object.keys(selectedFilters).length > 0 && (
                  <Badge className="ml-1 bg-gold text-black">
                    {Object.values(selectedFilters).flat().length}
                  </Badge>
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="ai-recommended">AI Recommended</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>127 customers viewing</span>
              </div>
              
              <div className="flex items-center border rounded">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expandable Filters */}
      {showFilters && (
        <section className="py-6 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categoryInfo.filters.map((filter) => (
                <div key={filter}>
                  <h4 className="font-medium mb-3">{filter}</h4>
                  <div className="space-y-2">
                    {['Option 1', 'Option 2', 'Option 3'].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4 mt-6 pt-6 border-t">
              <Button className="bg-gold hover:bg-gold/90 text-black">
                Apply Filters
              </Button>
              <Button variant="outline">
                Clear All
              </Button>
              <div className="text-sm text-gray-600">
                Showing 1-24 of 156 results
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid products={[]} />
        </div>
      </section>

      {/* AI-Powered Recommendations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Personalized for You</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI analyzes your browsing history, preferences, and style choices to recommend perfect matches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <Search className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600 text-sm">
                Use natural language to find exactly what you're looking for
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Bot className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Size Assistant</h3>
              <p className="text-gray-600 text-sm">
                Get perfect fit recommendations with our AI size bot
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Style Advisor</h3>
              <p className="text-gray-600 text-sm">
                Complete outfit suggestions based on your selections
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}