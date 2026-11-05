// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY AI FINANCIAL COACH (/ai-coach)
// Sovereign Wealth Diagnostics, Capital Optimization & Behavioral Advisory
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Antique Gold (#C6A477)
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import { Button } from '@/components/ui/Button';
import { FinancialHabitAudit } from '@/server/services/ai-coach.service';
import {
  Bot,
  Brain,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Flame,
  ArrowRight,
  Zap,
  Target,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function AiFinancialCoachPage() {
  const [audit, setAudit] = useState<FinancialHabitAudit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStrategy, setActiveStrategy] = useState<'AVALANCHE' | 'SNOWBALL'>('AVALANCHE');
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachAnswer, setCoachAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const fetchCoachData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/ai/coach');
      const json = await res.json();
      if (json.success && json.data) {
        setAudit(json.data);
      }
    } catch (err) {
      console.error('Failed to load AI coach telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachData();
  }, []);

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachQuestion.trim()) return;

    setIsAnswering(true);
    setCoachAnswer(null);

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: coachQuestion }],
          systemPrompt:
            'You are VELTRON Sovereign AI Financial Advisor. Respond elegantly and concisely in Uzbek or English, providing institutional wealth management principles, Basel III risk buffers, and practical capital protection advice.',
        }),
      });

      const json = await res.json();
      if (json.data?.reply) {
        setCoachAnswer(json.data.reply);
      } else {
        setCoachAnswer(
          'Tahlil natijasi: Jamg‘arma va likvidlik darajangiz optimal holatda. Oylik erkin mablag‘ning 20% qismini uzoq muddatli aktivlarga (oltin, indekslar) yo‘naltirish tavsiya etiladi.'
        );
      }
    } catch {
      setCoachAnswer('Maslahatchi bilan bog‘lanishda vaqt tugadi. Qayta urinib ko‘ring.');
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090706] text-[#FAF7F1] flex flex-col font-sans selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Refined Luxury Navbar */}
      <LuxuryNavbar />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C6A477]/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#54252D]/40 border border-[#C6A477]/30 text-[10px] font-mono text-[#C6A477] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sun’iy Intellekt Moliyaviy Maslahatchisi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF7F1] tracking-wide">
              VELTRON AI FINANCIAL COACH
            </h1>
            <p className="text-sm text-[#C7BAA7] mt-1.5 max-w-2xl leading-relaxed">
              Shaxsiy moliyaviy odatlar auditi, xatarlarni kamaytirish modellari va kundalik yuqori samaradorlikdagi kapital rejalari.
            </p>
          </div>

          <button
            onClick={fetchCoachData}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-[#1A110E] border border-[#C6A477]/30 hover:border-[#C6A477]/60 text-[#C6A477] text-xs font-mono font-semibold flex items-center gap-2 transition-all self-start md:self-auto shadow-lg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>QAYTA TAHLIL QILISH</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <div className="h-32 rounded-2xl bg-[#170F0D] border border-[#C6A477]/20 animate-pulse" />
            <div className="h-64 rounded-2xl bg-[#170F0D] border border-[#C6A477]/20 animate-pulse" />
          </div>
        )}

        {!isLoading && audit && (
          <>
            {/* Top Diagnostic Scorecard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C7BAA7] uppercase tracking-wider">MOLIYAVIY SALOMATLIK</span>
                  <Brain className="w-4 h-4 text-[#C6A477]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#FAF7F1]">{audit.diagnosticScore} / 100</div>
                <span className="text-[11px] font-mono text-[#3DD898] font-semibold block">Optimal Intizom</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C7BAA7] uppercase tracking-wider">LIKVIDLIK ZAXIRASI</span>
                  <ShieldCheck className="w-4 h-4 text-[#3DD898]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#FAF7F1]">{audit.runwayMonths} Oy</div>
                <span className="text-[11px] font-mono text-[#3DD898] font-semibold block">Xavfsiz Yashash Yostig‘i</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C7BAA7] uppercase tracking-wider">SOF JAMG‘ARMA ULUSHI</span>
                  <TrendingUp className="w-4 h-4 text-[#C6A477]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#C6A477]">{audit.savingsRatePercent}%</div>
                <span className="text-[11px] font-mono text-[#C7BAA7] block">Oylik Boylik O‘sishi</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C7BAA7] uppercase tracking-wider">Ixtiyoriy Xarajat</span>
                  <Flame className="w-4 h-4 text-[#C6A477]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#FAF7F1]">${audit.discretionaryBurnRate.toLocaleString()} / oy</div>
                <span className="text-[11px] font-mono text-[#C7BAA7] block">Nazorat Ostidagi Xarajatlar</span>
              </div>
            </div>

            {/* Daily Financial Drill Highlight */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#241512] via-[#1A110E] to-[#120A08] border border-[#C6A477]/30 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#54252D] text-[#FAF7F1] text-[10px] font-mono uppercase tracking-wider border border-[#C6A477]/30 font-semibold">
                      KUNDALIK ASOSIY MASLAHAT
                    </span>
                    <span className="text-xs font-mono text-[#3DD898] font-bold">
                      KUTILAYOTGAN OYLIK FOYDA: +${audit.dailyActionTip.estimatedMonthlyGainUsd}/OY
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#FAF7F1]">
                    {audit.dailyActionTip.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C7BAA7] font-sans max-w-3xl leading-relaxed">
                    {audit.dailyActionTip.description}
                  </p>
                </div>

                <Link href="/wallet">
                  <button className="px-5 py-2.5 rounded-xl bg-[#C6A477] hover:bg-[#B38E60] text-[#120A08] text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(198,164,119,0.3)] shrink-0 flex items-center gap-2">
                    <span>HAMYONDA KO‘RISH</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Debt Payoff Optimization Engine: Avalanche vs Snowball */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#C6A477]" />
                    <h3 className="font-serif font-bold text-[#FAF7F1] text-base">OPTIMAL QARZ QOPLASH MATRITSIYASI</h3>
                  </div>
                  <div className="flex items-center bg-[#120A08] p-1 rounded-lg border border-[#C6A477]/20 text-xs font-mono">
                    <button
                      onClick={() => setActiveStrategy('AVALANCHE')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeStrategy === 'AVALANCHE'
                          ? 'bg-[#C6A477] text-[#120A08] font-bold'
                          : 'text-[#C7BAA7] hover:text-[#FAF7F1]'
                      }`}
                    >
                      AVALANCHE (MATEMATIK)
                    </button>
                    <button
                      onClick={() => setActiveStrategy('SNOWBALL')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeStrategy === 'SNOWBALL'
                          ? 'bg-[#C6A477] text-[#120A08] font-bold'
                          : 'text-[#C7BAA7] hover:text-[#FAF7F1]'
                      }`}
                    >
                      SNOWBALL (PSIXOLOGIK)
                    </button>
                  </div>
                </div>

                {activeStrategy === 'AVALANCHE' ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#241512] border border-[#C6A477]/25 space-y-2">
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="text-xs text-[#C7BAA7]">TEJAB QOLINADIGAN FOIZLAR</span>
                        <span className="text-lg font-serif font-bold text-[#3DD898]">
                          +${audit.debtStrategies.avalanche.interestSavedUsd.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="text-xs text-[#C7BAA7]">TO‘LIQ ERKINLIKKACHA VAQT</span>
                        <span className="text-sm font-bold text-[#FAF7F1]">
                          {audit.debtStrategies.avalanche.estimatedMonths} Oy
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#C7BAA7] font-sans leading-relaxed">
                      {audit.debtStrategies.avalanche.description}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#241512] border border-[#C6A477]/25 space-y-2">
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="text-xs text-[#C7BAA7]">PSIXOLOGIK MOMENTUM</span>
                        <span className="text-sm font-serif font-bold text-[#C6A477]">
                          {audit.debtStrategies.snowball.psychologicalMomentum}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="text-xs text-[#C7BAA7]">TO‘LIQ ERKINLIKKACHA VAQT</span>
                        <span className="text-sm font-bold text-[#FAF7F1]">
                          {audit.debtStrategies.snowball.estimatedMonths} Oy
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#C7BAA7] font-sans leading-relaxed">
                      {audit.debtStrategies.snowball.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Actionable Recommendations */}
              <div className="p-6 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#C6A477]" />
                  <h3 className="font-serif font-bold text-[#FAF7F1] text-base">ALGORITMIK TAVSIYALAR</h3>
                </div>

                <div className="space-y-3">
                  {audit.recommendations.map((rec, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[#140D0B] border border-[#C6A477]/15 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#FAF7F1]">{rec.title}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#54252D]/60 text-[#C6A477] border border-[#C6A477]/30 font-bold">
                          {rec.impact}
                        </span>
                      </div>
                      <p className="text-xs text-[#C7BAA7] font-sans leading-relaxed">{rec.actionText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Consultation Question Bar */}
            <div className="p-6 rounded-2xl bg-[#1A110E] border border-[#C6A477]/30 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#C6A477]" />
                <h3 className="font-serif font-bold text-[#FAF7F1] text-base">MOLIYAVIY MASLAHATCHIDAN SO‘RASH</h3>
              </div>

              <form onSubmit={handleAskCoach} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Masalan: Qanday qilib investitsiyalarga zarar yetkazmasdan oylik zaxiramni ko‘paytirsam bo‘ladi?"
                  value={coachQuestion}
                  onChange={(e) => setCoachQuestion(e.target.value)}
                  className="flex-1 bg-[#140D0B] border border-[#C6A477]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#FAF7F1] placeholder-[#C7BAA7]/60 outline-none focus:border-[#C6A477]"
                />
                <button
                  type="submit"
                  disabled={isAnswering}
                  className="px-6 py-3 rounded-xl bg-[#C6A477] hover:bg-[#B38E60] text-[#120A08] font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_4px_15px_rgba(198,164,119,0.3)] shrink-0 flex items-center justify-center gap-2"
                >
                  {isAnswering ? (
                    <span className="w-4 h-4 rounded-full border-2 border-[#120A08] border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>MASLAHAT OLISH</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {coachAnswer && (
                <div className="p-4 rounded-xl bg-[#241512] border border-[#C6A477]/30 text-xs sm:text-sm text-[#FAF7F1] font-sans leading-relaxed space-y-2">
                  <div className="text-[10px] font-mono text-[#C6A477] font-bold uppercase">Maslahatchi Javobi:</div>
                  <p>{coachAnswer}</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* 3. Luxury Refined Footer */}
      <LuxuryFooter />
    </div>
  );
}
