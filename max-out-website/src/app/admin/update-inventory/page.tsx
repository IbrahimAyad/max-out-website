'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Package, CheckCircle, XCircle } from 'lucide-react'

export default function UpdateInventoryPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async () => {
    setIsUpdating(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/supabase/update-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update inventory')
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Update Product Inventory & Images</h1>
      
      <Card className="p-6 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <Package className="h-8 w-8 text-gold mt-1" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Bulk Inventory Update</h2>
            <p className="text-gray-600 mb-4">
              This will update all product variants to have 10 items in stock and add Cloudflare R2 images for all products.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> This operation will:
              </p>
              <ul className="list-disc list-inside mt-2 text-amber-700 text-sm">
                <li>Set inventory quantity to 10 for ALL product variants</li>
                <li>Mark all variants as available</li>
                <li>Enable backorders for all variants</li>
                <li>Update product images with Cloudflare R2 URLs</li>
              </ul>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleUpdate} 
          disabled={isUpdating}
          size="lg"
          className="w-full md:w-auto"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Inventory...
            </>
          ) : (
            <>
              <Package className="mr-2 h-4 w-4" />
              Update All Products
            </>
          )}
        </Button>
      </Card>

      {error && (
        <Card className="p-6 mb-8 border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">Error: {error}</p>
          </div>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          <Card className="p-6 border-green-200 bg-green-50">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-green-900">Update Summary</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{results.summary.totalProducts}</p>
                <p className="text-sm text-green-600">Total Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{results.summary.updatedProducts}</p>
                <p className="text-sm text-green-600">Updated Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{results.summary.updatedVariants}</p>
                <p className="text-sm text-green-600">Updated Variants</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-700">{results.summary.errors}</p>
                <p className="text-sm text-red-600">Errors</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Detailed Results</h2>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white border-b">
                  <tr>
                    <th className="text-left py-2 px-4">Product Name</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Images</th>
                    <th className="text-left py-2 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.results.map((result: any, index: number) => (
                    <tr 
                      key={index} 
                      className={result.status === 'success' ? 'bg-green-50' : 'bg-red-50'}
                    >
                      <td className="py-2 px-4 font-medium">{result.name}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          result.status === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {result.status === 'success' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {result.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {result.hasImages !== undefined && (
                          <span className={`text-xs ${result.hasImages ? 'text-green-600' : 'text-gray-400'}`}>
                            {result.hasImages ? '✓ Updated' : 'No mapping'}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-gray-600 text-xs">{result.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}