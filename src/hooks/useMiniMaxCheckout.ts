/**
 * Hook: useMiniMaxCheckout
 * Provides checkout functionality using MiniMax admin backend
 */

import { useState, useCallback } from 'react';
import { CheckoutData, CheckoutItem } from '@/lib/minimax/checkout';
import { useCart } from './useCart';
import { toast } from 'sonner';

export function useMiniMaxCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items: cartItems, clearCart } = useCart();

  /**
   * Convert cart items to checkout format
   */
  const prepareCheckoutItems = useCallback((): CheckoutItem[] => {
    return cartItems.map(item => ({
      product_id: item.id,
      product_type: item.stripe_price_id ? 'core' : 'catalog',
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.selectedSize,
      color: item.selectedColor,
      image: item.image,
      customization: item.customization,
    }));
  }, [cartItems]);

  /**
   * Process checkout
   */
  const processCheckout = useCallback(async (
    customerInfo: {
      email: string;
      name: string;
      phone?: string;
    },
    shippingAddress: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    },
    billingAddress?: {
      same_as_shipping?: boolean;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    }
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const checkoutData: CheckoutData = {
        items: prepareCheckoutItems(),
        customer: customerInfo,
        shipping: shippingAddress,
        billing: billingAddress || { same_as_shipping: true },
        shipping_method: 'standard',
        payment_method: 'stripe',
      };

      // Call MiniMax checkout API
      const response = await fetch('/api/minimax/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      const result = await response.json();

      // Clear cart on successful order creation
      if (result.success) {
        clearCart();
        toast.success('Order created successfully!');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [prepareCheckoutItems, clearCart]);

  /**
   * Get order status
   */
  const getOrderStatus = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`/api/minimax/order/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order status');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get order status';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Cancel order
   */
  const cancelOrder = useCallback(async (orderId: string, reason?: string) => {
    try {
      const response = await fetch(`/api/minimax/order/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const result = await response.json();
      toast.success('Order cancelled successfully');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Calculate shipping rates
   */
  const calculateShipping = useCallback(async (
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    }
  ) => {
    try {
      const response = await fetch('/api/minimax/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_address: address,
          items: prepareCheckoutItems(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate shipping');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate shipping';
      console.error(errorMessage);
      return { rates: [] };
    }
  }, [prepareCheckoutItems]);

  return {
    isProcessing,
    error,
    processCheckout,
    getOrderStatus,
    cancelOrder,
    calculateShipping,
    prepareCheckoutItems,
  };
}