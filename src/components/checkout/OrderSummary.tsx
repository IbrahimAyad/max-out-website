import { CartItem, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import Image from "next/image";

interface OrderSummaryProps {
  items: CartItem[];
  products: Product[];
  totalPrice: number;
}

export function OrderSummary({ items, products, totalPrice }: OrderSummaryProps) {
  const getProduct = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  const subtotal = totalPrice;
  const tax = Math.round(subtotal * 0.0875); // 8.75% tax
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => {
          const product = getProduct(item.productId);
          if (!product) return null;

          const variant = product.variants.find((v) => v.size === item.size);
          const price = variant?.price || product.price;

          return (
            <div key={`${item.productId}-${item.size}`} className="flex space-x-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={product.images[0] || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  Size: {item.size} | Qty: {item.quantity}
                </p>
                <p className="font-medium">{formatPrice(price * item.quantity)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}