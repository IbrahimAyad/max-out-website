import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import redirectsConfig from '../301-redirects.json'

// Create redirect maps for faster lookups
const redirectMap = new Map<string, string>();
const patternRedirects: Array<{ pattern: RegExp; target: string }> = [];

// Initialize redirect mappings
redirectsConfig.redirects.forEach(category => {
  category.mappings.forEach(mapping => {
    if ('pattern' in mapping && mapping.pattern) {
      const pattern = new RegExp(mapping.old.replace('*', '.*'));
      patternRedirects.push({ pattern, target: mapping.new });
    } else {
      redirectMap.set(mapping.old, mapping.new);
    }
  });
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check for 301 redirects first
  if (redirectMap.has(pathname)) {
    const newUrl = redirectMap.get(pathname)!;
    return NextResponse.redirect(new URL(newUrl, request.url), 301);
  }
  
  // Check for pattern-based redirects
  for (const { pattern, target } of patternRedirects) {
    if (pattern.test(pathname)) {
      return NextResponse.redirect(new URL(target, request.url), 301);
    }
  }
  
  // Create response with CORS headers for image resources
  const requestHeaders = new Headers(request.headers)
  
  // Add CORS headers for R2 image domains
  requestHeaders.set('Access-Control-Allow-Origin', '*')
  requestHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  requestHeaders.set('Access-Control-Allow-Headers', 'Content-Type')
  
  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  
  // Add CSP headers to allow R2 images and necessary external resources
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "img-src 'self' data: blob: https://cdn.kctmenswear.com https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev https://pub-140b3d87a1b64af6a3193ba8aa685e26.r2.dev https://imagedelivery.net https://*.supabase.co https://*.railway.app https://images.unsplash.com; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://facebook.com https://www.facebook.com https://api.stripe.com https://*.railway.app https://cdn.kctmenswear.com;"
  )

  // Skip middleware if Supabase env vars are not available (during build)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ['/account', '/profile', '/orders']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Auth routes that should redirect if already logged in
  const authRoutes = ['/auth/login', '/auth/signup']
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to home if accessing auth routes with active session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}