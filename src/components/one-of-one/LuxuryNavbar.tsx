// ==============================================================================
// VELTRON BESPOKE LUXURY NAVBAR (EXACT RECREATION OF TARGET IMAGE)
// Height: 75px, Clean Single Line, Obsidian Glass with Subtle Gold Coachline
// LEFT: Winged \V/ Crest + VELTRON Wordmark
// CENTER: Home, Markets, Trading, Education, Analytics, AI Assistant, More v
// RIGHT: Language selector (EN v), Bell icon, Alexandr avatar (Premium Member)
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VeltronLogo } from './VeltronLogo';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  Globe,
  Check,
  CreditCard,
  Building2,
  Trophy,
  Settings,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  PieChart,
  GraduationCap,
  TrendingUp,
  Search,
  Wallet,
  Zap,
} from 'lucide-react';

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function TradingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3L4 7l4 4" />
      <path d="M4 7h16" />
      <path d="M16 21l4-4-4-4" />
      <path d="M20 17H4" />
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

export function LuxuryNavbar() {
  const { locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchMe() {
      try {
        const res = await fetch('/api/v1/auth/me');
        const json = await res.json();
        if (isMounted && json?.authenticated && json?.user) {
          setCurrentUser(json.user);
        }
      } catch {}
    }
    fetchMe();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close drawer when route changes or ESC is pressed
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isBossOrAdmin =
    Boolean(currentUser?.isBoss) ||
    currentUser?.role === 'SYSTEM_ADMIN' ||
    currentUser?.role === 'COMPLIANCE_OFFICER';

  const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/markets', label: 'Markets' },
    { href: '/trading', label: 'Trading' },
    { href: '/education', label: 'Education' },
    { href: '/pricing', label: 'Tariflar (Pricing)' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/ai-assistant', label: 'AI Assistant' },
  ];

  // Exact 9 Core Menu Items from Target Image & WideDashboard
  const coreMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { href: '/markets', label: 'Markets', icon: BarChart3 },
    { href: '/trading', label: 'Trading', icon: TradingIcon },
    { href: '/wallet', label: 'Portfolio', icon: PieChart },
    { href: '/education', label: 'Education', icon: GraduationCap },
    { href: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { href: '/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/ranking', label: 'Ranking', icon: Trophy },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const filteredCoreItems = coreMenuItems.filter((item) =>
    item.label.toLowerCase().includes(drawerSearch.toLowerCase())
  );

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'uz', label: 'UZ', name: "O'zbekcha" },
    { code: 'ru', label: 'RU', name: 'Русский' },
    { code: 'ar', label: 'AR', name: 'العربية' },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <nav className="sticky top-0 z-50 h-[75px] bg-[#090706]/95 backdrop-blur-md border-b border-[#C6A477]/15 text-[#E9DDCA] transition-all flex flex-col justify-center select-none">
      {/* Precision Champagne Coachline Top Accent */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#C6A477]/35 to-transparent absolute top-0 left-0" />

      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[74px]">
          {/* LEFT: VELTRON Monogram & Wordmark + Burger Trigger */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <VeltronLogo size="md" />
            </Link>

            {/* Desktop Quick Drawer Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18100E] border border-[#C6A477]/35 hover:border-[#C6A477] text-xs font-semibold text-[#E9DDCA] hover:text-[#FAF7F1] transition-all shadow-[0_0_12px_rgba(198,164,119,0.12)] hover:scale-105 cursor-pointer"
              title="Barcha bo‘limlar va menyuni ochish"
            >
              <Menu className="w-3.5 h-3.5 text-[#C6A477]" />
              <span className="font-manrope">Boshqaruv</span>
            </button>
          </div>

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

          {/* RIGHT: Boss Badge, Language, Notification, User Profile, Burger Menu Button */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* ONLY VISIBLE TO BOSS OR ADMINS: Royal Glowing Admin Panel Button */}
            {isBossOrAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#54252D] via-[#782434] to-[#54252D] border border-[#C6A477]/70 text-xs font-bold text-[#FAF7F1] shadow-[0_0_18px_rgba(198,164,119,0.35)] hover:scale-105 transition-all"
                title="Sovereign Enterprise Administration"
              >
                <CrownIcon className="w-3.5 h-3.5 text-[#C6A477]" />
                <span className="hidden sm:inline">👑 Admin Panel</span>
                <span className="sm:hidden">👑 Admin</span>
              </Link>
            )}

            {/* Language Selector: Globe + EN v (Desktop) */}
            <div className="relative hidden md:block">
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
            <div className="relative hidden sm:block">
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

            {/* User Profile Pill or Login Button */}
            <div className="relative hidden sm:block">
              {currentUser ? (
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full hover:bg-white/5 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C6A477]/40 shrink-0 bg-[#54252D]/40 flex items-center justify-center font-bold text-xs text-[#C6A477]">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.displayName || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}</span>
                    )}
                  </div>
                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1 text-xs font-medium text-white">
                      <span>{currentUser.displayName || 'Investor'}</span>
                      <ChevronDown className="w-3 h-3 text-[#C6A477]" />
                    </div>
                    <div className="text-[10px] text-[#C6A477] font-medium tracking-wide">
                      {currentUser.isBoss ? '👑 Boss (Admin)' : `${currentUser.tier || 'Free'} Tier`}
                    </div>
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-full bg-[#54252D]/40 hover:bg-[#54252D]/70 border border-[#C6A477]/40 text-xs font-medium text-white transition-all"
                >
                  Kirish
                </Link>
              )}

              {profileDropdownOpen && currentUser && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#140D0B] border border-[#C6A477]/30 rounded-xl shadow-2xl p-2 space-y-1 z-50">
                  <div className="px-3 py-2 border-b border-[#C6A477]/15">
                    <p className="text-xs font-semibold text-white">{currentUser.displayName}</p>
                    <p className="text-[10px] text-[#C6A477]">
                      {currentUser.isBoss ? '👑 System Administrator' : `${currentUser.tier} Account`}
                    </p>
                  </div>
                  {isBossOrAdmin && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-xs font-bold text-[#C6A477] bg-[#54252D]/30 hover:bg-[#54252D]/60 rounded-lg transition-colors"
                    >
                      👑 Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-xs text-[#E9DDCA] hover:bg-[#481B24]/40 rounded-lg transition-colors"
                  >
                    Cockpit Overview
                  </Link>
                  <Link
                    href="/pricing"
                    className="block px-3 py-2 text-xs text-[#E9DDCA] hover:bg-[#481B24]/40 rounded-lg transition-colors"
                  >
                    Tarifni Yangilash
                  </Link>
                  <Link
                    href="/wallet"
                    className="block px-3 py-2 text-xs text-[#E9DDCA] hover:bg-[#481B24]/40 rounded-lg transition-colors"
                  >
                    Royal Banking & Cards
                  </Link>
                </div>
              )}
            </div>

            {/* UNIVERSAL BURGER MENU BUTTON (VISIBLE EVERYWHERE) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#1A1210] border border-[#C6A477]/40 hover:border-[#C6A477] text-[#C6A477] hover:text-white flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              aria-label="Open sovereign menu"
            >
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold text-[#E9DDCA]">Menyu</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================================== */}
      {/* SOVEREIGN ROYAL COMMAND DRAWER (INTEGRATED EXACT 9 CORE ITEMS FROM SCREENSHOT)  */}
      {/* ============================================================================== */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <aside className="relative z-[101] w-full max-w-[380px] bg-[#0C0807] border-l border-[#C6A477]/35 shadow-[-16px_0_50px_rgba(0,0,0,0.8)] h-full flex flex-col justify-between overflow-y-auto p-5 sm:p-6 text-[#E9DDCA]">
            <div>
              {/* Header: Logo + Close */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C6A477]/20">
                <Link href="/" onClick={() => setDrawerOpen(false)}>
                  <VeltronLogo size="sm" showTagline={true} />
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-[#C6A477]/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Boss Admin Quick Banner (If Boss) */}
              {isBossOrAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full py-2.5 px-3 mb-4 rounded-xl bg-gradient-to-r from-[#54252D] via-[#782434] to-[#54252D] border border-[#C6A477] text-xs font-bold text-[#FAF7F1] flex items-center justify-between shadow-[0_0_15px_rgba(198,164,119,0.3)] hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center gap-2">
                    <CrownIcon className="w-4 h-4 text-[#C6A477]" />
                    <span>👑 BOSS ADMIN BOSHQARUV</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C6A477]" />
                </Link>
              )}

              {/* Search Filter */}
              <div className="relative mb-5">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A477]/60" />
                <input
                  type="text"
                  placeholder="Bo‘lim qidirish..."
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  className="w-full bg-[#170F0D] border border-[#C6A477]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-[#E9DDCA] placeholder-[#E9DDCA]/40 focus:outline-none focus:border-[#C6A477] transition-colors"
                />
              </div>

              {/* SECTION TITLE: EXACT CORE NAVIGATION FROM SCREENSHOT */}
              <div className="text-[10px] font-manrope tracking-[0.25em] text-[#C6A477] uppercase font-bold mb-2.5 px-2 flex items-center justify-between">
                <span>SOVEREIGN CORE MENU</span>
                <span className="text-[9px] text-[#A89888] font-normal">9 Modul</span>
              </div>

              {/* The EXACT 9 Menu Items from Target Screenshot */}
              <nav className="space-y-1.5 mb-6">
                {filteredCoreItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-manrope font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#D6BB92] to-[#B8986B] text-[#120E0C] font-bold shadow-md'
                          : 'text-[#8E8278] hover:text-[#FAF7F1] hover:bg-[#1A1210]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#120E0C]' : 'text-[#8E8278]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive ? (
                        <div className="w-2 h-2 rounded-full bg-[#120E0C]" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-[#5A5048]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* EXTRA POWERHOUSE BANKING & VIP TIERS */}
              <div className="text-[10px] font-manrope tracking-[0.25em] text-[#C6A477] uppercase font-bold mb-2.5 px-2">
                BANKING & VIP SERVISLAR
              </div>
              <div className="space-y-1.5 mb-6">
                <Link
                  href="/wallet"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-manrope font-medium text-[#FAF7F1] bg-[#1A1113] border border-[#C6A477]/30 hover:border-[#C6A477] hover:bg-[#281419] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-[#C6A477]" />
                    <div>
                      <p className="font-semibold text-white">Royal Banking & Kartalar</p>
                      <p className="text-[10px] text-[#A89888]">Click, Payme, Visa, IBAN</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A477]" />
                </Link>

                <Link
                  href="/pricing"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-manrope font-medium text-[#FAF7F1] bg-[#16120E] border border-[#C6A477]/30 hover:border-[#C6A477] hover:bg-[#221A13] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#C6A477]" />
                    <div>
                      <p className="font-semibold text-white">Tariflar & VIP Paketlar</p>
                      <p className="text-[10px] text-[#A89888]">Free, Pro, Ultra, Max (100%)</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A477]" />
                </Link>
              </div>

              {/* LANGUAGE SELECTOR IN DRAWER */}
              <div className="mb-4">
                <div className="text-[10px] font-manrope tracking-[0.2em] text-[#A89888] uppercase mb-2 px-2">
                  Tilni tanlang (Language)
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocale(l.code as any)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        locale === l.code
                          ? 'bg-[#54252D] text-[#C6A477] border border-[#C6A477]/50'
                          : 'bg-[#170F0D] text-[#A89888] hover:text-white'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DRAWER FOOTER: PROFILE / LOGIN + SECURITY */}
            <div className="pt-4 border-t border-[#C6A477]/20 space-y-3">
              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#170F0D] border border-[#C6A477]/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C6A477]/40 bg-[#54252D]/40 flex items-center justify-center font-bold text-xs text-[#C6A477]">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{currentUser.displayName || 'Investor'}</p>
                      <p className="text-[10px] text-[#C6A477] font-medium">
                        {currentUser.isBoss ? '👑 Boss (Admin)' : `${currentUser.tier || 'Free'} Tier`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setDrawerOpen(false)}
                    className="text-[11px] text-[#C6A477] hover:underline"
                  >
                    Profil
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#54252D] hover:bg-[#682D38] text-center text-xs font-bold text-white border border-[#C6A477]/50 block shadow-md transition-colors"
                >
                  Akkauntga Kirish / Ro‘yxatdan O‘tish
                </Link>
              )}

              <div className="flex items-center justify-between text-[10px] text-[#5A5048] font-manrope">
                <span>VELTRON Sovereign OS</span>
                <span className="flex items-center gap-1 text-[#C6A477]">
                  <ShieldCheck className="w-3 h-3" />
                  256-Bit SSL
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </nav>
  );
}
