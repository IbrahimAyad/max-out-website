"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatPrice } from "@/lib/utils/format";
import { Truck, CheckCircle, Clock, Package } from "lucide-react";

interface OrderStatus {
  status: "pending" | "processing" | "shipped" | "delivered";
  timestamp: string;
  description: string;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Order not found");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600">We couldn't find an order with that ID.</p>
        </div>
      </div>
    );
  }

  const orderStatuses: OrderStatus[] = [
    {
      status: "pending",
      timestamp: order.createdAt,
      description: "Order placed",
    },
    {
      status: "processing",
      timestamp: order.processedAt || "",
      description: "Processing your order",
    },
    {
      status: "shipped",
      timestamp: order.shippedAt || "",
      description: "Order shipped",
    },
    {
      status: "delivered",
      timestamp: order.deliveredAt || "",
      description: "Delivered",
    },
  ];

  const currentStatusIndex = orderStatuses.findIndex(s => s.status === order.status);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6" />;
      case "processing":
        return <Package className="h-6 w-6" />;
      case "shipped":
        return <Truck className="h-6 w-6" />;
      case "delivered":
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Clock className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Order #{orderId}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Order Status Timeline */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            <div className="relative">
              {orderStatuses.map((status, index) => (
                <div key={status.status} className="flex items-start mb-8 last:mb-0">
                  <div className="relative">
                    <div
                      className={`
                        flex items-center justify-center w-12 h-12 rounded-full
                        ${index <= currentStatusIndex
                          ? "bg-gold text-black"
                          : "bg-gray-200 text-gray-400"
                        }
                      `}
                    >
                      {getStatusIcon(status.status)}
                    </div>
                    {index < orderStatuses.length - 1 && (
                      <div
                        className={`
                          absolute top-12 left-6 w-0.5 h-16 -ml-px
                          ${index < currentStatusIndex ? "bg-gold" : "bg-gray-200"}
                        `}
                      />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{status.description}</h3>
                    {status.timestamp && (
                      <p className="text-sm text-gray-600">
                        {new Date(status.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Tracking Information</h3>
              <p className="text-gray-600">
                Carrier: {order.carrier || "USPS"}<br />
                Tracking Number: <span className="font-mono">{order.trackingNumber}</span>
              </p>
            </div>
          )}

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(order.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax</span>
              <span>{formatPrice(order.tax || 0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping || 0)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(order.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <p className="text-gray-600">
            {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}<br />
            {order.shippingInfo?.address}<br />
            {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}<br />
            {order.shippingInfo?.phone}
          </p>
        </div>
      </div>
    </div>
  );
}