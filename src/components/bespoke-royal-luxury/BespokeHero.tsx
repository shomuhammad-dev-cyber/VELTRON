// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY HERO SECTION
// Inspired by Rolls-Royce Cullinan Mansory 1 of 1 Interior Architecture
// Palette: Deep Espresso (#211714), Royal Burgundy (#54252D), Champagne Gold (#C1A477), Warm Ivory (#F0E8DC)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowRight, ShieldCheck, ArrowUpRight, Lock, CheckCircle2, Sparkles, SlidersHorizontal as Sliders, ChevronRight } from 'lucide-react';

export function BespokeHero() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-20 pb-28 overflow-hidden bg-[#211714] border-b border-[#C1A477]/25 text-[#F0E8DC]">
      {/* Background Bespoke Craftsmanship Atmosphere: Starlight Console & Diffused Velvet Glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Soft Royal Burgundy & Warm Champagne atmospheric ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#C1A477]/12 via-[#54252D]/20 to-transparent blur-[140px]" />
        <div className="absolute -top-20 right-10 w-[450px] h-[450px] bg-[#54252D]/25 rounded-full blur-[100px]" />
        <div className="absolute top-40 left-10 w-[380px] h-[380px] bg-[#493329]/30 rounded-full blur-[110px]" />

        {/* Subtle Starlight Console Fiber Optic Constellation Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAF7F1" stopOpacity="1" />
              <stop offset="100%" stopColor="#C1A477" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Starlight constellation points */}
          <circle cx="12%" cy="18%" r="1" fill="#FAF7F1" opacity="0.6" />
          <circle cx="28%" cy="12%" r="1.5" fill="#FAF7F1" opacity="0.8" />
          <circle cx="45%" cy="22%" r="0.8" fill="#FAF7F1" opacity="0.4" />
          <circle cx="62%" cy="15%" r="1.2" fill="#FAF7F1" opacity="0.7" />
          <circle cx="78%" cy="26%" r="1.6" fill="#FAF7F1" opacity="0.9" />
          <circle cx="89%" cy="14%" r="0.8" fill="#FAF7F1" opacity="0.5" />
          <circle cx="18%" cy="45%" r="1.2" fill="#FAF7F1" opacity="0.6" />
          <circle cx="82%" cy="48%" r="1.4" fill="#FAF7F1" opacity="0.7" />
          <circle cx="94%" cy="65%" r="1" fill="#FAF7F1" opacity="0.5" />
          <circle cx="8%" cy="72%" r="1.5" fill="#FAF7F1" opacity="0.7" />

          {/* Coachline Geometric Alignment Grids */}
          <pattern id="coachlineGrid" width="180" height="180" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="180" y2="180" stroke="#C1A477" strokeWidth="0.4" strokeOpacity="0.15" />
            <line x1="180" y1="0" x2="0" y2="180" stroke="#C1A477" strokeWidth="0.4" strokeOpacity="0.15" />
            <circle cx="90" cy="90" r="1.5" fill="#C1A477" fillOpacity="0.25" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#coachlineGrid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Bespoke Royal Sovereign Crest Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#1A110E] border border-[#C1A477]/40 text-xs font-sans tracking-[0.22em] text-[#C1A477] mb-8 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477] animate-pulse" />
          <span className="uppercase">BESPOKE ROYAL LUXURY • 1 OF 1 SPECIFICATION</span>
        </div>

        {/* High-Contrast Regal Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bespoke-serif font-normal text-[#FAF7F1] max-w-5xl leading-[1.08] tracking-tight mb-8">
          The Sovereign Architecture of <br />
          <span className="italic font-normal text-[#C1A477]">Private Capital</span>
        </h1>

        {/* Meaningful Editorial Description */}
        <p className="text-base sm:text-lg text-[#F0E8DC]/85 max-w-3xl mx-auto font-sans font-light leading-relaxed mb-12">
          Rolls-Royce Cullinan Mansory 1 of 1 buyurtma hunarmandchiligi, britaniya lyuks detallari va oliy darajadagi institutsional moliya texnologiyasi uyg‘unligi. 
          Ortiqcha vizual shovqinsiz, chuqur espresso, qirollik burgundiyasi va nozik shampan oltini bilan kapitalingizni boshqaring.
        </p>

        {/* Dual Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <Link href="/preview/bespoke-royal-luxury/dashboard" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-sans font-semibold tracking-wider text-[#1A110E] bespoke-btn-champagne shadow-lg flex items-center justify-center gap-3 group">
              <span>ENTER EXECUTIVE COCKPIT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <Link href="/trading" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-sans font-semibold tracking-wider text-[#FAF7F1] bespoke-btn-burgundy shadow-lg flex items-center justify-center gap-2">
              <span>LAUNCH PAPER TERMINAL</span>
              <ArrowUpRight className="w-4 h-4 text-[#C1A477]" />
            </button>
          </Link>
        </div>

        {/* Live Sovereign Market Tickers (Twin Coachline Bracket) */}
        <div className="w-full max-w-4xl p-3.5 mb-14 rounded-2xl bg-[#1A110E]/80 border border-[#C1A477]/30 backdrop-blur-md flex flex-wrap items-center justify-around gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F0E8DC]">BTC/USD</span>
            <span className="font-mono text-[#FAF7F1] tabular-nums">$68,420.50</span>
            <span className="text-emerald-400 font-mono text-[11px]">+4.82%</span>
          </div>
          <div className="hidden sm:block text-[#C1A477]/30">|</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F0E8DC]">ETH/USD</span>
            <span className="font-mono text-[#FAF7F1] tabular-nums">$3,540.25</span>
            <span className="text-emerald-400 font-mono text-[11px]">+3.14%</span>
          </div>
          <div className="hidden sm:block text-[#C1A477]/30">|</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F0E8DC]">SOL/USD</span>
            <span className="font-mono text-[#FAF7F1] tabular-nums">$182.40</span>
            <span className="text-rose-400 font-mono text-[11px]">-1.22%</span>
          </div>
          <div className="hidden sm:block text-[#C1A477]/30">|</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F0E8DC]">GOLD (XAU)</span>
            <span className="font-mono text-[#FAF7F1] tabular-nums">$2,748.90</span>
            <span className="text-emerald-400 font-mono text-[11px]">+1.05%</span>
          </div>
        </div>

        {/* 3 Executive Cockpit Telemetry Pillars */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Telemetry 1: Virtual Starting Liquidity */}
          <div className="bespoke-card p-6 bespoke-card-stitched group">
            <div className="flex items-center justify-between text-xs font-sans text-[#C1A477] tracking-wider uppercase mb-3">
              <span>VIRTUAL LIQUIDITY</span>
              <span className="w-2 h-2 rounded-full bg-[#C1A477]" />
            </div>
            <div className="text-3xl font-bespoke-serif text-[#FAF7F1] tabular-nums mb-2">
              $100,000.00
            </div>
            <p className="text-xs text-[#F0E8DC]/70 font-sans leading-relaxed">
              Xavf-xatarsiz sinov amaliyoti uchun to‘liq institutsional simulyatsiya qilingan balans.
            </p>
          </div>

          {/* Telemetry 2: Neural Inference Latency */}
          <div className="bespoke-card-burgundy p-6 bespoke-card-stitched group">
            <div className="flex items-center justify-between text-xs font-sans text-[#C1A477] tracking-wider uppercase mb-3">
              <span>NEURAL AI INFERENCE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-3xl font-bespoke-serif text-[#FAF7F1] tabular-nums mb-2">
              4.2<span className="text-lg text-[#C1A477]">ms</span>
            </div>
            <p className="text-xs text-[#F0E8DC]/70 font-sans leading-relaxed">
              Real-vaqt rejimida CBU va CoinGecko ma'lumotlar oqimiga asoslangan kognitiv tahlil.
            </p>
          </div>

          {/* Telemetry 3: Security & Isolation Architecture */}
          <div className="bespoke-card p-6 bespoke-card-stitched group">
            <div className="flex items-center justify-between text-xs font-sans text-[#C1A477] tracking-wider uppercase mb-3">
              <span>SECURITY ARCHITECTURE</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C1A477]/20 text-[#C1A477] font-semibold">
                TIER-1
              </span>
            </div>
            <div className="text-2xl font-bespoke-serif text-[#FAF7F1] tracking-tight mb-2">
              ZERO CVV / PIN
            </div>
            <p className="text-xs text-[#F0E8DC]/70 font-sans leading-relaxed">
              Haqiqiy bank ma'lumotlarini so‘ramaydigan xavfsiz izolyatsiyalangan simulyatsiya protokoli.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
