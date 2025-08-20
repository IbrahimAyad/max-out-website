'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initializeFacebookPixel, initializeFacebookSDK, trackPageView } from '@/lib/analytics/facebook-pixel'

export function FacebookPixelScript() {
  return (
    <>
      {/* Facebook Pixel Code */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1409898642574301');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1409898642574301&ev=PageView&noscript=1"
        />
      </noscript>
    </>
  )
}

export function FacebookPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize Facebook SDK and Pixel
    initializeFacebookSDK()
    initializeFacebookPixel()
  }, [])

  useEffect(() => {
    // Track page views on route change
    if (pathname) {
      trackPageView()
    }
  }, [pathname, searchParams])

  return null
}