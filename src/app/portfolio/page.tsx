// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY PORTFOLIO HUB (/portfolio)
// Sovereign Wealth Allocations, Net Asset Trajectories & Institutional Breakdown
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import { PortfolioPanel } from '@/components/one-of-one/PortfolioPanel';
import {
  TrendingUp,
  PieChart,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Coins,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#090706] text-[#FAF7F1] flex flex-col font-sans selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Refined Luxury Navbar */}
      <LuxuryNavbar />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="border-b border-[#C6A477]/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#54252D]/40 border border-[#C6A477]/30 text-[10px] font-mono text-[#C6A477] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Institutsional Portfel Arxitekturasi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF7F1] tracking-wide">
              INVESTITSIYA PORTFELI
            </h1>
            <p className="text-sm text-[#C7BAA7] mt-1.5 max-w-2xl leading-relaxed">
              Jami kapital taqsimoti, real vaqtdagi daromadlilik egri chizig‘i va xatarlardan himoyalangan zaxiralar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/trading">
              <button className="px-5 py-2.5 rounded-xl bg-[#C6A477] hover:bg-[#B38E60] text-[#120A08] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(198,164,119,0.3)]">
                <span>YANGI POZITSIYA OCHISH</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-1 shadow-lg">
            <span className="text-[10px] font-mono text-[#C7BAA7] uppercase tracking-wider">JAMI PORTFEL QIYMATHI</span>
            <div className="text-2xl font-serif font-bold text-[#FAF7F1]">$12,847.32</div>
            <span className="text-[11px] font-mono text-[#3DD898] font-semibold block">+12.5% o‘sish</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-1 shadow-lg">
            <span className="text-[10px] font-mono text-[#C7BAA7] uppercase tracking-wider">INVESTITSIYA QILINGAN</span>
            <div className="text-2xl font-serif font-bold text-[#C6A477]">$8,932.17</div>
            <span className="text-[11px] font-mono text-[#3DD898] font-semibold block">+8.3% daromad</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-1 shadow-lg">
            <span className="text-[10px] font-mono text-[#C7BAA7] uppercase tracking-wider">ZAXIRA JAMG‘ARMA</span>
            <div className="text-2xl font-serif font-bold text-[#FAF7F1]">$2,104.50</div>
            <span className="text-[11px] font-mono text-[#3DD898] font-semibold block">+6.7% oylik</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-1 shadow-lg">
            <span className="text-[10px] font-mono text-[#C7BAA7] uppercase tracking-wider">PORTFEL O‘SISHI</span>
            <div className="text-2xl font-serif font-bold text-[#3DD898]">+24.8%</div>
            <span className="text-[11px] font-mono text-[#C7BAA7] block">Yillik indeksatsiya</span>
          </div>
        </div>

        {/* Full Portfolio Panel (Interactive SVG Chart & Asset Allocations) */}
        <PortfolioPanel />

        {/* Detailed Asset Table */}
        <div className="p-6 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#FAF7F1]">Aktivlar Taxtasi</h3>
            <span className="text-xs font-mono text-[#C6A477]">4 Ta Asosiy Pozitsiya</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#C6A477]/20 text-[#C7BAA7] uppercase">
                  <th className="py-3 px-4">Aktiv</th>
                  <th className="py-3 px-4">Ulus (% Portfel)</th>
                  <th className="py-3 px-4">Joriy Narx</th>
                  <th className="py-3 px-4">Qoldiq</th>
                  <th className="py-3 px-4 text-right">24s O‘zgarish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C6A477]/10">
                {[
                  { name: 'Bitcoin (BTC)', share: '45.0%', price: '$67,432.18', balance: '0.086 BTC ($5,799.16)', change: '+2.8%', up: true },
                  { name: 'Ethereum (ETH)', share: '24.5%', price: '$3,245.67', balance: '0.969 ETH ($3,145.05)', change: '+1.9%', up: true },
                  { name: 'Oltin Zaxirasi (XAU)', share: '18.5%', price: '$2,389.12', balance: '1.00 Oz ($2,389.12)', change: '+0.4%', up: true },
                  { name: 'Erkin Likvid Naqd (USD)', share: '12.0%', price: '$1.00', balance: '$1,513.99', change: '0.0%', up: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#140D0B] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#FAF7F1]">{row.name}</td>
                    <td className="py-3.5 px-4 text-[#C6A477]">{row.share}</td>
                    <td className="py-3.5 px-4 text-[#FAF7F1]">{row.price}</td>
                    <td className="py-3.5 px-4 text-[#C7BAA7]">{row.balance}</td>
                    <td className={`py-3.5 px-4 text-right font-bold ${row.up ? 'text-[#3DD898]' : 'text-[#EF4444]'}`}>
                      {row.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 3. Luxury Refined Footer */}
      <LuxuryFooter />
    </div>
  );
}
