import { useEffect, useState, useCallback } from "react";
import { adminClient } from "@/lib/api/adminClient";
import { useProductStore } from "@/lib/store/productStore";
import { StockLevel } from "@/lib/types";

export function useInventory(sku: string) {
  const [stock, setStock] = useState<StockLevel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { subscribeToInventory, unsubscribeFromInventory } = useProductStore();

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const inventory = await adminClient.fetchInventory(sku);
      setStock(inventory);
    } catch (error) {
      setError("Failed to fetch inventory");

    } finally {
      setIsLoading(false);
    }
  }, [sku]);

  useEffect(() => {
    // Initial fetch
    fetchInventory();

    // Subscribe to real-time updates
    subscribeToInventory(sku);

    return () => {
      unsubscribeFromInventory(sku);
    };
  }, [sku]);

  const isInStock = (size: string) => {
    return stock[size] > 0;
  };

  const getStockLevel = (size: string) => {
    return stock[size] || 0;
  };

  const getLowStockSizes = (threshold = 5) => {
    return Object.entries(stock)
      .filter(([_, quantity]) => quantity > 0 && quantity <= threshold)
      .map(([size]) => size);
  };

  return {
    stock,
    isLoading,
    error,
    isInStock,
    getStockLevel,
    getLowStockSizes,
    refetch: fetchInventory,
  };
}

export function useInventoryAlerts() {
  const [alerts, setAlerts] = useState<Array<{
    sku: string;
    size: string;
    type: "low_stock" | "out_of_stock";
    quantity: number;
  }>>([]);

  useEffect(() => {
    // Connect to websocket for inventory alerts
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL || "wss://kct-menswear.vercel.app"}/inventory-alerts`
    );

    ws.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      setAlerts((prev) => [...prev, alert]);
    };

    ws.onerror = (error) => {

    };

    return () => {
      ws.close();
    };
  }, []);

  const dismissAlert = useCallback((index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    dismissAlert,
    clearAlerts,
  };
}