import { NextResponse } from 'next/server';
import { enhancedKnowledgeAPI } from '@/lib/services/enhancedKnowledgeAdapter';

export async function GET() {
  try {
    // console.log('Testing Enhanced Knowledge API...');
    
    // Test health check
    const health = await enhancedKnowledgeAPI.checkHealth();
    // console.log('Health check:', health);
    
    // Test core endpoints
    const tests = {
      health,
      features: {
        visualAnalysis: false,
        smartBundles: false,
        analytics: false,
        core: false,
      },
      results: {} as any,
    };
    
    // Test core functionality (V1)
    try {
      const colorRelations = await enhancedKnowledgeAPI.getColorRelationships('navy');
      tests.features.core = true;
      tests.results.colorRelations = {
        success: true,
        sample: colorRelations?.perfect_matches?.shirts?.slice(0, 3),
      };
    } catch (error: any) {
      tests.results.colorRelations = { success: false, error: error.message };
    }
    
    // Test trending
    try {
      const trending = await enhancedKnowledgeAPI.getTrending(5);
      tests.results.trending = {
        success: true,
        count: trending?.length || 0,
        sample: trending?.slice(0, 2),
      };
    } catch (error: any) {
      tests.results.trending = { success: false, error: error.message };
    }
    
    // Test smart bundles (V2)
    try {
      const bundles = await enhancedKnowledgeAPI.generateSmartBundle({
        occasion: 'business',
        season: 'winter',
        budget: { min: 500, max: 1000 },
      });
      tests.features.smartBundles = true;
      tests.results.smartBundles = {
        success: true,
        count: bundles?.length || 0,
        sample: bundles?.slice(0, 1).map(b => ({
          name: b.name,
          items: b.items.length,
          price: b.pricing.bundlePrice,
          savings: b.pricing.savingsPercentage,
        })),
      };
    } catch (error: any) {
      tests.results.smartBundles = { success: false, error: error.message };
    }
    
    // Test trending bundles
    try {
      const trendingBundles = await enhancedKnowledgeAPI.getTrendingBundles(3);
      tests.results.trendingBundles = {
        success: true,
        count: trendingBundles?.length || 0,
      };
    } catch (error: any) {
      tests.results.trendingBundles = { success: false, error: error.message };
    }
    
    // Test analytics (V2)
    try {
      const analytics = await enhancedKnowledgeAPI.getConversionAnalytics();
      tests.features.analytics = true;
      tests.results.analytics = {
        success: true,
        hasData: !!analytics,
      };
    } catch (error: any) {
      tests.results.analytics = { success: false, error: error.message };
    }
    
    // Test predictions
    try {
      const predictions = await enhancedKnowledgeAPI.getTrendPredictions();
      tests.results.predictions = {
        success: true,
        count: predictions?.length || 0,
      };
    } catch (error: any) {
      tests.results.predictions = { success: false, error: error.message };
    }
    
    // Summary
    const summary = {
      apiStatus: health.status === 'healthy' ? '🟢 Healthy' : '🔴 Unhealthy',
      v1Features: tests.features.core ? '✅ Working' : '❌ Not Working',
      v2Features: {
        smartBundles: tests.features.smartBundles ? '✅ Enabled' : '❌ Disabled',
        analytics: tests.features.analytics ? '✅ Enabled' : '❌ Disabled',
        visualAnalysis: '🔄 Not Tested (requires image)',
      },
      recommendation: health.status === 'healthy' && tests.features.core
        ? '✅ Ready for production use!'
        : '⚠️ Check API configuration',
    };
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      details: tests,
    });
    
  } catch (error: any) {
    console.error('Enhanced Knowledge API test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      recommendation: 'Check if the Knowledge API is running and credentials are correct',
    }, { status: 500 });
  }
}