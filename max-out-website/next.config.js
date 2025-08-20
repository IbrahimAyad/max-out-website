const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://js.stripe.com
    https://www.googletagmanager.com
    https://connect.facebook.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob:
    https://cdn.kctmenswear.com
    https://imagedelivery.net
    https://*.supabase.co
    https://*.railway.app
    https://images.unsplash.com
    https://www.facebook.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self'
    https://*.supabase.co
    wss://*.supabase.co
    https://www.google-analytics.com
    https://analytics.google.com
    https://www.facebook.com
    https://connect.facebook.net
    https://api.stripe.com
    https://js.stripe.com
    https://*.railway.app
    https://cdn.kctmenswear.com
    https://fonts.googleapis.com
    https://fonts.gstatic.com;
  frame-src 'self' https://js.stripe.com https://connect.facebook.net;
  base-uri 'self';
  form-action 'self';
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ];
  },

  // Temporary safety net while Express server file is excluded
  typescript: {
    ignoreBuildErrors: true
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.kctmenswear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

module.exports = nextConfig;