import { topBundleGenerator } from '@/lib/services/topBundleGenerator';

async function generateAndDisplayBundles() {

  try {
    const bundles = await topBundleGenerator.generateTop15Bundles();

    bundles.forEach((bundle, index) => {

      // Suit details

      // Shirt details

      // Tie details

      // Bundle pricing

      // AI Analysis

      // Target & Occasions

      // Reasoning

    });

    // Summary statistics

    const avgOriginalPrice = bundles.reduce((sum, b) => sum + b.totalPrice, 0) / bundles.length;
    const avgBundlePrice = bundles.reduce((sum, b) => sum + b.bundlePrice, 0) / bundles.length;
    const avgDiscount = bundles.reduce((sum, b) => sum + b.discount, 0) / bundles.length;
    const trendingCount = bundles.filter(b => b.trending).length;
    const avgColorHarmony = bundles.reduce((sum, b) => sum + b.colorHarmonyScore, 0) / bundles.length;
    const avgAIConfidence = bundles.reduce((sum, b) => sum + b.aiConfidenceScore, 0) / bundles.length;

    // Occasion breakdown

    const occasionCount: Record<string, number> = {};
    bundles.forEach(bundle => {
      bundle.occasion.forEach(occ => {
        occasionCount[occ] = (occasionCount[occ] || 0) + 1;
      });
    });

    Object.entries(occasionCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([occasion, count]) => {

      });

    // Season breakdown

    const seasonCount: Record<string, number> = {};
    bundles.forEach(bundle => {
      bundle.seasonality.forEach(season => {
        seasonCount[season] = (seasonCount[season] || 0) + 1;
      });
    });

    Object.entries(seasonCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([season, count]) => {

      });

  } catch (error) {

  }
}

// Run the generator
generateAndDisplayBundles();