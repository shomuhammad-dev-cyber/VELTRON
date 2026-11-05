// ==============================================================================
// VELTRON ITALIAN ELEGANCE DASHBOARD PREVIEW COMPONENT
// Contemporary Classic Luxury Executive Financial Control Center
// Palette: Espresso Brown (#211714), Deep Burgundy (#54252D), Warm Ivory (#F0E8DC), Antique Gold (#C1A477)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ItalianLogo } from './ItalianLogo';
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
} from 'lucide-react';

export function ItalianDashboardPreview() {
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'GBP'>('EUR');
  const [activeTab, setActiveTab] = useState('overview');

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';
  const currencyRate = currency === 'EUR' ? 1.0 : currency === 'USD' ? 1.08 : 0.85;

  const formatMoney = (val: number) => {
    return `${currencySymbol}${(val * currencyRate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="min-h-screen bg-[#211714] text-[#F0E8DC] font-sans selection:bg-[#C1A477]/30 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-[#1A110E] border-b border-[#C1A477]/20 px-4 py-2.5 text-center text-xs font-sans text-[#C1A477] flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477]" />
        <span>ITALIAN ELEGANCE DASHBOARD PREVIEW • CONTEMPORARY CLASSIC LUXURY</span>
        <span className="text-[#F0E8DC]/40">|</span>
        <Link href="/preview/italian-elegance" className="underline hover:text-[#FAF7F1]">
          Bosh Sahifa Preview-ga Qaytish →
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-[1720px] mx-auto flex min-h-[calc(100vh-2.5rem)]">
        {/* 1. Left Editorial Walnut Sidebar */}
        <aside className="w-64 lg:w-72 bg-[#1A110E] border-r border-[#C1A477]/20 flex flex-col justify-between p-6 shrink-0 hidden md:flex">
          <div>
            {/* Brand Logo */}
            <div className="pb-8 mb-6 border-b border-[#C1A477]/20">
              <ItalianLogo size="sm" showTagline={true} />
            </div>

            {/* Navigation Category */}
            <div className="text-[10px] font-sans tracking-[0.25em] text-[#C1A477] uppercase font-semibold mb-3 px-3">
              EXECUTIVE PORTAL
            </div>

            <nav className="space-y-1.5">
              {[
                { id: 'overview', label: 'Treasury Overview', icon: Wallet },
                { id: 'markets', label: 'Paper Markets', icon: TrendingUp },
                { id: 'vaults', label: 'Travertine Cards', icon: CreditCard },
                { id: 'intelligence', label: 'Cognitive Oracle', icon: Sparkles },
                { id: 'history', label: 'Audited Ledger', icon: History },
                { id: 'academy', label: 'Private Academy', icon: GraduationCap },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-sans tracking-wide transition-all ${
                    activeTab === item.id
                      ? 'bg-[#54252D] text-[#FAF7F1] font-semibold border border-[#C1A477]/40 shadow-sm'
                      : 'text-[#F0E8DC]/70 hover:text-[#FAF7F1] hover:bg-[#211714]'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-[#C1A477]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* User Profile Mini Badge */}
          <div className="p-4 rounded-xl bg-[#211714] border border-[#C1A477]/20 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-sans text-[#C1A477]">
              <span>TIER-1 ALLOCATOR</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm font-bespoke-serif text-[#FAF7F1]">Sovereign Family Trust</p>
            <p className="text-[10px] text-[#F0E8DC]/60 truncate">trustee@veltron-private.ch</p>
          </div>
        </aside>

        {/* 2. Main Executive Content Stream */}
        <main className="flex-1 min-w-0 p-6 sm:p-10 lg:p-12 overflow-y-auto space-y-8">
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C1A477]/20">
            <div>
              <span className="text-[11px] font-sans tracking-[0.25em] text-[#C1A477] uppercase font-semibold">
                MILANO PRIVATE REPOSITORY
              </span>
              <h1 className="text-2xl sm:text-4xl font-bespoke-serif text-[#FAF7F1] font-normal mt-1">
                Executive Capital Ledger
              </h1>
            </div>

            {/* Actions: Currency Toggle & Export Statement */}
            <div className="flex items-center gap-3">
              {/* Currency Selector */}
              <div className="flex items-center rounded-lg bg-[#1A110E] border border-[#C1A477]/30 p-1 text-xs">
                {(['EUR', 'USD', 'GBP'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-3 py-1 rounded font-sans transition-colors ${
                      currency === curr
                        ? 'bg-[#C1A477] text-[#1A110E] font-bold'
                        : 'text-[#F0E8DC]/70 hover:text-white'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>

              <button className="px-4 py-2 rounded-lg bg-[#54252D] hover:bg-[#60232E] border border-[#C1A477]/30 text-xs font-sans font-semibold text-[#F0E8DC] flex items-center gap-2 transition-colors">
                <Download className="w-3.5 h-3.5 text-[#C1A477]" />
                <span>Export Statement</span>
              </button>
            </div>
          </div>

          {/* 4 Executive Metric Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric 1 */}
            <div className="italian-card p-6">
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#C1A477] uppercase font-semibold">
                NET LIQUIDATION VALUE
              </span>
              <p className="text-3xl font-bespoke-serif text-[#FAF7F1] font-normal mt-2 tracking-tight">
                {formatMoney(1428950)}
              </p>
              <div className="mt-3 pt-3 border-t border-[#C1A477]/15 flex items-center justify-between text-[11px] font-sans">
                <span className="text-[#C1A477]">+18.42% YTD Alpha</span>
                <span className="text-[#F0E8DC]/50">Audited Reserves</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="italian-card p-6">
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#C1A477] uppercase font-semibold">
                MONTHLY CASH INFLOW
              </span>
              <p className="text-3xl font-bespoke-serif text-[#FAF7F1] font-normal mt-2 tracking-tight">
                {formatMoney(12500)}
              </p>
              <div className="mt-3 pt-3 border-t border-[#C1A477]/15 flex items-center justify-between text-[11px] font-sans">
                <span className="text-[#C1A477]">+4.2% vs Previous</span>
                <span className="text-[#F0E8DC]/50">Treasury Yield</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="italian-card p-6">
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#C1A477] uppercase font-semibold">
                DISCIPLINED OUTFLOW
              </span>
              <p className="text-3xl font-bespoke-serif text-[#FAF7F1] font-normal mt-2 tracking-tight">
                {formatMoney(3240)}
              </p>
              <div className="mt-3 pt-3 border-t border-[#C1A477]/15 flex items-center justify-between text-[11px] font-sans">
                <span className="text-[#F0E8DC]/70">25.9% of Income</span>
                <span className="text-[#F0E8DC]/50">Strict Cap</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="italian-card p-6">
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#C1A477] uppercase font-semibold">
                RESERVE BUFFER RATIO
              </span>
              <p className="text-3xl font-bespoke-serif text-[#C1A477] font-normal mt-2 tracking-tight">
                74.1%
              </p>
              <div className="mt-3 pt-3 border-t border-[#C1A477]/15 flex items-center justify-between text-[11px] font-sans">
                <span className="text-[#C1A477]">Tier-1 Solvency</span>
                <span className="text-[#F0E8DC]/50">Zero Leverage</span>
              </div>
            </div>
          </div>

          {/* Clean High-Contrast Finance Chart */}
          <div className="italian-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C1A477]/20">
              <div>
                <span className="text-[10px] font-sans tracking-[0.2em] text-[#C1A477] uppercase font-semibold">
                  QUANTITATIVE PERFORMANCE
                </span>
                <h3 className="text-xl sm:text-2xl font-bespoke-serif text-[#FAF7F1]">
                  Sovereign Capital Trajectory (12 Months)
                </h3>
              </div>

              {/* Chart Timeframe Controls */}
              <div className="flex items-center gap-1.5 text-xs font-sans">
                {['1M', '3M', '6M', '1Y', 'ALL'].map((tf, i) => (
                  <button
                    key={tf}
                    className={`px-3 py-1 rounded transition-colors ${
                      i === 3
                        ? 'bg-[#C1A477] text-[#1A110E] font-bold'
                        : 'text-[#F0E8DC]/70 hover:text-white bg-[#1A110E]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Elegant SVG Chart Visualization (No Neon, Restrained Antique Gold & Deep Burgundy) */}
            <div className="w-full h-64 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 900 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C1A477" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#54252D" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#211714" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Subtle horizontal grid lines */}
                <line x1="0" y1="40" x2="900" y2="40" stroke="#C1A477" strokeOpacity="0.1" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="900" y2="100" stroke="#C1A477" strokeOpacity="0.1" strokeDasharray="4 4" />
                <line x1="0" y1="160" x2="900" y2="160" stroke="#C1A477" strokeOpacity="0.1" strokeDasharray="4 4" />
                <line x1="0" y1="220" x2="900" y2="220" stroke="#C1A477" strokeOpacity="0.15" />

                {/* Area under curve */}
                <path
                  d="M 0 190 Q 150 160 300 170 T 600 110 T 900 45 L 900 220 L 0 220 Z"
                  fill="url(#chartFill)"
                />

                {/* Main trajectory line */}
                <path
                  d="M 0 190 Q 150 160 300 170 T 600 110 T 900 45"
                  fill="none"
                  stroke="#C1A477"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Highlight Point */}
                <circle cx="900" cy="45" r="5" fill="#F0E8DC" stroke="#54252D" strokeWidth="2" />
              </svg>

              {/* Price Callout */}
              <div className="absolute top-2 right-4 px-3 py-1.5 rounded-lg bg-[#1A110E] border border-[#C1A477]/40 text-xs font-sans">
                <span className="text-[#C1A477] font-semibold">CURRENT CAPITAL: </span>
                <span className="text-[#FAF7F1] font-mono font-bold">{formatMoney(1428950)}</span>
              </div>
            </div>
          </div>

          {/* Cards & Recent Ledger Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 5 Cols: Demo Sandbox Travertine Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#C1A477] uppercase font-semibold">
                    SANDBOX ALLOCATION
                  </span>
                  <h3 className="text-xl font-bespoke-serif text-[#FAF7F1]">Travertine Demo Cards</h3>
                </div>
                <button className="p-2 rounded-lg bg-[#54252D] border border-[#C1A477]/30 text-xs text-[#F0E8DC] hover:text-white">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Card 1: Warm Ivory Calacatta */}
              <div className="bespoke-card-ivory p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-sans tracking-widest uppercase font-bold text-[#54252D]">
                    VELTRON PRIVATE RESERVE
                  </span>
                  <Building className="w-5 h-5 text-[#54252D]" />
                </div>
                <p className="text-xs font-mono text-[#34302C] tracking-widest">
                  •••• •••• •••• 8824
                </p>
                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#34302C]/60">SANDBOX BALANCE</span>
                    <p className="text-2xl font-bespoke-serif font-bold text-[#1A110E]">{formatMoney(85200)}</p>
                  </div>
                  <span className="text-xs font-sans font-bold text-[#54252D]">TIER-1 SANDBOX</span>
                </div>
              </div>

              {/* Card 2: Deep Burgundy Velvet */}
              <div className="bespoke-card-burgundy p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-sans tracking-widest uppercase font-bold text-[#C1A477]">
                    TREASURY YIELD VAULT
                  </span>
                  <ShieldCheck className="w-5 h-5 text-[#C1A477]" />
                </div>
                <p className="text-xs font-mono text-[#F0E8DC]/80 tracking-widest">
                  •••• •••• •••• 4192
                </p>
                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#F0E8DC]/60">SANDBOX BALANCE</span>
                    <p className="text-2xl font-bespoke-serif font-bold text-[#FAF7F1]">{formatMoney(45000)}</p>
                  </div>
                  <span className="text-xs font-sans font-bold text-[#C1A477]">ZERO CVV/PIN</span>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Real Audited Transactions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#C1A477] uppercase font-semibold">
                    AUDITED FINANCIAL LEDGER
                  </span>
                  <h3 className="text-xl font-bespoke-serif text-[#FAF7F1]">Recent Treasury Activity</h3>
                </div>
                <span className="text-xs font-sans text-[#C1A477]">Real Database Feeds</span>
              </div>

              <div className="italian-card overflow-hidden">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#C1A477]/20 text-[#C1A477] text-[10px] tracking-wider uppercase bg-[#1A110E]/60">
                      <th className="py-3 px-4">Entity / Counterparty</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C1A477]/10 text-[#F0E8DC]/85">
                    {[
                      { counterparty: 'Sovereign Treasury Vault Deposit', cat: 'Capital Inflow', status: 'Settled', amount: 5000, positive: true },
                      { counterparty: 'Milano Bourse Execution Alpha', cat: 'Paper Trade', status: 'Executed', amount: 1250, positive: true },
                      { counterparty: 'Private Custody Management Fee', cat: 'Advisory', status: 'Audited', amount: 420, positive: false },
                      { counterparty: 'Central Bank Liquidity Reserve Allocation', cat: 'Reserve Buffer', status: 'Settled', amount: 2800, positive: false },
                      { counterparty: 'Institutional Gold Bullion 999.9 Sweep', cat: 'Commodity', status: 'Verified', amount: 4500, positive: true },
                    ].map((tx, idx) => (
                      <tr key={idx} className="hover:bg-[#54252D]/20 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-[#FAF7F1]">{tx.counterparty}</td>
                        <td className="py-3.5 px-4 text-[#C1A477]">{tx.cat}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#1A110E] border border-[#C1A477]/30 text-[#C1A477]">
                            {tx.status}
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 text-right font-mono font-semibold ${tx.positive ? 'text-[#C1A477]' : 'text-[#F0E8DC]'}`}>
                          {tx.positive ? '+' : '-'}{formatMoney(tx.amount)}
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
