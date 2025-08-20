'use client';

import { useState, useEffect } from 'react';

export default function VerifyCloudflare() {
  const [results, setResults] = useState<any>({});
  
  useEffect(() => {
    // Test R2 image URL
    const testUrl = 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/main.png';
    
    // Test different optimization methods
    const tests = {
      original: testUrl,
      cdnOptimized: `/cdn-cgi/image/format=webp,width=400,quality=85/${testUrl}`,
      polishOnly: testUrl + '?polish=lossy',
      directWebP: testUrl.replace('.png', '.webp'),
    };
    
    // Check which URLs work
    Object.entries(tests).forEach(([key, url]) => {
      fetch(url, { method: 'HEAD' })
        .then(res => {
          setResults(prev => ({
            ...prev,
            [key]: {
              status: res.status,
              ok: res.ok,
              headers: {
                contentType: res.headers.get('content-type'),
                cfCache: res.headers.get('cf-cache-status'),
                cfPolish: res.headers.get('cf-polished'),
              }
            }
          }));
        })
        .catch(err => {
          setResults(prev => ({
            ...prev,
            [key]: { error: err.message }
          }));
        });
    });
  }, []);
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Cloudflare Optimization Verification</h1>
      
      <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-2">✅ Currently Enabled in Cloudflare:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Polish:</strong> Lossy compression (active)</li>
          <li><strong>WebP:</strong> Automatic conversion (active)</li>
          <li><strong>Mirage:</strong> Mobile optimization (active)</li>
        </ul>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Testing Different Methods:</h2>
        
        {Object.entries(results).map(([method, result]: [string, any]) => (
          <div key={method} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 capitalize">
              {method.replace(/([A-Z])/g, ' $1').trim()}:
            </h3>
            
            {result.error ? (
              <div className="text-red-600">❌ Error: {result.error}</div>
            ) : result.ok ? (
              <div>
                <div className="text-green-600">✅ Working (Status: {result.status})</div>
                {result.headers && (
                  <div className="mt-2 text-sm text-gray-600">
                    <div>Content-Type: {result.headers.contentType || 'N/A'}</div>
                    <div>CF-Cache: {result.headers.cfCache || 'N/A'}</div>
                    <div>CF-Polish: {result.headers.cfPolish || 'N/A'}</div>
                  </div>
                )}
              </div>
            ) : result.status ? (
              <div className="text-yellow-600">⚠️ Status: {result.status}</div>
            ) : (
              <div className="text-gray-400">Loading...</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">Visual Test - R2 Image with Optimizations:</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Original R2 URL:</h3>
            <img 
              src="https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/main.png"
              alt="Original"
              className="w-full border rounded"
            />
            <p className="text-xs mt-1">Direct from R2 (with Polish/WebP if enabled)</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">With Image Transform (if enabled):</h3>
            <img 
              src="/cdn-cgi/image/format=webp,width=400,quality=85/https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/main.png"
              alt="Optimized"
              className="w-full border rounded"
            />
            <p className="text-xs mt-1">Via /cdn-cgi/image/ endpoint</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-300 rounded">
        <h3 className="font-bold mb-2">🔧 If Image Transformations aren't working:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Click "Manage" next to Image Transformations in Cloudflare</li>
          <li>Enable "Resize images from any origin"</li>
          <li>Or create a Transform Rule for R2 URLs</li>
          <li>Polish alone will still optimize your images even without Image Transformations</li>
        </ol>
      </div>
    </div>
  );
}