'use client';

import { EnhancedPromGroupBuilder } from '@/components/prom/EnhancedPromGroupBuilder';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PromGroupBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-purple-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/prom" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Prom Central
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="py-12">
        <EnhancedPromGroupBuilder />
      </div>
    </div>
  );
}