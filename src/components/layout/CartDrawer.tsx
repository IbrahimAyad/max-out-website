"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/useCart";
import { useProductStore } from "@/lib/store/productStore";
import { formatPrice, getSizeLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "@/components/cart/CheckoutButton";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, cartSummary, updateQuantity, removeFromCart, isLoading } = useCart();
  const { products } = useProductStore();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const cartItemsWithProducts = items.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }));

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl transition-transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart ({cartSummary.itemCount})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItemsWithProducts.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItemsWithProducts.map((item) => {
                  if (!item.product) return null;
                  
                  const variant = item.product.variants.find(v => v.size === item.size);
                  const maxStock = variant?.stock || 0;

                  return (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-4 pb-4 border-b">
                      <div className="relative w-24 h-32 bg-gray-100 rounded-sm overflow-hidden">
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <Link 
                            href={`/products/${item.product.id}`}
                            className="font-semibold hover:text-gold transition-colors"
                            onClick={onClose}
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            Size: {getSizeLabel(item.size)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                              className="h-8 w-8 border rounded-sm hover:bg-gray-50 disabled:opacity-50"
                              disabled={item.quantity <= 1 || isLoading}
                            >
                              <Minus className="h-3 w-3 mx-auto" />
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.size, Math.min(maxStock, item.quantity + 1))}
                              className="h-8 w-8 border rounded-sm hover:bg-gray-50 disabled:opacity-50"
                              disabled={item.quantity >= maxStock || isLoading}
                            >
                              <Plus className="h-3 w-3 mx-auto" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-500">
                                {formatPrice(item.product.price)} each
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItemsWithProducts.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(cartSummary.totalPrice)}</span>
              </div>
              
              <div className="space-y-2">
                <CheckoutButton />
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}