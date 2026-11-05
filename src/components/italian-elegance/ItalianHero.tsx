// ==============================================================================
// VELTRON ITALIAN ELEGANCE HERO SECTION
// Editorial Milano Classic Luxury Composition — Architectural Travertine & Brass
// Palette: Espresso Brown (#211714), Deep Burgundy (#54252D), Warm Ivory (#F0E8DC), Antique Gold (#C1A477)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowRight, ShieldCheck, ArrowUpRight, Lock, CheckCircle2, Building2 as Building, ChevronRight } from 'lucide-react';

export function ItalianHero() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-20 pb-28 overflow-hidden italian-marble border-b border-[#C1A477]/20">
      {/* Background Architectural Travertine & Warm Natural Light Reflections */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Soft diffused warm natural sunlight through high palazzo windows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#C1A477]/15 via-[#54252D]/10 to-transparent blur-[120px]" />
        <div className="absolute -top-24 right-10 w-[450px] h-[450px] bg-[#F0E8DC]/5 rounded-full blur-[90px]" />
        
        {/* Architectural Geometry: Fine classical Palladian arches hairline overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="archGrid" width="160" height="160" patternUnits="userSpaceOnUse">
              <path d="M 0 160 L 0 80 C 0 35.8 35.8 0 80 0 C 124.2 0 160 35.8 160 80 L 160 160" fill="none" stroke="#C1A477" strokeWidth="0.8" />
              <line x1="0" y1="160" x2="160" y2="160" stroke="#C1A477" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#archGrid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Editorial Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-[#1A110E] border border-[#C1A477]/40 text-xs font-sans tracking-[0.2em] text-[#C1A477] mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477]" />
          <span className="uppercase">CONTEMPORARY ITALIAN LUXURY • FINTECH ARCHITECTURE</span>
        </div>

        {/* High-Fashion Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bespoke-serif font-normal text-[#F0E8DC] max-w-5xl leading-[1.08] tracking-tight mb-8">
          The Architecture of <br />
          <span className="italic font-normal text-[#C1A477]">Sovereign Wealth</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#F0E8DC]/80 max-w-3xl mx-auto font-sans font-light leading-relaxed mb-12">
          Italiya hashamatli moda uylari, Milan editorial dizayni va zamonaviy institutsional moliya uyg‘unligi. 
          Ortiqcha neonlarsiz, xotirjam va intizomli arxitektura bilan shaxsiy kapitalingizni boshqaring.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-sans font-semibold tracking-wider text-[#1A110E] bespoke-btn-champagne shadow-md flex items-center justify-center gap-3 group">
              <span>EXPLORE EXECUTIVE DASHBOARD</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <Link href="/trading" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-sans font-semibold tracking-wider text-[#F0E8DC] bespoke-btn-burgundy shadow-md flex items-center justify-center gap-2">
              <span>PAPER TRADING TERMINAL</span>
              <ArrowUpRight className="w-4 h-4 text-[#C1A477]" />
            </button>
          </Link>
        </div>

        {/* 3 Prestigious Architectural Pillars (Travertine, Walnut & Brass) */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          {/* Pillar 1: Total Sovereign Balance */}
          <div className="italian-card p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs font-sans text-[#C1A477] tracking-wider uppercase mb-3">
              <span>TREASURY CAPITAL</span>
              <span className="w-2 h-2 rounded-full bg-[#C1A477]" />
            </div>
            <p className="text-3xl font-bespoke-serif text-[#FAF7F1] font-normal tracking-tight">
              €14,850,000
            </p>
            <p className="text-xs font-sans text-[#F0E8DC]/60 mt-2">
              Audited Multigenerational Reserves
            </p>
          </div>

          {/* Pillar 2: Solvency & Security */}
          <div className="italian-card p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs font-sans text-[#C1A477] tracking-wider uppercase mb-3">
              <span>SOLVENCY MARGIN</span>
              <span className="text-[11px] font-semibold text-[#C1A477]">TIER-1</span>
            </div>
            <p className="text-3xl font-bespoke-serif text-[#FAF7F1] font-normal tracking-tight">
              99.98%
            </p>
            <p className="text-xs font-sans text-[#F0E8DC]/60 mt-2">
              Zero Leverage Liability Margin
            </p>
          </div>

          {/* Pillar 3: Sandboxed Card Vaults */}
          <div className="italian-card p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs font-sans text-[#C1A477] tracking-wider uppercase mb-3">
              <span>CARD SANDBOX</span>
              <Lock className="w-3.5 h-3.5 text-[#C1A477]" />
            </div>
            <p className="text-3xl font-bespoke-serif text-[#FAF7F1] font-normal tracking-tight">
              ZERO CVV/PIN
            </p>
            <p className="text-xs font-sans text-[#F0E8DC]/60 mt-2">
              Isolated Educational Ledger
            </p>
          </div>
        </div>

        {/* Real-time Sovereign Financial Ribbon */}
        <div className="w-full max-w-5xl py-3.5 px-6 rounded-xl bg-[#1A110E]/90 border border-[#C1A477]/20 flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-[#F0E8DC]/70">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F0E8DC]">EUR/USD:</span>
            <span className="text-[#C1A477] font-mono">1.0842 (+0.24%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F0E8DC]">Gold Bullion 999.9:</span>
            <span className="text-[#C1A477] font-mono">€2,514.80/oz (+0.68%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F0E8DC]">Italian BTP 10Y:</span>
            <span className="text-[#C1A477] font-mono">3.48% (Stable)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F0E8DC]">BTC Reserve:</span>
            <span className="text-[#C1A477] font-mono">€63,140.00 (+2.1%)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
