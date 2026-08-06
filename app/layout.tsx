import './globals.css'
import { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AuthProvider from '../components/providers/AuthProvider'
import MobileBottomNav from '../components/navigation/MobileBottomNav'
import PwaInstallPrompt from '../components/pwa/PwaInstallPrompt'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'CS2BD — Bangladesh CS2 Skins Marketplace',
    template: '%s | cs2bd',
  },
  description: 'Buy and sell CS2 skins securely in Bangladesh. Verified sellers, manual payment verification via bKash & Nagad, lowest prices guaranteed.',
  keywords: [
    'cs2 skins', 'csgo skins bangladesh', 'cs2 marketplace bd', 'buy skins bangladesh',
    'cs2 knife bangladesh', 'cs2 gloves bd', 'cs2 skin bKash', 'cs2 Nagad',
    'counter strike 2 bangladesh', 'cs2 trading bd', 'steam marketplace bangladesh',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'cs2bd',
  },
  openGraph: {
    title: 'CS2BD — Bangladesh CS2 Skins Marketplace',
    description: "Bangladesh's #1 CS2 skins marketplace — buy and sell skins securely with bKash & Nagad escrow protection.",
    url: baseUrl,
    siteName: 'cs2bd',
    type: 'website',
    locale: 'en_BD',
    images: [
      {
        url: '/og-cs2.png',
        width: 1200,
        height: 630,
        alt: 'CS2BD — Bangladesh CS2 Skins Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CS2BD — Bangladesh CS2 Skins Marketplace',
    description: "Bangladesh's #1 CS2 skins marketplace — buy and sell skins securely with bKash & Nagad escrow protection.",
    images: ['/og-cs2.png'],
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
  alternates: {
    canonical: baseUrl,
    types: {
      'application/rss+xml': `${baseUrl}/rss.xml`,
    },
  },
  verification: {
    google: undefined,
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="bg-[#09090b] text-white min-h-screen pb-16 md:pb-0 antialiased selection:bg-[#22c55e] selection:text-[#09090b]">
        <AuthProvider>
          <Navbar />
          <div className="pt-16 min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <MobileBottomNav />
          <PwaInstallPrompt />
        </AuthProvider>
      </body>
    </html>
  )
}
