'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function TestStripeCheckout() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/unified?limit=50');
      const data = await response.json();
      // Get first 12 products for testing (mix of Core and Enhanced)
      const testProducts = data.products.slice(0, 12);
      setProducts(testProducts);
    } catch (error) {
      setMessage('Error loading products');
    }
  };

  const testCheckout = async (product: any) => {
    setLoading(true);
    setMessage('Creating checkout session...');
    setSelectedProduct(product);

    try {
      // Create checkout session
      const response = await fetch('/api/checkout/unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: product.id,
            name: product.name,
            price: Math.round(product.price * 100), // Convert to cents
            quantity: 1,
            image: product.imageUrl?.replace(
              'pub-46371bda6faf4910b74631159fc2dfd4.r2.dev',
              'cdn.kctmenswear.com'
            ) || product.images?.primary?.url || 'https://cdn.kctmenswear.com/placeholder.jpg',
            stripePriceId: product.stripePriceId,
            enhanced: product.stripePriceId ? false : true, // If no Stripe ID, it's enhanced
            category: product.category
          }],
          customerEmail: 'test@example.com',
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        setMessage('Redirecting to Stripe Checkout...');
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Stripe Checkout Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Test Checkout" on any product below</li>
            <li>You'll be redirected to Stripe Checkout</li>
            <li>Use test card: <code className="bg-gray-100 px-2 py-1 rounded">4242 4242 4242 4242</code></li>
            <li>Any future date for expiry, any CVC</li>
            <li>Complete the payment to test the flow</li>
          </ol>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Test Products ({products.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 9).map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <img 
                  src={(() => {
                    // Use working CDN images as placeholders for bundles
                    if (product.name?.includes('Tuxedo')) {
                      return 'https://cdn.kctmenswear.com/tuxedos/black-gold-design-tuxedo/mens_tuxedos_suit_2005_0.webp';
                    }
                    if (product.name?.includes('Executive') || product.name?.includes('Navy')) {
                      return 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/black-suspender-bowtie-set/model.webp';
                    }
                    // Try to fix R2 URLs to CDN
                    const fixedUrl = product.imageUrl?.replace(
                      'pub-46371bda6faf4910b74631159fc2dfd4.r2.dev',
                      'cdn.kctmenswear.com'
                    );
                    return fixedUrl || product.images?.primary?.url || '/placeholder-product.jpg';
                  })()} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                  }}
                />
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">Price: ${product.price}</p>
                <p className="text-xs text-gray-500 mb-3">
                  {product.stripePriceId 
                    ? `Stripe ID: ${product.stripePriceId.slice(0, 20)}...` 
                    : 'Dynamic pricing (Enhanced)'}
                </p>
                
                <button
                  onClick={() => testCheckout(product)}
                  disabled={loading && selectedProduct?.id === product.id}
                  className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading && selectedProduct?.id === product.id ? 'Processing...' : 'Test Checkout'}
                </button>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              Loading products...
            </p>
          )}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Test Mode</h3>
          <p className="text-yellow-700">
            This is using Stripe test mode. No real charges will be made.
            Make sure your Stripe keys are configured in the .env file:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-yellow-600">
            <li>• STRIPE_SECRET_KEY</li>
            <li>• NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</li>
          </ul>
        </div>
      </div>
    </div>
  );
}