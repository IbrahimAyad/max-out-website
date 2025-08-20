'use client';

import { useEffect, useState } from 'react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { SecurityDashboard } from '@/components/auth/SecurityDashboard';
import { 
  Shield, 
  Users, 
  ShoppingCart, 
  Package,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface AdminStats {
  totalOrders: number;
  totalProducts: number;
  activeUsers: number;
  securityAlerts: number;
  revenue: number;
  conversionRate: number;
}

export default function AdminDashboard() {
  const { user } = useEnhancedAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Simulate fetching admin statistics
      // In production, this would call your actual analytics API
      setTimeout(() => {
        setStats({
          totalOrders: 1247,
          totalProducts: 892,
          activeUsers: 156,
          securityAlerts: 3,
          revenue: 87650,
          conversionRate: 3.2
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin</h1>
        <p className="text-red-100">
          Manage your KCT Menswear store with enhanced security and AI-powered tools.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Orders"
          value={stats?.totalOrders.toLocaleString() || '0'}
          icon={ShoppingCart}
          trend="+12%"
          trendUp={true}
        />
        <MetricCard
          title="Products"
          value={stats?.totalProducts.toLocaleString() || '0'}
          icon={Package}
          trend="+5%"
          trendUp={true}
        />
        <MetricCard
          title="Active Users"
          value={stats?.activeUsers.toLocaleString() || '0'}
          icon={Users}
          trend="+8%"
          trendUp={true}
        />
        <MetricCard
          title="Security Alerts"
          value={stats?.securityAlerts.toString() || '0'}
          icon={AlertTriangle}
          trend="-2"
          trendUp={false}
          alert={Boolean(stats?.securityAlerts && stats.securityAlerts > 0)}
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            href="/admin/bundle-generator"
            title="Generate Bundles"
            description="Create AI-powered product bundles"
            icon={Package}
          />
          <QuickActionCard
            href="/admin/agents"
            title="AI Agents"
            description="Monitor and manage AI agents"
            icon={Users}
          />
          <QuickActionCard
            href="/admin/auto-tagging"
            title="Auto Tagging"
            description="Manage product auto-tagging"
            icon={Shield}
          />
          <QuickActionCard
            href="/admin/security"
            title="Security Center"
            description="View security settings"
            icon={Shield}
          />
        </div>
      </Card>

      {/* Security Dashboard Integration */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Overview
        </h2>
        {user && (
          <SecurityDashboard 
            userId={user.id} 
            securityLevel={user.security_level || 'admin'} 
          />
        )}
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          <ActivityItem
            icon={CheckCircle}
            title="Bundle generated successfully"
            time="2 minutes ago"
            type="success"
          />
          <ActivityItem
            icon={Shield}
            title="Security scan completed"
            time="15 minutes ago"
            type="info"
          />
          <ActivityItem
            icon={Package}
            title="New products auto-tagged"
            time="1 hour ago"
            type="success"
          />
          <ActivityItem
            icon={AlertTriangle}
            title="Failed login attempt detected"
            time="2 hours ago"
            type="warning"
          />
        </div>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  alert?: boolean;
}

function MetricCard({ title, value, icon: Icon, trend, trendUp, alert }: MetricCardProps) {
  return (
    <Card className={`p-4 ${alert ? 'border-red-200 bg-red-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${alert ? 'text-red-600' : ''}`}>
            {value}
          </p>
          {trend && (
            <p className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${alert ? 'text-red-400' : 'text-gray-400'}`} />
      </div>
    </Card>
  );
}

interface QuickActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

function QuickActionCard({ href, title, description, icon: Icon }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start gap-3">
          <Icon className="h-6 w-6 text-red-600 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}

function ActivityItem({ icon: Icon, title, time, type }: ActivityItemProps) {
  const colors = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className={`h-5 w-5 ${colors[type]}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}