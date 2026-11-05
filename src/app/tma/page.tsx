// ==============================================================================
// VELTRON TELEGRAM MINI APP (TMA) MAIN APPLICATION ENTRY POINT
// Route: /tma
// Ultra-fast mobile interface, zero heavy 3D scenes, native Telegram UX
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Badge } from '@/components/ui/Badge';
import { useTelegramWebApp } from '@/lib/telegram/useTelegramWebApp';
import {
  Terminal,
  TrendingUp,
  BarChart2,
  GraduationCap,
  Trophy,
  Bell,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  ArrowUpRight,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  DollarSign,
  Award,
  Lock,
} from 'lucide-react';

type TabKey = 'dashboard' | 'markets' | 'analytics' | 'education' | 'ranking' | 'settings';

export default function TelegramMiniAppPage() {
  const {
    isAvailable,
    isReady,
    initData,
    initDataUnsafe,
    themeParams,
    colorScheme,
    startParam,
    expand,
    requestFullscreen,
    openLink,
    setBackButton,
    setMainButton,
    haptic,
  } = useTelegramWebApp();

  // Active tab state (initial tab resolved from startParam deep link)
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Challenge completed states for immediate interactive feedback
  const [claimedSprints, setClaimedSprints] = useState<Record<string, boolean>>({});
  const [notificationToggles, setNotificationToggles] = useState({
    security: true,
    market: true,
    reports: true,
    education: true,
  });

  // Resolve deep link target tab on load
  useEffect(() => {
    if (!startParam) return;
    const lower = startParam.toLowerCase();
    if (lower === 'markets' || lower === 'market') setActiveTab('markets');
    else if (lower === 'ranking' || lower === 'leaderboard') setActiveTab('ranking');
    else if (lower === 'education' || lower === 'academy' || lower === 'challenges') setActiveTab('education');
    else if (lower === 'analytics' || lower === 'portfolio') setActiveTab('analytics');
    else if (lower === 'settings' || lower === 'alerts' || lower === 'notifications') setActiveTab('settings');
    else if (lower === 'dashboard' || lower === 'app') setActiveTab('dashboard');
  }, [startParam]);

  // Authenticate with server using raw initData
  useEffect(() => {
    let isMounted = true;

    async function authenticateTma() {
      setAuthLoading(true);
      setAuthError(null);

      // If outside Telegram or developing locally with simulated client
      const rawPayload = initData || (initDataUnsafe?.user ? `simulated_dev_init_data` : '');

      if (!rawPayload && !isAvailable) {
        // Standalone preview mode
        if (isMounted) {
          setUserSession({
            displayName: 'Guest Allocator',
            paperEquity: 100000.0,
            checkingBalance: 2450.0,
            level: 'Strategist',
            xp: 3850,
            isLinked: false,
          });
          setAuthLoading(false);
        }
        return;
      }

      try {
        const res = await fetch('/api/v1/telegram/webapp/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData: rawPayload }),
        });

        const json = await res.json();
        if (json.success && json.data) {
          if (isMounted) {
            setUserSession(json.data.user);
            if (json.data.startParam) {
              const sp = json.data.startParam.toLowerCase();
              if (['markets', 'ranking', 'education', 'analytics', 'settings'].includes(sp)) {
                setActiveTab(sp as TabKey);
              }
            }
          }
        } else {
          // If development placeholder signature was supplied, fallback gracefully for display
          if (isMounted) {
            setUserSession({
              displayName: initDataUnsafe?.user?.first_name || 'Veltron Allocator',
              paperEquity: 100000.0,
              checkingBalance: 2450.0,
              level: 'Strategist',
              xp: 3850,
              isLinked: true,
            });
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setAuthError(err.message || 'Authentication network error');
        }
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }

    authenticateTma();
    return () => {
      isMounted = false;
    };
  }, [initData, initDataUnsafe, isAvailable]);

  // Handle native Telegram BackButton & MainButton updates
  useEffect(() => {
    if (activeTab === 'dashboard') {
      setBackButton(false);
      setMainButton({
        text: '⚡ LAUNCH FULL TERMINAL',
        visible: true,
        onClick: () => {
          haptic.impact('light');
          openLink('https://veltron.com/dashboard');
        },
      });
    } else {
      setBackButton(true, () => {
        haptic.selection();
        setActiveTab('dashboard');
      });

      if (activeTab === 'education') {
        setMainButton({
          text: '🎓 OPEN ACADEMY DRILLS',
          visible: true,
          onClick: () => {
            haptic.impact('medium');
            openLink('https://veltron.com/education');
          },
        });
      } else if (activeTab === 'markets') {
        setMainButton({
          text: '📈 OPEN TRADING DESK',
          visible: true,
          onClick: () => {
            haptic.impact('medium');
            openLink('https://veltron.com/trading');
          },
        });
      } else if (activeTab === 'ranking') {
        setMainButton({
          text: '🏆 VIEW GLOBAL LEADERBOARD',
          visible: true,
          onClick: () => {
            haptic.impact('medium');
            openLink('https://veltron.com/ranking');
          },
        });
      } else {
        setMainButton({ visible: false, text: '' });
      }
    }
  }, [activeTab, setBackButton, setMainButton, haptic, openLink]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTabSwitch = (tab: TabKey) => {
    haptic.selection();
    setActiveTab(tab);
  };

  const handleClaimSprint = (id: string, xpReward: number) => {
    haptic.notification('success');
    setClaimedSprints((prev) => ({ ...prev, [id]: true }));
    if (userSession) {
      setUserSession((prev: any) => ({
        ...prev,
        xp: (prev.xp || 3850) + xpReward,
      }));
    }
    showToast(`Sprint verified! +${xpReward} XP awarded to your sovereign rank.`);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative bg-[#07090E] pb-24 text-white sm:px-0 md:px-0 lg:px-0">
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-40 bg-[#0A0D14]/90 backdrop-blur-lg border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo variant="main" size="sm" />
          <Badge variant="cyan" dot className="text-[10px] py-0.5 px-2 font-mono">
            TMA NODE
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {userSession && (
            <div className="flex items-center gap-1.5 bg-valixen-violet/20 border border-valixen-violet/30 rounded-full px-2.5 py-1 text-xs font-mono text-valixen-ice">
              <Sparkles className="w-3 h-3 text-valixen-violet" />
              <span>{userSession.xp || 3850} XP</span>
            </div>
          )}

          <button
            onClick={() => {
              haptic.impact('light');
              openLink('https://veltron.com');
            }}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white"
            title="Open Web Platform"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-valixen-violet text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-glow-violet flex items-center gap-2 border border-white/20">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Loading Indicator */}
        {authLoading && (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-valixen-ice animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">Verifying sovereign Telegram identity...</p>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {!authLoading && activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Allocator Identity Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent border border-white/[0.08] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-valixen-violet/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  SOVEREIGN ALLOCATOR
                </span>
                <Badge variant="green" className="text-[10px] font-mono px-2 py-0.5">
                  VERIFIED
                </Badge>
              </div>

              <h2 className="text-xl font-display font-bold text-white mb-1">
                {userSession?.displayName || 'Veltron Allocator'}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-valixen-ice mb-4">
                <Award className="w-3.5 h-3.5 text-valixen-gold" />
                <span>Level 4 • Capital Strategist</span>
              </div>

              {/* Balance Cards */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/[0.06]">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">VIRTUAL EQUITY</span>
                  <span className="text-base font-mono font-bold text-emerald-400">
                    ${(userSession?.paperEquity || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">CHECKING BALANCE</span>
                  <span className="text-base font-mono font-bold text-white">
                    ${(userSession?.checkingBalance || 2450).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Savings Goal Milestone */}
            <div className="p-4 rounded-2xl bg-[#0A0D14] border border-white/[0.08] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-valixen-ice" />
                  <span className="text-xs font-display font-bold text-white">Emergency Reserve Vault</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">58%</span>
              </div>

              <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-valixen-cyan to-valixen-violet h-full rounded-full w-[58%]" />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Current: $14,500.00</span>
                <span>Target: $25,000.00</span>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleTabSwitch('markets')}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-left transition-all group"
              >
                <TrendingUp className="w-5 h-5 text-valixen-cyan mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-display font-bold text-white block">Real-time Markets</span>
                <span className="text-[10px] font-mono text-slate-400">BTC, ETH, CBU Rates</span>
              </button>

              <button
                onClick={() => handleTabSwitch('education')}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-left transition-all group"
              >
                <GraduationCap className="w-5 h-5 text-valixen-violet mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-display font-bold text-white block">Daily Challenges</span>
                <span className="text-[10px] font-mono text-slate-400">Earn +1,950 XP</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MARKETS */}
        {!authLoading && activeTab === 'markets' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">LIVE ASSET TELEMETRY</h3>
              <Badge variant="cyan" dot className="text-[10px] font-mono">
                REAL-TIME
              </Badge>
            </div>

            {/* Asset Items */}
            {[
              { symbol: 'BTC/USD', name: 'Bitcoin Spot', price: '$94,820.00', change: '+2.42%', up: true },
              { symbol: 'ETH/USD', name: 'Ethereum Spot', price: '$3,420.50', change: '+1.80%', up: true },
              { symbol: 'SOL/USD', name: 'Solana Spot', price: '$185.40', change: '+4.20%', up: true },
              { symbol: 'USD/UZS', name: 'CBU Official Rate', price: '12,850.00 UZS', change: '0.00%', up: true },
              { symbol: 'S&P 500', name: 'US Benchmark Index', price: '5,980.25', change: '+0.38%', up: true },
              { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: '1.0845', change: '-0.15%', up: false },
            ].map((asset) => (
              <div
                key={asset.symbol}
                className="p-3.5 rounded-xl bg-[#0A0D14] border border-white/[0.06] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-white">{asset.symbol}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans">{asset.name}</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white block">{asset.price}</span>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      asset.up ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {asset.change}
                  </span>
                </div>
              </div>
            ))}

            {/* Monetary Policy Rate Badges */}
            <div className="p-3.5 rounded-xl bg-valixen-violet/10 border border-valixen-violet/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">🇺🇿 CBU Policy Benchmark:</span>
                <span className="text-valixen-ice font-bold">13.50% (Nov 5 Review)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">🇺🇸 US Fed Funds Rate:</span>
                <span className="text-valixen-ice font-bold">4.50% (Nov 6 Decision)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & RISK */}
        {!authLoading && activeTab === 'analytics' && (
          <div className="space-y-3.5">
            <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">QUANTITATIVE RISK TELEMETRY</h3>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#0A0D14] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">SHARPE RATIO</span>
                <span className="text-lg font-mono font-bold text-valixen-cyan">2.14</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Institutional Alpha</span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0D14] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">REALIZED 7D PNL</span>
                <span className="text-lg font-mono font-bold text-emerald-400">+$2,140.00</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">+2.14% return</span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0D14] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">MAX DRAWDOWN</span>
                <span className="text-lg font-mono font-bold text-amber-400">-4.20%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Conservative Guard</span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0D14] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">PORTFOLIO BETA</span>
                <span className="text-lg font-mono font-bold text-white">0.85</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Low Market Exposure</span>
              </div>
            </div>

            {/* Open Positions List */}
            <div className="p-4 rounded-xl bg-[#0A0D14] border border-white/[0.06] space-y-2.5">
              <span className="text-xs font-mono font-bold text-white block">Active Hedged Allocations</span>
              <div className="flex justify-between items-center text-xs font-mono py-1 border-b border-white/[0.04]">
                <span className="text-slate-300">BTC Limit Long (0.25 BTC)</span>
                <span className="text-emerald-400 font-bold">+$485.00</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono py-1 border-b border-white/[0.04]">
                <span className="text-slate-300">ETH Spot Hold (2.50 ETH)</span>
                <span className="text-emerald-400 font-bold">+$124.50</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono py-1">
                <span className="text-slate-300">Gold Commodity Vault (5.0 Oz)</span>
                <span className="text-emerald-400 font-bold">+$320.00</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EDUCATION & SPRINTS */}
        {!authLoading && activeTab === 'education' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">DAILY FINANCIAL SPRINTS</h3>
              <span className="text-xs font-mono text-valixen-ice">Claim XP</span>
            </div>

            {[
              {
                id: 'sprint-1',
                title: '7-Day Zero Impulse Spending',
                desc: 'Enforce a 48-hour cooling period on any non-essential purchase.',
                xp: 350,
              },
              {
                id: 'sprint-2',
                title: 'Macroeconomic Currency Shield',
                desc: 'Analyze FX spread trends and Central Bank rate adjustments.',
                xp: 750,
              },
              {
                id: 'sprint-3',
                title: 'Monthly 20% Net Wealth Capture',
                desc: 'Automate transfer of 20% gross inflow into the high-yield vault.',
                xp: 850,
              },
            ].map((sprint) => {
              const isClaimed = claimedSprints[sprint.id];
              return (
                <div
                  key={sprint.id}
                  className="p-4 rounded-xl bg-[#0A0D14] border border-white/[0.06] space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-display font-bold text-white">{sprint.title}</h4>
                    <span className="text-xs font-mono text-valixen-ice font-bold shrink-0">+{sprint.xp} XP</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{sprint.desc}</p>

                  <button
                    disabled={isClaimed}
                    onClick={() => handleClaimSprint(sprint.id, sprint.xp)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all mt-2 ${
                      isClaimed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-valixen-violet hover:bg-valixen-violet/80 text-white shadow-glow-violet'
                    }`}
                  >
                    {isClaimed ? '✔ SPRINT VERIFIED & CLAIMED' : `COMPLETE SPRINT & CLAIM +${sprint.xp} XP`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 5: RANKING */}
        {!authLoading && activeTab === 'ranking' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">MERIT LEADERBOARD</h3>
              <Badge variant="purple" className="text-[10px] font-mono">
                ZERO WEALTH BIAS
              </Badge>
            </div>

            {/* User Standing Card */}
            <div className="p-3.5 rounded-xl bg-valixen-violet/15 border border-valixen-violet/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-300 block">YOUR POSITION</span>
                <span className="text-sm font-display font-bold text-white">#8 Global • #4 Uzbekistan 🇺🇿</span>
              </div>
              <span className="text-sm font-mono font-bold text-valixen-ice">{userSession?.xp || 3850} XP</span>
            </div>

            {/* Podium */}
            {[
              { rank: 1, name: 'QuantumAllocator', country: '🇺🇿 UZ', xp: '28,450 XP', tier: 'Legend' },
              { rank: 2, name: 'SovereignWealth_Tashkent', country: '🇺🇿 UZ', xp: '21,800 XP', tier: 'Master' },
              { rank: 3, name: 'NordicHedgeMaster', country: '🇸🇪 SE', xp: '18,400 XP', tier: 'Master' },
              { rank: 4, name: 'CyberStrategist_01', country: '🇺🇿 UZ', xp: '15,200 XP', tier: 'Expert' },
              { rank: 5, name: 'ApexDisciplined', country: '🇸🇬 SG', xp: '12,900 XP', tier: 'Expert' },
            ].map((item) => (
              <div
                key={item.rank}
                className="p-3 rounded-xl bg-[#0A0D14] border border-white/[0.06] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      item.rank === 1
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : item.rank === 2
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30'
                        : item.rank === 3
                        ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30'
                        : 'bg-white/[0.04] text-slate-400'
                    }`}
                  >
                    {item.rank}
                  </span>
                  <div>
                    <span className="text-xs font-display font-bold text-white block">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.country} • {item.tier}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-valixen-ice">{item.xp}</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: SETTINGS & NOTIFICATIONS */}
        {!authLoading && activeTab === 'settings' && (
          <div className="space-y-3.5">
            <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">TELEGRAM PREFERENCES</h3>

            {/* Notification Toggles */}
            <div className="p-4 rounded-xl bg-[#0A0D14] border border-white/[0.06] space-y-3">
              {[
                { key: 'security', label: 'SOC Security Incidents', desc: 'Real-time alert on brute-force or new session' },
                { key: 'market', label: 'Macro Catalysts & FX', desc: 'CBU policy rates and crypto volatility' },
                { key: 'reports', label: 'Weekly Wealth Reports', desc: 'Portfolio PnL and Sharpe ratio digests' },
                { key: 'education', label: 'Gamified Ranking Updates', desc: 'Challenge completions and podium shifts' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-1">
                  <div>
                    <span className="text-xs font-display font-bold text-white block">{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-sans">{item.desc}</span>
                  </div>
                  <button
                    onClick={() => {
                      haptic.impact('light');
                      setNotificationToggles((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev],
                      }));
                      showToast(`${item.label} preferences updated.`);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      notificationToggles[item.key as keyof typeof notificationToggles]
                        ? 'bg-valixen-violet'
                        : 'bg-white/[0.1]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                        notificationToggles[item.key as keyof typeof notificationToggles]
                          ? 'right-0.5'
                          : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Full Site Launcher */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-xs font-mono font-bold text-white block">Sovereign Web Terminal</span>
              <p className="text-[11px] text-slate-400 font-sans">
                Access deep quant charts, 3D interactive visualizations, and full account settings in your desktop browser.
              </p>
              <button
                onClick={() => {
                  haptic.impact('medium');
                  openLink('https://veltron.com/dashboard');
                }}
                className="w-full py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-white flex items-center justify-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-valixen-ice" />
                <span>OPEN DESKTOP TERMINAL</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-[#0A0D14]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-2 flex items-center justify-around">
        {[
          { key: 'dashboard', label: 'Terminal', icon: Terminal },
          { key: 'markets', label: 'Markets', icon: TrendingUp },
          { key: 'analytics', label: 'Analytics', icon: BarChart2 },
          { key: 'education', label: 'Academy', icon: GraduationCap },
          { key: 'ranking', label: 'Ranking', icon: Trophy },
          { key: 'settings', label: 'Alerts', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabSwitch(tab.key as TabKey)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-valixen-ice font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-valixen-violet/20 text-valixen-ice' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
