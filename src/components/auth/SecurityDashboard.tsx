'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Smartphone, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Monitor,
  Key,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SecurityDashboardProps {
  userId: string;
  securityLevel: 'standard' | 'enhanced' | 'admin';
}

interface SecurityMetrics {
  twoFactorEnabled: boolean;
  lastLogin: string;
  failedAttempts: number;
  trustedDevices: number;
  sessionDuration: number;
  securityScore: number;
}

interface SecurityEvent {
  id: string;
  type: string;
  timestamp: string;
  device: string;
  location: string;
  success: boolean;
}

interface TrustedDevice {
  id: string;
  name: string;
  browser: string;
  os: string;
  lastUsed: string;
  current: boolean;
}

export function SecurityDashboard({ userId, securityLevel }: SecurityDashboardProps) {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
  }, [userId]);

  const fetchSecurityData = async () => {
    try {
      const [metricsRes, eventsRes, devicesRes] = await Promise.all([
        fetch(`/api/auth/security/metrics/${userId}`),
        fetch(`/api/auth/security/events/${userId}`),
        fetch(`/api/auth/security/devices/${userId}`)
      ]);

      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (devicesRes.ok) setDevices(await devicesRes.json());
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/auth/security/devices/${deviceId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDevices(prev => prev.filter(d => d.id !== deviceId));
      }
    } catch (error) {
      console.error('Failed to revoke device:', error);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEventIcon = (type: string, success: boolean) => {
    if (!success) return <XCircle className="h-4 w-4 text-red-500" />;
    
    switch (type) {
      case 'login': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case '2fa_used': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'password_changed': return <Key className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2">Loading security dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Security Score</p>
              <p className={`text-2xl font-bold ${getSecurityScoreColor(metrics?.securityScore || 0)}`}>
                {metrics?.securityScore || 0}%
              </p>
            </div>
            <Shield className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Two-Factor Auth</p>
              <p className="text-2xl font-bold">
                {metrics?.twoFactorEnabled ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Disabled
                  </Badge>
                )}
              </p>
            </div>
            <Smartphone className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trusted Devices</p>
              <p className="text-2xl font-bold">{metrics?.trustedDevices || 0}</p>
            </div>
            <Monitor className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed Attempts</p>
              <p className="text-2xl font-bold text-red-600">{metrics?.failedAttempts || 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Security Events
        </h3>
        
        <div className="space-y-3">
          {events.slice(0, 10).map((event) => (
            <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                {getEventIcon(event.type, event.success)}
                <div>
                  <p className="text-sm font-medium">
                    {event.type.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.device} • {event.location}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">{new Date(event.timestamp).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Trusted Devices */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Trusted Devices
        </h3>
        
        <div className="space-y-3">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {device.name}
                    {device.current && (
                      <Badge variant="default" className="text-xs">Current</Badge>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {device.browser} on {device.os}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last used: {new Date(device.lastUsed).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {!device.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => revokeDevice(device.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Security Recommendations */}
      {securityLevel === 'admin' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Recommendations
          </h3>
          
          <div className="space-y-3">
            {!metrics?.twoFactorEnabled && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    Two-Factor Authentication Required
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Admin accounts must have 2FA enabled for security compliance.
                  </p>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Enable 2FA
                </Button>
              </div>
            )}

            {(metrics?.failedAttempts || 0) > 5 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">
                    Multiple Failed Login Attempts
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Consider changing your password if you suspect unauthorized access attempts.
                  </p>
                </div>
              </div>
            )}

            {(metrics?.trustedDevices || 0) > 3 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <Monitor className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Review Trusted Devices
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    You have {metrics?.trustedDevices} trusted devices. Consider removing unused devices.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}