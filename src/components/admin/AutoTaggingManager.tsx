'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, Zap, AlertTriangle, CheckCircle, XCircle, 
  Search, Filter, Download, Settings, TrendingUp,
  Eye, EyeOff, RotateCw, Save, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fashionClipAutoTagging, AutoTaggingResult, ProductTags } from '@/lib/services/fashionClipAutoTagging';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  tags: string[];
  category: string;
  price: number;
  lastTagged?: Date;
  seoScore?: number;
}

interface TaggingJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  productCount: number;
  processedCount: number;
  results: Map<string, AutoTaggingResult>;
  createdAt: Date;
}

export function AutoTaggingManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [currentJob, setCurrentJob] = useState<TaggingJob | null>(null);
  const [showPreview, setShowPreview] = useState<Map<string, boolean>>(new Map());
  const [filter, setFilter] = useState<'all' | 'untagged' | 'lowSEO' | 'conflicts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock products data
  useEffect(() => {
    setProducts([
      {
        id: 'prod-1',
        name: 'Navy Three-Piece Suit',
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public',
        tags: ['navy', 'suit', 'formal'],
        category: 'suits',
        price: 79900,
        seoScore: 65
      },
      {
        id: 'prod-2', 
        name: 'Black Wedding Tuxedo',
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/3859e360-f63d-40d5-35ec-223ffc67f000/public',
        tags: ['black', 'tuxedo'],
        category: 'suits',
        price: 119900,
        seoScore: 45
      },
      {
        id: 'prod-3',
        name: 'Charcoal Business Suit',
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/5aa4d62a-c0dc-476d-09e7-c4c1da0b9700/public',
        tags: ['charcoal', 'business', 'professional', 'charcoal grey'], // Has duplicate variations
        category: 'suits',
        price: 69900,
        seoScore: 55
      }
    ]);
  }, []);

  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    switch (filter) {
      case 'untagged':
        return product.tags.length < 3;
      case 'lowSEO':
        return (product.seoScore || 0) < 60;
      case 'conflicts':
        return product.tags.some(tag => 
          product.tags.filter(t => t.toLowerCase().includes(tag.toLowerCase().split(' ')[0])).length > 1
        );
      default:
        return true;
    }
  });

  const handleBulkAutoTag = async () => {
    if (selectedProducts.size === 0) return;

    setIsProcessing(true);
    const jobId = `job-${Date.now()}`;
    
    const job: TaggingJob = {
      id: jobId,
      status: 'processing',
      productCount: selectedProducts.size,
      processedCount: 0,
      results: new Map(),
      createdAt: new Date()
    };
    
    setCurrentJob(job);

    try {
      const selectedProductsArray = products.filter(p => selectedProducts.has(p.id));
      
      const bulkResults = await fashionClipAutoTagging.bulkAutoTag(
        selectedProductsArray.map(p => ({
          id: p.id,
          imageUrl: p.imageUrl,
          existingTags: p.tags,
          name: p.name
        }))
      );

      job.status = 'completed';
      job.results = bulkResults;
      job.processedCount = selectedProducts.size;
      
      setCurrentJob({ ...job });
      
      // Update products with new tags
      setProducts(prev => prev.map(product => {
        const result = bulkResults.get(product.id);
        if (result) {
          return {
            ...product,
            tags: [...product.tags, ...result.addedTags],
            seoScore: result.seoScore,
            lastTagged: new Date()
          };
        }
        return product;
      }));

    } catch (error) {
      job.status = 'failed';
      setCurrentJob({ ...job });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSingleAutoTag = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      const result = await fashionClipAutoTagging.autoTagProduct(
        product.id,
        product.imageUrl,
        product.tags,
        product.name
      );

      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { 
              ...p, 
              tags: [...p.tags, ...result.addedTags],
              seoScore: result.seoScore,
              lastTagged: new Date()
            }
          : p
      ));

      // Show preview of what was added
      alert(`Added ${result.addedTags.length} new tags: ${result.addedTags.join(', ')}`);
      
    } catch (error) {
      alert('Failed to auto-tag product');
    }
  };

  const togglePreview = (productId: string) => {
    setShowPreview(prev => {
      const newMap = new Map(prev);
      newMap.set(productId, !newMap.get(productId));
      return newMap;
    });
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTagIssues = (tags: string[]) => {
    const suggestions = fashionClipAutoTagging.getTagSuggestions(tags);
    const issueCount = suggestions.missing.length + suggestions.redundant.length;
    return { suggestions, issueCount };
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="w-8 h-8 text-gold" />
            Fashion-CLIP Auto-Tagging
          </h1>
          <p className="text-gray-600 mt-2">
            Intelligent product tagging with SEO optimization and smart deduplication
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Tag className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">
                {products.filter(p => (p.seoScore || 0) < 60).length}
              </p>
              <p className="text-sm text-gray-600">Low SEO Score</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold">
                {products.filter(p => getTagIssues(p.tags).issueCount > 0).length}
              </p>
              <p className="text-sm text-gray-600">Tag Conflicts</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">
                {Math.round(products.reduce((sum, p) => sum + (p.seoScore || 0), 0) / products.length)}
              </p>
              <p className="text-sm text-gray-600">Avg SEO Score</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-gold"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-gold"
          >
            <option value="all">All Products</option>
            <option value="untagged">Under-tagged</option>
            <option value="lowSEO">Low SEO Score</option>
            <option value="conflicts">Tag Conflicts</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleBulkAutoTag}
            disabled={selectedProducts.size === 0 || isProcessing}
            className="bg-gold hover:bg-gold/90 text-black gap-2"
          >
            {isProcessing ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Auto-Tag Selected ({selectedProducts.size})
          </Button>
        </div>
      </div>

      {/* Current Job Status */}
      <AnimatePresence>
        {currentJob && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Auto-Tagging Job {currentJob.id}</h3>
                  <p className="text-sm text-gray-600">
                    {currentJob.status === 'processing' ? 'Processing...' : 
                     currentJob.status === 'completed' ? 'Completed successfully' : 
                     'Failed'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {currentJob.processedCount} / {currentJob.productCount}
                  </p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(currentJob.processedCount / currentJob.productCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
                      } else {
                        setSelectedProducts(new Set());
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Tags</th>
                <th className="text-left p-4">SEO Score</th>
                <th className="text-left p-4">Issues</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const { suggestions, issueCount } = getTagIssues(product.tags);
                
                return (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedProducts);
                          if (e.target.checked) {
                            newSelected.add(product.id);
                          } else {
                            newSelected.delete(product.id);
                          }
                          setSelectedProducts(newSelected);
                        }}
                        className="rounded"
                      />
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">${(product.price / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.tags.length} tags
                      </p>
                    </td>
                    
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSEOScoreColor(product.seoScore || 0)}`}>
                        {product.seoScore || 0}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      {issueCount > 0 ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-yellow-600">{issueCount} issues</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">Good</span>
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSingleAutoTag(product.id)}
                          className="gap-1"
                        >
                          <Zap className="w-3 h-3" />
                          Auto-Tag
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePreview(product.id)}
                          className="gap-1"
                        >
                          {showPreview.get(product.id) ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Suggestions Panel */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          SEO Recommendations
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-green-600">High Priority</h4>
            <ul className="text-sm space-y-1">
              <li>• Add color tags to {products.filter(p => !p.tags.some(tag => ['navy', 'black', 'charcoal', 'grey'].includes(tag.toLowerCase()))).length} products</li>
              <li>• Add occasion tags to improve discoverability</li>
              <li>• Include "men's" prefix for better SEO</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-yellow-600">Medium Priority</h4>
            <ul className="text-sm space-y-1">
              <li>• Remove duplicate color variations</li>
              <li>• Add fabric type tags (wool, cotton, linen)</li>
              <li>• Include fit descriptions (slim, regular)</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-blue-600">Low Priority</h4>
            <ul className="text-sm space-y-1">
              <li>• Add seasonal tags</li>
              <li>• Include brand-specific keywords</li>
              <li>• Add location-based tags for local SEO</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}