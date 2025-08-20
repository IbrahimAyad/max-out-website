import { NextRequest, NextResponse } from "next/server";
import { ProductAffinity } from "@/lib/recommendations/types";

// Mock affinity data for development
const mockAffinities: Record<string, ProductAffinity> = {
  "1": {
    productId: "1",
    relatedProducts: [
      { productId: "5", score: 0.92, cooccurrence: 87 },
      { productId: "6", score: 0.85, cooccurrence: 72 },
      { productId: "7", score: 0.78, cooccurrence: 65 },
      { productId: "8", score: 0.71, cooccurrence: 54 },
    ],
  },
  "2": {
    productId: "2",
    relatedProducts: [
      { productId: "1", score: 0.88, cooccurrence: 76 },
      { productId: "7", score: 0.82, cooccurrence: 68 },
      { productId: "3", score: 0.75, cooccurrence: 52 },
    ],
  },
};

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Query purchase history database
    // 2. Calculate co-occurrence matrix
    // 3. Apply collaborative filtering
    // 4. Cache results

    const affinity = mockAffinities[productId] || {
      productId,
      relatedProducts: [],
    };

    return NextResponse.json(affinity);
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to calculate product affinity" },
      { status: 500 }
    );
  }
}