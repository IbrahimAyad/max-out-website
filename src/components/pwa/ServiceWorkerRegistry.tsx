'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerRegistry - Currently DISABLED
 * 
 * This component was previously registering a service worker that was causing
 * critical issues including:
 * - FetchEvent.respondWith returning null errors
 * - Failed loading of external resources (Google Fonts, Stripe, Facebook)
 * - Image optimization failures
 * - ReferenceError issues in service worker code
 * 
 * The service worker is now disabled and any existing registrations are cleaned up.
 * This can be re-enabled later once the service worker is properly implemented.
 */
export const ServiceWorkerRegistry = () => {
  useEffect(() => {
    // Check if service workers are supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      console.log('🧹 Cleaning up service workers...');
      
      // Unregister all existing service workers
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          console.log('🗑️ Unregistering service worker:', registration.scope);
          registration.unregister();
        });
        
        if (registrations.length > 0) {
          console.log(`✅ Successfully unregistered ${registrations.length} service worker(s)`);
        } else {
          console.log('✅ No service workers found to unregister');
        }
      }).catch(error => {
        console.error('❌ Error while unregistering service workers:', error);
      });
    }
  }, []);

  // No UI needed - this is just for cleanup
  return null;
};

/**
 * TODO: When re-enabling service worker later:
 * 1. Fix the service worker file (/public/sw.js)
 * 2. Properly handle caching strategies
 * 3. Fix external resource loading
 * 4. Test thoroughly before re-enabling
 * 5. Restore the original registration logic
 */