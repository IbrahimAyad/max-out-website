'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function UpdateVestsPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async () => {
    setIsUpdating(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/supabase/update-vests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update products')
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Update Vest & Tie Products</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <p className="text-yellow-800">
          This will update all vest & tie products in the database with Cloudflare R2 image URLs and set the price to $49.99.
        </p>
      </div>

      <Button 
        onClick={handleUpdate} 
        disabled={isUpdating}
        className="mb-8"
      >
        {isUpdating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating Products...
          </>
        ) : (
          'Update Vest Products'
        )}
      </Button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Update Summary</h2>
            <ul className="space-y-1">
              <li>Total products: {results.summary.total}</li>
              <li>Successfully updated: {results.summary.updated}</li>
              <li>Errors: {results.summary.errors}</li>
              <li>Not found: {results.summary.notFound}</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Detailed Results</h2>
            <div className="space-y-2">
              {results.results.map((result: any, index: number) => (
                <div 
                  key={index} 
                  className={`p-2 rounded ${
                    result.status === 'success' ? 'bg-green-50' : 
                    result.status === 'error' ? 'bg-red-50' : 
                    result.status === 'not_found' ? 'bg-yellow-50' : 
                    'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{result.name}</span>
                    <span className={`text-sm ${
                      result.status === 'success' ? 'text-green-600' : 
                      result.status === 'error' ? 'text-red-600' : 
                      result.status === 'not_found' ? 'text-yellow-600' : 
                      'text-gray-600'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  {result.message && (
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}