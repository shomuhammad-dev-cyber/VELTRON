// ==============================================================================
// VELTRON ONE OF ONE FINANCIAL CARDS
// Palette: Burgundy Velvet, Burr Walnut, Brushed Champagne Metal, Warm Ivory Calacatta
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { Wifi, Copy, Check } from 'lucide-react';

export function FinancialCard() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const cards = [
    {
      title: 'Burgundy Velvet Edition',
      material: 'Hand-Stitched Leather & Gold Inlay',
      balance: '$128,450.00',
      currency: 'USD',
      number: '•••• •••• •••• 8821',
      holder: 'VELTRON SOVEREIGN',
      exp: '11/29',
      style: 'oneofone-panel-burgundy',
      badge: '1 OF 1 SPEC',
      badgeColor: 'bg-[#C6A477]/20 text-[#FAF7F1] border-[#C6A477]/40',
      chipColor: 'from-[#DECCAE] to-[#C6A477]',
      textColor: 'text-[#FAF7F1]',
      subTextColor: 'text-[#E9DDCA]/70',
    },
    {
      title: 'Burr Walnut Reserve',
      material: 'Bookmatched Walnut & Brass Inlay',
      balance: '€94,200.00',
      currency: 'EUR',
      number: '•••• •••• •••• 4409',
      holder: 'EXECUTIVE VAULT',
      exp: '08/30',
      style: 'oneofone-panel',
      badge: 'WALNUT CORE',
      badgeColor: 'bg-[#FAF7F1]/10 text-[#FAF7F1] border-[#C6A477]/30',
      chipColor: 'from-[#C6A477] to-[#96764D]',
      textColor: 'text-[#FAF7F1]',
      subTextColor: 'text-[#E9DDCA]/70',
    },
    {
      title: 'Brushed Champagne Metal',
      material: 'Solid Aircraft-Grade Alloy & Twin Coachline',
      balance: '£76,850.00',
      currency: 'GBP',
      number: '•••• •••• •••• 9102',
      holder: 'PRIVATE COGNITIVE',
      exp: '04/31',
      style: 'oneofone-panel',
      badge: 'TITANIUM ALLOY',
      badgeColor: 'bg-[#C6A477]/20 text-[#C6A477] border-[#C6A477]/40',
      chipColor: 'from-[#FAF7F1] to-[#C6A477]',
      textColor: 'text-[#FAF7F1]',
      subTextColor: 'text-[#C6A477]',
    },
    {
      title: 'Warm Ivory Calacatta',
      material: 'Italian Calacatta Satin & Champagne Trim',
      balance: '1,450,000,000 UZS',
      currency: 'UZS',
      number: '•••• •••• •••• 3377',
      holder: 'TASHKENT RESERVE',
      exp: '12/28',
      style: 'bg-gradient-to-br from-[#FAF7F1] via-[#E9DDCA] to-[#D8D0C5] text-[#090706] border border-[#C6A477]/50',
      badge: 'CENTRAL REPO',
      badgeColor: 'bg-[#090706]/10 text-[#090706] border-[#090706]/20',
      chipColor: 'from-[#C6A477] to-[#170F0D]',
      textColor: 'text-[#090706]',
      subTextColor: 'text-[#170F0D]/80',
    },
  ];

  const handleCopy = (index: number) => {
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-20 bg-[#090706] border-b border-[#C6A477]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#170F0D] border border-[#C6A477]/30 text-xs font-manrope tracking-[0.2em] text-[#C6A477] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A477]" />
            ONE OF ONE BESPOKE CARDS
          </div>
          <h2 className="text-3xl sm:text-5xl font-cormorant font-semibold text-[#FAF7F1] leading-tight mb-4">
            Four Bespoke Finishes, <br />
            <span className="italic font-normal text-[#C6A477]">Zero Card Compromise</span>
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C6A477]/60 to-transparent mx-auto mb-6" />
          <p className="text-sm sm:text-base text-[#E9DDCA]/80 font-manrope font-light">
            Har bir virtual karta xavfsiz sandbox muhitida ishlaydi, hech qachon haqiqiy karta raqami yoki CVV talab etilmaydi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`${card.style} p-6 rounded-2xl h-[290px] flex flex-col justify-between group shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden`}
              onClick={() => handleCopy(idx)}
            >
              <div className="flex items-center justify-between">
                <div className={`w-11 h-8 rounded-md bg-gradient-to-br ${card.chipColor} p-1 flex flex-col justify-between border border-[#FAF7F1]/30 shadow-inner`}>
                  <div className="w-full h-[1px] bg-[#090706]/30" />
                  <div className="w-2/3 h-[1px] bg-[#090706]/30" />
                  <div className="w-full h-[1px] bg-[#090706]/30" />
                </div>

                <div className="flex items-center gap-2">
                  <Wifi className={`w-5 h-5 ${card.textColor} opacity-60 rotate-90`} />
                  <span className={`text-[9px] font-manrope px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
              </div>

              <div>
                <span className={`text-[10px] font-manrope uppercase tracking-[0.2em] font-medium block mb-1 ${card.subTextColor}`}>
                  LIQUIDITY BALANCE
                </span>
                <div className={`text-2xl font-cormorant tabular-nums font-semibold ${card.textColor}`}>
                  {card.balance}
                </div>
              </div>

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

                <div className="flex items-center justify-between text-[11px] font-manrope uppercase">
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
