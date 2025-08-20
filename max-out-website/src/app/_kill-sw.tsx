'use client';
import { useEffect } from 'react';
export default function KillSW() {
  useEffect(() => {
    (async () => {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    })();
  }, []);
  return null;
}