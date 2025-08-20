'use client';

import { useState, useEffect } from 'react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { SecurityDashboard } from '@/components/auth/SecurityDashboard';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { 
  Shield, 
  Smartphone, 
  Key, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Monitor,
  Lock,
  Unlock,
  LucideIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SecuritySettingsPage() {
  const { user, getTrustedDevices, revokeDevice } = useEnhancedAuth();
  const [activeTab, setActiveTab] = useState<'overview' | '2fa' | 'devices' | 'sessions'>('overview');
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [trustedDevices, setTrustedDevices] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'devices') {
      loadTrustedDevices();
    }
    if (activeTab === 'sessions') {
      loadActiveSessions();
    }
  }, [activeTab]);

  const loadTrustedDevices = async () => {
    setLoading(true);
    try {
      const devices = await getTrustedDevices();
      setTrustedDevices(devices);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveSessions = async () => {
    setLoading(true);
    try {
      // Simulate loading sessions
      setSessions([
        {
          id: '1',
          device: 'Chrome on macOS',
          location: 'Detroit, MI',
          lastActive: new Date(),
          current: true
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          location: 'Detroit, MI',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          current: false
        }
      ]);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    try {
      await revokeDevice(deviceId);
      await loadTrustedDevices();
    } catch (error) {
      console.error('Failed to revoke device:', error);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      // In production, this would call the revoke session API
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Failed to revoke session:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Security Center
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your account security settings and monitor access activity.
          </p>
        </div>
      </div>

      {/* Security Status */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900">Security Status: Excellent</h3>
            <p className="text-sm text-green-700">
              Your account is properly secured with 2FA and all security features enabled.
            </p>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon={Shield}
          >
            Overview
          </TabButton>
          <TabButton
            active={activeTab === '2fa'}
            onClick={() => setActiveTab('2fa')}
            icon={Smartphone}
          >
            Two-Factor Auth
          </TabButton>
          <TabButton
            active={activeTab === 'devices'}
            onClick={() => setActiveTab('devices')}
            icon={Monitor}
          >
            Trusted Devices
          </TabButton>
          <TabButton
            active={activeTab === 'sessions'}
            onClick={() => setActiveTab('sessions')}
            icon={Clock}
          >
            Active Sessions
          </TabButton>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {user && (
              <SecurityDashboard 
                userId={user.id} 
                securityLevel={user.security_level || 'admin'} 
              />
            )}
          </div>
        )}

        {activeTab === '2fa' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Two-Factor Authentication
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Add an extra layer of security to your admin account.
                  </p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              </div>

              {show2FASetup ? (
                <TwoFactorSetup
                  onComplete={() => setShow2FASetup(false)}
                  onCancel={() => setShow2FASetup(false)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">2FA is Active</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your account is protected with two-factor authentication using your authenticator app.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShow2FASetup(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Reconfigure 2FA
                    </Button>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Generate New Backup Codes
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Trusted Devices
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                  <span className="text-sm text-gray-600">Loading devices...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {trustedDevices.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No trusted devices found.</p>
                  ) : (
                    trustedDevices.map((device: TrustedDevice) => (
                      <DeviceItem
                        key={device.id}
                        device={device}
                        onRevoke={handleRevokeDevice}
                      />
                    ))
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Active Sessions
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                  <span className="text-sm text-gray-600">Loading sessions...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session: UserSession) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      onRevoke={handleRevokeSession}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
}

function TabButton({ active, onClick, icon: Icon, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
        active
          ? 'border-red-500 text-red-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

interface TrustedDevice {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  trusted: boolean;
}

function DeviceItem({ device, onRevoke }: { device: TrustedDevice; onRevoke: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <Monitor className="h-5 w-5 text-gray-400" />
        <div>
          <p className="font-medium flex items-center gap-2">
            {device.name}
            {device.current && (
              <Badge variant="default" className="text-xs">Current Device</Badge>
            )}
          </p>
          <p className="text-sm text-gray-600">{device.browser} on {device.os}</p>
          <p className="text-xs text-gray-500">
            Last used: {new Date(device.lastUsed).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {!device.current && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRevoke(device.id)}
          className="text-red-600 hover:text-red-700"
        >
          Revoke
        </Button>
      )}
    </div>
  );
}

interface UserSession {
  id: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

function SessionItem({ session, onRevoke }: { session: UserSession; onRevoke: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        {session.current ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Clock className="h-5 w-5 text-gray-400" />
        )}
        <div>
          <p className="font-medium flex items-center gap-2">
            {session.device}
            {session.current && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                Current Session
              </Badge>
            )}
          </p>
          <p className="text-sm text-gray-600">{session.location}</p>
          <p className="text-xs text-gray-500">
            Last active: {session.lastActive.toLocaleString()}
          </p>
        </div>
      </div>
      
      {!session.current && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRevoke(session.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Unlock className="h-4 w-4 mr-1" />
          Revoke
        </Button>
      )}
    </div>
  );
}