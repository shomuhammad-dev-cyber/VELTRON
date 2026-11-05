// ==============================================================================
// VELTRON ITALIAN ELEGANCE NAVBAR
// Editorial Milanese High-Fashion & Architectural Layout
// Palette: Espresso Brown (#211714), Deep Burgundy (#54252D), Warm Ivory (#F0E8DC), Antique Gold (#C1A477)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ItalianLogo } from './ItalianLogo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles as Compass,
  Building2,
  TrendingUp,
  Landmark,
} from 'lucide-react';

export function ItalianNavbar() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#211714]/95 backdrop-blur-md border-b border-[#C1A477]/20 text-[#F0E8DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Brand Identity */}
          <Link href="/" className="flex items-center gap-2">
            <ItalianLogo size="md" />
          </Link>

          {/* Center Editorial Links (Single Clean Row, No Text Break) */}
          <div className="hidden lg:flex items-center gap-8 text-[13px] tracking-wide font-sans font-medium text-[#F0E8DC]/90">
            <div className="relative group">
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className="flex items-center gap-1.5 hover:text-[#FAF7F1] transition-colors py-2"
              >
                <span>Private Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#C1A477] transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              {servicesDropdownOpen && (
                <div
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="absolute left-0 top-full mt-1 w-64 bg-[#1E110E] border border-[#C1A477]/30 rounded-xl shadow-2xl p-2 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#54252D]/30 text-xs transition-colors"
                  >
                    <div className="p-1.5 rounded bg-[#54252D]/50 border border-[#C1A477]/30 text-[#C1A477]">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F0E8DC]">Executive Ledger</p>
                      <p className="text-[10px] text-[#C1A477]">Sovereign Balance Sheets</p>
                    </div>
                  </Link>

                  <Link
                    href="/wallet"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#54252D]/30 text-xs transition-colors"
                  >
                    <div className="p-1.5 rounded bg-[#54252D]/50 border border-[#C1A477]/30 text-[#C1A477]">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F0E8DC]">Travertine Vaults</p>
                      <p className="text-[10px] text-[#C1A477]">Sandboxed Card Allocation</p>
                    </div>
                  </Link>

                  <Link
                    href="/trading"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#54252D]/30 text-xs transition-colors"
                  >
                    <div className="p-1.5 rounded bg-[#54252D]/50 border border-[#C1A477]/30 text-[#C1A477]">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F0E8DC]">Paper Trading</p>
                      <p className="text-[10px] text-[#C1A477]">Multigenerational Wealth</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/markets" className="hover:text-[#FAF7F1] transition-colors">
              Markets
            </Link>
            <Link href="/wallet" className="hover:text-[#FAF7F1] transition-colors">
              Asset Vaults
            </Link>
            <Link href="/ai-assistant" className="hover:text-[#FAF7F1] transition-colors">
              Cognitive Oracle
            </Link>
            <Link href="/education" className="hover:text-[#FAF7F1] transition-colors">
              Accademia
            </Link>
          </div>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Status Indicator */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A110E] border border-[#C1A477]/30 text-[11px] font-sans text-[#C1A477]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477] animate-pulse" />
              <span>MILANO BOURSE ACTIVE</span>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* CTA Button */}
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-lg text-xs font-sans font-semibold text-[#1A110E] bespoke-btn-champagne shadow-sm flex items-center gap-2 group"
            >
              <span>Executive Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F0E8DC] hover:text-[#FAF7F1] rounded-lg border border-[#C1A477]/30 bg-[#1A110E]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1E110E] border-b border-[#C1A477]/30 px-6 py-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-3 text-sm font-sans">
            <Link
              href="/preview/italian-elegance/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg bg-[#54252D]/40 border border-[#C1A477]/30 text-[#F0E8DC] font-semibold flex items-center justify-between"
            >
              <span>Open Dashboard Preview</span>
              <ArrowUpRight className="w-4 h-4 text-[#C1A477]" />
            </Link>
            <Link
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F0E8DC]/90 hover:text-white py-1"
            >
              Architecture & Materials
            </Link>
            <Link
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F0E8DC]/90 hover:text-white py-1"
            >
              Private Asset Vaults
            </Link>
            <Link
              href="#intelligence"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F0E8DC]/90 hover:text-white py-1"
            >
              Cognitive Financial Intelligence
            </Link>
            <Link
              href="#heritage"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F0E8DC]/90 hover:text-white py-1"
            >
              Milano Heritage & Standards
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
