'use client';

import { AgentMonitor } from '@/components/admin/AgentMonitor';

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent System Management</h1>
          <p className="mt-2 text-gray-600">
            Monitor and control the autonomous agent system that continuously maintains and improves your site.
          </p>
        </div>
        
        <AgentMonitor />
      </div>
    </div>
  );
}