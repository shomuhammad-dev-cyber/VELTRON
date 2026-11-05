// ==============================================================================
// VELTRON ROOT LAYOUT & HTML SHELL
// The Future of Finance — Futuristic AI Finance
// ==============================================================================

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SmoothScrollProvider } from '@/components/animations/SmoothScrollProvider';
import { I18nProvider } from '@/lib/i18n/LanguageContext';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'VELTRON',
    'The Future of Finance',
    'FinTech',
    'Horology',
    'Artificial Intelligence',
    'Cryptocurrency',
    'Smart Banking',
    'Virtual Trading',
    'Quantitative Analytics',
    'Personal Finance',
  ],
  authors: [{ name: 'VELTRON Technologies Inc.' }],
  creator: 'VELTRON',
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#07090E',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" dir="ltr" className="dark" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#120A08] font-sans antialiased text-[#E9DFCE] min-h-screen relative overflow-x-hidden selection:bg-[#C6A477]/30 selection:text-[#FAF7F1]" suppressHydrationWarning>
        {/* Cinematic Vignette Ambient Light with Italian Elegance & Bespoke Royal Luxury Warmth */}
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" suppressHydrationWarning>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#C6A477]/12 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -left-40 w-[650px] h-[650px] bg-[#54252D]/18 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#30201A]/15 rounded-full blur-[160px]" />
        </div>

        <I18nProvider>
          <SmoothScrollProvider>
            <div className="relative z-10 flex flex-col min-h-screen">
              {children}
            </div>
          </SmoothScrollProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
