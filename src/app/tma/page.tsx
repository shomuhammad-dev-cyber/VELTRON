// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY TELEGRAM MINI APP (TMA)
// Route: /tma
// Ultra-fast mobile interface, Bespoke Italian Elegance, Native Telegram WebApp
// Palette: Obsidian Espresso (#120A08), Royal Burgundy (#54252D), Antique Gold (#C6A477), Ivory (#FAF7F1)
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ChevronRight,
  TrendingDown,
} from 'lucide-react';

type TabKey = 'dashboard' | 'markets' | 'analytics' | 'education' | 'ranking' | 'settings';

export default function TelegramMiniAppPage() {
  const router = useRouter();
  const {
    isAvailable,
    isReady,
    initData,
    initDataUnsafe,
    startParam,
    expand,
    openLink,
    setBackButton,
    setMainButton,
    haptic,
  } = useTelegramWebApp();

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [authLoading, setAuthLoading] = useState(true);
  const [userSession, setUserSession] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Authenticate / Initialize
  useEffect(() => {
    let isMounted = true;
    async function initUser() {
      setAuthLoading(true);
      try {
        const tgUser = initDataUnsafe?.user;
        if (isMounted) {
          setUserSession({
            displayName: tgUser ? `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}` : 'Investor (Alexandr)',
            username: tgUser?.username || 'investor_alex',
            paperEquity: 100000.0,
            checkingBalance: 12847.32,
            xp: 4250,
          });
        }
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }
    initUser();
    return () => {
      isMounted = false;
    };
  }, [initDataUnsafe]);

  // Native Telegram Buttons
  useEffect(() => {
    if (activeTab === 'dashboard') {
      setBackButton(false);
      setMainButton({
        text: '🏛 VELTRON SAVDO DESKINI OCHISH',
        visible: true,
        onClick: () => {
          haptic.impact('medium');
          setActiveTab('markets');
        },
      });
    } else {
      setBackButton(true, () => {
        haptic.selection();
        setActiveTab('dashboard');
      });

      if (activeTab === 'education') {
        setMainButton({
          text: '🎓 AKADEMIYA TESTLARINI BOSHLASH',
          visible: true,
          onClick: () => {
            haptic.impact('medium');
            showToast('Akademiya darslari yuklanmoqda...');
          },
        });
      } else if (activeTab === 'markets') {
        setMainButton({
          text: '💼 $100,000 DEMO SAVDO QILISH',
          visible: true,
          onClick: () => {
            haptic.impact('medium');
            showToast('Paper Trading terminali faollashdi!');
          },
        });
      } else if (activeTab === 'ranking') {
        setMainButton({
          text: '🏆 GLOBAL REYTINGNI KO‘RISH',
          visible: true,
          onClick: () => {
            haptic.impact('light');
            showToast('Reyting yangilandi!');
          },
        });
      } else {
        setMainButton({ visible: false, text: '' });
      }
    }
  }, [activeTab, setBackButton, setMainButton, haptic]);

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
        xp: (prev.xp || 4250) + xpReward,
      }));
    }
    showToast(`Topshiriq bajarildi! +${xpReward} XP hisobingizga qo'shildi.`);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative bg-[#120A08] pb-24 text-[#FAF7F1] sm:px-0 font-sans selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-40 bg-[#1A110E]/95 backdrop-blur-xl border-b border-[#C6A477]/25 px-4 py-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2.5">
          {/* Golden Chevron Logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C6A477] via-[#96764D] to-[#54252D] p-[1px] flex items-center justify-center shadow-[0_0_12px_rgba(198,164,119,0.3)]">
            <div className="w-full h-full bg-[#170E0C] rounded-[7px] flex items-center justify-center">
              <span className="font-serif font-bold text-[#C6A477] text-sm tracking-wider">V</span>
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-sm tracking-wider text-[#FAF7F1] block leading-none">
              VELTRON
            </span>
            <span className="text-[9px] font-mono text-[#C6A477] tracking-widest uppercase">
              LUXURY PLATFORM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userSession && (
            <div className="flex items-center gap-1.5 bg-[#54252D]/40 border border-[#C6A477]/30 rounded-full px-2.5 py-1 text-xs font-mono text-[#C6A477]">
              <Sparkles className="w-3 h-3 text-[#C6A477]" />
              <span>{userSession.xp || 4250} XP</span>
            </div>
          )}

          <button
            onClick={() => {
              haptic.impact('light');
              window.location.href = '/';
            }}
            className="p-1.5 rounded-lg bg-[#221613] border border-[#C6A477]/25 text-[#C6A477] hover:text-[#FAF7F1] transition-colors"
            title="Bosh sahifani ochish"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-[#1C1210] text-[#FAF7F1] px-4 py-3 rounded-xl text-xs font-sans shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 border border-[#C6A477]/40">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C6A477]" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Loading Indicator */}
        {authLoading && (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#C6A477] animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#C7BAA7]">Xavfsiz sessiya yuklanmoqda...</p>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {!authLoading && activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Investor Identity Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#241512] via-[#1A110E] to-[#120A08] border border-[#C6A477]/30 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6A477]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-[#C6A477] uppercase tracking-wider font-semibold">
                  PREMIUM INVESTOR
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3DD898]/15 border border-[#3DD898]/40 text-[#3DD898] font-bold">
                  VERIFIED
                </span>
              </div>

              <h2 className="text-xl font-serif font-bold text-[#FAF7F1] mb-1">
                {userSession?.displayName || 'Alexandr'}
              </h2>
              <div className="flex items-center gap-2 text-xs font-sans text-[#C6A477] mb-4">
                <Award className="w-3.5 h-3.5" />
                <span>Level 4 • Private Wealth Allocator</span>
              </div>

              {/* Balance Cards */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#C6A477]/20">
                <div className="p-3 rounded-xl bg-[#140D0B] border border-[#C6A477]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#C7BAA7] block uppercase">JAMI BALANS</span>
                  <span className="text-lg font-serif font-bold text-[#FAF7F1]">
                    ${(userSession?.checkingBalance || 12847.32).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] font-mono text-[#3DD898] block font-semibold">+12.5% o‘sish</span>
                </div>
                <div className="p-3 rounded-xl bg-[#140D0B] border border-[#C6A477]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#C7BAA7] block uppercase">DEMO CAPITAL</span>
                  <span className="text-lg font-serif font-bold text-[#C6A477]">
                    ${(userSession?.paperEquity || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] font-mono text-[#C7BAA7] block">Xavfsiz Sandbox</span>
                </div>
              </div>
            </div>

            {/* Savings Goal Milestone */}
            <div className="p-4 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#C6A477]" />
                  <span className="text-xs font-serif font-bold text-[#FAF7F1]">Zaxira Fond Maqsadi</span>
                </div>
                <span className="text-xs font-mono text-[#3DD898] font-bold">78%</span>
              </div>

              <div className="w-full bg-[#120A08] rounded-full h-2 overflow-hidden border border-[#C6A477]/20">
                <div className="bg-gradient-to-r from-[#96764D] to-[#C6A477] h-full rounded-full w-[78%]" />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-[#C7BAA7]">
                <span>Mavjud: $19,500.00</span>
                <span>Maqsad: $25,000.00</span>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleTabSwitch('markets')}
                className="p-3.5 rounded-xl bg-[#1A110E] border border-[#C6A477]/20 hover:border-[#C6A477]/40 text-left transition-all group"
              >
                <TrendingUp className="w-5 h-5 text-[#C6A477] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-bold text-[#FAF7F1] block">Bozorlar & Kripto</span>
                <span className="text-[10px] font-mono text-[#C7BAA7]">BTC, ETH, Oltin, CBU</span>
              </button>

              <button
                onClick={() => handleTabSwitch('education')}
                className="p-3.5 rounded-xl bg-[#1A110E] border border-[#C6A477]/20 hover:border-[#C6A477]/40 text-left transition-all group"
              >
                <GraduationCap className="w-5 h-5 text-[#C6A477] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-bold text-[#FAF7F1] block">Moliya Akademiyasi</span>
                <span className="text-[10px] font-mono text-[#C7BAA7]">12 Dars • +1,950 XP</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MARKETS */}
        {!authLoading && activeTab === 'markets' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono text-[#C6A477] uppercase tracking-wider font-semibold">
                JONLI BOZORLAR & AKTIVLAR
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3DD898]/15 text-[#3DD898] border border-[#3DD898]/30 font-bold">
                REAL-TIME
              </span>
            </div>

            {/* Asset Items */}
            {[
              { symbol: 'BTC/USD', name: 'Bitcoin Spot', price: '$67,432.18', change: '+2.8%', up: true },
              { symbol: 'ETH/USD', name: 'Ethereum Spot', price: '$3,245.67', change: '+1.9%', up: true },
              { symbol: 'TSLA/USD', name: 'Tesla Inc', price: '$248.31', change: '-0.7%', up: false },
              { symbol: 'XAU/USD', name: 'Oltin (Troy Unsiya)', price: '$2,389.12', change: '+0.4%', up: true },
              { symbol: 'USD/UZS', name: 'O‘zbekiston MB Rasmiy Kursi', price: '12,850.00 UZS', change: '0.0%', up: true },
              { symbol: 'EUR/USD', name: 'Yevro / AQSH Dollari', price: '1.0845', change: '-0.15%', up: false },
            ].map((asset) => (
              <div
                key={asset.symbol}
                className="p-3.5 rounded-xl bg-[#1A110E] border border-[#C6A477]/20 flex items-center justify-between hover:border-[#C6A477]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-[#FAF7F1]">{asset.symbol}</span>
                  </div>
                  <span className="text-[10px] text-[#C7BAA7] font-sans">{asset.name}</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#FAF7F1] block">{asset.price}</span>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      asset.up ? 'text-[#3DD898]' : 'text-[#EF4444]'
                    }`}
                  >
                    {asset.change}
                  </span>
                </div>
              </div>
            ))}

            {/* Monetary Policy Rate Badges */}
            <div className="p-3.5 rounded-xl bg-[#241512] border border-[#C6A477]/25 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C7BAA7]">🇺🇿 Markaziy Bank Asosiy Stavka:</span>
                <span className="text-[#C6A477] font-bold">13.50%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C7BAA7]">🇺🇸 AQSH FRS Foiz Stavkasi:</span>
                <span className="text-[#C6A477] font-bold">4.75%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & RISK */}
        {!authLoading && activeTab === 'analytics' && (
          <div className="space-y-3.5">
            <h3 className="text-xs font-mono text-[#C6A477] uppercase tracking-wider font-semibold">
              KAPITAL TAHLILI & XATAR BAXOSI
            </h3>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#1A110E] border border-[#C6A477]/20">
                <span className="text-[10px] font-mono text-[#C7BAA7] block mb-1">SHARPE KOEFFITSIYENTI</span>
                <span className="text-lg font-serif font-bold text-[#C6A477]">2.48</span>
                <span className="text-[10px] text-[#3DD898] block mt-0.5">Yuqori Samaradorlik</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1A110E] border border-[#C6A477]/20">
                <span className="text-[10px] font-mono text-[#C7BAA7] block mb-1">PORTFEL O‘SISHI</span>
                <span className="text-lg font-serif font-bold text-[#3DD898]">+24.8%</span>
                <span className="text-[10px] text-[#C7BAA7] block mt-0.5">So‘nggi 30 kunda</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1A110E] border border-[#C6A477]/20">
                <span className="text-[10px] font-mono text-[#C7BAA7] block mb-1">MAKSIMAL DRAWDOWN</span>
                <span className="text-lg font-serif font-bold text-amber-400">-3.8%</span>
                <span className="text-[10px] text-[#C7BAA7] block mt-0.5">Xavfsiz Chegara</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1A110E] border border-[#C6A477]/20">
                <span className="text-[10px] font-mono text-[#C7BAA7] block mb-1">PORTFEL BETASI</span>
                <span className="text-lg font-serif font-bold text-[#FAF7F1]">0.78</span>
                <span className="text-[10px] text-[#C7BAA7] block mt-0.5">Bozorga Kam Bog‘liq</span>
              </div>
            </div>

            {/* Open Positions List */}
            <div className="p-4 rounded-xl bg-[#1A110E] border border-[#C6A477]/20 space-y-2.5">
              <span className="text-xs font-serif font-bold text-[#FAF7F1] block">Faol Ochiq Pozitsiyalar</span>
              <div className="flex justify-between items-center text-xs font-mono py-1 border-b border-[#C6A477]/10">
                <span className="text-[#C7BAA7]">BTC Spot Hold (0.25 BTC)</span>
                <span className="text-[#3DD898] font-bold">+$585.00 (+3.4%)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono py-1 border-b border-[#C6A477]/10">
                <span className="text-[#C7BAA7]">ETH Spot Hold (2.00 ETH)</span>
                <span className="text-[#3DD898] font-bold">+$142.50 (+2.2%)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono py-1">
                <span className="text-[#C7BAA7]">Oltin Zaxira (5.0 Oz)</span>
                <span className="text-[#3DD898] font-bold">+$380.00 (+3.2%)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EDUCATION & SPRINTS */}
        {!authLoading && activeTab === 'education' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono text-[#C6A477] uppercase tracking-wider font-semibold">
                MOLIYA AKADEMIYASI TOPSHIRIQLARI
              </h3>
              <span className="text-xs font-mono text-[#C6A477] font-bold">XP Ishlash</span>
            </div>

            {[
              {
                id: 'sprint-1',
                title: 'Risk Management & Stop-Loss Qoidalari',
                desc: 'Har bir bitimda umumiy depozitning 2% dan oshmagan qismini xatarga qo‘yish strategiyasi.',
                xp: 350,
              },
              {
                id: 'sprint-2',
                title: 'Makroiqtisodiy Valyuta Himoyasi',
                desc: 'Oltin va AQSH dollari orqali inflyatsiyadan to‘liq himoyalanish modelini o‘rganish.',
                xp: 750,
              },
              {
                id: 'sprint-3',
                title: 'Oylik 20% Sof Kapital Jamg‘arish',
                desc: 'Daromadlarning kamida 20 foizini avtomatik zaxira fondiga yo‘naltirish mexanizmi.',
                xp: 850,
              },
            ].map((sprint) => {
              const isClaimed = claimedSprints[sprint.id];
              return (
                <div
                  key={sprint.id}
                  className="p-4 rounded-xl bg-[#1A110E] border border-[#C6A477]/25 space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-serif font-bold text-[#FAF7F1]">{sprint.title}</h4>
                    <span className="text-xs font-mono text-[#C6A477] font-bold shrink-0">+{sprint.xp} XP</span>
                  </div>
                  <p className="text-[11px] text-[#C7BAA7] font-sans leading-relaxed">{sprint.desc}</p>

                  <button
                    disabled={isClaimed}
                    onClick={() => handleClaimSprint(sprint.id, sprint.xp)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all mt-2 ${
                      isClaimed
                        ? 'bg-[#3DD898]/15 text-[#3DD898] border border-[#3DD898]/40 cursor-default'
                        : 'bg-[#C6A477] hover:bg-[#B38E60] text-[#120A08] shadow-[0_4px_15px_rgba(198,164,119,0.3)]'
                    }`}
                  >
                    {isClaimed ? '✔ TOPSHIRIQ BAJARILDI VA TASDIQLANDI' : `TOPSHIRIQNI BAJARISH & +${sprint.xp} XP`}
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
              <h3 className="text-xs font-mono text-[#C6A477] uppercase tracking-wider font-semibold">
                GLOBAL INVESTORLAR REYTINGI
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C6A477]/15 text-[#C6A477] border border-[#C6A477]/30">
                HALOL MERITOKRATIYA
              </span>
            </div>

            {/* User Standing Card */}
            <div className="p-3.5 rounded-xl bg-[#241512] border border-[#C6A477]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#C7BAA7] block">SIZNING O‘RNINGIZ</span>
                <span className="text-sm font-serif font-bold text-[#FAF7F1]">#124 Global • #8 O‘zbekiston 🇺🇿</span>
              </div>
              <span className="text-sm font-mono font-bold text-[#C6A477]">{userSession?.xp || 4250} XP</span>
            </div>

            {/* Podium */}
            {[
              { rank: 1, name: 'SovereignWealth_Tashkent', country: '🇺🇿 UZ', xp: '28,450 XP', tier: 'Master' },
              { rank: 2, name: 'QuantumCapital_Global', country: '🇺🇸 US', xp: '24,800 XP', tier: 'Master' },
              { rank: 3, name: 'Samarkand_Quant_Desk', country: '🇺🇿 UZ', xp: '21,400 XP', tier: 'Strategist' },
              { rank: 4, name: 'BukharaReserveFund', country: '🇺🇿 UZ', xp: '18,200 XP', tier: 'Strategist' },
              { rank: 5, name: 'ApexInvestor_Zurich', country: '🇨🇭 CH', xp: '15,900 XP', tier: 'Analyst' },
            ].map((item) => (
              <div
                key={item.rank}
                className="p-3 rounded-xl bg-[#1A110E] border border-[#C6A477]/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      item.rank === 1
                        ? 'bg-[#C6A477] text-[#120A08]'
                        : item.rank === 2
                        ? 'bg-[#FAF7F1]/80 text-[#120A08]'
                        : item.rank === 3
                        ? 'bg-[#96764D] text-[#FAF7F1]'
                        : 'bg-[#120A08] text-[#C7BAA7] border border-[#C6A477]/20'
                    }`}
                  >
                    {item.rank}
                  </span>
                  <div>
                    <span className="text-xs font-serif font-bold text-[#FAF7F1] block">{item.name}</span>
                    <span className="text-[10px] font-mono text-[#C7BAA7]">
                      {item.country} • {item.tier}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-[#C6A477]">{item.xp}</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: SETTINGS & NOTIFICATIONS */}
        {!authLoading && activeTab === 'settings' && (
          <div className="space-y-3.5">
            <h3 className="text-xs font-mono text-[#C6A477] uppercase tracking-wider font-semibold">
              TELEGRAM BILDIRISHNOMALAR SOZLAMALARI
            </h3>

            {/* Notification Toggles */}
            <div className="p-4 rounded-xl bg-[#1A110E] border border-[#C6A477]/20 space-y-3">
              {[
                { key: 'security', label: 'Xavfsizlik & Kirish Xabarlari', desc: 'Yangi sessiya yoki parolni o‘zgartirish haqida darhol xabar' },
                { key: 'market', label: 'Bozor & Valyuta Katalizatorlari', desc: 'Markaziy bank stavkalari va kripto keskin harakatlari' },
                { key: 'reports', label: 'Haftalik Portfel Hisobotlari', desc: 'Sharpe koeffitsiyenti va daromad tahlillari' },
                { key: 'education', label: 'Akademiya & Reyting Yangiliklari', desc: 'Yangi testlar va o‘riningiz ko‘tarilishi' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-1">
                  <div>
                    <span className="text-xs font-serif font-bold text-[#FAF7F1] block">{item.label}</span>
                    <span className="text-[10px] text-[#C7BAA7] font-sans">{item.desc}</span>
                  </div>
                  <button
                    onClick={() => {
                      haptic.impact('light');
                      setNotificationToggles((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev],
                      }));
                      showToast(`${item.label} yangilandi.`);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      notificationToggles[item.key as keyof typeof notificationToggles]
                        ? 'bg-[#C6A477]'
                        : 'bg-[#2E1E1A]'
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

            {/* Web Platform Shortcut */}
            <div className="p-4 rounded-xl bg-[#241512] border border-[#C6A477]/25 space-y-2">
              <span className="text-xs font-serif font-bold text-[#FAF7F1] block">VELTRON Katta Veb Platformasi</span>
              <p className="text-[11px] text-[#C7BAA7] font-sans leading-relaxed">
                Brauzerda 3D interaktiv grafiklar, to‘liq analitika va institut darajasidagi savdo maydoniga o‘ting.
              </p>
              <button
                onClick={() => {
                  haptic.impact('medium');
                  window.location.href = '/';
                }}
                className="w-full py-2.5 rounded-lg bg-[#C6A477] hover:bg-[#B38E60] text-[#120A08] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors shadow-[0_4px_15px_rgba(198,164,119,0.3)]"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>ASOSIY SAHIFANI OCHISH</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-[#1A110E]/95 backdrop-blur-xl border-t border-[#C6A477]/25 px-2 py-2 flex items-center justify-around shadow-[0_-5px_25px_rgba(0,0,0,0.8)]">
        {[
          { key: 'dashboard', label: 'Bosh sahifa', icon: Terminal },
          { key: 'markets', label: 'Bozorlar', icon: TrendingUp },
          { key: 'analytics', label: 'Tahlil', icon: BarChart2 },
          { key: 'education', label: 'Akademiya', icon: GraduationCap },
          { key: 'ranking', label: 'Reyting', icon: Trophy },
          { key: 'settings', label: 'Sozlamalar', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabSwitch(tab.key as TabKey)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#C6A477] font-bold scale-105'
                  : 'text-[#C7BAA7] hover:text-[#FAF7F1]'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive ? 'bg-[#54252D]/50 text-[#C6A477] border border-[#C6A477]/40 shadow-[0_0_10px_rgba(198,164,119,0.25)]' : 'text-[#C7BAA7]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-sans tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
