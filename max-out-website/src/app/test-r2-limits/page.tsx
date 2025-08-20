'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TestR2Limits() {
  const [results, setResults] = useState<{url: string, status: number, time: number}[]>([]);
  const [testing, setTesting] = useState(false);

  // Test images from the problematic bucket
  const testUrls = [
    'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg',
    'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Black-Dress-Shirt.jpg',
    'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg',
  ];

  const testSequential = async () => {
    setTesting(true);
    setResults([]);
    
    for (let i = 0; i < testUrls.length; i++) {
      const start = Date.now();
      try {
        const response = await fetch(testUrls[i]);
        const time = Date.now() - start;
        setResults(prev => [...prev, { url: testUrls[i], status: response.status, time }]);
        
        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        setResults(prev => [...prev, { url: testUrls[i], status: 0, time: Date.now() - start }]);
      }
    }
    
    setTesting(false);
  };

  const testParallel = async () => {
    setTesting(true);
    setResults([]);
    
    const promises = testUrls.map(async (url) => {
      const start = Date.now();
      try {
        const response = await fetch(url);
        return { url, status: response.status, time: Date.now() - start };
      } catch (error) {
        return { url, status: 0, time: Date.now() - start };
      }
    });
    
    const results = await Promise.all(promises);
    setResults(results);
    setTesting(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">R2 Rate Limit Test</h1>
      
      <Card className="p-6 mb-4">
        <p className="mb-4">Test if 402 errors are due to rate limiting</p>
        <div className="space-x-4">
          <Button onClick={testSequential} disabled={testing}>
            Test Sequential (500ms delay)
          </Button>
          <Button onClick={testParallel} disabled={testing}>
            Test Parallel (all at once)
          </Button>
        </div>
      </Card>

      {results.length > 0 && (
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Results:</h2>
          <div className="space-y-2">
            {results.map((result, idx) => (
              <div key={idx} className={`p-3 rounded ${result.status === 200 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm font-mono">{result.url.split('/').pop()}</p>
                <p className="text-sm">
                  Status: <span className={result.status === 200 ? 'text-green-600' : 'text-red-600'}>
                    {result.status}
                  </span> | Time: {result.time}ms
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="font-semibold">Analysis:</p>
            <p className="text-sm">
              {results.filter(r => r.status === 402).length} out of {results.length} returned 402 errors
            </p>
            {results.some(r => r.status === 402) && results.some(r => r.status === 200) && (
              <p className="text-sm mt-2 text-orange-600">
                Mixed results suggest rate limiting or quota issues!
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}