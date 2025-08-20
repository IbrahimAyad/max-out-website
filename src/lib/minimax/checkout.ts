/**
 * MiniMax Checkout Integration
 * Handles the complete checkout flow using MiniMax admin backend
 */

import { miniMaxClient } from './client';
import { MINIMAX_CONFIG } from './config';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface CheckoutItem {
  product_id: string;
  product_type: 'core' | 'catalog';
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  customization?: {
    monogram?: string;
    notes?: string;
  };
}

export interface CheckoutData {
  items: CheckoutItem[];
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  shipping: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  billing?: {
    same_as_shipping?: boolean;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  shipping_method?: string;
  payment_method?: string;
}

/**
 * Process checkout using MiniMax backend
 */
export async function processCheckout(checkoutData: CheckoutData) {
  try {
    // Step 1: Create order in MiniMax
    const order = await miniMaxClient.createOrder({
      customer: {
        ...checkoutData.customer,
        address: checkoutData.shipping,
      },
      items: checkoutData.items,
      shipping_method: checkoutData.shipping_method || 'standard',
      payment_method: checkoutData.payment_method || 'stripe',
      metadata: {
        source: 'kct-menswear-frontend',
        billing_address: checkoutData.billing,
      },
    });

    console.log('Order created:', order);

    // Step 2: Calculate shipping rates
    const shippingRates = await miniMaxClient.calculateShipping({
      from_address: {
        line1: '1234 Store Street',
        city: 'Detroit',
        state: 'MI',
        postal_code: '48201',
        country: 'US',
      },
      to_address: checkoutData.shipping,
      parcel: {
        weight: 2, // Default 2 lbs for suits
        length: 24,
        width: 18,
        height: 4,
      },
    });

    console.log('Shipping rates:', shippingRates);

    // Step 3: Create payment intent for Core products (have Stripe IDs)
    const coreItems = checkoutData.items.filter(item => item.product_type === 'core');
    const catalogItems = checkoutData.items.filter(item => item.product_type === 'catalog');
    
    let paymentIntent = null;
    let totalAmount = 0;

    // Calculate total
    checkoutData.items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // Add shipping cost (use first rate as default)
    const shippingCost = shippingRates?.rates?.[0]?.amount || 0;
    totalAmount += shippingCost;

    // Create payment intent
    if (coreItems.length > 0 || catalogItems.length > 0) {
      paymentIntent = await miniMaxClient.createPaymentIntent({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'usd',
        customer_email: checkoutData.customer.email,
        order_id: order.id,
        metadata: {
          order_number: order.order_number,
          customer_name: checkoutData.customer.name,
          items_count: checkoutData.items.length,
        },
      });

      console.log('Payment intent created:', paymentIntent);
    }

    // Step 4: Send order confirmation email
    await miniMaxClient.sendOrderConfirmation({
      order_id: order.id,
      customer_email: checkoutData.customer.email,
      order_details: {
        order_number: order.order_number,
        items: checkoutData.items,
        subtotal: totalAmount - shippingCost,
        shipping: shippingCost,
        total: totalAmount,
        estimated_delivery: '5-7 business days',
        shipping_address: checkoutData.shipping,
      },
    });

    // Step 5: Send admin notification
    await miniMaxClient.sendAdminNotification({
      type: 'new_order',
      order_id: order.id,
      message: `New order #${order.order_number} from ${checkoutData.customer.name}`,
      details: {
        customer_email: checkoutData.customer.email,
        total: totalAmount,
        items_count: checkoutData.items.length,
      },
    });

    return {
      success: true,
      order,
      paymentIntent,
      shippingRates,
      totalAmount,
    };
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

/**
 * Complete payment using Stripe
 */
export async function completePayment(
  clientSecret: string,
  paymentElement: any
) {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe not initialized');

    const result = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
}

/**
 * Handle successful payment
 */
export async function handlePaymentSuccess(
  orderId: string,
  paymentIntentId: string
) {
  try {
    // Update order status
    await miniMaxClient.updateOrder(orderId, {
      status: MINIMAX_CONFIG.orderStatus.PAID,
      payment_intent_id: paymentIntentId,
      paid_at: new Date().toISOString(),
    });

    // Create shipping label
    const shippingLabel = await miniMaxClient.createShippingLabel({
      order_id: orderId,
      rate_id: 'default_rate', // Use selected rate from checkout
      carrier: 'usps',
      service: 'Priority',
    });

    // Send shipping notification
    if (shippingLabel.tracking_number) {
      const order = await miniMaxClient.getOrder(orderId);
      
      await miniMaxClient.sendShippingNotification({
        order_id: orderId,
        customer_email: order.customer_email,
        tracking_number: shippingLabel.tracking_number,
        carrier: 'usps',
        estimated_delivery: shippingLabel.estimated_delivery,
      });
    }

    return {
      success: true,
      shippingLabel,
    };
  } catch (error) {
    console.error('Post-payment error:', error);
    // Don't throw - payment was successful, just log the error
    return {
      success: true,
      error: error instanceof Error ? error.message : 'Post-payment processing error',
    };
  }
}

/**
 * Get order status
 */
export async function getOrderStatus(orderId: string) {
  try {
    const order = await miniMaxClient.getOrder(orderId);
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

/**
 * Cancel order
 */
export async function cancelOrder(orderId: string, reason?: string) {
  try {
    // Update order status
    await miniMaxClient.updateOrder(orderId, {
      status: MINIMAX_CONFIG.orderStatus.CANCELLED,
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
    });

    // Get order details for refund
    const order = await miniMaxClient.getOrder(orderId);

    // Process refund if payment was made
    if (order.payment_intent_id && order.status === MINIMAX_CONFIG.orderStatus.PAID) {
      await miniMaxClient.refundPayment({
        payment_intent_id: order.payment_intent_id,
        reason: reason || 'Customer requested cancellation',
      });
    }

    return {
      success: true,
      message: 'Order cancelled successfully',
    };
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
}