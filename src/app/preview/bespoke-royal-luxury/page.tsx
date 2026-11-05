// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY HOMEPAGE PREVIEW (/preview/bespoke-royal-luxury)
// Inspired by Rolls-Royce Cullinan Mansory 1 of 1 Bespoke Craftsmanship
// Palette: Deep Espresso (#211714), Royal Burgundy (#54252D), Champagne Gold (#C1A477), Warm Ivory (#F0E8DC)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { BespokeNavbar } from '@/components/bespoke-royal-luxury/BespokeNavbar';
import { BespokeHero } from '@/components/bespoke-royal-luxury/BespokeHero';
import { BespokeFinancialCards } from '@/components/bespoke-royal-luxury/BespokeFinancialCards';
import { BespokePillars } from '@/components/bespoke-royal-luxury/BespokePillars';
import { BespokeLogo } from '@/components/bespoke-royal-luxury/BespokeLogo';
import {
  ArrowRight,
  ShieldCheck,
  Building2 as Building,
  ShieldCheck as Scale,
  Sparkles,
  Lock,
  Layers,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

export default function BespokeRoyalLuxuryPreviewPage() {
  return (
    <div className="min-h-screen bg-[#211714] text-[#F0E8DC] font-sans selection:bg-[#C1A477]/30 selection:text-white">
      {/* 1. TOP PREVIEW ADVISORY BANNER */}
      <div className="bg-[#1A110E] border-b border-[#C1A477]/30 py-2.5 px-4 text-center text-xs font-sans text-[#C1A477] flex flex-wrap items-center justify-center gap-4">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C1A477] animate-pulse" />
          <strong className="text-[#FAF7F1]">VELTRON DESIGN SYSTEM PREVIEW:</strong>
          <span>BESPOKE ROYAL LUXURY (ROLLS-ROYCE CULLINAN MANSORY 1 OF 1)</span>
        </span>

        <span className="hidden md:inline text-[#F0E8DC]/40">•</span>

        <div className="flex items-center gap-3">
          <Link
            href="/preview/bespoke-royal-luxury/dashboard"
            className="px-3 py-1 rounded bg-[#54252D] text-[#FAF7F1] font-semibold border border-[#C1A477]/30 hover:border-[#C1A477] transition-colors"
          >
            Dashboard Preview-ni Ko‘rish →
          </Link>
          <Link
            href="/"
            className="text-xs text-[#F0E8DC]/70 hover:text-[#FAF7F1] underline transition-colors"
          >
            Mavjud Saytga Qaytish (Home)
          </Link>
        </div>
      </div>

      {/* 2. REFINED BESPOKE NAVBAR */}
      <BespokeNavbar />

      {/* 3. CINEMATIC HERO COMPOSITION */}
      <BespokeHero />

      {/* 4. FOUR BESPOKE MATERIAL FINANCIAL CARDS */}
      <BespokeFinancialCards />

      {/* 5. FOUR PILLARS OF SOVEREIGN ARCHITECTURE */}
      <BespokePillars />

      {/* 6. BESPOKE CRAFTSMANSHIP & PHILOSOPHY SECTION */}
      <section className="py-24 bg-[#1A110E] border-b border-[#C1A477]/25 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Editorial Narrative */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#211714] border border-[#C1A477]/30 text-xs font-sans tracking-[0.2em] text-[#C1A477] uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477]" />
                THE PHILOSOPHY OF BESPOKE COMMERCE
              </div>
              <h2 className="text-3xl sm:text-5xl font-bespoke-serif text-[#FAF7F1] leading-tight mb-6">
                Not a Template. <br />
                <span className="italic font-normal text-[#C1A477]">A Sovereign Monolith.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#F0E8DC]/80 font-sans font-light leading-relaxed mb-6">
                Britaniya avtomobil hunarmandchiligi eng oliy cho‘qqisi — Rolls-Royce Cullinan Mansory 1 of 1 modelining ichki pardozlash prinsiplari asosida shakllantirilgan. 
                Chuqur espresso fonida qad ko‘targan qirollik burgundiyasi, nozik shampan oltini hoshiyalari va qo‘lda ishlangan yong‘oq yog‘ochi hissi raqamli moliyani chinakam san’at darajasiga olib chiqadi.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  '100% O‘zbekiston (CBU) va Xalqaro (CoinGecko) jonli kotirovkalari',
                  'Zero CVV / Zero PIN — hech qanday shaxsiy bank sirlarini xavf ostiga qo‘ymaydigan sandbox',
                  '$100,000 boshlang‘ich virtual balans bilan to‘liq xavfsiz savdo mashg‘ulotlari',
                  '4 ta global til (UZ, RU, EN, AR) va arab yozuvi uchun to‘liq RTL qo‘llab-quvvatlovi',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-[#F0E8DC]/90 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-[#C1A477] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/preview/bespoke-royal-luxury/dashboard">
                <button className="px-8 py-4 rounded-xl text-xs font-sans font-semibold tracking-wider text-[#1A110E] bespoke-btn-champagne shadow-lg flex items-center gap-2">
                  <span>SOVEREIGN COCKPITNI SINAB KO‘RISH</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Right: Bespoke Architectural Console Inlay */}
            <div className="bespoke-card-walnut bespoke-card-stitched p-8 sm:p-10 text-left relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#C1A477]/25">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.25em] text-[#C1A477] uppercase block mb-1">
                    CRAFTSMANSHIP SPECIFICATION
                  </span>
                  <h3 className="text-2xl font-bespoke-serif text-[#FAF7F1]">Bespoke Order No. 001</h3>
                </div>
                <div className="p-3 rounded-xl bg-[#211714] border border-[#C1A477]/40 text-[#C1A477]">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-5 text-xs font-sans">
                <div className="flex justify-between items-center py-2 border-b border-[#C1A477]/15">
                  <span className="text-[#F0E8DC]/70">Color Palette</span>
                  <span className="font-semibold text-[#FAF7F1]">Deep Espresso, Burgundy, Champagne</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#C1A477]/15">
                  <span className="text-[#F0E8DC]/70">Material Inlays</span>
                  <span className="font-semibold text-[#FAF7F1]">Bookmatched Walnut, Fluted Metal</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#C1A477]/15">
                  <span className="text-[#F0E8DC]/70">Navigation Integrity</span>
                  <span className="font-semibold text-[#C1A477]">Single Row Clean Dropdowns</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#C1A477]/15">
                  <span className="text-[#F0E8DC]/70">Security Protocol</span>
                  <span className="font-semibold text-emerald-400">Sandbox Isolation Tier-1</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#F0E8DC]/70">Language Matrix</span>
                  <span className="font-semibold text-[#FAF7F1]">UZ / RU / EN / AR (RTL)</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#C1A477]/20 flex items-center justify-between text-[11px] text-[#C1A477]">
                <span>MEMBER PRIVILEGE: ACTIVE</span>
                <span className="font-mono">VELTRON-MANSORY-1OF1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REFINED BESPOKE FOOTER */}
      <footer className="bg-[#1A110E] border-t border-[#C1A477]/25 py-16 text-[#F0E8DC]/80 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-[#C1A477]/20">
            <BespokeLogo size="md" />

            <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-[#F0E8DC]/80">
              <Link href="/preview/bespoke-royal-luxury/dashboard" className="hover:text-[#FAF7F1] transition-colors">
                Bespoke Dashboard
              </Link>
              <Link href="/trading" className="hover:text-[#FAF7F1] transition-colors">
                Paper Trading
              </Link>
              <Link href="/wallet" className="hover:text-[#FAF7F1] transition-colors">
                Travertine Vaults
              </Link>
              <Link href="/education" className="hover:text-[#FAF7F1] transition-colors">
                Royal Academy
              </Link>
              <Link href="/ai-chat" className="hover:text-[#FAF7F1] transition-colors">
                Cognitive Oracle
              </Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#F0E8DC]/50">
            <p>© 2026 VELTRON BESPOKE ROYAL LUXURY. Barcha huquqlar himoyalangan.</p>
            <p className="text-[#C1A477]/80">Rolls-Royce Cullinan Mansory 1 of 1 Bespoke Craftsmanship Inspiration</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
