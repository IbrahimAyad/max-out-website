'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function TestProductsDebug() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products/unified?limit=12');
        const data = await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <div className="p-8">Loading products...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Product Debug - {products.length} products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <div className="relative aspect-square mb-4 bg-gray-100">
              {product.imageUrl && product.imageUrl !== '/placeholder-product.jpg' ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>
            
            <h3 className="font-semibold mb-2">{product.name}</h3>
            
            <div className="text-sm space-y-1">
              <p>Type: {product.type}</p>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p>Image URL: {product.imageUrl ? '✓ Has URL' : '✗ No URL'}</p>
              {product.imageUrl && (
                <p className="text-xs text-gray-500 truncate" title={product.imageUrl}>
                  {product.imageUrl}
                </p>
              )}
              <p>Is Bundle: {product.isBundle ? 'Yes' : 'No'}</p>
              <p>In Stock: {product.inStock ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Debug Info:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(products.slice(0, 2), null, 2)}
        </pre>
      </div>
    </div>
  );
}