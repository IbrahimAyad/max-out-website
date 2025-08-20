// Global type declarations to fix missing types

declare module '@supabase/functions-js';
declare module '@supabase/realtime-js';

// Extend Window interface for any custom properties
interface Window {
  gtag?: Function;
  dataLayer?: any[];
  fbq?: Function;
  _fbq?: Function;
}

// Add any type for problematic imports
declare module '*';

// Fix for Next.js typed routes
declare module 'next/navigation' {
  export function useRouter(): {
    push: (href: string | any) => void;
    replace: (href: string | any) => void;
    prefetch: (href: string | any) => void;
    back: () => void;
    refresh: () => void;
  };
}
