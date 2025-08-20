"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/lib/hooks/useCart";
import { SmartSearchBar } from "@/components/search/SmartSearchBar";
import { InstantSearch } from "@/components/search/InstantSearch";
import { MegaMenu } from "./MegaMenu";
import UserMenu from "./UserMenu";
import MobileNavigation from "./MobileNavigation";
import EnhancedMobileNav from "./EnhancedMobileNav";
import ConversionOptimizedMobileNav from "../mobile/ConversionOptimizedMobileNav";
import { useStoreInfo } from "@/contexts/SettingsContext";
import { navigationConfig } from "@/lib/config/navigation-presets";
import { useUIStore } from "@/store/uiStore";

// Updated nav items with preset URLs
const navItems = [
  { href: "/products", label: "Shop All" },
  { href: "/search", label: "Search & Visual AI", highlight: false },
  { href: "/products?type=bundle", label: "Complete Looks", highlight: true },
  { href: "/products?category=suits", label: "Suits" },
  { href: "/products?category=shirts", label: "Dress Shirts" },
  { href: "/products?category=ties,bowties", label: "Ties & Bowties" },
  { href: "/products?preset=black-tie", label: "Black Tie" },
  { href: "/products?preset=wedding-guest", label: "Wedding" },
  { href: "/style-quiz", label: "Style Quiz" },
  { href: "/cart", label: "Cart", mobileOnly: true },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartSummary } = useCart();
  const storeInfo = useStoreInfo();
  const { setIsCartOpen } = useUIStore();

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
    <nav 
      id="navigation"
      className="luxury-header fixed top-0 w-full z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group"
            aria-label={`${storeInfo.name} - Home`}
          >
            {storeInfo.logo && storeInfo.logo !== '/KCTLogo.jpg' ? (
              <img 
                src={storeInfo.logo} 
                alt={storeInfo.name}
                className="h-8 w-auto transition-transform group-hover:scale-105"
              />
            ) : (
              <h1 className="logo-brand">
                <span className="logo-primary">
                  {storeInfo.name.split(' ')[0] || 'KCT'}
                </span>
                <span className="logo-secondary">
                  {storeInfo.name.split(' ')[1] || 'Menswear'}
                </span>
              </h1>
            )}
          </Link>

          {/* Desktop Navigation with MegaMenu */}
          <div className="hidden md:flex items-center">
            <MegaMenu />
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-all duration-200 group relative focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:ring-offset-2"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products (⌘K)"
            >
              <Search className="h-5 w-5 group-hover:text-burgundy transition-colors duration-200" />
              <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100">
                <div className="px-2 py-1 text-xs text-gray-600 bg-white rounded-md shadow-lg border border-gray-200">
                  ⌘K
                </div>
              </div>
            </button>
            <UserMenu />
            <Button 
              variant="ghost" 
              size="icon"
              className="relative hover:text-burgundy hover:bg-burgundy-50 transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:ring-offset-2"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping cart with ${cartSummary.itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartSummary.itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 h-5 w-5 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in shadow-md ring-2 ring-white"
                  style={{ backgroundColor: 'var(--burgundy)' }}
                >
                  {cartSummary.itemCount}
                </span>
              )}
            </Button>
            <Button 
              className="btn-burgundy px-6 py-2.5 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:ring-offset-2"
              aria-label="Book an appointment for custom fitting"
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-burgundy-50 hover:text-burgundy transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:ring-offset-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {/* Conversion-Optimized Mobile Navigation - Latest Version */}
      <ConversionOptimizedMobileNav 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
      {/* Previous versions for A/B testing */}
      {/* <EnhancedMobileNav 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      /> */}
      {/* <MobileNavigation 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      /> */}
    </nav>
    
    {/* Instant Search */}
    <InstantSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    
    {/* Cart Drawer is now handled by SimpleCartDrawer in layout.tsx using global UI store */}
    </>
  );
}