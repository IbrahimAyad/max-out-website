'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { User, ChevronDown, Heart, Sparkles } from 'lucide-react'

export default function UserMenu() {
  const { user, signOut, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    )
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
          {user.email?.[0].toUpperCase()}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-1 py-1">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
            >
              My Account
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
            >
              Order History
            </Link>
            <Link
              href="/account/wishlist"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
            >
              <Heart className="w-4 h-4 mr-2" />
              My Wishlist
            </Link>
            <Link
              href="/account/profile"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
            >
              Profile Settings
            </Link>
            <Link
              href="/profile-enhanced"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors bg-gradient-to-r from-burgundy/5 to-burgundy/10 text-burgundy font-medium"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Enhanced Profile
            </Link>
          </div>
          <div className="px-1 py-1">
            <button
              onClick={() => {
                signOut()
                setIsOpen(false)
              }}
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-left"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}