// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY NAVBAR
// Inspired by Rolls-Royce Cullinan Mansory 1 of 1 Interior Balance
// Palette: Deep Espresso (#211714), Royal Burgundy (#54252D), Champagne Gold (#C1A477), Warm Ivory (#F0E8DC)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BespokeLogo } from './BespokeLogo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
  Building2,
  TrendingUp,
  Landmark,
  GraduationCap,
  Trophy,
  SlidersHorizontal,
  Sparkles as Compass,
} from 'lucide-react';

export function BespokeNavbar() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 bg-[#211714]/95 backdrop-blur-md border-b border-[#C1A477]/25 text-[#F0E8DC] transition-all">
      {/* Precision Hand-Painted Coachline Header Accents */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C1A477]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Brand Sovereign Monogram */}
          <Link href="/preview/bespoke-royal-luxury" className="flex items-center gap-2">
            <BespokeLogo size="md" />
          </Link>

          {/* Center Bespoke Navigation (Single Clean Row, Uncrowded Dropdowns) */}
          <div className="hidden lg:flex items-center gap-8 text-[13px] tracking-wide font-sans font-medium text-[#F0E8DC]/90">
            {/* 1. Private Wealth */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('wealth')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="flex items-center gap-1.5 hover:text-[#FAF7F1] transition-colors py-2"
                onClick={() => setActiveDropdown(activeDropdown === 'wealth' ? null : 'wealth')}
              >
                <span>Private Wealth</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#C1A477] transition-transform group-hover:rotate-180" />
              </button>

              {activeDropdown === 'wealth' && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-[#1A110E] border border-[#C1A477]/30 rounded-xl shadow-2xl p-2.5 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/preview/bespoke-royal-luxury/dashboard"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#54252D]/40 text-xs transition-colors"
                  >
                    <div className="p-2 rounded bg-[#54252D]/60 border border-[#C1A477]/35 text-[#C1A477]">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F0E8DC]">Bespoke Cockpit</p>
                      <p className="text-[10px] text-[#C1A477]">Sovereign Executive Balance Sheets</p>
                    </div>
                  </Link>

                  <Link
                    href="/wallet"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#54252D]/40 text-xs transition-colors"
                  >
                    <div className="p-2 rounded bg-[#54252D]/60 border border-[#C1A477]/35 text-[#C1A477]">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F0E8DC]">Travertine Vaults</p>
                      <p className="text-[10px] text-[#C1A477]">Cold Storage & Virtual Cards</p>
                    </div>
                  </Link>

                  <Link
                    href="/analytics"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#54252D]/40 text-xs transition-colors"
                  >
                    <div className="p-2 rounded bg-[#54252D]/60 border border-[#C1A477]/35 text-[#C1A477]">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F0E8DC]">Capital Analytics</p>
                      <p className="text-[10px] text-[#C1A477]">Institutional Asset Performance</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Bespoke Markets */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('markets')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="flex items-center gap-1.5 hover:text-[#FAF7F1] transition-colors py-2"
                onClick={() => setActiveDropdown(activeDropdown === 'markets' ? null : 'markets')}
              >
                <span>Bespoke Markets</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#C1A477] transition-transform group-hover:rotate-180" />
              </button>

              {activeDropdown === 'markets' && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-[#1A110E] border border-[#C1A477]/30 rounded-xl shadow-2xl p-2.5 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/trading"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#54252D]/40 text-xs transition-colors"
                  >
                    <div className="p-2 rounded bg-[#54252D]/60 border border-[#C1A477]/35 text-[#C1A477]">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F0E8DC]">Paper Terminal</p>
                      <p className="text-[10px] text-[#C1A477]">Institutional Market Simulator</p>
                    </div>
                  </Link>

                  <Link
                    href="/markets"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#54252D]/40 text-xs transition-colors"
                  >
                    <div className="p-2 rounded bg-[#54252D]/60 border border-[#C1A477]/35 text-[#C1A477]">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F0E8DC]">Global Indices</p>
                      <p className="text-[10px] text-[#C1A477]">Real-Time CBU & Coingecko Feeds</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Cognitive Oracle */}
            <Link
              href="/ai-chat"
              className="hover:text-[#FAF7F1] transition-colors py-2 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C1A477]" />
              <span>Cognitive Oracle</span>
            </Link>

            {/* 4. Royal Academy */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('academy')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="flex items-center gap-1.5 hover:text-[#FAF7F1] transition-colors py-2"
                onClick={() => setActiveDropdown(activeDropdown === 'academy' ? null : 'academy')}
              >
                <span>Royal Academy</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#C1A477] transition-transform group-hover:rotate-180" />
              </button>

              {activeDropdown === 'academy' && (
                <div className="absolute left-0 top-full mt-1 w-68 bg-[#1A110E] border border-[#C1A477]/30 rounded-xl shadow-2xl p-2.5 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/education"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#54252D]/40 text-xs transition-colors"
                  >
                    <div className="p-2 rounded bg-[#54252D]/60 border border-[#C1A477]/35 text-[#C1A477]">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F0E8DC]">Curriculum</p>
                      <p className="text-[10px] text-[#C1A477]">Elite Financial Architecture</p>
                    </div>
                  </Link>

                  <Link
                    href="/ranking"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#54252D]/40 text-xs transition-colors"
                  >
                    <div className="p-2 rounded bg-[#54252D]/60 border border-[#C1A477]/35 text-[#C1A477]">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F0E8DC]">Sovereign Leaderboard</p>
                      <p className="text-[10px] text-[#C1A477]">Tier-1 Elite Members</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />

            <Link href="/preview/bespoke-royal-luxury/dashboard">
              <button className="px-5 py-2.5 rounded-xl text-xs font-sans font-semibold tracking-wider text-[#1A110E] bespoke-btn-champagne shadow-md flex items-center gap-2">
                <span>ENTER COCKPIT</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#1A110E]" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#1A110E] border border-[#C1A477]/30 text-[#C1A477]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1A110E] border-b border-[#C1A477]/30 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-2 text-sm font-sans">
            <Link
              href="/preview/bespoke-royal-luxury/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg bg-[#54252D]/30 border border-[#C1A477]/30 text-[#F0E8DC]"
            >
              <div className="flex items-center gap-3">
                <Landmark className="w-4 h-4 text-[#C1A477]" />
                <span className="font-medium">Bespoke Cockpit</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#C1A477]" />
            </Link>

            <Link
              href="/trading"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg bg-[#211714] border border-[#C1A477]/20 text-[#F0E8DC]"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-[#C1A477]" />
                <span className="font-medium">Paper Trading Terminal</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#C1A477]" />
            </Link>

            <Link
              href="/wallet"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg bg-[#211714] border border-[#C1A477]/20 text-[#F0E8DC]"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-[#C1A477]" />
                <span className="font-medium">Travertine Vaults</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#C1A477]" />
            </Link>

            <Link
              href="/ai-chat"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg bg-[#211714] border border-[#C1A477]/20 text-[#F0E8DC]"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#C1A477]" />
                <span className="font-medium">Cognitive Oracle AI</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#C1A477]" />
            </Link>

            <Link
              href="/education"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg bg-[#211714] border border-[#C1A477]/20 text-[#F0E8DC]"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-[#C1A477]" />
                <span className="font-medium">Royal Academy</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#C1A477]" />
            </Link>
          </div>

          <div className="pt-4 border-t border-[#C1A477]/20 flex flex-col gap-3">
            <Link href="/preview/bespoke-royal-luxury/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full py-3 rounded-xl text-xs font-sans font-semibold tracking-wider text-[#1A110E] bespoke-btn-champagne">
                ENTER EXECUTIVE COCKPIT
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
