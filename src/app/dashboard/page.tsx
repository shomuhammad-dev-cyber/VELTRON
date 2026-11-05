// ==============================================================================
// VELTRON ONE OF ONE BESPOKE LUXURY DASHBOARD (/dashboard)
// Strict recreation of target layout (Left Sidebar - Center Metrics & Charts - Right AI & Academy)
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
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
  Search,
  PieChart,
  Target,
  BarChart3,
  Award,
  Zap,
  Flame,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export function DashboardPage() {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'UZS'>('USD');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState<'1M' | '3M' | '1Y'>('1M');
  const [filterType, setFilterType] = useState('ALL');

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '';
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Wallet, href: '/dashboard' },
    { id: 'markets', label: 'Markets', icon: TrendingUp, href: '/markets' },
    { id: 'trading', label: 'Trading', icon: SlidersHorizontal, href: '/trading' },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart, href: '/analytics' },
    { id: 'education', label: 'Education', icon: GraduationCap, href: '/education' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, href: '/ai-assistant' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'ranking', label: 'Ranking', icon: Trophy, href: '/ranking' },
    { id: 'settings', label: 'Settings', icon: ShieldCheck, href: '/settings' },
  ];

  const transactions = [
    {
      action: 'BTC/USD Buy Order (Paper)',
      category: 'Paper Market Execution',
      time: 'Bugun, 14:32',
      amount: '+$12,500.00',
      positive: true,
      status: 'Bajarildi',
      type: 'TRADE',
    },
    {
      action: 'Cold Vault Allocation',
      category: 'Treasury Rebalance',
      time: 'Kecha, 18:20',
      amount: '-$5,000.00',
      positive: false,
      status: 'Muvaffaqiyatli',
      type: 'VAULT',
    },
    {
      action: 'Simulated Inflow (Stripe)',
      category: 'Demo Sandbox Top-Up',
      time: '01 Noyabr, 10:15',
      amount: '+$25,000.00',
      positive: true,
      status: 'Kiritildi',
      type: 'DEPOSIT',
    },
    {
      action: 'XAU/USD Gold Hedge',
      category: 'Commodities Hedge',
      time: '31 Oktabr, 16:45',
      amount: '+$4,850.00',
      positive: true,
      status: 'Bajarildi',
      type: 'TRADE',
    },
  ];

  const filteredTransactions =
    filterType === 'ALL'
      ? transactions
      : transactions.filter((t) => t.type === filterType);

  return (
    <div className="min-h-screen bg-[#090706] text-[#E9DDCA] font-manrope selection:bg-[#C6A477]/30 selection:text-white flex flex-col">
      {/* 1. LUXURY NAVBAR */}
      <LuxuryNavbar />

      {/* 2. MAIN 3-COLUMN COCKPIT (LEFT SIDEBAR - CENTER OPERATIONS - RIGHT AI & ACADEMY) */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C6A477]/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-manrope text-[#C6A477] tracking-wider uppercase mb-1">
              <span>EXECUTIVE CONTROL COCKPIT</span>
              <span>•</span>
              <span>MANSORY 1 OF 1 SPECIFICATION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-cormorant font-semibold text-[#FAF7F1]">
              Sovereign Treasury Desk
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center p-1 rounded-xl bg-[#170F0D] border border-[#C6A477]/30 text-xs font-manrope">
              {(['USD', 'EUR', 'GBP', 'UZS'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    currency === c
                      ? 'bg-[#481B24] text-[#FAF7F1] border border-[#C6A477]/40 shadow-sm'
                      : 'text-[#E9DDCA]/60 hover:text-[#FAF7F1]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => alert('Virtual $10,000 depozit muvaffaqiyatli qabul qilindi!')}
              className="px-4 py-2 rounded-xl text-xs font-semibold oneofone-btn-gold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Depozit Kiritish</span>
            </button>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ============================================================ */}
          {/* LEFT COLUMN: Sidebar (2 Cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-2 oneofone-panel p-4 space-y-6">
            <div>
              <div className="text-[10px] font-manrope tracking-[0.25em] text-[#C6A477] uppercase font-semibold mb-3 px-2">
                PORTAL
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-manrope font-medium transition-all ${
                        isActive
                          ? 'bg-[#481B24] text-[#FAF7F1] border border-[#C6A477]/40 shadow-sm'
                          : 'text-[#E9DDCA]/70 hover:bg-[#170F0D] hover:text-[#FAF7F1]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#C6A477]' : 'text-[#C6A477]/70'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#C6A477]" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-3 rounded-xl bg-[#090706] border border-[#C6A477]/25 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FAF7F1] mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6A477]" />
                <span>Sovereign Guard</span>
              </div>
              <p className="text-[10px] text-[#E9DDCA]/60 leading-relaxed font-manrope">
                Tier-1 Sandbox Zero CVV/PIN Isolation Active.
              </p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CENTER COLUMN: Main Operations (7 Cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C6A477]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Aktivlar, tranzaksiyalar va bozorlarni qidiring (Ctrl+K)..."
                suppressHydrationWarning
                className="w-full bg-[#170F0D] border border-[#C6A477]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E9DDCA] placeholder-[#E9DDCA]/40 focus:outline-none focus:border-[#C6A477]"
              />
            </div>

            {/* 4 Financial Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="oneofone-panel p-4">
                <div className="flex items-center justify-between text-xs font-manrope text-[#C6A477] uppercase mb-1">
                  <span className="text-[10px] tracking-wider">TOTAL BALANCE</span>
                  <Wallet className="w-3.5 h-3.5 text-[#C6A477]" />
                </div>
                <div className="text-2xl font-cormorant font-semibold text-[#FAF7F1] tabular-nums mb-1">
                  {formatMoney(248650)}
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +14.8% 30d
                </span>
              </div>

              <div className="oneofone-panel-burgundy p-4">
                <div className="flex items-center justify-between text-xs font-manrope text-[#C6A477] uppercase mb-1">
                  <span className="text-[10px] tracking-wider">INVESTMENTS</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#C6A477]" />
                </div>
                <div className="text-2xl font-cormorant font-semibold text-[#FAF7F1] tabular-nums mb-1">
                  {formatMoney(136750)}
                </div>
                <span className="text-[10px] text-[#FAF7F1] font-mono">BTC, ETH, XAU Spot</span>
              </div>

              <div className="oneofone-panel p-4">
                <div className="flex items-center justify-between text-xs font-manrope text-[#C6A477] uppercase mb-1">
                  <span className="text-[10px] tracking-wider">SAVINGS VAULT</span>
                  <Lock className="w-3.5 h-3.5 text-[#C6A477]" />
                </div>
                <div className="text-2xl font-cormorant font-semibold text-[#FAF7F1] tabular-nums mb-1">
                  {formatMoney(65000)}
                </div>
                <span className="text-[10px] text-[#C6A477] font-mono">100% Isolated</span>
              </div>

              <div className="oneofone-panel p-4">
                <div className="flex items-center justify-between text-xs font-manrope text-[#C6A477] uppercase mb-1">
                  <span className="text-[10px] tracking-wider">PORTFOLIO YIELD</span>
                  <Zap className="w-3.5 h-3.5 text-[#C6A477]" />
                </div>
                <div className="text-2xl font-cormorant font-semibold text-[#FAF7F1] tabular-nums mb-1">
                  +21.4%
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Simulated Net</span>
              </div>
            </div>

            {/* NAV Trajectory Chart */}
            <div className="oneofone-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-cormorant font-semibold text-[#FAF7F1]">Net Asset Value (NAV) Trajectory</h3>
                  <p className="text-[11px] text-[#E9DDCA]/60 font-manrope">Portfel qiymatining dinamik o‘sishi</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-manrope">
                  {(['1M', '3M', '1Y'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all ${
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

              <div className="h-52 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="dashChartGrad" x1="0%" y1="0%" x2="0%" y2="1">
                      <stop offset="0%" stopColor="#C6A477" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#481B24" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="45" x2="600" y2="45" stroke="#C6A477" strokeWidth="0.5" strokeOpacity="0.1" />
                  <line x1="0" y1="90" x2="600" y2="90" stroke="#C6A477" strokeWidth="0.5" strokeOpacity="0.1" />
                  <line x1="0" y1="135" x2="600" y2="135" stroke="#C6A477" strokeWidth="0.5" strokeOpacity="0.1" />

                  <path
                    d="M 0 140 Q 100 120 180 95 T 360 70 T 480 35 T 600 20 L 600 180 L 0 180 Z"
                    fill="url(#dashChartGrad)"
                  />
                  <path
                    d="M 0 140 Q 100 120 180 95 T 360 70 T 480 35 T 600 20"
                    fill="none"
                    stroke="#C6A477"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="600" cy="20" r="4" fill="#FAF7F1" stroke="#C6A477" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#C6A477]/15 text-[11px] font-manrope text-[#E9DDCA]/70">
                <span>Start: $216,000</span>
                <span className="text-[#C6A477] font-semibold">Apex: $252,000</span>
                <span>Current: $248,650</span>
              </div>
            </div>

            {/* Market Overview Section */}
            <div className="oneofone-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-cormorant font-semibold text-[#FAF7F1]">Market Overview</h3>
                <Link href="/markets" className="text-xs text-[#C6A477] hover:text-[#FAF7F1] flex items-center gap-1">
                  <span>Barcha Bozorlar</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { sym: 'BTC/USD', price: '$68,420.50', chg: '+4.82%', pos: true },
                  { sym: 'ETH/USD', price: '$3,540.25', chg: '+3.14%', pos: true },
                  { sym: 'SOL/USD', price: '$182.40', chg: '-1.22%', pos: false },
                  { sym: 'XAU/USD', price: '$2,748.90', chg: '+1.05%', pos: true },
                  { sym: 'USD/UZS', price: '12,850 UZS', chg: '+0.12%', pos: true },
                  { sym: 'EUR/USD', price: '1.0825', chg: '-0.24%', pos: false },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href="/trading"
                    className="p-3 rounded-xl bg-[#170F0D] border border-[#C6A477]/20 hover:border-[#C6A477]/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-[#FAF7F1]">{item.sym}</span>
                      <span className={`text-[10px] font-mono font-semibold ${item.pos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.chg}
                      </span>
                    </div>
                    <div className="text-sm font-cormorant font-semibold text-[#E9DDCA] tabular-nums">
                      {item.price}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Audited Transaction Ledger */}
            <div className="oneofone-panel p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-cormorant font-semibold text-[#FAF7F1]">
                    Audited Transaction Ledger
                  </h3>
                  <p className="text-[11px] text-[#E9DDCA]/60 font-manrope">
                    So‘nggi tranzaksiyalar va virtual orderlar
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center p-1 rounded-xl bg-[#090706] border border-[#C6A477]/30 text-xs font-manrope">
                    {(['ALL', 'TRADE', 'VAULT', 'DEPOSIT'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          filterType === type
                            ? 'bg-[#481B24] text-[#FAF7F1] border border-[#C6A477]/40'
                            : 'text-[#E9DDCA]/60 hover:text-[#FAF7F1]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => alert('CSV fayli yuklab olindi (Simulyatsiya)')}
                    className="px-3 py-1 rounded-xl bg-[#170F0D] border border-[#C6A477]/30 text-xs text-[#C6A477] hover:border-[#C6A477] flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Eksport</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-manrope">
                  <thead>
                    <tr className="border-b border-[#C6A477]/20 text-[#C6A477] uppercase text-[10px] tracking-wider">
                      <th className="pb-2.5">Amaliyot</th>
                      <th className="pb-2.5">Kategoriya</th>
                      <th className="pb-2.5">Vaqt</th>
                      <th className="pb-2.5">Miqdor</th>
                      <th className="pb-2.5 text-right">Holat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C6A477]/10">
                    {filteredTransactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-[#170F0D]/60 transition-colors">
                        <td className="py-3 font-medium text-[#FAF7F1]">{tx.action}</td>
                        <td className="py-3 text-[#E9DDCA]/70">{tx.category}</td>
                        <td className="py-3 text-[#E9DDCA]/50 font-mono text-[11px]">{tx.time}</td>
                        <td className={`py-3 font-mono font-semibold ${tx.positive ? 'text-emerald-400' : 'text-[#FAF7F1]'}`}>
                          {tx.amount}
                        </td>
                        <td className="py-3 text-right">
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

          {/* ============================================================ */}
          {/* RIGHT COLUMN: AI Assistant, Education, Achievements (3 Cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Assistant */}
            <div className="oneofone-panel-burgundy p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-manrope text-[#C6A477] font-semibold">
                  <Sparkles className="w-4 h-4 text-[#C6A477]" />
                  <span>COGNITIVE ORACLE</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#170F0D] border border-[#C6A477]/30 text-[#C6A477]">
                  4.2ms
                </span>
              </div>

              <h4 className="text-lg font-cormorant font-semibold text-[#FAF7F1]">
                Neyron Maslahatchi
              </h4>
              <p className="text-xs text-[#E9DDCA]/80 font-manrope leading-relaxed">
                "BTC/USD $68,400 atrofida barqaror. Xavfni kamaytirish uchun oltin (XAU) xedjini 15% gacha oshirish tavsiya etiladi."
              </p>

              <Link href="/ai-assistant" className="block w-full">
                <button className="w-full py-2.5 rounded-xl text-xs font-semibold oneofone-btn-gold flex items-center justify-center gap-1.5">
                  <span>ORACLE BILAN MULOQOT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {/* Education Progress */}
            <div className="oneofone-panel p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-cormorant font-semibold text-[#FAF7F1]">Ta’lim Progressi</h4>
                <GraduationCap className="w-4 h-4 text-[#C6A477]" />
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Sovereign Architecture', pct: 80 },
                  { name: 'Quantitative Risk', pct: 65 },
                  { name: 'Paper Execution', pct: 40 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-manrope">
                      <span className="text-[#E9DDCA]">{item.name}</span>
                      <span className="text-[#C6A477] font-mono text-[11px]">{item.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#170F0D]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C6A477] to-[#DECCAE]"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/education" className="block text-center text-xs text-[#C6A477] hover:text-[#FAF7F1] pt-2">
                Barcha Modullarni Ko‘rish →
              </Link>
            </div>

            {/* Achievement Statistics */}
            <div className="oneofone-panel p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-cormorant font-semibold text-[#FAF7F1]">Yutuqlar va Reyting</h4>
                <Trophy className="w-4 h-4 text-[#C6A477]" />
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#170F0D] border border-[#C6A477]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                    <div>
                      <p className="text-xs font-semibold text-[#FAF7F1]">12 Kunlik Ketma-ketlik</p>
                      <p className="text-[10px] text-[#E9DDCA]/60">Faoliyat davomiyligi</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">12D</span>
                </div>

                <div className="p-3 rounded-xl bg-[#170F0D] border border-[#C6A477]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#C6A477]" />
                    <div>
                      <p className="text-xs font-semibold text-[#FAF7F1]">Umumiy Tajriba (XP)</p>
                      <p className="text-[10px] text-[#E9DDCA]/60">Akademiya ballari</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#FAF7F1]">4,850 XP</span>
                </div>
              </div>

              <Link href="/ranking" className="block text-center text-xs text-[#C6A477] hover:text-[#FAF7F1] pt-1">
                Yetakchilar Reytingi →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 3. LUXURY FOOTER */}
      <LuxuryFooter />
    </div>
  );
}

export default DashboardPage;
