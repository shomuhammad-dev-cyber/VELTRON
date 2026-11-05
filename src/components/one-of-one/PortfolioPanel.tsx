// ==============================================================================
// VELTRON ONE OF ONE PORTFOLIO PANEL
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, PieChart, Sparkles } from 'lucide-react';

export function PortfolioPanel() {
  const [period, setPeriod] = useState<'1M' | '3M' | '1Y'>('1M');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Chart Area (2 Columns) */}
      <div className="lg:col-span-2 oneofone-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-cormorant font-semibold text-[#FAF7F1]">Net Asset Value (NAV) Trajectory</h3>
            <p className="text-xs text-[#E9DDCA]/60 font-manrope">30 kunlik kapital o‘sish dinamikasi</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-manrope">
            {(['1M', '3M', '1Y'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  period === p
                    ? 'bg-[#481B24] text-[#C6A477] border border-[#C6A477]/40'
                    : 'text-[#E9DDCA]/60 hover:text-[#FAF7F1]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Elegant SVG Chart Representation */}
        <div className="h-64 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradientOneOfOne" x1="0%" y1="0%" x2="0%" y2="1">
                <stop offset="0%" stopColor="#C6A477" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#481B24" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Subtle Grid Lines */}
            <line x1="0" y1="50" x2="600" y2="50" stroke="#C6A477" strokeWidth="0.5" strokeOpacity="0.12" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#C6A477" strokeWidth="0.5" strokeOpacity="0.12" />
            <line x1="0" y1="150" x2="600" y2="150" stroke="#C6A477" strokeWidth="0.5" strokeOpacity="0.12" />

            {/* Gradient Area */}
            <path
              d="M 0 160 Q 100 140 180 110 T 360 80 T 480 40 T 600 25 L 600 200 L 0 200 Z"
              fill="url(#chartGradientOneOfOne)"
            />
            {/* Glowing Golden Stroke Line */}
            <path
              d="M 0 160 Q 100 140 180 110 T 360 80 T 480 40 T 600 25"
              fill="none"
              stroke="#C6A477"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Apex Highlight Point */}
            <circle cx="600" cy="25" r="4.5" fill="#FAF7F1" stroke="#C6A477" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#C6A477]/15 text-xs font-manrope text-[#E9DDCA]/70">
          <span>Boshlang‘ich: $216,000</span>
          <span className="text-[#C6A477] font-semibold">Maksimal: $252,000</span>
          <span>Hozirgi: $248,650</span>
        </div>
      </div>

      {/* Capital Allocation Breakdown (1 Column) */}
      <div className="oneofone-panel p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-cormorant font-semibold text-[#FAF7F1] mb-1">Aktivlar Taqsimoti</h3>
          <p className="text-xs text-[#E9DDCA]/60 font-manrope mb-6">Strategik portfel vaznlari</p>

          <div className="space-y-4 text-xs font-manrope">
            <div>
              <div className="flex justify-between text-[#E9DDCA] mb-1">
                <span>Paper BTC & ETH</span>
                <span className="font-semibold text-[#FAF7F1]">45% ($111,892)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#170F0D]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#C6A477] to-[#DECCAE]" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#E9DDCA] mb-1">
                <span>Cold Vault Fiat Reserve</span>
                <span className="font-semibold text-[#FAF7F1]">30% ($74,595)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#170F0D]">
                <div className="h-full rounded-full bg-[#481B24]" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#E9DDCA] mb-1">
                <span>Gold & Commodities (XAU)</span>
                <span className="font-semibold text-[#FAF7F1]">15% ($37,297)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#170F0D]">
                <div className="h-full rounded-full bg-[#96764D]" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#E9DDCA] mb-1">
                <span>Syndicate Liquid Pool</span>
                <span className="font-semibold text-[#FAF7F1]">10% ($24,865)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#170F0D]">
                <div className="h-full rounded-full bg-[#292321]" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#C6A477]/15">
          <Link
            href="/analytics"
            className="w-full py-2.5 rounded-xl text-xs font-manrope font-semibold oneofone-btn-burgundy flex items-center justify-center gap-2"
          >
            <span>Batafsil Tahlilni Ko‘rish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
