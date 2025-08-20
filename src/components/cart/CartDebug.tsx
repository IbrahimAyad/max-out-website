'use client';

import { useCart } from '@/lib/hooks/useCart';

export function CartDebug() {
  const { items, clearCart } = useCart();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 m-4 rounded-lg">
      <h3 className="font-semibold text-yellow-800 mb-2">Cart Debug Info</h3>
      <p className="text-sm text-yellow-700 mb-2">Items in cart: {items.length}</p>
      {items.map((item, index) => (
        <div key={index} className="text-xs text-yellow-600 mb-1">
          <strong>Item {index + 1}:</strong>
          <br />
          Product ID: {item.productId}
          <br />
          Has metadata: {item.metadata ? 'Yes' : 'No'}
          <br />
          Stripe Price ID: {item.metadata?.stripePriceId || 'Missing'}
          <br />
          Name: {item.name || 'Missing'}
          <br />
          ---
        </div>
      ))}
      <button
        onClick={clearCart}
        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
      >
        Clear Cart
      </button>
    </div>
  );
}