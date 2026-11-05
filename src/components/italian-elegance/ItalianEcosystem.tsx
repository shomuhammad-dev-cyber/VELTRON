// ==============================================================================
// VELTRON ITALIAN ELEGANCE ECOSYSTEM SECTION
// Architectural Gallery of Core Financial Capabilities
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Brain,
  TrendingUp,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  Building2,
  ShieldCheck as Scale,
  Award,
} from 'lucide-react';

const PILLARS = [
  {
    tag: 'PILLAR I • COGNITIVE INTELLIGENCE',
    title: 'Private Wealth Advisory & AI Oracle',
    description:
      'Grounded in authorized accounts, Central Bank bulletins, and macroeconomic indicators. Provides disciplined financial analysis with zero speculative promises.',
    icon: Brain,
    accent: '#C1A477',
    link: '/ai-assistant',
  },
  {
    tag: 'PILLAR II • PAPER TERMINAL',
    title: 'Institutional Simulation Terminal',
    description:
      'Risk-free educational trading terminal seeded with €100,000 virtual capital. Real orderbook feeds, multi-timeframe analytics, and portfolio attribution.',
    icon: TrendingUp,
    accent: '#F0E8DC',
    link: '/trading',
  },
  {
    tag: 'PILLAR III • SANDBOX VAULTS',
    title: 'Multi-Asset Travertine Vaults',
    description:
      'Zero-knowledge card sandbox. Test budgeting scenarios and demo expense allocations with strict access controls and zero CVV or bank credentials required.',
    icon: Shield,
    accent: '#54252D',
    link: '/wallet',
  },
  {
    tag: 'PILLAR IV • PRIVATE ACADEMY',
    title: 'Accademia Di Finanza & Merits',
    description:
      'Comprehensive institutional curriculum: fundamental valuation, cash flow modeling, risk management, and global merit ranking based on completed challenges.',
    icon: Layers,
    accent: '#C1A477',
    link: '/education',
  },
];

export function ItalianEcosystem() {
  return (
    <section id="architecture" className="py-28 bg-[#1E110E] text-[#F0E8DC] relative border-b border-[#C1A477]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-20 text-left">
          <span className="text-xs font-sans tracking-[0.25em] text-[#C1A477] uppercase font-semibold">
            MILANESE PROPORTIONS • FOUR PILLARS
          </span>
          <h2 className="text-3xl sm:text-5xl font-bespoke-serif text-[#FAF7F1] font-normal tracking-tight mt-3 mb-6">
            Refined Disciplines for <br />
            <span className="italic text-[#C1A477]">Private Capital Governance</span>
          </h2>
          <p className="text-sm sm:text-base text-[#F0E8DC]/75 font-sans leading-relaxed">
            Har bir funksiya haqiqiy backend va ma'lumotlar bazasi bilan mustahkamlangan. 
            Soxta tugmalar va sun'iy animatsiyalardan xoli, zamonaviy va intizomli moliya muhiti.
          </p>
        </div>

        {/* 4 Architectural Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="italian-card p-8 sm:p-10 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[11px] font-sans tracking-[0.2em] text-[#C1A477] uppercase font-semibold">
                    {pillar.tag}
                  </span>
                  <div className="p-3 rounded-lg bg-[#211714] border border-[#C1A477]/30 text-[#C1A477] group-hover:scale-105 transition-transform">
                    <pillar.icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bespoke-serif text-[#FAF7F1] font-normal mb-4 group-hover:text-[#C1A477] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-sm text-[#F0E8DC]/75 font-sans leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-[#C1A477]/15 flex items-center justify-between text-xs font-sans font-semibold tracking-wider text-[#C1A477] group-hover:text-[#FAF7F1] transition-colors">
                <span>EXPLORE CAPABILITY</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Material & Identity Showcase Strip */}
        <div className="mt-20 p-8 rounded-2xl bg-[#211714] border border-[#C1A477]/25 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-[10px] font-sans tracking-widest text-[#C1A477] uppercase">PRIMARY MATERIAL</span>
            <p className="text-base font-bespoke-serif text-[#FAF7F1] mt-1">Italian Travertine</p>
          </div>
          <div>
            <span className="text-[10px] font-sans tracking-widest text-[#C1A477] uppercase">WOODWORK ACCENT</span>
            <p className="text-base font-bespoke-serif text-[#FAF7F1] mt-1">Dark Espresso Walnut</p>
          </div>
          <div>
            <span className="text-[10px] font-sans tracking-widest text-[#C1A477] uppercase">METALLIC DETAIL</span>
            <p className="text-base font-bespoke-serif text-[#FAF7F1] mt-1">Hairline Antique Brass</p>
          </div>
          <div>
            <span className="text-[10px] font-sans tracking-widest text-[#C1A477] uppercase">VELVET ACCENT</span>
            <p className="text-base font-bespoke-serif text-[#FAF7F1] mt-1">Deep Milan Burgundy</p>
          </div>
        </div>
      </div>
    </section>
  );
}
