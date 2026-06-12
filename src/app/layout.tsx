import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AuthProvider } from '@/components/layout/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIChatbot from '@/components/shared/AIChatbot';
import PWARegister from '@/components/layout/PWARegister';
import CookieBanner from '@/components/layout/CookieBanner';
import ScrollToTop from '@/components/shared/ScrollToTop';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://leanverse.vercel.app'),
  title: {
    default: 'LeanVerse | Best AI Nutrition & Workout Planner',
    template: '%s | LeanVerse',
  },
  description: 'LeanVerse is your ultimate AI-powered personal fitness tracking, diet planning, and gamified workout leveling system. Transform your body with LeanVerse AI.',
  applicationName: 'LeanVerse',
  authors: [{ name: 'LeanVerse Team', url: 'https://leanverse.vercel.app' }],
  creator: 'LeanVerse',
  publisher: 'LeanVerse',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  keywords: ['Workout Tracker', 'Progressive Overload Tracker', 'Food Tracker', 'AI Diet Planner', 'Calorie Calculator', 'BMI Calculator', 'TDEE Calculator', 'LeanVerse', 'LeanVerse AI', 'Leanverse fitness tracker', 'Leanverse workout planner', 'macro breakdown', 'custom gym plans', 'Indian diet plans'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'LeanVerse - Transform Your Body with AI',
    description: 'Smart AI-powered diet plans, progressive overload trackers, and dynamic BMR/TDEE calculations designed for sustainable health on LeanVerse.',
    url: 'https://leanverse.vercel.app',
    siteName: 'LeanVerse',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'LeanVerse AI Fitness Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeanVerse | Best AI Nutrition & Workout Planner',
    description: 'Transform your body with LeanVerse AI-powered workout & diet plans.',
    creator: '@leanverse',
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=630&fit=crop'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth scroll-pt-24`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LeanVerse" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <Script
          id="adsense-init"
          strategy="lazyOnload"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-0000000000000000'}`}
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground">
        <Script
          id="structured-data-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "LeanVerse",
              "url": "https://leanverse.vercel.app",
              "logo": "https://leanverse.vercel.app/icon.svg",
              "sameAs": [
                "https://twitter.com/leanverse",
                "https://github.com/leanverse"
              ]
            })
          }}
        />
        <Script
          id="structured-data-app"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "LeanVerse Fitness Platform",
              "operatingSystem": "Web, iOS, Android",
              "applicationCategory": "HealthApplication",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1250"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            {/* Visual background glows - properly contained to prevent scrollbars */}
            <div className="fixed inset-0 z-[-50] overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px]" />
              <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
            </div>

            <Navbar />
            <main className="flex-1 pt-20 lg:pt-24 pb-4">
              {children}
            </main>
            <Footer />
            <AIChatbot />
            <PWARegister />
            <CookieBanner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
