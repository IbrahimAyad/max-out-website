import { formatPrice } from "@/lib/utils/format";
import { Truck, CheckCircle, Clock, Package } from "lucide-react";

export default async function OrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;

  // TODO: fetch order data on the server using orderId
  // const order = await getOrder(orderId)

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Order #{orderId}</h1>
      {/* Render your server-fetched order details here */}
      <div className="text-sm text-muted-foreground">
        Coming soon: order details for {orderId}
      </div>
    </main>
  );
}