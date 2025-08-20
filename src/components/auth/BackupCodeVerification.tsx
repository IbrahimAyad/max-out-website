'use client';

import { useState } from 'react';
import { Key, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BackupCodeVerificationProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function BackupCodeVerification({ email, onSuccess, onBack }: BackupCodeVerificationProps) {
  const [backupCode, setBackupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyBackupCode = async () => {
    if (!backupCode.trim()) {
      setError('Please enter a backup code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/2fa/verify-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          backupCode: backupCode.replace(/\s+/g, '').toLowerCase()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid backup code');
      }

      onSuccess();
    } catch (err) {
      setError('Invalid backup code. Please check your saved codes and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifyBackupCode();
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Key className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-semibold">Use Backup Code</h2>
        </div>
        <p className="text-sm text-gray-600">
          Enter one of your saved backup codes
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="backup-code" className="block text-sm font-medium text-gray-700 mb-2">
            Backup Code
          </label>
          <Input
            id="backup-code"
            type="text"
            placeholder="Enter backup code"
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value)}
            onKeyPress={handleKeyPress}
            className="font-mono"
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
          onClick={verifyBackupCode}
          disabled={loading || !backupCode.trim()}
          className="w-full"
        >
          {loading ? 'Verifying...' : 'Verify Backup Code'}
        </Button>

        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full text-sm"
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to authenticator
        </Button>
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-amber-700 mb-1">
              <strong>Important:</strong> Each backup code can only be used once.
            </p>
            <p className="text-xs text-amber-700">
              Make sure to generate new backup codes after using this one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}