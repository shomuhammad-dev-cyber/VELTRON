// ==============================================================================
// VALIXEN AI FINANCIAL COACH (/ai-coach)
// Behavioral Diagnostic Audits, Debt Avalanche/Snowball & Daily Drills
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
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

    // Call chat endpoint with coach prompt
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `[FINANCIAL COACH CONSULTATION]: ${coachQuestion}`,
        }),
      });
      const json = await res.json();
      if (json.data?.reply) {
        setCoachAnswer(json.data.reply);
      }
    } catch {
      setCoachAnswer('Coach connection timed out. Please try again.');
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans selection:bg-valixen-violet selection:text-white">
      {/* 1. Header Toolbar */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="main" size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">/</span>
            <span className="text-valixen-ice font-bold">AI FINANCIAL COACH</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/ai-assistant">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-slate-300">
              AI Assistant
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="glass" size="sm" className="font-mono text-xs">
              Analytics Overview →
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                BEHAVIORAL WEALTH ADVISORY
              </Badge>
              <span className="text-xs font-mono text-slate-400">NEURAL FINANCIAL COACH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              AI FINANCIAL COACH
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Autonomous behavioral audits, debt payoff optimization models, and actionable daily financial drills.
            </p>
          </div>

          <Button variant="glass" size="sm" onClick={fetchCoachData} disabled={isLoading} className="text-xs font-mono self-start md:self-auto">
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            RE-EVALUATE
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <div className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            <div className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
          </div>
        )}

        {!isLoading && audit && (
          <>
            {/* Top Diagnostic Scorecard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="BEHAVIORAL HEALTH SCORE"
                value={`${audit.diagnosticScore} / 100`}
                change={{ value: 'Optimal Discipline', isPositive: audit.diagnosticScore >= 70 }}
                icon={<Brain className="w-4 h-4 text-valixen-ice" />}
              />
              <StatCard
                title="LIQUIDITY RUNWAY"
                value={`${audit.runwayMonths} Months`}
                change={{ value: 'Baseline Living Cushion', isPositive: audit.runwayMonths >= 6 }}
                icon={<ShieldCheck className="w-4 h-4 text-valixen-telemetry-profit" />}
              />
              <StatCard
                title="NET SAVINGS ALLOCATION"
                value={`${audit.savingsRatePercent}%`}
                change={{ value: 'Monthly Wealth Capture', isPositive: audit.savingsRatePercent >= 20 }}
                icon={<TrendingUp className="w-4 h-4 text-valixen-violet" />}
              />
              <StatCard
                title="DISCRETIONARY BURN RATE"
                value={`$${audit.discretionaryBurnRate.toLocaleString()} / mo`}
                change={{ value: 'Wants & Non-Essentials', isPositive: true }}
                icon={<Flame className="w-4 h-4 text-valixen-gold" />}
              />
            </div>

            {/* Daily Financial Drill Highlight */}
            <GlassPanel variant="prismatic" className="p-6 relative overflow-hidden border-valixen-violet/40">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" dot className="text-[10px]">
                      DAILY HIGH-CONVEXITY DRILL
                    </Badge>
                    <span className="text-xs font-mono text-valixen-ice font-bold">
                      POTENTIAL GAIN: +${audit.dailyActionTip.estimatedMonthlyGainUsd}/MO
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {audit.dailyActionTip.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl leading-relaxed">
                    {audit.dailyActionTip.description}
                  </p>
                </div>

                <Link href="/wallet">
                  <Button variant="primary" size="md" className="font-mono text-xs shrink-0">
                    EXECUTE AUDIT IN WALLET →
                  </Button>
                </Link>
              </div>
            </GlassPanel>

            {/* Debt Payoff Optimization Engine: Avalanche vs Snowball */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassPanel variant="prismatic" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-valixen-ice" />
                    <h3 className="font-display font-bold text-white text-base">DEBT ACCELERATION MATRIX</h3>
                  </div>
                  <div className="flex items-center bg-white/[0.04] p-1 rounded-lg border border-white/10 text-xs font-mono">
                    <button
                      onClick={() => setActiveStrategy('AVALANCHE')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeStrategy === 'AVALANCHE'
                          ? 'bg-valixen-violet text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      AVALANCHE (MATH)
                    </button>
                    <button
                      onClick={() => setActiveStrategy('SNOWBALL')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeStrategy === 'SNOWBALL'
                          ? 'bg-valixen-ice text-black font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      SNOWBALL (BEHAVIOR)
                    </button>
                  </div>
                </div>

                {activeStrategy === 'AVALANCHE' ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-valixen-violet/10 border border-valixen-violet/30 space-y-2">
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="text-xs text-slate-400">INTEREST CAPITAL SAVED</span>
                        <span className="text-lg font-extrabold text-valixen-telemetry-profit">
                          +${audit.debtStrategies.avalanche.interestSavedUsd.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="text-xs text-slate-400">TIME TO ZERO DEBT</span>
                        <span className="text-sm font-bold text-white">
                          {audit.debtStrategies.avalanche.estimatedMonths} Months
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {audit.debtStrategies.avalanche.description}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-valixen-ice/10 border border-valixen-ice/30 space-y-2">
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="text-xs text-slate-400">PSYCHOLOGICAL MOMENTUM</span>
                        <span className="text-sm font-bold text-valixen-ice">
                          {audit.debtStrategies.snowball.psychologicalMomentum}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="text-xs text-slate-400">TIME TO ZERO DEBT</span>
                        <span className="text-sm font-bold text-white">
                          {audit.debtStrategies.snowball.estimatedMonths} Months
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {audit.debtStrategies.snowball.description}
                    </p>
                  </div>
                )}
              </GlassPanel>

              {/* Actionable Recommendations */}
              <GlassPanel variant="prismatic" className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-valixen-gold" />
                  <h3 className="font-display font-bold text-white text-base">TAILORED RE-ALLOCATIONS</h3>
                </div>

                <div className="space-y-3">
                  {audit.recommendations.map((rec, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-white">{rec.title}</span>
                        <Badge variant={rec.impact === 'HIGH' ? 'risk' : 'default'} className="text-[9px] px-1.5 py-0.5">
                          {rec.impact}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">{rec.actionText}</p>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>

            {/* Direct Consultation Question Bar */}
            <GlassPanel variant="elevated" className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-valixen-ice" />
                <h3 className="font-display font-bold text-white text-base">ASK YOUR FINANCIAL COACH</h3>
              </div>

              <form onSubmit={handleAskCoach} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. How can I optimize my monthly emergency reserve pace without hurting investments?"
                  value={coachQuestion}
                  onChange={(e) => setCoachQuestion(e.target.value)}
                  className="flex-1 bg-[#0E121B] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-valixen-ice"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isAnswering}
                  isLoading={isAnswering}
                  className="font-mono text-xs shrink-0"
                >
                  CONSULT COACH →
                </Button>
              </form>

              {coachAnswer && (
                <div className="p-4 rounded-xl bg-black/40 border border-valixen-ice/30 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed space-y-2">
                  <div className="text-[10px] font-mono text-valixen-ice font-bold uppercase">Coach Advisory Response:</div>
                  <p>{coachAnswer}</p>
                </div>
              )}
            </GlassPanel>
          </>
        )}
      </main>
    </div>
  );
}
