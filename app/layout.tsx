import './globals.css'
import { ReactNode } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AuthProvider from '../components/providers/AuthProvider'
import MobileBottomNav from '../components/navigation/MobileBottomNav'
import PwaInstallPrompt from '../components/pwa/PwaInstallPrompt'
import NotificationBar from '../components/layout/NotificationBar'

export const metadata = {
  title: {
    default: 'CS2BD — Bangladesh CS2 Skins Marketplace',
    template: '%s | cs2bd',
  },
  description: 'Buy and sell CS2 skins securely in Bangladesh. Verified sellers, manual payment verification, lowest prices.',
  keywords: ['cs2 skins', 'csgo skins bangladesh', 'cs2 marketplace bd', 'buy skins bangladesh'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'cs2bd',
  },
  openGraph: {
    title: 'CS2BD — CS2 Skins Marketplace',
    description: "Bangladesh's #1 CS2 skins marketplace",
    type: 'website',
    locale: 'en_BD',
  },
}

export const viewport = {
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
          <NotificationBar />
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

