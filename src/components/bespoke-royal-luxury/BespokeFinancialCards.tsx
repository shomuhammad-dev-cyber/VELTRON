// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY FINANCIAL CARDS
// Inspired by Rolls-Royce Cullinan Mansory 1 of 1 Material Customization
// Palette: Burgundy Leather, Burr Walnut, Brushed Champagne Metal, Warm Ivory Calacatta
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { Wifi, ShieldCheck, Sparkles, Lock, ArrowUpRight, Copy, Check } from 'lucide-react';

export function BespokeFinancialCards() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const cards = [
    {
      title: 'Royal Burgundy Pebble Leather',
      material: 'Hand-Stitched Leather & Fluted Gold',
      balance: '$128,450.00',
      currency: 'USD',
      number: '•••• •••• •••• 8821',
      holder: 'VELTRON SOVEREIGN',
      exp: '11/29',
      style: 'bespoke-card-burgundy',
      badge: '1 OF 1 SPECIFICATION',
      badgeColor: 'bg-[#C1A477]/20 text-[#FAF7F1] border-[#C1A477]/40',
      chipColor: 'from-[#E2CEAC] to-[#C1A477]',
      textColor: 'text-[#FAF7F1]',
      subTextColor: 'text-[#F0E8DC]/70',
    },
    {
      title: 'Hand-Finished Burr Walnut',
      material: 'Bookmatched Walnut Boiserie & Brass Inlay',
      balance: '€94,200.00',
      currency: 'EUR',
      number: '•••• •••• •••• 4409',
      holder: 'EXECUTIVE VAULT',
      exp: '08/30',
      style: 'bespoke-card-walnut',
      badge: 'WALNUT RESERVE',
      badgeColor: 'bg-[#FAF7F1]/10 text-[#FAF7F1] border-[#C1A477]/30',
      chipColor: 'from-[#D4BC93] to-[#9C8058]',
      textColor: 'text-[#FAF7F1]',
      subTextColor: 'text-[#F0E8DC]/70',
    },
    {
      title: 'Brushed Champagne Metal',
      material: 'Solid Aircraft-Grade Alloy & Twin Coachline',
      balance: '£76,850.00',
      currency: 'GBP',
      number: '•••• •••• •••• 9102',
      holder: 'PRIVATE COGNITIVE',
      exp: '04/31',
      style: 'bespoke-card',
      badge: 'TITANIUM ALLOY',
      badgeColor: 'bg-[#C1A477]/20 text-[#C1A477] border-[#C1A477]/40',
      chipColor: 'from-[#FAF7F1] to-[#C1A477]',
      textColor: 'text-[#FAF7F1]',
      subTextColor: 'text-[#C1A477]',
    },
    {
      title: 'Warm Ivory Calacatta Leather',
      material: 'Italian Calacatta Satin & Champagne Trim',
      balance: '1,450,000,000 UZS',
      currency: 'UZS',
      number: '•••• •••• •••• 3377',
      holder: 'TASHKENT RESERVE',
      exp: '12/28',
      style: 'bespoke-card-ivory',
      badge: 'CENTRAL REPO',
      badgeColor: 'bg-[#211714]/10 text-[#211714] border-[#211714]/20',
      chipColor: 'from-[#C1A477] to-[#493329]',
      textColor: 'text-[#211714]',
      subTextColor: 'text-[#493329]/80',
    },
  ];

  const handleCopy = (index: number) => {
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-24 bg-[#211714] border-b border-[#C1A477]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A110E] border border-[#C1A477]/30 text-xs font-sans tracking-[0.2em] text-[#C1A477] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477]" />
            BESPOKE MATERIALITY & CARDS
          </div>
          <h2 className="text-3xl sm:text-5xl font-bespoke-serif text-[#FAF7F1] leading-tight mb-4">
            Four Bespoke Finishes, <br />
            <span className="italic font-normal text-[#C1A477]">Zero Vulnerability</span>
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C1A477]/60 to-transparent mx-auto mb-6" />
          <p className="text-sm sm:text-base text-[#F0E8DC]/80 font-sans font-light">
            Rolls-Royce Cullinan interyeridagi oliy darajadagi charm, yong‘oq yog‘ochi va shampan metall detallari virtual kartalarimiz shaklida.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`${card.style} bespoke-card-stitched p-6 h-[290px] flex flex-col justify-between group shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer`}
              onClick={() => handleCopy(idx)}
            >
              {/* Card Top: Chip and Contactless */}
              <div className="flex items-center justify-between">
                <div className={`w-11 h-8 rounded-md bg-gradient-to-br ${card.chipColor} p-1 flex flex-col justify-between border border-[#FAF7F1]/30 shadow-inner`}>
                  <div className="w-full h-[1px] bg-[#211714]/30" />
                  <div className="w-2/3 h-[1px] bg-[#211714]/30" />
                  <div className="w-full h-[1px] bg-[#211714]/30" />
                </div>

                <div className="flex items-center gap-2">
                  <Wifi className={`w-5 h-5 ${card.textColor} opacity-60 rotate-90`} />
                  <span className={`text-[9px] font-sans px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
              </div>

              {/* Card Balance */}
              <div>
                <span className={`text-[10px] font-sans uppercase tracking-[0.2em] font-medium block mb-1 ${card.subTextColor}`}>
                  LIQUIDITY BALANCE
                </span>
                <div className={`text-2xl font-bespoke-serif tabular-nums font-semibold ${card.textColor}`}>
                  {card.balance}
                </div>
              </div>

              {/* Card Bottom: Number, Holder & Exp */}
              <div>
                <div className={`font-mono text-sm tracking-[0.18em] mb-3 flex items-center justify-between ${card.textColor}`}>
                  <span>{card.number}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] font-sans uppercase">
                  <div>
                    <span className={`text-[8px] tracking-wider block opacity-70 ${card.textColor}`}>HOLDER</span>
                    <span className={`font-semibold tracking-wide ${card.textColor}`}>{card.holder}</span>
                  </div>
                  <div>
                    <span className={`text-[8px] tracking-wider block opacity-70 ${card.textColor}`}>EXPIRES</span>
                    <span className={`font-mono font-medium ${card.textColor}`}>{card.exp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
