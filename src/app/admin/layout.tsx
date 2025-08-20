'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { Navigation } from '@/components/layout/Navigation';
import { Shield, Settings, Users, BarChart3, Package, LucideIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, requires2FA } = useEnhancedAuth();
  const [showSecuritySetup, setShowSecuritySetup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Redirect non-authenticated users
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Check if user is admin
      if (user.security_level !== 'admin') {
        router.push('/');
        return;
      }

      // Show 2FA setup if required
      if (requires2FA) {
        setShowSecuritySetup(true);
      }
    }
  }, [user, loading, requires2FA, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2">Verifying security credentials...</span>
      </div>
    );
  }

  // Show login redirect
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Admin Access Required</h1>
          <p className="text-gray-600 mb-4">Please log in to access the admin panel.</p>
          <Link
            href="/auth/login"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Show security setup if required
  if (showSecuritySetup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Security Setup Required</h1>
            <p className="text-gray-600 mt-2">
              Admin accounts require two-factor authentication for security compliance.
            </p>
          </div>
          
          <TwoFactorSetup
            onComplete={() => {
              setShowSecuritySetup(false);
              window.location.reload(); // Refresh to update auth state
            }}
            onCancel={() => router.push('/')}
          />
        </div>
      </div>
    );
  }

  // Show admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-600" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Secure Access
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Welcome,</span>
              <span className="text-sm font-medium text-gray-900">
                {user.email?.split('@')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            <AdminNavLink href="/admin" icon={BarChart3}>Dashboard</AdminNavLink>
            <AdminNavLink href="/admin/agents" icon={Users}>AI Agents</AdminNavLink>
            <AdminNavLink href="/admin/bundle-generator" icon={Package}>Bundles</AdminNavLink>
            <AdminNavLink href="/admin/auto-tagging" icon={Settings}>Auto Tagging</AdminNavLink>
            <AdminNavLink href="/admin/security" icon={Shield}>Security</AdminNavLink>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

interface AdminNavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

function AdminNavLink({ href, icon: Icon, children }: AdminNavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}