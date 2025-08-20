"use client"

import { AlertTriangle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface SupabaseConfigErrorProps {
  message?: string
  className?: string
}

export function SupabaseConfigError({ 
  message = "Supabase configuration is missing", 
  className 
}: SupabaseConfigErrorProps) {
  return (
    <Card className={`p-8 text-center border-yellow-200 bg-yellow-50 ${className}`}>
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Configuration Required
        </h3>
        
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {message}. Please add the following environment variables to your deployment:
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left w-full">
          <pre className="text-sm text-gray-800 font-mono">
{`NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key`}
          </pre>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            Retry
          </Button>
          <Button 
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={() => window.open('https://supabase.com/docs/guides/getting-started', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Setup Guide
          </Button>
        </div>
      </div>
    </Card>
  )
}