import { NextRequest, NextResponse } from "next/server";

// Mock order data for development
const mockOrders: { [key: string]: any } = {
  "test-order-123": {
    id: "test-order-123",
    status: "shipped",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    items: [
      {
        name: "Classic Navy Suit",
        size: "42R",
        quantity: 1,
        price: 89900,
      },
      {
        name: "White Dress Shirt",
        size: "L",
        quantity: 2,
        price: 12900,
      },
    ],
    subtotal: 115700,
    tax: 10123,
    shipping: 0,
    total: 125823,
    shippingInfo: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Detroit",
      state: "MI",
      zipCode: "48201",
      phone: "(313) 555-0123",
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  try {
    // In production, fetch from database
    const order = mockOrders[orderId] || {
      id: orderId,
      status: "pending",
      createdAt: new Date().toISOString(),
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      shippingInfo: {},
    };

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}