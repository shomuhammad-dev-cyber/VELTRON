// ==============================================================================
// VELTRON ONE OF ONE LUXURY PILLARS & ARCHITECTURE
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, TrendingUp, Building2, GraduationCap, ArrowUpRight, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export function LuxuryPillars() {
  const pillars = [
    {
      id: 'custody',
      title: 'Private Wealth & Treasury Custody',
      subtitle: 'SOVEREIGN CAPITAL CONSOLE',
      description: 'Shaxsiy kapital, real vaqt valyuta konvertatsiyasi (USD, EUR, GBP, UZS) va g‘aznachilik intizomi uchun oliy darajadagi boshqaruv markazi.',
      icon: Landmark,
      href: '/dashboard',
      actionText: 'Cockpit-ni Ko‘rish',
      cardType: 'oneofone-panel',
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
      cardType: 'oneofone-panel-burgundy',
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
      cardType: 'oneofone-panel',
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
      cardType: 'oneofone-panel',
      stats: 'Tier-1 Modullar',
    },
  ];

  return (
    <section className="py-24 bg-[#170F0D] border-b border-[#C6A477]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#090706] border border-[#C6A477]/30 text-xs font-manrope tracking-[0.2em] text-[#C6A477] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A477]" />
            FOUR PILLARS OF SOVEREIGN ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-cormorant font-semibold text-[#FAF7F1] leading-tight mb-4">
            Bespoke Craftsmanship Meets <br />
            <span className="italic font-normal text-[#C6A477]">High-Precision Fintech</span>
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C6A477]/60 to-transparent mx-auto mb-6" />
          <p className="text-sm sm:text-base text-[#E9DDCA]/80 font-manrope font-light">
            Har bir modul Rolls-Royce Cullinan Mansory 1 of 1 kabi mukammal mutanosiblik va material aniqligi bilan barpo etilgan.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`${pillar.cardType} p-8 flex flex-col justify-between group transition-all duration-300 hover:scale-[1.01]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-[#090706]/80 border border-[#C6A477]/35 text-[#C6A477] shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-manrope px-3 py-1 rounded-full bg-[#090706] border border-[#C6A477]/30 text-[#C6A477] font-semibold tracking-wider uppercase">
                      {pillar.stats}
                    </span>
                  </div>

                  <span className="text-[10px] font-manrope tracking-[0.2em] text-[#C6A477] uppercase font-semibold block mb-2">
                    {pillar.subtitle}
                  </span>
                  <h3 className="text-2xl font-cormorant font-semibold text-[#FAF7F1] mb-3 group-hover:text-[#C6A477] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E9DDCA]/75 font-manrope font-light leading-relaxed mb-8">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#C6A477]/20 flex items-center justify-between">
                  <span className="text-[11px] text-[#E9DDCA]/60 font-manrope">Veltron Sovereign Core</span>
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C6A477] hover:text-[#FAF7F1] transition-colors group-hover:translate-x-1"
                  >
                    <span>{pillar.actionText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bespoke Craftsmanship & Philosophy Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#090706] border border-[#C6A477]/30 text-xs font-manrope tracking-[0.2em] text-[#C6A477] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A477]" />
              THE PHILOSOPHY OF 1 OF 1 LUXURY
            </div>
            <h2 className="text-3xl sm:text-5xl font-cormorant font-semibold text-[#FAF7F1] leading-tight mb-6">
              Not a Template. <br />
              <span className="italic font-normal text-[#C6A477]">A Sovereign Monolith.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#E9DDCA]/80 font-manrope font-light leading-relaxed mb-6">
              Klassik marmar haykaltaroshligi, chuqur obsidian va espresso foni, ipak kabi oqayotgan burgundiya matolari hamda shampan oltini chiziqlari uyg‘unligi. 
              VELTRON bu shunchaki moliya sayti emas — bu o‘z kapitalingizni eng yuqori darajada nazorat qilish san’ati.
            </p>
            <div className="space-y-3 mb-8">
              {[
                '100% Markaziy Bank (CBU) va Xalqaro bozor kotirovkalari',
                'Zero CVV / Zero PIN — hech qachon shaxsiy karta maxfiyligini so‘ramaydigan sandbox',
                '$100,000 boshlang‘ich virtual balans bilan to‘liq xavfsiz savdo mashg‘ulotlari',
                '4 ta til (UZ, RU, EN, AR) va arab yozuvi uchun to‘liq RTL qo‘llab-quvvatlovi',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-[#E9DDCA]/90 font-manrope">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A477] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-manrope font-semibold tracking-wider text-[#090706] oneofone-btn-gold shadow-lg"
            >
              <span>SOVEREIGN COCKPITNI OCHISH</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Bespoke Order Specification Panel */}
          <div className="oneofone-panel-burgundy p-8 sm:p-10 text-left relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#C6A477]/25">
              <div>
                <span className="text-[10px] font-manrope tracking-[0.25em] text-[#C6A477] uppercase block mb-1">
                  CRAFTSMANSHIP SPECIFICATION
                </span>
                <h3 className="text-2xl font-cormorant font-semibold text-[#FAF7F1]">Bespoke Order No. 001</h3>
              </div>
              <div className="p-3 rounded-xl bg-[#090706] border border-[#C6A477]/40 text-[#C6A477]">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-5 text-xs font-manrope">
              <div className="flex justify-between items-center py-2 border-b border-[#C6A477]/15">
                <span className="text-[#E9DDCA]/70">Color Foundation</span>
                <span className="font-semibold text-[#FAF7F1]">Obsidian, Espresso, Burgundy Velvet</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#C6A477]/15">
                <span className="text-[#E9DDCA]/70">Metallic Accents</span>
                <span className="font-semibold text-[#FAF7F1]">Champagne Gold #C6A477</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#C6A477]/15">
                <span className="text-[#E9DDCA]/70">Display Typography</span>
                <span className="font-semibold text-[#FAF7F1]">Cormorant Garamond Display</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#C6A477]/15">
                <span className="text-[#E9DDCA]/70">Body Typography</span>
                <span className="font-semibold text-[#FAF7F1]">Manrope Editorial Sans</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[#E9DDCA]/70">Security Architecture</span>
                <span className="font-semibold text-emerald-400">Sandbox Isolation Tier-1</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#C6A477]/20 flex items-center justify-between text-[11px] text-[#C6A477]">
              <span>MEMBER PRIVILEGE: ACTIVE</span>
              <span className="font-mono">VELTRON-MANSORY-1OF1</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
