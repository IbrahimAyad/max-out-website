"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sparkles, Calendar, Users, Video, BookOpen, Palette } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

interface MegaMenuProps {
  className?: string
}

const menuStructure = {
  collections: {
    title: 'Collections',
    sections: [
      {
        title: 'Suits & Tuxedos',
        items: [
          { href: '/products/suits', label: 'All Suits', badge: null },
          { href: '/products/suits/tuxedos', label: 'Tuxedos', badge: null },
          { href: '/custom-suits', label: 'Custom Suits', badge: 'NEW' },
          { href: '/collections/three-piece', label: 'Three Piece Suits', badge: null },
          { href: '/collections/double-breasted', label: 'Double Breasted', badge: null }
        ]
      },
      {
        title: 'Accessories',
        items: [
          { href: '/collections/ties', label: 'Ties & Bowties', badge: null },
          { href: '/collections/dress-shirts', label: 'Dress Shirts', badge: 'SALE' },
          { href: '/collections/cufflinks', label: 'Cufflinks', badge: null },
          { href: '/collections/pocket-squares', label: 'Pocket Squares', badge: null },
          { href: '/collections/belts', label: 'Belts & Suspenders', badge: null }
        ]
      },
      {
        featured: {
          title: 'Featured Collection',
          image: '/placeholder-suit.jpg',
          href: '/collections/new-arrivals',
          label: 'New Arrivals',
          description: 'Discover our latest styles'
        }
      }
    ]
  },
  occasions: {
    title: 'Occasions',
    sections: [
      {
        title: 'Wedding',
        icon: <Users className="h-5 w-5 text-burgundy" />,
        items: [
          { href: '/weddings', label: 'Wedding Collection', badge: null },
          { href: '/weddings/collections', label: 'Wedding Styles', badge: null },
          { href: '/weddings/coordination', label: 'Group Coordination', badge: null },
          { href: '/wedding-guide', label: 'Wedding Guide', badge: null },
          { href: '/weddings/video-lookbook', label: 'Video Lookbook', badge: 'NEW', icon: <Video className="h-3 w-3" /> }
        ]
      },
      {
        title: 'Prom',
        icon: <Sparkles className="h-5 w-5 text-burgundy" />,
        items: [
          { href: '/prom', label: 'Prom Collection', badge: 'HOT' },
          { href: '/prom/guides', label: 'Style Guides', badge: null },
          { href: '/prom/videos', label: 'Prom Videos', badge: null, icon: <Video className="h-3 w-3" /> },
          { href: '/prom-collection', label: 'Style Gallery', badge: null },
          { href: '/prom/group-discounts', label: 'Group Discounts', badge: null }
        ]
      },
      {
        title: 'Other Events',
        icon: <Calendar className="h-5 w-5 text-burgundy" />,
        items: [
          { href: '/occasions/cocktail', label: 'Cocktail Events', badge: null },
          { href: '/occasions/business', label: 'Business Formal', badge: null },
          { href: '/occasions/black-tie', label: 'Black Tie', badge: null },
          { href: '/occasions/wedding-party', label: 'Wedding Party', badge: null }
        ]
      }
    ]
  },
  services: {
    title: 'Services & Tools',
    sections: [
      {
        title: 'Style Tools',
        icon: <Palette className="h-5 w-5 text-burgundy" />,
        items: [
          { href: '/atelier-ai', label: 'Atelier AI Hub', badge: 'NEW' },
          { href: '/style-quiz', label: "Stylin' Profilin'", badge: 'AI' },
          { href: '/builder', label: '3D Suit Builder', badge: 'NEW' },
          { href: '/voice-search', label: 'Voice Search', badge: null },
          { href: '/color-matcher', label: 'Color Matcher', badge: null }
        ]
      },
      {
        title: 'Resources',
        icon: <BookOpen className="h-5 w-5 text-burgundy" />,
        items: [
          { href: '/size-guide', label: 'Size Guide', badge: null },
          { href: '/care-instructions', label: 'Care Instructions', badge: null },
          { href: '/style-tips', label: 'Style Tips', badge: null },
          { href: '/appointment', label: 'Book Appointment', badge: null }
        ]
      }
    ]
  }
}

export function MegaMenu({ className }: MegaMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (menu: string) => {
    setActiveMenu(menu)
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!isHovering) {
        setActiveMenu(null)
      }
    }, 100)
  }

  const closeMenu = () => {
    setActiveMenu(null)
    setIsHovering(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close menu when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <nav className={cn("relative", className)} ref={menuRef}>
      <div className="flex items-center space-x-8">
        {Object.entries(menuStructure).map(([key, menu]) => (
          <div
            key={key}
            className="relative"
            onMouseEnter={() => handleMouseEnter(key)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                "hover:text-burgundy",
                activeMenu === key && "text-burgundy"
              )}
            >
              {menu.title}
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                activeMenu === key && "rotate-180"
              )} />
            </button>

            <AnimatePresence>
              {activeMenu === key && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full pt-2 z-50"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => {
                    setIsHovering(false)
                    handleMouseLeave()
                  }}
                >
                  <div className="bg-white rounded-lg shadow-2xl border border-gray-100 p-6 min-w-[600px]">
                    <div className="grid grid-cols-3 gap-6">
                      {menu.sections.map((section, idx) => (
                        <div key={idx}>
                          {section.featured ? (
                            <Link
                              href={section.featured.href}
                              className="block group"
                              onClick={closeMenu}
                            >
                              <div className="relative h-48 mb-3 overflow-hidden rounded-lg">
                                <Image
                                  src={section.featured.image}
                                  alt={section.featured.label}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                  <h4 className="font-semibold mb-1">{section.featured.label}</h4>
                                  <p className="text-sm opacity-90">{section.featured.description}</p>
                                </div>
                              </div>
                            </Link>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-3">
                                {section.icon}
                                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                              </div>
                              <ul className="space-y-2">
                                {section.items.map((item) => (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      className="flex items-center justify-between text-sm text-gray-600 hover:text-burgundy transition-colors py-1"
                                      onClick={closeMenu}
                                    >
                                      <span className="flex items-center gap-1">
                                        {item.icon}
                                        {item.label}
                                      </span>
                                      {item.badge && (
                                        <span className={cn(
                                          "text-xs px-2 py-0.5 rounded-full font-medium",
                                          item.badge === 'NEW' && "bg-burgundy text-white",
                                          item.badge === 'HOT' && "bg-red-500 text-white",
                                          item.badge === 'SALE' && "bg-gold text-black",
                                          item.badge === 'AI' && "bg-gradient-to-r from-burgundy to-purple-600 text-white"
                                        )}>
                                          {item.badge}
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTA */}
                    {key === 'occasions' && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Need help choosing? Try our AI-powered style finder
                          </p>
                          <Link
                            href="/style-quiz"
                            className="text-sm font-medium text-burgundy hover:text-burgundy-700 transition-colors"
                            onClick={closeMenu}
                          >
                            Take the Quiz →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </nav>
  )
}