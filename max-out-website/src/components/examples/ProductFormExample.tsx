'use client';

import { useState } from 'react';
import { SmartTagInput } from '@/components/product/SmartTagInput';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Example of how to integrate SmartTagInput into a product form
 */
export function ProductFormExample() {
  const [formData, setFormData] = useState({
    name: 'Navy Three-Piece Business Suit',
    description: 'Premium wool suit perfect for business meetings and professional occasions. Features slim fit tailoring and modern styling.',
    price: 79900,
    tags: ['navy', 'suit', 'business'],
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'
  });

  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert('Product saved! Check console for data.');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">Product Form with Smart Tagging</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (cents)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
            />
          </div>

          {/* Smart Tag Input - The main feature */}
          <SmartTagInput
            value={formData.tags}
            onChange={handleTagsChange}
            productId="example-product"
            productImageUrl={formData.imageUrl}
            productName={formData.name}
            productDescription={formData.description}
            enableAutoTagging={true}
            maxTags={15}
          />

          {/* Product Image Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="flex items-start gap-4">
              <img
                src={formData.imageUrl}
                alt="Product preview"
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Image URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fashion-CLIP will analyze this image to suggest relevant tags
                </p>
              </div>
            </div>
          </div>

          {/* Current Data Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Current Form Data:</h3>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" className="bg-gold hover:bg-gold/90 text-black">
              Save Product
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setFormData(prev => ({ ...prev, tags: [] }))}
            >
              Clear Tags
            </Button>
          </div>
        </form>
      </Card>

      {/* Usage Instructions */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold mb-4">How to Use Smart Tagging:</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
            <div>
              <strong>Type tags manually:</strong> Enter tags separated by commas or press Enter after each tag
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
            <div>
              <strong>Use AI suggestions:</strong> Click "AI Suggest" to get Fashion-CLIP recommendations based on the product image
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
            <div>
              <strong>Quick add common tags:</strong> Use the quick-add buttons for frequently used tags
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">4</span>
            <div>
              <strong>SEO optimization:</strong> The system automatically prevents duplicate variations and suggests SEO improvements
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">5</span>
            <div>
              <strong>Conflict prevention:</strong> Duplicate variations like "navy" and "navy blue" are automatically detected and prevented
            </div>
          </li>
        </ul>
      </Card>
    </div>
  );
}