'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { trackLogin, trackFormStart, trackFormSubmit } from '@/lib/analytics/google-analytics'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  // Track form start when user begins typing
  useEffect(() => {
    if (email || password) {
      trackFormStart('login_form');
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Track form submission
    trackFormSubmit('login_form');
    
    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      // Track successful login
      trackLogin('email')
    }
    
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:border-burgundy-400 transition-all duration-200 hover:border-gray-300"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:border-burgundy-400 transition-all duration-200 hover:border-gray-300"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-700 font-medium">
              {error}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-burgundy text-white py-3 px-4 rounded-lg hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium hover:shadow-md focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:ring-offset-2"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="text-center space-y-3">
          <Link href="/auth/forgot-password" className="text-sm text-gray-600 hover:text-burgundy-600 transition-colors duration-200 focus:outline-none focus:text-burgundy-600">
            Forgot your password?
          </Link>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-burgundy-700 hover:text-burgundy-900 font-medium transition-colors duration-200 focus:outline-none focus:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}