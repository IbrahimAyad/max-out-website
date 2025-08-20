import { NextResponse } from 'next/server';
import { knowledgeBankAdapter } from '@/lib/services/knowledgeBankAdapter';

/**
 * API route to test Knowledge Bank Railway API integration
 * Access at: /api/test-knowledge-bank
 */
export async function GET() {
  const results: {
    timestamp: string;
    apiUrl: string;
    apiKeyConfigured: boolean;
    tests: any;
    summary?: {
      totalTests: number;
      passed: number;
      failed: number;
      apiStatus: string;
      fallbackWorking: boolean;
    };
  } = {
    timestamp: new Date().toISOString(),
    apiUrl: process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_API || 'https://kct-knowledge-api-2-production.up.railway.app',
    apiKeyConfigured: !!process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_KEY,
    tests: {}
  };

  try {
    // Test 1: Color Relationships (with fallback)

    const navyColors = await knowledgeBankAdapter.getColorRelationships('navy');
    results.tests.colorRelationships = {
      success: !!navyColors,
      data: navyColors,
      usedFallback: !navyColors || !navyColors.perfect_matches
    };

    // Test 2: Validate Combination

    const validation = await knowledgeBankAdapter.validateCombination('navy', 'white', 'burgundy');
    results.tests.validation = {
      success: true,
      data: validation
    };

    // Test 3: Recommendations

    const recommendations = await knowledgeBankAdapter.getRecommendations({
      occasion: 'business',
      season: 'fall'
    });
    results.tests.recommendations = {
      success: recommendations.length > 0,
      count: recommendations.length,
      sample: recommendations[0]
    };

    // Test 4: Trending Combinations

    const trending = await knowledgeBankAdapter.getTrendingCombinations(5);
    results.tests.trending = {
      success: trending.length > 0,
      count: trending.length,
      sample: trending[0]
    };

    // Test 5: Style Profile

    const profile = await knowledgeBankAdapter.getStyleProfile('classic_conservative');
    results.tests.styleProfile = {
      success: !!profile,
      data: profile,
      usedFallback: true // Currently always uses fallback
    };

    // Overall status
    const allTests = Object.values(results.tests);
    const successCount = allTests.filter((test: any) => test.success).length;

    results.summary = {
      totalTests: allTests.length,
      passed: successCount,
      failed: allTests.length - successCount,
      apiStatus: successCount > 0 ? 'partial' : 'offline',
      fallbackWorking: true
    };

    return NextResponse.json(results, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {

    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      results
    }, { status: 500 });
  }
}