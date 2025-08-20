'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | '2fa_enabled' | '2fa_used' | 'password_changed' | 'failed_login';
  timestamp: Date;
  device?: string;
  location?: string;
  ip?: string;
}

interface DeviceInfo {
  id: string;
  name: string;
  trusted: boolean;
  lastUsed: Date;
  browser: string;
  os: string;
}

interface UserProfile extends User {
  has_2fa?: boolean;
  is_admin?: boolean;
  requires_2fa?: boolean;
  security_level?: 'standard' | 'enhanced' | 'admin';
}

export function useEnhancedAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<DeviceInfo[]>([]);
  const [sessionTimeout, setSessionTimeout] = useState<number | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // Device fingerprinting
  const getDeviceFingerprint = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 2, 2);
    
    return btoa(JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL()
    }));
  }, []);

  // Initialize session monitoring
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
        await checkSecurityRequirements(profile);
        await trackSecurityEvent('login');
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
        await checkSecurityRequirements(profile);
      } else {
        setUser(null);
        setRequires2FA(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Session timeout management
  useEffect(() => {
    if (session && user?.security_level === 'admin') {
      const timeout = setTimeout(() => {
        showSessionTimeoutWarning();
      }, 25 * 60 * 1000); // 25 minutes for admin sessions (30 min total)

      setSessionTimeout(timeout);

      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [session, user]);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch(`/api/auth/profile/${userId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
    return null;
  };

  const checkSecurityRequirements = async (profile: UserProfile | null) => {
    if (!profile) return;

    // Check if user needs 2FA
    if (profile.security_level === 'admin' && !profile.has_2fa) {
      setRequires2FA(true);
      return;
    }

    // Check device trust
    const deviceId = getDeviceFingerprint();
    const trusted = await checkDeviceTrust(deviceId);
    
    if (!trusted && profile.security_level === 'admin') {
      await handleUntrustedDevice(deviceId);
    }
  };

  const checkDeviceTrust = async (deviceId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/device/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId })
      });
      
      const data = await response.json();
      return data.trusted || false;
    } catch {
      return false;
    }
  };

  const handleUntrustedDevice = async (deviceId: string) => {
    // This would typically trigger additional verification
    
    if (extendSession) {
      extendCurrentSession();
    } else {
      signOut();
    }
  };

  const extendCurrentSession = async () => {
    try {
      await fetch('/api/auth/extend-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Reset timeout
      if (sessionTimeout) clearTimeout(sessionTimeout);
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };

  const trackSecurityEvent = async (eventType: SecurityEvent['type'], metadata?: any) => {
    try {
      const deviceId = getDeviceFingerprint();
      
      await fetch('/api/auth/security-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: eventType,
          deviceId,
          metadata,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to track security event:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase client not available') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        await trackSecurityEvent('failed_login', { email, reason: error.message });
        return { data, error };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        
        // Check if user has 2FA enabled
        if (profile?.has_2fa) {
          setRequires2FA(true);
          return { data: { ...data, requires2FA: true }, error: null };
        }
        
        await trackSecurityEvent('login', { email });
      }

      return { data, error };
    } catch (error) {
      await trackSecurityEvent('failed_login', { email, reason: 'Network error' });
      return { data: null, error };
    }
  };

  const verify2FA = async (code: string, email: string) => {
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if (!response.ok) {
        throw new Error('Invalid 2FA code');
      }

      await trackSecurityEvent('2fa_used');
      setRequires2FA(false);
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const setup2FA = async () => {
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to setup 2FA');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error('Supabase client not available') };
    }

    await trackSecurityEvent('logout');
    
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setRequires2FA(false);
      if (sessionTimeout) clearTimeout(sessionTimeout);
      router.push('/');
    }
    return { error };
  };

  const getSecurityEvents = async (): Promise<SecurityEvent[]> => {
    try {
      const response = await fetch('/api/auth/security-events');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch security events:', error);
    }
    return [];
  };

  const getTrustedDevices = async (): Promise<DeviceInfo[]> => {
    try {
      const response = await fetch('/api/auth/devices');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch trusted devices:', error);
    }
    return [];
  };

  const revokeDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/auth/devices/${deviceId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTrustedDevices(prev => prev.filter(d => d.id !== deviceId));
      }
    } catch (error) {
      console.error('Failed to revoke device:', error);
    }
  };

  return {
    user,
    session,
    loading,
    requires2FA,
    securityEvents,
    trustedDevices,
    signIn,
    verify2FA,
    setup2FA,
    signOut,
    trackSecurityEvent,
    getSecurityEvents,
    getTrustedDevices,
    revokeDevice,
    extendCurrentSession
  };
}