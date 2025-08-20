'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, ImageIcon, CheckCircle, XCircle, AlertCircle, Copy } from 'lucide-react'

interface BucketStatus {
  url: string
  status: 'checking' | 'success' | 'error'
  error?: string
  description: string
}

export default function FixImagesPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [bucketStatuses, setBucketStatuses] = useState<BucketStatus[]>([])
  const [failingImages, setFailingImages] = useState<string[]>([])

  // Define the three R2 buckets found in your codebase
  const buckets: BucketStatus[] = [
    {
      url: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev',
      status: 'checking',
      description: 'Main Products (Suits, Shirts, Ties, Bow Ties)'
    },
    {
      url: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev',
      status: 'checking', 
      description: 'Vest Products & Tie Sets'
    },
    {
      url: 'https://pub-140b3d87a1b64af6a3193ba8aa685e26.r2.dev',
      status: 'checking',
      description: 'Style Swiper Images'
    }
  ]

  const testImageUrls = [
    'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg',
    'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/Turquoise-model.png',
    'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/blush-vest.jpg',
    'https://pub-140b3d87a1b64af6a3193ba8aa685e26.r2.dev/style-swiper/test/sample.png'
  ]

  const checkBucketStatus = async (bucket: BucketStatus): Promise<BucketStatus> => {
    try {
      // Try to load a test image from each bucket
      const testUrl = testImageUrls.find(url => url.includes(bucket.url.replace('https://', '')))
      if (!testUrl) {
        return { ...bucket, status: 'error', error: 'No test images found' }
      }

      const response = await fetch(testUrl, { method: 'HEAD' })
      if (response.ok) {
        return { ...bucket, status: 'success' }
      } else {
        return { 
          ...bucket, 
          status: 'error', 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }
      }
    } catch (error) {
      return { 
        ...bucket, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Network error' 
      }
    }
  }

  const handleCheckBuckets = async () => {
    setIsChecking(true)
    setBucketStatuses(buckets.map(b => ({ ...b, status: 'checking' })))
    setFailingImages([])

    try {
      // Check each bucket status
      const results = await Promise.all(buckets.map(checkBucketStatus))
      setBucketStatuses(results)

      // Find failing images
      const failing: string[] = []
      for (const url of testImageUrls) {
        try {
          const response = await fetch(url, { method: 'HEAD' })
          if (!response.ok) {
            failing.push(`${url} - HTTP ${response.status}`)
          }
        } catch (error) {
          failing.push(`${url} - ${error instanceof Error ? error.message : 'Network error'}`)
        }
      }
      setFailingImages(failing)
    } finally {
      setIsChecking(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">R2 Bucket Debug Tool</h1>
      
      <Card className="p-6 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <ImageIcon className="h-8 w-8 text-gold mt-1" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Debug Cloudflare R2 402 Errors</h2>
            <p className="text-gray-600 mb-4">
              Check which R2 buckets are returning 402 Payment Required errors.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Found 3 R2 buckets in your codebase:</strong> Main Products, Vest Products, and Style Swiper. 
                  This tool will test each bucket to identify which ones are causing 402 errors.
                </span>
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCheckBuckets} 
          disabled={isChecking}
          size="lg"
          className="w-full md:w-auto"
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking Buckets...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Check All R2 Buckets
            </>
          )}
        </Button>
      </Card>

      {bucketStatuses.length > 0 && (
        <div className="grid gap-6 mb-8">
          <h2 className="text-2xl font-semibold">Bucket Status Results</h2>
          {bucketStatuses.map((bucket, index) => (
            <Card key={index} className={`p-6 ${
              bucket.status === 'error' ? 'border-red-200 bg-red-50' :
              bucket.status === 'success' ? 'border-green-200 bg-green-50' :
              'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {bucket.status === 'checking' && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
                    {bucket.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {bucket.status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                    <h3 className="text-lg font-semibold">{bucket.description}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 font-mono">{bucket.url}</p>
                  {bucket.error && (
                    <p className="text-red-700 text-sm font-medium">Error: {bucket.error}</p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(bucket.url)}
                  className="ml-4"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {failingImages.length > 0 && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Failing Images Found</h2>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {failingImages.map((image, index) => (
              <div key={index} className="bg-white p-3 rounded border flex items-center justify-between">
                <span className="text-sm font-mono text-red-700 flex-1 mr-4">{image}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(image.split(' - ')[0])}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 mt-8 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps for 402 Errors</h3>
        <div className="space-y-3 text-blue-800">
          <p className="flex items-start gap-2">
            <span className="font-semibold">1.</span>
            <span>Check your Cloudflare account billing and R2 usage quotas</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="font-semibold">2.</span>
            <span>Verify payment methods are up to date in Cloudflare dashboard</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="font-semibold">3.</span>
            <span>Look at which specific bucket is failing - likely the vest products bucket (pub-8ea0502158a94b8ca8a7abb9e18a57e8)</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="font-semibold">4.</span>
            <span>Open browser dev tools Network tab and look for red 402 responses to confirm which URLs are failing</span>
          </p>
        </div>
      </Card>
    </div>
  )
}