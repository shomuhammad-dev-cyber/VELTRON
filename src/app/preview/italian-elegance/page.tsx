// ==============================================================================
// VELTRON ITALIAN ELEGANCE HOMEPAGE PREVIEW (/preview/italian-elegance)
// Contemporary Classic Luxury & Milanese Editorial Architecture
// Palette: Espresso Brown (#211714), Deep Burgundy (#54252D), Warm Ivory (#F0E8DC), Antique Gold (#C1A477)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { ItalianNavbar } from '@/components/italian-elegance/ItalianNavbar';
import { ItalianHero } from '@/components/italian-elegance/ItalianHero';
import { ItalianEcosystem } from '@/components/italian-elegance/ItalianEcosystem';
import { ItalianLogo } from '@/components/italian-elegance/ItalianLogo';
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
} from 'lucide-react';

export default function ItalianElegancePreviewPage() {
  return (
    <div className="min-h-screen bg-[#211714] text-[#F0E8DC] font-sans selection:bg-[#C1A477]/30 selection:text-white">
      {/* 1. TOP PREVIEW ADVISORY BANNER */}
      <div className="bg-[#1A110E] border-b border-[#C1A477]/30 py-2.5 px-4 text-center text-xs font-sans text-[#C1A477] flex flex-wrap items-center justify-center gap-4">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C1A477] animate-pulse" />
          <strong className="text-[#FAF7F1]">VELTRON DESIGN SYSTEM PREVIEW:</strong>
          <span>ITALIAN ELEGANCE / CONTEMPORARY CLASSIC LUXURY</span>
        </span>

        <span className="hidden md:inline text-[#F0E8DC]/40">•</span>

        <div className="flex items-center gap-3">
          <Link
            href="/preview/italian-elegance/dashboard"
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

      {/* 2. REFINED MILANESE NAVBAR */}
      <ItalianNavbar />

      {/* 3. EDITORIAL HERO COMPOSITION */}
      <ItalianHero />

      {/* 4. FOUR PILLARS ARCHITECTURAL ECOSYSTEM */}
      <ItalianEcosystem />

      {/* 5. ARCHITECTURAL EDITORIAL SECTION: MILANESE REPOSITORY */}
      <section id="portfolio" className="py-28 bg-[#1A110E] border-b border-[#C1A477]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 6 Columns: Editorial Copy */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-sans tracking-[0.25em] text-[#C1A477] uppercase font-semibold">
                ARCHITECTURAL MATERIALITY
              </span>

              <h2 className="text-3xl sm:text-5xl font-bespoke-serif text-[#FAF7F1] font-normal tracking-tight leading-tight">
                Quiet Prestige, <br />
                <span className="italic text-[#C1A477]">Disciplined Proportion</span>
              </h2>

              <p className="text-sm sm:text-base text-[#F0E8DC]/80 font-sans leading-relaxed">
                Bu oddiy fintech ilovasi emas. Bu Milan moda uylari va Italiya me'morchiligining chuqur falsafasi:
                qimmatbaho espresso yong‘oq yog‘ochi (walnut), Calacatta va Travertine marmari, shuningdek, nozik latun hoshiyalarning uyg‘unligi.
              </p>

              <div className="space-y-4 pt-4">
                <div className="italian-card p-5 flex items-start gap-4">
                  <div className="p-2 rounded bg-[#54252D]/40 border border-[#C1A477]/30 text-[#C1A477] shrink-0 mt-0.5">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bespoke-serif text-[#FAF7F1] font-semibold">
                      Har bir ko‘rsatkichda yuqori kontrast va ravshanlik
                    </h4>
                    <p className="text-xs text-[#F0E8DC]/70 mt-1">
                      Ko‘zni toliqtiruvchi o‘yin effektlari yoki yashil miltillashlar yo‘q. Matnlar qora espresso foni ustida iliq fil suyagi (warm ivory) rangida tiniq o‘qiladi.
                    </p>
                  </div>
                </div>

                <div className="italian-card p-5 flex items-start gap-4">
                  <div className="p-2 rounded bg-[#54252D]/40 border border-[#C1A477]/30 text-[#C1A477] shrink-0 mt-0.5">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bespoke-serif text-[#FAF7F1] font-semibold">
                      Xavfsiz Sandboks va Haqiqiy Moliya Ta'limi
                    </h4>
                    <p className="text-xs text-[#F0E8DC]/70 mt-1">
                      Bank kartalari, sandboks demo hisoblar va savdo simulyatori real backend va database bilan to‘liq himoyalangan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Visual Architecture Composition */}
            <div className="lg:col-span-6 space-y-6">
              {/* Luxury Travertine Card Showcase */}
              <div className="bespoke-card-ivory p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                  <span className="text-xs font-sans tracking-widest text-[#54252D] uppercase font-bold">
                    VELTRON PRIVATE CUSTODY
                  </span>
                  <Building className="w-6 h-6 text-[#54252D]" />
                </div>

                <div className="space-y-2 mb-10">
                  <p className="text-xs font-mono text-[#34302C]/70">PORTFOLIO ATTRIBUTION</p>
                  <p className="text-4xl font-bespoke-serif font-bold text-[#1A110E]">€1,428,950.00</p>
                </div>

                <div className="pt-6 border-t border-[#34302C]/15 flex items-center justify-between text-xs font-sans text-[#34302C]">
                  <span>Family Trust Sovereign Caliber</span>
                  <span className="font-bold text-[#54252D]">TIER-1 AUDITED</span>
                </div>
              </div>

              {/* Burgundy Private Vault Card */}
              <div className="bespoke-card-burgundy p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-sans tracking-widest text-[#C1A477] uppercase font-bold">
                    MILANO ACADEMY MERIT ALLOCATION
                  </span>
                  <ShieldCheck className="w-6 h-6 text-[#C1A477]" />
                </div>

                <div className="space-y-2 mb-8">
                  <p className="text-xs font-sans text-[#F0E8DC]/70">INSTITUTIONAL SOLVENCY</p>
                  <p className="text-3xl font-bespoke-serif text-[#FAF7F1]">99.98% Prime Reserve</p>
                </div>

                <div className="pt-4 border-t border-[#C1A477]/20 flex items-center justify-between text-xs font-sans text-[#C1A477]">
                  <span>Zero CVV/PIN Sandbox</span>
                  <span className="text-[#FAF7F1]">Argon2id Hardened</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL EDITORIAL CTA SECTION */}
      <section className="py-24 bg-[#211714] text-center relative border-b border-[#C1A477]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="inline-block p-4 rounded-2xl bg-[#1A110E] border border-[#C1A477]/30 shadow-lg">
            <ItalianLogo size="lg" showTagline={false} />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bespoke-serif text-[#FAF7F1] font-normal tracking-tight">
            VELTRON <br />
            <span className="italic text-[#C1A477]">The Architecture of Capital</span>
          </h2>

          <p className="text-base text-[#F0E8DC]/80 max-w-xl mx-auto font-sans font-light leading-relaxed">
            Ushbu yangi Italian Elegance dizayn tizimi bo‘yicha to‘liq Dashboard preview-ni ochib ko‘rishingiz mumkin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/preview/italian-elegance/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-4 rounded-xl text-xs font-sans font-semibold tracking-wider text-[#1A110E] bespoke-btn-champagne shadow-md flex items-center justify-center gap-2">
                <span>VIEW DASHBOARD PREVIEW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-sans font-semibold tracking-wider text-[#F0E8DC] bespoke-btn-burgundy shadow-md">
                MAVJUD SAYTGA QAYTISH
              </button>
            </Link>
          </div>

          <div className="pt-12 border-t border-[#C1A477]/20 flex flex-wrap items-center justify-center gap-8 text-xs font-sans text-[#C1A477]">
            <span>ITALIAN MARBLE & WALNUT MATERIALITY</span>
            <span>•</span>
            <span>NO WATCH DIALS • NO NEON</span>
            <span>•</span>
            <span>MILANO CONTEMPORARY CLASSIC</span>
          </div>
        </div>
      </section>

      {/* 7. CLASSICAL LUXURY FOOTER */}
      <footer className="py-12 bg-[#1A110E] text-xs font-sans text-[#F0E8DC]/60 text-center border-t border-[#C1A477]/15">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 VELTRON PRIVATE CAPITAL. MILANO • CONTEMPORARY CLASSIC LUXURY.</p>
          <div className="flex items-center gap-6 text-[#C1A477]">
            <Link href="/preview/italian-elegance" className="hover:text-white">Home Preview</Link>
            <Link href="/preview/italian-elegance/dashboard" className="hover:text-white">Dashboard Preview</Link>
            <Link href="/" className="hover:text-white">Live App</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
