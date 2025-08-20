'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Package, Heart, User, CreditCard, MapPin, LogOut, Sparkles, ArrowRight } from 'lucide-react'

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirectTo=/account')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const accountSections = [
    {
      title: 'Order History',
      description: 'View and track your orders',
      href: '/orders',
      icon: Package,
    },
    {
      title: 'Wishlist',
      description: 'Items you\'ve saved for later',
      href: '/account/wishlist',
      icon: Heart,
    },
    {
      title: 'Profile Settings',
      description: 'Manage your personal information',
      href: '/account/profile',
      icon: User,
    },
    {
      title: 'Payment Methods',
      description: 'Manage your payment options',
      href: '/account/payment',
      icon: CreditCard,
    },
    {
      title: 'Addresses',
      description: 'Manage your shipping addresses',
      href: '/account/addresses',
      icon: MapPin,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Enhanced Profile Banner */}
        <Link href="/profile-enhanced" className="block mb-8">
          <div className="bg-gradient-to-r from-burgundy to-burgundy-dark rounded-lg shadow-lg p-4 sm:p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-0.5 sm:mb-1">✨ New! Enhanced Profile Experience</h2>
                  <p className="text-white/90 text-sm sm:text-base">Advanced features, luxury interface, and personalized style management</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform ml-auto sm:ml-0" />
            </div>
          </div>
        </Link>

        {/* Account Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountSections.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.href}
                href={section.href}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 group-hover:text-black">
                      {section.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Recent Orders Preview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-black hover:underline">
              View all
            </Link>
          </div>
          <p className="text-gray-600 text-sm">
            No orders yet. Start shopping to see your order history here.
          </p>
        </div>
      </div>
    </div>
  )
}