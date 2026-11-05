// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY PILLARS & ARCHITECTURE
// Inspired by Rolls-Royce Cullinan Mansory 1 of 1 Precision Engineering
// Palette: Deep Espresso (#211714), Royal Burgundy (#54252D), Champagne Gold (#C1A477), Warm Ivory (#F0E8DC)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, TrendingUp, Building2, GraduationCap, ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export function BespokePillars() {
  const pillars = [
    {
      id: 'custody',
      title: 'Private Wealth & Treasury Custody',
      subtitle: 'SOVEREIGN CAPITAL CONSOLE',
      description: 'Shaxsiy kapital, real vaqt valyuta konvertatsiyasi (USD, EUR, GBP, UZS) va g‘aznachilik intizomi uchun oliy darajadagi boshqaruv markazi.',
      icon: Landmark,
      href: '/preview/bespoke-royal-luxury/dashboard',
      actionText: 'Cockpit-ni Ko‘rish',
      accentColor: 'border-[#C1A477]/40 text-[#C1A477]',
      cardType: 'bespoke-card',
      stats: '4 Valyuta Balansi',
    },
    {
      id: 'terminal',
      title: 'Institutional Paper Terminal',
      subtitle: 'ZERO-RISK MARKET SIMULATOR',
      description: '$100,000 boshlang‘ich virtual balans bilan global kriptovalyuta, indekslar va tovar bozorlarida professional savdo tajribasini oshiring.',
      icon: TrendingUp,
      href: '/trading',
      actionText: 'Terminalga O‘tish',
      accentColor: 'border-[#C1A477]/40 text-[#C1A477]',
      cardType: 'bespoke-card-burgundy',
      stats: '$100K Simulyatsiya',
    },
    {
      id: 'vaults',
      title: 'Travertine Cold Vaults',
      subtitle: 'ISOLATED CAPITAL PROTECTION',
      description: 'Haqiqiy mablag‘ xavfsizligini 100% kafolatlovchi, haqiqiy karta yoki CVV talab qilmaydigan to‘liq izolyatsiyalangan virtual hamyon.',
      icon: Building2,
      href: '/wallet',
      actionText: 'Hamyonni Ochish',
      accentColor: 'border-[#C1A477]/40 text-[#C1A477]',
      cardType: 'bespoke-card',
      stats: '100% Izolyatsiya',
    },
    {
      id: 'academy',
      title: 'Royal Academy of Finance',
      subtitle: 'ELITE PEDAGOGICAL CURRICULUM',
      description: 'Klassik investitsiya falsafasi, risk menejmenti va kognitiv tahlil bo‘yicha eksklyuziv ta’lim modullari va yetakchilar reytingi.',
      icon: GraduationCap,
      href: '/education',
      actionText: 'Akademiyani Ko‘rish',
      accentColor: 'border-[#C1A477]/40 text-[#C1A477]',
      cardType: 'bespoke-card-walnut',
      stats: 'Tier-1 Modullar',
    },
  ];

  return (
    <section className="py-24 bg-[#1A110E] border-b border-[#C1A477]/25 relative">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#54252D]/30 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Twin Coachline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#211714] border border-[#C1A477]/30 text-xs font-sans tracking-[0.2em] text-[#C1A477] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477]" />
            FOUR PILLARS OF SOVEREIGN ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-bespoke-serif text-[#FAF7F1] leading-tight mb-4">
            Bespoke Craftsmanship Meets <br />
            <span className="italic font-normal text-[#C1A477]">High-Precision Fintech</span>
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C1A477]/60 to-transparent mx-auto mb-6" />
          <p className="text-sm sm:text-base text-[#F0E8DC]/80 font-sans font-light">
            Har bir modul Rolls-Royce buyurtma xizmati kabi mukammal muvozanat va material aniqligi bilan barpo etilgan.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`${pillar.cardType} p-8 bespoke-card-stitched flex flex-col justify-between group transition-all duration-300 hover:scale-[1.01]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-[#211714]/80 border border-[#C1A477]/35 text-[#C1A477] shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-sans px-3 py-1 rounded-full bg-[#211714] border border-[#C1A477]/30 text-[#C1A477] font-semibold tracking-wider uppercase">
                      {pillar.stats}
                    </span>
                  </div>

                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#C1A477] uppercase font-semibold block mb-2">
                    {pillar.subtitle}
                  </span>
                  <h3 className="text-2xl font-bespoke-serif text-[#FAF7F1] mb-3 group-hover:text-[#C1A477] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F0E8DC]/75 font-sans font-light leading-relaxed mb-8">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#C1A477]/20 flex items-center justify-between">
                  <span className="text-[11px] text-[#F0E8DC]/60 font-sans">Veltron Sovereign Core</span>
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C1A477] hover:text-[#FAF7F1] transition-colors group-hover:translate-x-1"
                  >
                    <span>{pillar.actionText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
