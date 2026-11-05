// ==============================================================================
// VALIXEN TELEGRAM MINI APP (TMA) LAYOUT
// Viewport, Safe Area, Official Telegram WebApp SDK Script & Dark Theme
// ==============================================================================

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Valixen Sovereign Terminal — Telegram Mini App',
  description: 'Autonomous AI wealth management, paper trading, and real-time sovereign telemetry inside Telegram.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Valixen TMA',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07090E',
};

export default function TelegramMiniAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090E] text-white overflow-x-hidden select-none font-sans antialiased">
      {/* Official Telegram WebApp JavaScript SDK */}
      <script src="https://telegram.org/js/telegram-web-app.js" async />
      {children}
    </div>
  );
}
