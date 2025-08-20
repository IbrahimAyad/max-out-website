import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers/Providers";
import { SmartChatLauncher } from "@/components/chat/SmartChatLauncher";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { SimpleCartDrawer } from "@/components/cart/SimpleCartDrawer";
import { StyleConsultantButton } from "@/components/style-consultant/VirtualStyleConsultant";
import { GoogleAnalytics, GoogleAnalyticsScript } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { FacebookPixel, FacebookPixelScript } from "@/components/analytics/FacebookPixel";
import { PostHogProvider, PostHogPageview } from "@/components/analytics/PostHogProvider";
// import { FacebookMessenger } from "@/components/chat/FacebookMessenger";
import { Suspense } from "react";
import { socialMediaSchema } from "./layout/social-schema";
import { SkipLinks } from "@/components/accessibility/SkipLinks";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import KillSW from "./_kill-sw";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#D4AF37'
};

export const metadata: Metadata = {
  title: "KCT Menswear - Premium Men's Formal Wear",
  description: "Elevate your style with premium men's formal wear and expert tailoring. Shop suits, wedding attire, and occasion-based bundles.",
  keywords: "mens suits, formal wear, wedding suits, tuxedos, dress shirts, tailoring, Detroit menswear",
  openGraph: {
    title: "KCT Menswear - Premium Men's Formal Wear",
    description: "Elevate your style with premium men's formal wear and expert tailoring",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KCT Menswear - Premium Men's Formal Wear",
      },
    ],
    locale: "en_US",
    siteName: "KCT Menswear",
  },
  twitter: {
    card: "summary_large_image",
    title: "KCT Menswear - Premium Men's Formal Wear",
    description: "Elevate your style with premium men's formal wear and expert tailoring",
    images: ["/og-image.jpg"],
    site: "@KCTMenswear",
    creator: "@KCTMenswear",
  },
  alternates: {
    canonical: "https://kctmenswear.com",
  },
  other: {
    "fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "",
    "pinterest-rich-pin": "true",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalyticsScript />
        <FacebookPixelScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(socialMediaSchema) }}
        />
      </head>
      <body className="antialiased">
        <SkipLinks />
        <KillSW />
        {/* <PostHogProvider> */}
          <Providers>
            <Navigation />
            <main id="main-content" className="pt-16 min-h-screen" role="main" aria-label="Main content">
              {children}
            </main>
            <Footer />
            <SmartChatLauncher />
            {/* <StyleConsultantButton /> */}
            <SimpleCartDrawer />
            <MobileBottomNav />
            <Suspense fallback={null}>
              {/* <PostHogPageview /> */}
              <GoogleAnalytics />
              <FacebookPixel />
            </Suspense>
            {/* <FacebookMessenger /> */}
            {process.env.NODE_ENV === 'development' && <AnalyticsDashboard />}
          </Providers>
        {/* </PostHogProvider> */}
      </body>
    </html>
  );
}
