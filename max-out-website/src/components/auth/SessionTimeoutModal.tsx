'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  timeRemaining: number; // in seconds
  onExtend: () => void;
  onLogout: () => void;
}

export function SessionTimeoutModal({ 
  isOpen, 
  timeRemaining, 
  onExtend, 
  onLogout 
}: SessionTimeoutModalProps) {
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    setCountdown(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (!isOpen || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onLogout(); // Auto-logout when countdown reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, countdown, onLogout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = () => {
    if (countdown <= 60) return 'text-red-600';
    if (countdown <= 180) return 'text-yellow-600';
    return 'text-blue-600';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-gray-200">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-2 rounded-full",
              countdown <= 60 ? "bg-red-100" : countdown <= 180 ? "bg-yellow-100" : "bg-blue-100"
            )}>
              {countdown <= 60 ? (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              ) : (
                <Shield className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Session Timeout Warning
              </h3>
              <p className="text-sm text-gray-600">
                Your session will expire soon due to inactivity
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center mb-6">
            <div className={cn(
              "text-4xl font-mono font-bold mb-2",
              getUrgencyColor()
            )}>
              {formatTime(countdown)}
            </div>
            <p className="text-sm text-gray-600">
              Your session will automatically end in the time shown above.
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 font-medium">
                  Enhanced Security Active
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Admin sessions automatically expire after 30 minutes of inactivity to protect your account.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onExtend}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={countdown <= 0}
            >
              <Shield className="h-4 w-4 mr-2" />
              Extend Session
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex-1"
            >
              Logout Now
            </Button>
          </div>

          {/* Auto-logout notice */}
          {countdown <= 60 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <p className="text-xs text-red-700 font-medium">
                  Warning: You will be automatically logged out when the timer reaches zero.
                </p>
              </div>
            </div>
          )}

          {/* Keyboard shortcut hint */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Space</kbd> to extend session
          </p>
        </div>
      </div>
    </>
  );
}

// Hook for keyboard shortcuts
export function useSessionTimeoutKeyboard(onExtend: () => void, isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        onExtend();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onExtend, isOpen]);
}