'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trackLogin, trackFormStart, trackFormSubmit } from '@/lib/analytics/google-analytics';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { TwoFactorVerification } from './TwoFactorVerification';
import { BackupCodeVerification } from './BackupCodeVerification';

type LoginStep = 'credentials' | '2fa' | 'backup';

export default function EnhancedLoginForm() {
  const [step, setStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, verify2FA, trackSecurityEvent } = useEnhancedAuth();
  const router = useRouter();

  // Track form start when user begins typing
  useEffect(() => {
    if (email || password) {
      trackFormStart('enhanced_login_form');
    }
  }, [email, password]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Track form submission
    trackFormSubmit('enhanced_login_form');
    
    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        setError(result.error.message);
        await trackSecurityEvent('failed_login', { email, reason: result.error.message });
      } else if (result.data?.requires2FA) {
        // User needs 2FA verification
        setStep('2fa');
      } else {
        // Login successful
        trackLogin('email');
        await trackSecurityEvent('login', { email });
        router.push('/admin');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      await trackSecurityEvent('failed_login', { email, reason: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handle2FASuccess = async () => {
    trackLogin('email_2fa');
    await trackSecurityEvent('2fa_used');
    router.push('/admin');
  };

  const handle2FABack = () => {
    setStep('credentials');
    setEmail('');
    setPassword('');
  };

  const handleUseBackupCode = () => {
    setStep('backup');
  };

  const handleBackupSuccess = async () => {
    trackLogin('email_backup');
    await trackSecurityEvent('2fa_used', { method: 'backup_code' });
    router.push('/admin');
  };

  const handleBackupBack = () => {
    setStep('2fa');
  };

  // Render based on current step
  if (step === '2fa') {
    return (
      <TwoFactorVerification
        email={email}
        onSuccess={handle2FASuccess}
        onBack={handle2FABack}
        onUseBackupCode={handleUseBackupCode}
      />
    );
  }

  if (step === 'backup') {
    return (
      <BackupCodeVerification
        email={email}
        onSuccess={handleBackupSuccess}
        onBack={handleBackupBack}
      />
    );
  }

  // Default credentials form
  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-600">
              {error}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="text-center space-y-2">
          <Link href="/auth/forgot-password" className="text-sm text-gray-600 hover:underline">
            Forgot your password?
          </Link>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-black hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-700">
          <strong>Enhanced Security:</strong> Admin accounts require two-factor authentication. 
          Your login activity is monitored for security purposes.
        </p>
      </div>
    </div>
  );
}