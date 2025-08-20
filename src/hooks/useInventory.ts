import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface InventoryItem {
  id: string;
  product_id: string;
  size: string;
  stock_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  low_stock_threshold: number;
}

export function useInventory(productId: string) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchInventory();

    // Subscribe to real-time inventory changes
    const channel = supabase
      .channel(`inventory:${productId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory',
          filter: `product_id=eq.${productId}`,
        },
        (payload) => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId)
        .order('size');

      if (error) throw error;

      // Calculate available quantity for each size
      const inventoryWithAvailable = (data || []).map(item => ({
        ...item,
        available_quantity: item.stock_quantity - item.reserved_quantity
      }));

      setInventory(inventoryWithAvailable);
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = (size: string, quantity: number): boolean => {
    const item = inventory.find(inv => inv.size === size);
    return item ? item.available_quantity >= quantity : false;
  };

  const getAvailableStock = (size: string): number => {
    const item = inventory.find(inv => inv.size === size);
    return item ? item.available_quantity : 0;
  };

  const isLowStock = (size: string): boolean => {
    const item = inventory.find(inv => inv.size === size);
    return item ? item.available_quantity <= item.low_stock_threshold : false;
  };

  return {
    inventory,
    loading,
    error,
    checkAvailability,
    getAvailableStock,
    isLowStock,
    refetch: fetchInventory,
  };
}

export function useCartInventory() {
  const supabase = createClient();

  const reserveInventory = async (
    cartId: string,
    productId: string,
    size: string,
    quantity: number
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('reserve_inventory', {
        p_cart_id: cartId,
        p_product_id: productId,
        p_size: size,
        p_quantity: quantity,
      });

      if (error) throw error;
      return data || false;
    } catch (err) {

      return false;
    }
  };

  const releaseCartReservations = async (cartId: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('release_cart_reservations', {
        p_cart_id: cartId,
      });

      if (error) throw error;
    } catch (err) {

    }
  };

  return {
    reserveInventory,
    releaseCartReservations,
  };
}