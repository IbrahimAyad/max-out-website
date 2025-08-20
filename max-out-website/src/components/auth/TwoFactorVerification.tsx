'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TwoFactorVerificationProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
  onUseBackupCode: () => void;
}

export function TwoFactorVerification({ email, onSuccess, onBack, onUseBackupCode }: TwoFactorVerificationProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const verifyCode = async () => {
    if (!code.trim() || code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          code 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      onSuccess();
    } catch (err) {
      setAttempts(prev => prev + 1);
      
      if (attempts >= 2) {
        setError('Too many failed attempts. Please use a backup code or try again later.');
      } else {
        setError('Invalid code. Please check your authenticator app and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifyCode();
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
        </div>
        <p className="text-sm text-gray-600">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="2fa-code" className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <Input
            id="2fa-code"
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyPress={handleKeyPress}
            className="text-center text-lg tracking-widest"
            maxLength={6}
            autoComplete="one-time-code"
            autoFocus
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <Button
          onClick={verifyCode}
          disabled={loading || code.length !== 6}
          className="w-full"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </Button>

        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={onUseBackupCode}
            className="w-full text-sm"
            disabled={loading}
          >
            Use backup code instead
          </Button>

          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full text-sm"
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-700">
          <strong>Having trouble?</strong> Make sure your device time is synced and try refreshing your authenticator app.
        </p>
      </div>
    </div>
  );
}