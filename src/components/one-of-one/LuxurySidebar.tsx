// ==============================================================================
// VELTRON ONE OF ONE LUXURY SIDEBAR
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VeltronLogo } from './VeltronLogo';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  History,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  SlidersHorizontal,
  Trophy,
  Settings,
  Search,
  Target,
  BarChart3,
} from 'lucide-react';

export function LuxurySidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { href: '/dashboard', label: 'Treasury Cockpit', icon: Wallet },
    { href: '/trading', label: 'Paper Terminal', icon: TrendingUp },
    { href: '/wallet', label: 'Cold Vaults & Cards', icon: CreditCard },
    { href: '/ai-assistant', label: 'Cognitive Oracle', icon: Sparkles },
    { href: '/analytics', label: 'Capital Analytics', icon: BarChart3 },
    { href: '/education', label: 'Royal Academy', icon: GraduationCap },
    { href: '/ranking', label: 'Leaderboard', icon: Trophy },
    { href: '/settings', label: 'System Settings', icon: Settings },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 lg:w-72 bg-[#090706] border-r border-[#C6A477]/25 flex flex-col justify-between p-6 shrink-0 min-h-screen">
      <div>
        {/* Brand Logo */}
        <div className="pb-6 mb-6 border-b border-[#C6A477]/20">
          <Link href="/">
            <VeltronLogo size="sm" showTagline={true} />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A477]/60" />
          <input
            type="text"
            placeholder="Qidiruv (Ctrl+K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#170F0D] border border-[#C6A477]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-[#E9DDCA] placeholder-[#E9DDCA]/40 focus:outline-none focus:border-[#C6A477] transition-colors"
          />
        </div>

        {/* Section Label */}
        <div className="text-[10px] font-manrope tracking-[0.25em] text-[#C6A477] uppercase font-semibold mb-3 px-3">
          SOVEREIGN NAVIGATION
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {filteredItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-manrope font-medium transition-all ${
                  isActive
                    ? 'bg-[#481B24] text-[#FAF7F1] border border-[#C6A477]/50 shadow-md'
                    : 'text-[#E9DDCA]/70 hover:bg-[#170F0D] hover:text-[#FAF7F1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#C6A477]' : 'text-[#C6A477]/70'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#C6A477]" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Sovereign Security Badge */}
      <div className="p-4 rounded-xl bg-[#170F0D] border border-[#C6A477]/25 text-left">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FAF7F1] mb-1">
          <ShieldCheck className="w-4 h-4 text-[#C6A477]" />
          <span>Sovereign Guard</span>
        </div>
        <p className="text-[10px] text-[#E9DDCA]/60 leading-relaxed font-manrope">
          Tier-1 Isolated Sandbox & Zero-CVV/PIN Protection.
        </p>
      </div>
    </aside>
  );
}
