// ==============================================================================
// VELTRON BESPOKE WIDE DASHBOARD SECTION (EXACT RECREATION OF TARGET IMAGE)
// 3-Column Luxury Architecture:
// LEFT: Navigation Sidebar (Dashboard, Markets, Trading, Portfolio, etc.) + Premium Plan
// CENTER: Search Bar, 4 Metric Cards (Total Balance $12,847.32, Investments $8,932.17,
//         Savings $2,104.50, Growth +24.8%), Market Overview (BTC, ETH, TSLA, GOLD),
//         Master Trading with VELTRON architectural card
// RIGHT: AI Financial Assistant (with 3D Gold Spheres), Your Progress (78% Radial Gauge)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  PieChart,
  GraduationCap,
  Sparkles,
  BarChart3,
  Trophy,
  Settings,
  Search,
  Bell,
  SlidersHorizontal,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Clock,
  Award,
} from 'lucide-react';

// Custom icons to guarantee 100% type-safety
function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function TradingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3L4 7l4 4" />
      <path d="M4 7h16" />
      <path d="M16 21l4-4-4-4" />
      <path d="M20 17H4" />
    </svg>
  );
}

export function WideDashboardSection() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
    { id: 'markets', label: 'Markets', icon: BarChart3, href: '/markets' },
    { id: 'trading', label: 'Trading', icon: TradingIcon, href: '/trading' },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart, href: '/wallet' },
    { id: 'education', label: 'Education', icon: GraduationCap, href: '/education' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, href: '/ai-assistant' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, href: '/analytics' },
    { id: 'ranking', label: 'Ranking', icon: Trophy, href: '/ranking' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard' },
  ];

  const marketAssets = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: '$67,432.18',
      change: '+2.8%',
      isPositive: true,
      color: 'bg-[#F7931A]',
      icon: '₿',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: '$3,245.67',
      change: '+1.9%',
      isPositive: true,
      color: 'bg-[#627EEA]',
      icon: 'Ξ',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla',
      price: '$248.31',
      change: '-0.7%',
      isPositive: false,
      color: 'bg-[#E82127]',
      icon: 'T',
    },
    {
      symbol: 'GOLD',
      name: 'Gold',
      price: '$2,389.12',
      change: '+0.4%',
      isPositive: true,
      color: 'bg-[#C6A477]',
      icon: 'Au',
    },
  ];

  return (
    <section className="relative z-30 bg-[#0B0807] rounded-t-[36px] border-t border-[#C6A477]/35 shadow-[0_-16px_50px_rgba(198,164,119,0.08)] -mt-6 pt-7 pb-16 text-[#E9DDCA] select-none">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ==================================================================== */}
          {/* 1. LEFT COLUMN: NAVIGATION SIDEBAR & PREMIUM PLAN (Col Span 2)       */}
          {/* ==================================================================== */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
            <div className="space-y-1.5">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-manrope font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D6BB92] to-[#B8986B] text-[#120E0C] font-semibold shadow-md'
                        : 'text-[#8E8278] hover:text-[#FAF7F1] hover:bg-[#1A1210]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#120E0C]' : 'text-[#8E8278]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Premium Plan Card & Version */}
            <div className="space-y-3 pt-4 border-t border-[#C6A477]/10">
              <Link href="/wallet">
                <div className="bg-[#150F11] border border-[#C6A477]/25 hover:border-[#C6A477]/50 rounded-xl p-3 flex items-center justify-between group transition-all cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    {/* Crown SVG */}
                    <svg className="w-4 h-4 text-[#C6A477] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                    </svg>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#C6A477] transition-colors">
                        Premium Plan
                      </p>
                      <p className="text-[10px] text-[#8E8278]">Active until 2026</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C6A477] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <div className="text-[10px] text-[#5A5048] font-manrope tracking-wider text-center">
                VELTRON v2.0.0
              </div>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* 2. CENTER COLUMN: SEARCH, 4 METRICS, MARKETS, ACADEMY (Col Span 7)   */}
          {/* ==================================================================== */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Search Bar */}
            <div className="bg-[#140D0B] border border-[#C6A477]/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#8E8278] shadow-inner">
              <div className="flex items-center gap-2.5 w-full">
                <Search className="w-4 h-4 text-[#8E8278] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets, tools, or anything..."
                  suppressHydrationWarning
                  className="bg-transparent border-none outline-none text-[#FAF7F1] placeholder-[#6E645A] w-full text-xs font-manrope"
                />
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-2">
                <button className="relative hover:text-[#FAF7F1] transition-colors">
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#E82127]" />
                </button>
                <button className="hover:text-[#FAF7F1] transition-colors">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Top 4 Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {/* Card 1: Total Balance */}
              <div className="bg-[#140D0B] border border-[#C6A477]/25 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-md">
                <div>
                  <div className="flex items-center justify-between text-[#8E8278] text-[11px] font-manrope">
                    <div className="flex items-center gap-1.5">
                      <span>Total Balance</span>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="hover:text-white transition-colors"
                      >
                        {showBalance ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-2xl font-cormorant font-normal text-white tracking-tight flex items-baseline">
                    {showBalance ? (
                      <>
                        <span>$12,847</span>
                        <span className="text-base text-[#C6A477]">.32</span>
                      </>
                    ) : (
                      <span>$ •••••••</span>
                    )}
                  </div>
                </div>

                {/* SVG Golden Wave Graphic */}
                <div className="my-2 h-7 w-full">
                  <svg className="w-full h-full" viewBox="0 0 160 30" fill="none">
                    <path
                      d="M0 24 C 30 26, 45 18, 70 20 C 95 22, 110 8, 135 10 C 145 11, 155 4, 160 2"
                      stroke="#C6A477"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="160" cy="2" r="2.5" fill="#FAF7F1" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] font-manrope pt-1 border-t border-[#C6A477]/10">
                  <span className="text-[#34D399] font-medium flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    +12.5%
                  </span>
                  <Link
                    href="/wallet"
                    className="text-[#8E8278] hover:text-[#C6A477] transition-colors flex items-center gap-0.5 text-[10px]"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Investments */}
              <div className="bg-[#140D0B] border border-[#C6A477]/20 rounded-2xl p-4 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-[#8E8278] text-[11px] font-manrope">
                  <span>Investments</span>
                  <BarChart3 className="w-3.5 h-3.5 text-[#C6A477]" />
                </div>

                <div className="my-3 text-2xl font-cormorant font-normal text-white tracking-tight flex items-baseline">
                  <span>$8,932</span>
                  <span className="text-base text-[#C6A477]">.17</span>
                </div>

                <div className="text-[11px] font-manrope text-[#34D399] font-medium flex items-center gap-0.5 pt-1 border-t border-[#C6A477]/10">
                  <ArrowUpRight className="w-3 h-3" />
                  +8.3%
                </div>
              </div>

              {/* Card 3: Savings */}
              <div className="bg-[#140D0B] border border-[#C6A477]/20 rounded-2xl p-4 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-[#8E8278] text-[11px] font-manrope">
                  <span>Savings</span>
                  {/* Piggy Bank / Vault SVG */}
                  <svg className="w-3.5 h-3.5 text-[#C6A477]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8.7 3.3 2 4.3V20h3v-2h6v2h3v-4.5c1.4-1.2 2-2.7 2-4.5 0-2.5-1.3-4-2-6z" />
                    <circle cx="9" cy="11" r="1" />
                  </svg>
                </div>

                <div className="my-3 text-2xl font-cormorant font-normal text-white tracking-tight flex items-baseline">
                  <span>$2,104</span>
                  <span className="text-base text-[#C6A477]">.50</span>
                </div>

                <div className="text-[11px] font-manrope text-[#34D399] font-medium flex items-center gap-0.5 pt-1 border-t border-[#C6A477]/10">
                  <ArrowUpRight className="w-3 h-3" />
                  +6.7%
                </div>
              </div>

              {/* Card 4: Portfolio Growth */}
              <div className="bg-[#140D0B] border border-[#C6A477]/20 rounded-2xl p-4 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-[#8E8278] text-[11px] font-manrope">
                  <span>Portfolio Growth</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#C6A477]" />
                </div>

                <div className="my-3 text-2xl font-cormorant font-normal text-white tracking-tight">
                  +24.8%
                </div>

                <div className="text-[10px] font-manrope text-[#8E8278] pt-1 border-t border-[#C6A477]/10">
                  Simulated Net Yield
                </div>
              </div>
            </div>

            {/* Bottom Row: Market Overview & Master Trading Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Card: Market Overview • Live */}
              <div className="bg-[#140D0B] border border-[#C6A477]/20 rounded-2xl p-4 relative overflow-hidden shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white font-manrope">
                        Market Overview
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#34D399] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                        Live
                      </span>
                    </div>
                  </div>

                  {/* 4 Asset Rows */}
                  <div className="space-y-2.5">
                    {marketAssets.map((asset) => (
                      <div
                        key={asset.symbol}
                        className="flex items-center justify-between text-xs py-1 hover:bg-white/[0.02] rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-full ${asset.color} flex items-center justify-center text-white font-bold text-[9px] shadow-sm`}
                          >
                            {asset.icon}
                          </div>
                          <div>
                            <span className="font-semibold text-white">{asset.name}</span>
                            <span className="text-[10px] text-[#8E8278] ml-1.5">{asset.symbol}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-medium text-[#FAF7F1]">{asset.price}</span>
                          <span
                            className={`text-[10px] font-semibold flex items-center w-12 justify-end ${
                              asset.isPositive ? 'text-[#34D399]' : 'text-[#E82127]'
                            }`}
                          >
                            {asset.isPositive ? (
                              <ArrowUpRight className="w-3 h-3 mr-0.5" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 mr-0.5" />
                            )}
                            {asset.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtle Ambient Gold Sparkline Across the Bottom */}
                <div className="h-4 w-full mt-2">
                  <svg className="w-full h-full opacity-40" viewBox="0 0 200 20" fill="none">
                    <path
                      d="M0 15 Q 40 5, 80 12 T 160 6 T 200 2"
                      stroke="#C6A477"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Right Card: Master Trading with VELTRON (Neoclassical Colonnade Background) */}
              <div className="relative rounded-2xl overflow-hidden border border-[#C6A477]/30 shadow-xl flex flex-col justify-end p-5 min-h-[200px] group">
                {/* Background Image of Illuminated Classical Roman Colonnade */}
                <img
                  src="/images/trading-academy-colonnade.jpg"
                  alt="Master Trading with VELTRON Architecture"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                {/* Rich Dark Gradient Vignette for Content Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0807] via-[#0B0807]/75 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col items-start">
                  <h3 className="font-cormorant text-2xl text-white leading-tight">
                    Master Trading
                  </h3>
                  <h4 className="font-cormorant text-2xl text-[#C6A477] leading-tight">
                    with VELTRON
                  </h4>
                  <p className="text-[11px] text-[#C9BEB2] font-manrope font-light mt-1">
                    Learn. Practice. Earn.
                  </p>

                  <Link
                    href="/education"
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-manrope font-semibold text-[#120E0D] bg-gradient-to-r from-[#D5B98D] to-[#B8986B] hover:brightness-110 shadow-md transition-all"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* 3. RIGHT COLUMN: AI ASSISTANT & YOUR PROGRESS (Col Span 3)           */}
          {/* ==================================================================== */}
          <div className="lg:col-span-3 space-y-4">
            {/* Top Card: AI Financial Assistant (with 3D Gold Spheres Graphic) */}
            <div className="bg-[#140D0B] border border-[#C6A477]/25 rounded-2xl p-4 relative overflow-hidden shadow-md flex flex-col justify-between min-h-[175px]">
              {/* Right Side 3D Liquid Gold Spheres Image */}
              <div className="absolute top-0 right-0 w-28 h-full pointer-events-none opacity-85">
                <img
                  src="/images/ai-gold-spheres.jpg"
                  alt="AI Assistant 3D Gold Spheres"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#140D0B] via-transparent to-transparent" />
              </div>

              <div className="relative z-10 max-w-[65%]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white font-manrope mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C6A477]" />
                  <span>AI Financial Assistant</span>
                </div>

                <p className="text-[11px] text-[#8E8278] font-manrope leading-snug mb-3">
                  Your personal AI advisor for smarter decisions.
                </p>

                <Link
                  href="/ai-assistant"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[11px] font-manrope font-semibold text-[#120E0D] bg-gradient-to-r from-[#D5B98D] to-[#B8986B] hover:brightness-110 shadow-sm transition-all"
                >
                  <span>Ask Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Bottom Card: Your Progress (78% Radial Progress Ring) */}
            <div className="bg-[#140D0B] border border-[#C6A477]/25 rounded-2xl p-4 shadow-md flex flex-col justify-between min-h-[195px]">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-white font-manrope">Your Progress</span>
                  <Link
                    href="/education"
                    className="text-[11px] text-[#8E8278] hover:text-[#C6A477] transition-colors flex items-center gap-0.5"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>

                {/* Radial Progress Gauge */}
                <div className="flex items-center gap-4 my-2">
                  {/* SVG Circular Ring Gauge */}
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      {/* Background circle path */}
                      <path
                        className="text-[#261A16]"
                        strokeWidth="3.2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Gold Progress stroke path (78%) */}
                      <path
                        stroke="#C6A477"
                        strokeWidth="3.2"
                        strokeDasharray="78, 100"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-cormorant text-base font-normal text-white">
                      78%
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-white font-manrope">
                      Financial Education
                    </div>
                    <div className="text-[10px] text-[#8E8278] font-manrope mt-0.5">
                      Completed 78%
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Bottom Stats: Lessons, Time, Ranking */}
              <div className="grid grid-cols-3 gap-1 pt-3 border-t border-[#C6A477]/15 text-center">
                <div className="flex flex-col items-center">
                  <BookOpen className="w-3.5 h-3.5 text-[#C6A477] mb-1" />
                  <span className="text-[10px] font-semibold text-white">12</span>
                  <span className="text-[9px] text-[#8E8278]">Lessons</span>
                </div>

                <div className="flex flex-col items-center border-x border-[#C6A477]/10">
                  <Clock className="w-3.5 h-3.5 text-[#C6A477] mb-1" />
                  <span className="text-[10px] font-semibold text-white">8h</span>
                  <span className="text-[9px] text-[#8E8278]">Time</span>
                </div>

                <div className="flex flex-col items-center">
                  <Award className="w-3.5 h-3.5 text-[#C6A477] mb-1" />
                  <span className="text-[10px] font-semibold text-white">#124</span>
                  <span className="text-[9px] text-[#8E8278]">Ranking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
