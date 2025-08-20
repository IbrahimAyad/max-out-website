import { NextRequest, NextResponse } from "next/server";
import { recommendationService } from "@/lib/recommendations/recommendationService";
import { RecommendationType, RecommendationContext } from "@/lib/recommendations/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const type = searchParams.get("type") as RecommendationType;
    const productId = searchParams.get("productId");
    const customerId = searchParams.get("customerId");
    const category = searchParams.get("category");
    const size = searchParams.get("size");
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!type) {
      return NextResponse.json(
        { error: "Recommendation type is required" },
        { status: 400 }
      );
    }

    const context: RecommendationContext = {
      productId: productId || undefined,
      customerId: customerId || undefined,
      category: category || undefined,
      size: size || undefined,
      limit,
    };

    // For authenticated users, fetch additional context
    if (customerId) {
      // In production, fetch from database:
      // - Purchase history
      // - View history
      // - Style preferences
      // - Cart items
    }

    const recommendations = await recommendationService.getRecommendations(type, context);

    return NextResponse.json({
      type,
      recommendations,
      count: recommendations.length,
    });
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}