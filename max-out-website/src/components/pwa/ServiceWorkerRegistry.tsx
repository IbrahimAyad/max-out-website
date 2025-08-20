'use client';

import { useEffect, useState } from 'react';

export const ServiceWorkerRegistry = () => {
  // Fix hydration mismatch: Initialize with undefined, set in useEffect
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if service workers are supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // Set up online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      setRegistration(registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        }
      });

      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED') {
          setShowUpdate(true);
        }
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  };

  const handleUpdate = async () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const handleClearCache = async () => {
    if (registration) {
      registration.active?.postMessage({ type: 'CLEAR_CACHE' });
      window.location.reload();
    }
  };

  // Online/Offline Status Bar
  if (isOnline === false) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 px-4 z-50">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">You're offline</span>
        </div>
      </div>
    );
  }

  // Update Available Notification
  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white rounded-lg shadow-lg p-4 z-50 max-w-sm mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Update Available</p>
            <p className="text-xs opacity-90">A new version is ready to install</p>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    );
  }

  // Development controls (only in dev mode)
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white rounded-lg p-3 text-xs space-y-2 z-50">
        <div>SW: {registration ? '✅' : '❌'}</div>
        <div>Online: {isOnline ? '✅' : '❌'}</div>
        <button
          onClick={handleClearCache}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Clear Cache
        </button>
      </div>
    );
  }

  return null;
};