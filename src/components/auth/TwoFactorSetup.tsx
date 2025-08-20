'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Copy, Check, AlertTriangle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface SetupData {
  qrCodeUrl: string;
  secret: string;
  backupCodes: string[];
}

export function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [backupCodesSaved, setBackupCodesSaved] = useState(false);

  useEffect(() => {
    initializeTwoFactor();
  }, []);

  const initializeTwoFactor = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to initialize 2FA setup');
      
      const data = await response.json();
      setSetupData(data);
    } catch (err) {
      setError('Failed to initialize 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/2fa/verify-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: verificationCode,
          secret: setupData?.secret 
        })
      });

      if (!response.ok) throw new Error('Invalid verification code');

      setStep('backup');
    } catch (err) {
      setError('Invalid code. Please check your authenticator app and try again.');
    } finally {
      setLoading(false);
    }
  };

  const completeTwoFactorSetup = async () => {
    if (!backupCodesSaved) {
      setError('Please confirm you have saved your backup codes');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to complete setup');

      onComplete();
    } catch (err) {
      setError('Failed to complete 2FA setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !setupData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2">Setting up Two-Factor Authentication...</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-semibold">Enable 2FA</h2>
        </div>
      </div>

      {step === 'setup' && setupData && (
        <>
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
            <div className="bg-white p-4 rounded-lg border inline-block">
              <QRCodeSVG value={setupData.qrCodeUrl} size={160} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or enter this code manually:
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                {setupData.secret}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(setupData.secret)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter verification code from your app:
            </label>
            <Input
              type="text"
              placeholder="6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={verifyCode} 
              disabled={loading || verificationCode.length !== 6}
              className="flex-1"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </div>
        </>
      )}

      {step === 'backup' && setupData && (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-gray-900">Save Your Backup Codes</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Store these backup codes in a safe place. You can use them to access your account if you lose your phone.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="grid grid-cols-2 gap-2">
                {setupData.backupCodes.map((code, index) => (
                  <code key={index} className="block bg-white px-2 py-1 rounded text-sm font-mono text-center">
                    {code}
                  </code>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => copyToClipboard(setupData.backupCodes.join('\n'))}
              className="w-full mb-4"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All Codes
            </Button>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={backupCodesSaved}
                onChange={(e) => setBackupCodesSaved(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">I have saved these backup codes in a secure location</span>
            </label>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <Button 
            onClick={completeTwoFactorSetup}
            disabled={!backupCodesSaved || loading}
            className="w-full"
          >
            {loading ? 'Completing Setup...' : 'Complete 2FA Setup'}
          </Button>
        </>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start gap-2">
          <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Recommended Authenticator Apps
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Google Authenticator</li>
              <li>• Authy</li>
              <li>• Microsoft Authenticator</li>
              <li>• 1Password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}