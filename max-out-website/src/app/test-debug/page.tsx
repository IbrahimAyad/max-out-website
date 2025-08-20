'use client';

import { useState, useEffect } from 'react';
import { testDirectConnection } from '@/lib/shared/supabase-products-debug';

export default function TestDebugPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function test() {
      setLoading(false);
    }
    test();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Debug Test</h1>
      
      {loading ? (
        <p>Testing connection with hardcoded values...</p>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
          
          <h2 className="text-lg font-semibold mt-4 mb-2">Check Console for Details</h2>
          <p className="text-gray-600">Open browser console (F12) to see detailed logs</p>
        </div>
      )}
    </div>
  );
}