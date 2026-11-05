// ==============================================================================
// VELTRON ITALIAN ELEGANCE GLOBAL HEADER NAVIGATION
// Milanese Editorial Architecture & Contemporary Classic Luxury
// Palette: Espresso Brown (#241512), Deep Burgundy (#501E27), Warm Ivory (#E9DFCE), Antique Gold (#B49A72)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { SoundController } from '@/components/ui/SoundController';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { mechanicalAudio } from '@/lib/sound/MechanicalSoundSystem';
import { ShieldCheck, ArrowUpRight, Send } from 'lucide-react';

export function Header() {
  const { t, isRtl } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A0F0D]/95 backdrop-blur-md border-b border-[#B49A72]/20">
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"
      >
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            href="/"
            onClick={() => mechanicalAudio.playClick()}
            className="hover:opacity-95 transition-opacity"
          >
            <Logo size="md" />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[13px] tracking-wide font-sans text-[#E9DFCE]/80">
            {[
              { href: '/dashboard', label: t('nav.dashboard') },
              { href: '/markets', label: t('nav.markets') },
              { href: '/trading', label: t('nav.trading') },
              { href: '/ai-assistant', label: t('nav.aiAssistant'), highlight: true },
              { href: '/wallet', label: t('nav.wallet') },
              { href: '/education', label: t('nav.education') },
              { href: '/ranking', label: t('nav.ranking') },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => mechanicalAudio.playClick()}
                className={`transition-colors py-1 px-2.5 rounded-lg text-xs font-sans tracking-wider uppercase ${
                  item.highlight
                    ? 'text-[#FAF7F2] font-semibold bg-[#501E27] border border-[#B49A72]/40'
                    : 'text-[#E9DFCE]/80 hover:text-[#FAF7F2] hover:bg-[#241512]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#241512] border border-[#B49A72]/30 text-[11px] font-sans text-[#B49A72]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B49A72] animate-pulse" />
            <span>MILANO PRIVATE BOURSE</span>
          </div>

          <a
            href="https://t.me/VeltronAI_Bot"
            target="_blank"
            rel="noopener noreferrer"
            title="VELTRON Telegram Bot (@VeltronAI_Bot)"
            className="p-2 rounded-lg bg-[#241512] hover:bg-[#501E27] border border-[#B49A72]/30 text-[#B49A72] hover:text-[#FAF7F2] transition-colors flex items-center justify-center gap-1.5 text-xs font-sans"
          >
            <Send className="w-3.5 h-3.5 text-[#2AABEE]" />
            <span className="hidden md:inline text-[11px] font-medium text-[#E9DFCE]">Bot</span>
          </a>

          <LanguageSwitcher />
          <SoundController />

          <Link href="/login" onClick={() => mechanicalAudio.playClick()}>
            <button className="px-4 py-2 rounded-lg text-xs font-sans font-semibold tracking-wider text-[#1A0F0D] italian-btn-gold shadow-sm flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A0F0D]" />
              <span>{t('common.login')}</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
