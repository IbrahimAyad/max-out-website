import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const ADMIN_WEBHOOK_SECRET = process.env.ADMIN_WEBHOOK_SECRET || "";

interface ProductWebhookPayload {
  event: "product.created" | "product.updated" | "product.deleted" | "product.published";
  timestamp: string;
  data: {
    id: string;
    sku: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    description?: string;
    variants: Array<{
      size: string;
      stock: number;
      price?: number;
    }>;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature from macOS Admin Panel
    const headersList = await headers();
    const signature = headersList.get("x-admin-signature");
    const timestamp = headersList.get("x-admin-timestamp");

    if (!verifyWebhookSignature(signature, timestamp, await request.text())) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: ProductWebhookPayload = await request.json();
    const { event, data } = payload;

    switch (event) {
      case "product.created":
        await handleProductCreated(data);
        break;
      case "product.updated":
        await handleProductUpdated(data);
        break;
      case "product.deleted":
        await handleProductDeleted(data);
        break;
      case "product.published":
        await handleProductPublished(data);
        break;
      default:

    }

    // Invalidate relevant caches
    await invalidateProductCaches(data.id, data.category);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {

    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

function verifyWebhookSignature(
  signature: string | null,
  timestamp: string | null,
  body: string
): boolean {
  if (!signature || !timestamp) return false;

  // Verify timestamp is within 5 minutes
  const timestampMs = parseInt(timestamp);
  const now = Date.now();
  if (Math.abs(now - timestampMs) > 5 * 60 * 1000) {
    return false;
  }

  // In production, verify HMAC signature
  // const expectedSignature = crypto
  //   .createHmac("sha256", ADMIN_WEBHOOK_SECRET)
  //   .update(`${timestamp}.${body}`)
  //   .digest("hex");
  // return signature === expectedSignature;

  return true; // Simplified for development
}

async function handleProductCreated(product: any) {

  // Update local database
  // Send notification to subscribed customers about new arrival
  // Update search index
  // Trigger recommendation engine update
}

async function handleProductUpdated(product: any) {

  // Update local cache and database
  // Check if price changed and notify customers with it in cart
  // Update related product recommendations
}

async function handleProductDeleted(product: any) {

  // Remove from local database
  // Remove from customer carts
  // Update search index
}

async function handleProductPublished(product: any) {

  // Make product visible on website
  // Send new arrival notifications
  // Update homepage featured products
}

async function invalidateProductCaches(productId: string, category: string) {
  // Invalidate Next.js cache for:
  // - Product detail pages
  // - Category pages
  // - Search results
  // - Homepage if featured

  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "",
      },
      body: JSON.stringify({
        paths: [
          `/products/${productId}`,
          `/products`,
          `/search`,
          `/`,
        ],
        tags: [`product-${productId}`, `category-${category}`],
      }),
    });
  } catch (error) {

  }
}