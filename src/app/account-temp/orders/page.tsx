"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { LoadingState } from "@/components/ui/states/LoadingState";
import { EmptyState } from "@/components/ui/states/ErrorState";
import { formatPrice } from "@/lib/utils/format";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Order {
  id: string;
  createdAt: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  total: number;
  itemCount: number;
}

export default function OrderHistoryPage() {
  const { customer } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch customer orders
    const fetchOrders = async () => {
      try {
        // Mock data for development
        setOrders([
          {
            id: "ORD-001",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "delivered",
            total: 89900,
            itemCount: 1,
          },
          {
            id: "ORD-002",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: "shipped",
            total: 145800,
            itemCount: 3,
          },
          {
            id: "ORD-003",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: "processing",
            total: 34900,
            itemCount: 1,
          },
        ]);
      } catch (error) {

      } finally {
        setIsLoading(false);
      }
    };

    if (customer) {
      fetchOrders();
    }
  }, [customer]);

  if (isLoading) {
    return <LoadingState text="Loading orders..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <EmptyState
          title="No orders yet"
          message="When you place your first order, it will appear here."
          action={{
            label: "Start Shopping",
            onClick: () => window.location.href = "/products",
          }}
        />
      </div>
    );
  }

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { bg: "bg-gray-100", text: "text-gray-800", label: "Pending" },
      processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Processing" },
      shipped: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Shipped" },
      delivered: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
    };

    const config = statusConfig[status];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order.id}
                    </h3>
                    {getStatusBadge(order.status)}
                  </div>

                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  <div className="mt-3 flex items-center space-x-6">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{order.itemCount}</span>
                      {order.itemCount === 1 ? " item" : " items"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}