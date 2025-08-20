'use client';

import { useCart } from '@/lib/hooks/useCart';

export function ClearCartButton() {
  const { clearCart } = useCart();
  
  return (
    <button
      onClick={clearCart}
      className="text-sm text-red-600 hover:text-red-700 underline"
    >
      Clear Cart
    </button>
  );
}