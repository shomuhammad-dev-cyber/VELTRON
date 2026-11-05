// ==============================================================================
// VELTRON BESPOKE LUXURY NAVBAR (EXACT RECREATION OF TARGET IMAGE)
// Height: 75px, Clean Single Line, Obsidian Glass with Subtle Gold Coachline
// LEFT: Winged \V/ Crest + VELTRON Wordmark
// CENTER: Home, Markets, Trading, Education, Analytics, AI Assistant, More v
// RIGHT: Language selector (EN v), Bell icon, Alexandr avatar (Premium Member)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VeltronLogo } from './VeltronLogo';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Menu,
  X,
  ChevronDown,
  Bell,
  Globe,
  Check,
  CreditCard,
  Building2,
  Trophy,
  Settings,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export function LuxuryNavbar() {
  const { locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/markets', label: 'Markets' },
    { href: '/trading', label: 'Trading' },
    { href: '/education', label: 'Education' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/ai-assistant', label: 'AI Assistant' },
  ];

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'uz', label: 'UZ', name: "O'zbekcha" },
    { code: 'ru', label: 'RU', name: 'Русский' },
    { code: 'ar', label: 'AR', name: 'العربية' },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <nav className="sticky top-0 z-50 h-[75px] bg-[#090706]/92 backdrop-blur-md border-b border-[#C6A477]/15 text-[#E9DDCA] transition-all flex flex-col justify-center select-none">
      {/* Precision Champagne Coachline Top Accent */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#C6A477]/35 to-transparent absolute top-0 left-0" />

      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[74px]">
          {/* LEFT: VELTRON Monogram & Wordmark */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <VeltronLogo size="md" />
          </Link>

          {/* CENTER: Exact Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-[13px] tracking-wide font-manrope font-medium text-[#C9BEB2]">
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#FAF7F1] font-semibold'
                      : 'hover:text-[#FAF7F1]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#C6A477] rounded-full shadow-[0_0_8px_#C6A477]" />
                  )}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMoreDropdownOpen(true)}
              onMouseLeave={() => setMoreDropdownOpen(false)}
            >
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="flex items-center gap-1 hover:text-[#FAF7F1] transition-colors py-1"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#C6A477]/80 transition-transform duration-200" />
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-60 bg-[#140D0B] border border-[#C6A477]/30 rounded-xl shadow-2xl p-2 space-y-1 backdrop-blur-xl animate-in fade-in duration-150 z-50">
                  <Link
                    href="/wallet"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#481B24]/40 text-xs text-[#E9DDCA] transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-[#C6A477]" />
                    <div>
                      <p className="font-semibold text-white">Sovereign Wallet</p>
                      <p className="text-[10px] text-[#A89888]">Multi-Asset Vaults</p>
                    </div>
                  </Link>
                  <Link
                    href="/ranking"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#481B24]/40 text-xs text-[#E9DDCA] transition-colors"
                  >
                    <Trophy className="w-4 h-4 text-[#C6A477]" />
                    <div>
                      <p className="font-semibold text-white">Private Ranking</p>
                      <p className="text-[10px] text-[#A89888]">Executive Tier League</p>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#481B24]/40 text-xs text-[#E9DDCA] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#C6A477]" />
                    <div>
                      <p className="font-semibold text-white">System Settings</p>
                      <p className="text-[10px] text-[#A89888]">Security & Preferences</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Language Selector, Notification Icon, Alexandr User Profile */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            {/* Language Selector: Globe + EN v */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 text-xs text-[#C9BEB2] hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-white/5"
              >
                <Globe className="w-3.5 h-3.5 text-[#C6A477]" />
                <span className="font-semibold uppercase">{currentLang.label}</span>
                <ChevronDown className="w-3 h-3 text-[#C6A477]" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-[#140D0B] border border-[#C6A477]/30 rounded-xl shadow-2xl p-1.5 space-y-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLocale(l.code as any);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        locale === l.code
                          ? 'bg-[#481B24]/60 text-[#C6A477] font-semibold'
                          : 'text-[#E9DDCA] hover:bg-white/5'
                      }`}
                    >
                      <span>{l.name}</span>
                      {locale === l.code && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell Icon */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-1.5 rounded-lg text-[#C9BEB2] hover:text-[#C6A477] transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#C6A477] shadow-[0_0_6px_#C6A477]" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#140D0B] border border-[#C6A477]/30 rounded-xl shadow-2xl p-3 space-y-2 z-50">
                  <div className="flex items-center justify-between border-b border-[#C6A477]/20 pb-2">
                    <span className="text-xs font-semibold text-white">Notifications</span>
                    <span className="text-[10px] text-[#C6A477]">2 New</span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div className="p-2 rounded-lg bg-[#481B24]/30 border border-[#C6A477]/20">
                      <p className="font-medium text-white">BTC/USD Target Reached</p>
                      <p className="text-[10px] text-[#A89888]">$67,432.18 (+2.8%)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill: Alexandr / Premium Member */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full hover:bg-white/5 transition-all cursor-pointer"
              >
                {/* Circular photo avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C6A477]/40 shrink-0">
                  <img
                    src="/images/avatar-alexandr.jpg"
                    alt="Alexandr"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Profile text */}
                <div className="text-left leading-tight">
                  <div className="flex items-center gap-1 text-xs font-medium text-white">
                    <span>Alexandr</span>
                    <ChevronDown className="w-3 h-3 text-[#C6A477]" />
                  </div>
                  <div className="text-[10px] text-[#C6A477] font-medium tracking-wide">
                    Premium Member
                  </div>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#140D0B] border border-[#C6A477]/30 rounded-xl shadow-2xl p-2 space-y-1 z-50">
                  <div className="px-3 py-2 border-b border-[#C6A477]/15">
                    <p className="text-xs font-semibold text-white">Alexandr</p>
                    <p className="text-[10px] text-[#C6A477]">Bespoke 1 of 1 Account</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-xs text-[#E9DDCA] hover:bg-[#481B24]/40 rounded-lg transition-colors"
                  >
                    Cockpit Overview
                  </Link>
                  <Link
                    href="/wallet"
                    className="block px-3 py-2 text-xs text-[#E9DDCA] hover:bg-[#481B24]/40 rounded-lg transition-colors"
                  >
                    Asset Vaults
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#C6A477]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090706] border-b border-[#C6A477]/30 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#E9DDCA] hover:text-[#C6A477]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-[#C6A477]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C6A477]/40">
                <img src="/images/avatar-alexandr.jpg" alt="Alexandr" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Alexandr</p>
                <p className="text-[10px] text-[#C6A477]">Premium Member</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
