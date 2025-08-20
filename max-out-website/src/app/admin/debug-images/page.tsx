'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface ImageTestResult {
  url: string;
  status: 'loading' | 'success' | 'error';
  statusCode?: number;
  bucket: string;
  category: string;
}

export default function DebugImagesPage() {
  const [results, setResults] = useState<ImageTestResult[]>([]);
  const [testing, setTesting] = useState(false);

  // Sample images from each R2 bucket
  const testImages = [
    // Main Products Bucket
    {
      bucket: 'pub-46371bda6faf4910b74631159fc2dfd4.r2.dev',
      category: 'Suits',
      urls: [
        'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
        'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
        'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
      ]
    },
    {
      bucket: 'pub-46371bda6faf4910b74631159fc2dfd4.r2.dev',
      category: 'Dress Shirts',
      urls: [
        'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg',
        'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Black-Dress-Shirt.jpg',
        'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Sky-Blue-Dress-Shirt.jpg',
      ]
    },
    {
      bucket: 'pub-46371bda6faf4910b74631159fc2dfd4.r2.dev',
      category: 'Ties',
      urls: [
        'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg',
        'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Navy.webp',
        'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/black.jpg',
      ]
    },
    // Vest Products Bucket (likely problematic)
    {
      bucket: 'pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev',
      category: 'Vests & Ties',
      urls: [
        'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/Turquoise-model.png',
        'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/burgundy-model.png',
        'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/gold-vest.jpg',
      ]
    },
    // Style Swiper Bucket
    {
      bucket: 'pub-140b3d87a1b64af6a3193ba8aa685e26.r2.dev',
      category: 'Style Swiper',
      urls: [
        'https://pub-140b3d87a1b64af6a3193ba8aa685e26.r2.dev/style-swiper/test/sample.png',
      ]
    },
  ];

  const testImage = async (url: string, bucket: string, category: string): Promise<ImageTestResult> => {
    const result: ImageTestResult = {
      url,
      status: 'loading',
      bucket,
      category,
    };

    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' // To avoid CORS issues during testing
      });
      
      // In no-cors mode, we can't read the status, so we'll load the image
      return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          resolve({ ...result, status: 'success' });
        };
        
        img.onerror = () => {
          // Try to fetch with CORS to get status code
          fetch(url)
            .then(res => {
              resolve({ ...result, status: 'error', statusCode: res.status });
            })
            .catch(() => {
              resolve({ ...result, status: 'error', statusCode: 0 });
            });
        };
        
        img.src = url;
      });
    } catch (error) {
      return { ...result, status: 'error', statusCode: 0 };
    }
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    const allTests: Promise<ImageTestResult>[] = [];

    testImages.forEach(group => {
      group.urls.forEach(url => {
        allTests.push(testImage(url, group.bucket, group.category));
      });
    });

    const results = await Promise.all(allTests);
    setResults(results);
    setTesting(false);
  };

  const bucketSummary = results.reduce((acc, result) => {
    if (!acc[result.bucket]) {
      acc[result.bucket] = { total: 0, success: 0, errors: 0, error402: 0 };
    }
    acc[result.bucket].total++;
    if (result.status === 'success') {
      acc[result.bucket].success++;
    } else {
      acc[result.bucket].errors++;
      if (result.statusCode === 402) {
        acc[result.bucket].error402++;
      }
    }
    return acc;
  }, {} as Record<string, { total: number; success: number; errors: number; error402: number }>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">R2 Bucket Image Debug Tool</h1>
        <p className="text-gray-600">Test images from each R2 bucket to identify 402 Payment Required errors</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Test R2 Buckets</h2>
          <Button onClick={runTests} disabled={testing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing...' : 'Run Tests'}
          </Button>
        </div>

        {/* Bucket Summary */}
        {results.length > 0 && (
          <div className="mb-6 space-y-4">
            <h3 className="font-semibold">Bucket Summary:</h3>
            {Object.entries(bucketSummary).map(([bucket, stats]) => (
              <Card key={bucket} className={`p-4 ${stats.error402 > 0 ? 'border-red-500 bg-red-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm">{bucket}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.success}/{stats.total} working
                      {stats.error402 > 0 && (
                        <span className="text-red-600 font-semibold ml-2">
                          • {stats.error402} images returning 402 (Payment Required)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    {stats.errors === 0 ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : stats.error402 > 0 ? (
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-yellow-500" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Detailed Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Detailed Results:</h3>
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : result.statusCode === 402
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{result.category}</p>
                    <p className="text-xs text-gray-600 truncate max-w-md">{result.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.statusCode && result.statusCode !== 0 && (
                      <span className={`text-sm font-semibold ${
                        result.statusCode === 402 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {result.statusCode}
                      </span>
                    )}
                    {result.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {results.length === 0 && !testing && (
          <div className="text-center py-8 text-gray-500">
            <p>Click "Run Tests" to check all R2 buckets for 402 errors</p>
            <p className="text-sm mt-2">This will test sample images from each bucket</p>
          </div>
        )}
      </Card>

      {/* Next Steps */}
      {results.some(r => r.statusCode === 402) && (
        <Card className="p-6 border-orange-200 bg-orange-50">
          <h3 className="font-semibold text-orange-800 mb-2">Next Steps to Fix 402 Errors:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-orange-700">
            <li>Log into your Cloudflare dashboard</li>
            <li>Navigate to R2 Storage → Select the failing bucket</li>
            <li>Check the billing/payment status for this bucket</li>
            <li>Verify your payment method is up to date</li>
            <li>Check if you've exceeded the free tier limits (10GB storage / 1M requests)</li>
            <li>Consider upgrading to a paid plan or consolidating buckets</li>
          </ol>
        </Card>
      )}
    </div>
  );
}