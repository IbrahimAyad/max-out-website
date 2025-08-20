'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { primarySocialLinks } from '@/components/icons/SocialIcons'

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setIsSubscribing(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      toast.success('Successfully subscribed to newsletter!', {
        description: 'Thank you for joining our mailing list. Check your email for a welcome message!'
      })
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe', {
        description: 'Please try again later.'
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer id="footer" className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 md:mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-serif mb-4">KCT Menswear</h3>
            <p className="text-gray-400 mb-4">
              Elevate your style with premium men's formal wear. Quality craftsmanship since 1985.
            </p>
            <div className="flex gap-3">
              {primarySocialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gold transition-all duration-200 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black"
                    aria-label={`Follow us on ${link.name}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Shop All</Link></li>
              <li><Link href="/products/suits" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Suits</Link></li>
              <li><Link href="/weddings" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Weddings</Link></li>
              <li><Link href="/prom-collection" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Prom</Link></li>
              <li><Link href="/custom-suits" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Custom Suits</Link></li>
              <li><Link href="/alterations" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Alterations</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Contact</Link></li>
              <li><Link href="/locations" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Store Locations</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <p className="text-gray-400 mb-4">Subscribe for exclusive offers and new arrivals</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 pr-14 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black transition-all duration-200"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gold hover:bg-gold/90 text-black rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Subscribe to newsletter"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Customer Service</p>
              <a href="tel:269-342-1234" className="flex items-center gap-2 text-gold hover:text-gold/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black rounded-lg p-1 -m-1">
                <Phone className="w-4 h-4" />
                (269) 342-1234
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} KCT Menswear. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-gold transition-all duration-200 focus:outline-none focus:text-gold">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}