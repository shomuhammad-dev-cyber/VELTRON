// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY DASHBOARD PREVIEW
// Inspired by Rolls-Royce Cullinan Mansory 1 of 1 Executive Control Console
// Palette: Deep Espresso (#211714), Royal Burgundy (#54252D), Champagne Gold (#C1A477), Warm Ivory (#F0E8DC)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BespokeLogo } from './BespokeLogo';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  History,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Lock,
  Download,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  Layers,
  Send,
  Building2 as Building,
  CheckCircle2,
  PieChart,
  Target,
  ArrowRight,
} from 'lucide-react';

export function BespokeDashboardPreview() {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'UZS'>('USD');
  const [activeTab, setActiveTab] = useState('overview');

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : 'UZS ';
  const currencyRate = currency === 'USD' ? 1.0 : currency === 'EUR' ? 0.92 : currency === 'GBP' ? 0.79 : 12850;

  const formatMoney = (val: number) => {
    if (currency === 'UZS') {
      return `${(val * currencyRate).toLocaleString('uz-UZ', { maximumFractionDigits: 0 })} so'm`;
    }
    return `${currencySymbol}${(val * currencyRate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="min-h-screen bg-[#211714] text-[#F0E8DC] font-sans selection:bg-[#C1A477]/30 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-[#1A110E] border-b border-[#C1A477]/25 px-4 py-2.5 text-center text-xs font-sans text-[#C1A477] flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477] animate-ping" />
        <span>BESPOKE ROYAL LUXURY DASHBOARD PREVIEW • 1 OF 1 SPECIFICATION</span>
        <span className="text-[#F0E8DC]/40">|</span>
        <Link href="/preview/bespoke-royal-luxury" className="underline hover:text-[#FAF7F1]">
          Bosh Sahifa Preview-ga Qaytish →
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-[1720px] mx-auto flex min-h-[calc(100vh-2.5rem)]">
        {/* 1. Left Bespoke Walnut Sidebar */}
        <aside className="w-64 lg:w-72 bg-[#1A110E] border-r border-[#C1A477]/25 flex flex-col justify-between p-6 shrink-0 hidden md:flex">
          <div>
            {/* Brand Logo */}
            <div className="pb-8 mb-6 border-b border-[#C1A477]/20">
              <BespokeLogo size="sm" showTagline={true} />
            </div>

            {/* Navigation Category */}
            <div className="text-[10px] font-sans tracking-[0.25em] text-[#C1A477] uppercase font-semibold mb-3 px-3">
              EXECUTIVE COCKPIT
            </div>

            <nav className="space-y-1.5">
              {[
                { id: 'overview', label: 'Treasury Overview', icon: Wallet },
                { id: 'markets', label: 'Paper Markets', icon: TrendingUp },
                { id: 'vaults', label: 'Bespoke Cards', icon: CreditCard },
                { id: 'intelligence', label: 'Cognitive Oracle', icon: Sparkles },
                { id: 'budget', label: 'Budget & Goals', icon: Target },
                { id: 'ledger', label: 'Audited Ledger', icon: History },
                { id: 'academy', label: 'Royal Academy', icon: GraduationCap },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium transition-all ${
                      isActive
                        ? 'bg-[#54252D] text-[#FAF7F1] border border-[#C1A477]/50 shadow-md'
                        : 'text-[#F0E8DC]/70 hover:bg-[#211714] hover:text-[#FAF7F1]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#C1A477]' : 'text-[#C1A477]/70'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#C1A477]" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer: Sovereign Security Badge */}
          <div className="p-4 rounded-xl bg-[#211714] border border-[#C1A477]/25 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FAF7F1] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#C1A477]" />
              <span>Sovereign Guard</span>
            </div>
            <p className="text-[10px] text-[#F0E8DC]/60 leading-relaxed">
              Tier-1 Hardware Security Module & Zero-CVV Isolated Sandbox Protection.
            </p>
          </div>
        </aside>

        {/* 2. Main Executive Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {/* Top Bar: Title & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#C1A477]/20">
            <div>
              <div className="flex items-center gap-2 text-xs font-sans text-[#C1A477] tracking-wider uppercase mb-1">
                <span>MANSORY 1 OF 1 SPECIFICATION</span>
                <span>•</span>
                <span>EXECUTIVE DESK</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bespoke-serif text-[#FAF7F1]">
                Sovereign Treasury Console
              </h1>
            </div>

            {/* Currency Switcher & Quick Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Currency Selector */}
              <div className="flex items-center p-1 rounded-xl bg-[#1A110E] border border-[#C1A477]/30 text-xs font-sans">
                {(['USD', 'EUR', 'GBP', 'UZS'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      currency === c
                        ? 'bg-[#54252D] text-[#FAF7F1] border border-[#C1A477]/40 shadow-sm'
                        : 'text-[#F0E8DC]/60 hover:text-[#FAF7F1]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Action: Add Simulated Capital */}
              <button className="px-4 py-2 rounded-xl text-xs font-semibold bespoke-btn-champagne flex items-center gap-2 shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                <span>Deposit Funds</span>
              </button>
            </div>
          </div>

          {/* 3. Hero Metric Cards (Deep Espresso & Burgundy Satin) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Main Total Capital */}
            <div className="bespoke-card p-6 bespoke-card-stitched relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs font-sans text-[#C1A477] tracking-wider uppercase mb-2">
                <span>TOTAL SOVEREIGN LIQUIDITY</span>
                <span className="p-1 rounded-full bg-[#C1A477]/20 text-[#C1A477]">
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-bespoke-serif text-[#FAF7F1] tabular-nums mb-3">
                {formatMoney(248650)}
              </div>
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="flex items-center text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +14.8%
                </span>
                <span className="text-[#F0E8DC]/60">vs past 30 days</span>
              </div>
            </div>

            {/* Simulated Yield & Trading Profits */}
            <div className="bespoke-card-burgundy p-6 bespoke-card-stitched group">
              <div className="flex items-center justify-between text-xs font-sans text-[#C1A477] tracking-wider uppercase mb-2">
                <span>SIMULATED NET YIELD</span>
                <span className="p-1 rounded-full bg-[#C1A477]/20 text-[#C1A477]">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-bespoke-serif text-[#FAF7F1] tabular-nums mb-3">
                {formatMoney(32480)}
              </div>
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="flex items-center text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +21.4%
                </span>
                <span className="text-[#F0E8DC]/60">paper trading execution</span>
              </div>
            </div>

            {/* Cold Vault Reserve */}
            <div className="bespoke-card-walnut p-6 bespoke-card-stitched group">
              <div className="flex items-center justify-between text-xs font-sans text-[#C1A477] tracking-wider uppercase mb-2">
                <span>COLD VAULT RESERVE</span>
                <span className="p-1 rounded-full bg-[#C1A477]/20 text-[#C1A477]">
                  <Lock className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-bespoke-serif text-[#FAF7F1] tabular-nums mb-3">
                {formatMoney(112000)}
              </div>
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="text-[#C1A477] font-semibold">100% Isolated</span>
                <span className="text-[#F0E8DC]/60">zero real bank exposure</span>
              </div>
            </div>
          </div>

          {/* 4. Portfolio Performance Curve & Allocation Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Chart Area (2 Columns) */}
            <div className="lg:col-span-2 bespoke-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bespoke-serif text-[#FAF7F1]">Net Asset Value (NAV) Trajectory</h3>
                  <p className="text-xs text-[#F0E8DC]/60 font-sans">Sovereign 30-Day Capital Appreciation</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans">
                  <span className="px-2.5 py-1 rounded-lg bg-[#54252D] text-[#C1A477] border border-[#C1A477]/30 font-semibold">
                    1M
                  </span>
                  <span className="px-2.5 py-1 rounded-lg hover:bg-[#211714] text-[#F0E8DC]/60">3M</span>
                  <span className="px-2.5 py-1 rounded-lg hover:bg-[#211714] text-[#F0E8DC]/60">1Y</span>
                </div>
              </div>

              {/* Elegant SVG Chart Representation */}
              <div className="h-64 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradientBespoke" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C1A477" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#54252D" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Subtle Grid Lines */}
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#C1A477" strokeWidth="0.5" strokeOpacity="0.1" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#C1A477" strokeWidth="0.5" strokeOpacity="0.1" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#C1A477" strokeWidth="0.5" strokeOpacity="0.1" />

                  {/* Gradient Area */}
                  <path
                    d="M 0 160 Q 100 140 180 110 T 360 80 T 480 40 T 600 30 L 600 200 L 0 200 Z"
                    fill="url(#chartGradientBespoke)"
                  />
                  {/* Glowing Stroke Line */}
                  <path
                    d="M 0 160 Q 100 140 180 110 T 360 80 T 480 40 T 600 30"
                    fill="none"
                    stroke="#C1A477"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Current Apex Highlight Point */}
                  <circle cx="600" cy="30" r="4" fill="#FAF7F1" stroke="#C1A477" strokeWidth="2" />
                </svg>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#C1A477]/15 text-xs font-sans text-[#F0E8DC]/70">
                <span>Start: {formatMoney(216000)}</span>
                <span className="text-[#C1A477] font-semibold">Peak: {formatMoney(252000)}</span>
                <span>Current: {formatMoney(248650)}</span>
              </div>
            </div>

            {/* Asset Allocation Breakdown (1 Column) */}
            <div className="bespoke-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bespoke-serif text-[#FAF7F1] mb-1">Capital Allocation</h3>
                <p className="text-xs text-[#F0E8DC]/60 font-sans mb-6">Strategic Portfolio Weighting</p>

                <div className="space-y-4 text-xs font-sans">
                  <div>
                    <div className="flex justify-between text-[#F0E8DC] mb-1">
                      <span>Paper BTC & ETH</span>
                      <span className="font-semibold text-[#FAF7F1]">45% ({formatMoney(111892)})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1A110E]">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#C1A477] to-[#D4BC93]" style={{ width: '45%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#F0E8DC] mb-1">
                      <span>Cold Vault Fiat Reserve</span>
                      <span className="font-semibold text-[#FAF7F1]">30% ({formatMoney(74595)})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1A110E]">
                      <div className="h-full rounded-full bg-[#54252D]" style={{ width: '30%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#F0E8DC] mb-1">
                      <span>Gold & Commodities (XAU)</span>
                      <span className="font-semibold text-[#FAF7F1]">15% ({formatMoney(37297)})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1A110E]">
                      <div className="h-full rounded-full bg-[#493329]" style={{ width: '15%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#F0E8DC] mb-1">
                      <span>Syndicate Liquid Pool</span>
                      <span className="font-semibold text-[#FAF7F1]">10% ({formatMoney(24865)})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1A110E]">
                      <div className="h-full rounded-full bg-[#302B28]" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#C1A477]/15">
                <Link
                  href="/analytics"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bespoke-btn-burgundy flex items-center justify-center gap-2"
                >
                  <span>Batafsil Tahlilni Ko‘rish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 5. Savings Goals & Audited Transaction Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Savings Goals */}
            <div className="bespoke-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bespoke-serif text-[#FAF7F1]">Bespoke Goals</h3>
                  <p className="text-xs text-[#F0E8DC]/60 font-sans">Capital Accumulation Targets</p>
                </div>
                <button className="p-1.5 rounded-lg bg-[#54252D] text-[#C1A477] border border-[#C1A477]/30">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#1A110E] border border-[#C1A477]/20">
                  <div className="flex justify-between text-xs font-sans mb-1">
                    <span className="font-semibold text-[#FAF7F1]">Sovereign Bond Reserve</span>
                    <span className="text-[#C1A477]">{formatMoney(85000)} / {formatMoney(100000)}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#211714] mb-2">
                    <div className="h-full rounded-full bg-[#C1A477]" style={{ width: '85%' }} />
                  </div>
                  <span className="text-[10px] text-[#F0E8DC]/60 font-sans">85% bajarilyapti • 15 kun qoldi</span>
                </div>

                <div className="p-4 rounded-xl bg-[#1A110E] border border-[#C1A477]/20">
                  <div className="flex justify-between text-xs font-sans mb-1">
                    <span className="font-semibold text-[#FAF7F1]">Private Syndicate Allocation</span>
                    <span className="text-[#C1A477]">{formatMoney(32000)} / {formatMoney(50000)}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#211714] mb-2">
                    <div className="h-full rounded-full bg-[#54252D]" style={{ width: '64%' }} />
                  </div>
                  <span className="text-[10px] text-[#F0E8DC]/60 font-sans">64% bajarilyapti • 42 kun qoldi</span>
                </div>
              </div>
            </div>

            {/* Audited Transaction Ledger (2 Columns) */}
            <div className="lg:col-span-2 bespoke-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bespoke-serif text-[#FAF7F1]">Audited Transaction Ledger</h3>
                  <p className="text-xs text-[#F0E8DC]/60 font-sans">Recent Virtual Settled Orders</p>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-[#C1A477] hover:text-[#FAF7F1] transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  <span>Eksport (CSV)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#C1A477]/20 text-[#C1A477] uppercase text-[10px] tracking-wider">
                      <th className="pb-3">Amaliyot</th>
                      <th className="pb-3">Kategoriya</th>
                      <th className="pb-3">Vaqt</th>
                      <th className="pb-3">Miqdor</th>
                      <th className="pb-3 text-right">Holat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C1A477]/10">
                    {[
                      {
                        action: 'BTC/USD Buy Order (Paper)',
                        category: 'Paper Market Execution',
                        time: 'Bugun, 14:32',
                        amount: `+${formatMoney(12500)}`,
                        positive: true,
                        status: 'Bajarildi',
                      },
                      {
                        action: 'Cold Vault Allocation',
                        category: 'Treasury Rebalance',
                        time: 'Kecha, 18:20',
                        amount: `-${formatMoney(5000)}`,
                        positive: false,
                        status: 'Muvaffaqiyatli',
                      },
                      {
                        action: 'Simulated Inflow (Stripe)',
                        category: 'Demo Sandbox Top-Up',
                        time: '01 Noyabr, 10:15',
                        amount: `+${formatMoney(25000)}`,
                        positive: true,
                        status: 'Kiritildi',
                      },
                      {
                        action: 'XAU/USD Gold Hedge',
                        category: 'Commodities Hedge',
                        time: '31 Oktabr, 16:45',
                        amount: `+${formatMoney(4850)}`,
                        positive: true,
                        status: 'Bajarildi',
                      },
                    ].map((tx, idx) => (
                      <tr key={idx} className="hover:bg-[#1A110E]/40 transition-colors">
                        <td className="py-3.5 font-medium text-[#FAF7F1]">{tx.action}</td>
                        <td className="py-3.5 text-[#F0E8DC]/70">{tx.category}</td>
                        <td className="py-3.5 text-[#F0E8DC]/50 font-mono text-[11px]">{tx.time}</td>
                        <td className={`py-3.5 font-mono font-semibold ${tx.positive ? 'text-emerald-400' : 'text-[#F0E8DC]'}`}>
                          {tx.amount}
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
