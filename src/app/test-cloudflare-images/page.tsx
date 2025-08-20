'use client';

import { useState } from 'react';
import { useCloudflareImage } from '@/hooks/useCloudflareImage';
import Image from 'next/image';

export default function TestCloudflareImages() {
  const [testUrl, setTestUrl] = useState('https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/main.png');
  
  // Generate optimized versions
  const thumbnail = useCloudflareImage(testUrl, 'thumbnail');
  const card = useCloudflareImage(testUrl, 'card');
  const gallery = useCloudflareImage(testUrl, 'gallery');
  const custom = useCloudflareImage(testUrl, { width: 300, height: 300, quality: 90, format: 'webp' });

  const testImages = [
    'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/main.png',
    'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/charcoal-grey/main.png',
    'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-model.png'
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Cloudflare Image Resizing Test</h1>
      
      <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-2">⚠️ Setup Required:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to <a href="https://dash.cloudflare.com" target="_blank" className="text-blue-600 underline">Cloudflare Dashboard</a></li>
          <li>Select your domain (kctmenswear.com)</li>
          <li>Navigate to: <strong>Speed → Optimization → Image Resizing</strong></li>
          <li>Toggle ON "Image Resizing"</li>
          <li>Enable "Resize images from any origin"</li>
          <li>Enable "Polish" with "Lossy" compression</li>
        </ol>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Test with any image URL:</label>
        <input
          type="text"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter image URL..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div>
          <h3 className="font-semibold mb-2">Thumbnail (150x200)</h3>
          <img 
            src={thumbnail.src} 
            alt="Thumbnail"
            className="w-full border rounded"
          />
          <p className="text-xs mt-1 text-gray-600">WebP, 85% quality</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Card (400x533)</h3>
          <img 
            src={card.src}
            alt="Card"
            className="w-full border rounded"
          />
          <p className="text-xs mt-1 text-gray-600">WebP, 90% quality</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Gallery (800x1067)</h3>
          <img 
            src={gallery.src}
            alt="Gallery"
            className="w-full border rounded"
          />
          <p className="text-xs mt-1 text-gray-600">WebP, 95% quality</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Custom (300x300)</h3>
          <img 
            src={custom.src}
            alt="Custom"
            className="w-full border rounded"
          />
          <p className="text-xs mt-1 text-gray-600">WebP, 90% quality</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Generated URLs:</h2>
        <div className="space-y-2 bg-gray-100 p-4 rounded">
          <div>
            <strong>Original:</strong>
            <code className="block text-xs mt-1 break-all">{testUrl}</code>
          </div>
          <div>
            <strong>Optimized Thumbnail:</strong>
            <code className="block text-xs mt-1 break-all text-green-600">{thumbnail.src}</code>
          </div>
          <div>
            <strong>Optimized Card:</strong>
            <code className="block text-xs mt-1 break-all text-green-600">{card.src}</code>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sample Product Images (Auto-Optimized)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testImages.map((url, index) => {
            const optimized = useCloudflareImage(url, 'card');
            return (
              <div key={index} className="border rounded overflow-hidden">
                <img 
                  src={optimized.src}
                  alt={`Product ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2 bg-gray-50">
                  <p className="text-xs text-gray-600">Auto-optimized</p>
                  <p className="text-xs text-green-600">WebP format</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">Expected Benefits After Activation:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>50-80% smaller image files</li>
          <li>Automatic WebP/AVIF conversion</li>
          <li>Responsive image sizing</li>
          <li>2-3x faster page loads</li>
          <li>Better mobile performance</li>
          <li>Lower bandwidth costs</li>
        </ul>
      </div>
    </div>
  );
}