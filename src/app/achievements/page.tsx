// ==============================================================================
// VALIXEN ACHIEVEMENT SYSTEM (/achievements)
// Institutional Allocator Mastery Badges, Gamified Level Progression & XP Telemetry
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import { UserProgressionOverview } from '@/server/services/achievements.service';
import {
  Award,
  Trophy,
  Flame,
  Sparkles,
  Lock,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Target,
  RefreshCw,
  Coins,
  DollarSign,
  GraduationCap,
  Layers,
} from 'lucide-react';

export default function AchievementsPage() {
  const [data, setData] = useState<UserProgressionOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState('ALL');

  const fetchProgression = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/achievements');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgression();
  }, []);

  const filteredAchievements = data?.achievements.filter((a) => {
    if (tierFilter !== 'ALL' && a.tier !== tierFilter) return false;
    return true;
  }) || [];

  const tierColors: Record<string, string> = {
    BRONZE: 'bg-amber-700/20 text-amber-300 border-amber-600/30',
    SILVER: 'bg-slate-400/20 text-slate-200 border-slate-300/30',
    GOLD: 'bg-valixen-gold/20 text-valixen-gold border-valixen-gold/40',
    PLATINUM: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    DIAMOND: 'bg-valixen-violet/20 text-valixen-ice border-valixen-violet/40',
  };

  return (
    <div className="min-h-screen bg-[#090706] text-[#FAF7F1] flex flex-col font-sans selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <LuxuryNavbar />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                SOVEREIGN RECOGNITION LEDGER
              </Badge>
              <span className="text-xs font-mono text-slate-400">CRYPTOGRAPHIC MASTERY PROOFS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              ACHIEVEMENT SYSTEM
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Earn permanent institutional credentials and elevate your allocator tier by mastering algorithmic execution, capital preservation, and macroeconomic strategy.
            </p>
          </div>

          <Button variant="glass" size="sm" onClick={fetchProgression} disabled={isLoading} className="text-xs font-mono self-start md:self-auto">
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            SYNC BADGES
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <div className="h-44 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {!isLoading && data && (
          <>
            {/* User Level Progression Hero Banner */}
            <GlassPanel variant="prismatic" className="p-6 sm:p-8 space-y-6 border-valixen-gold/30 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-valixen-gold via-amber-500 to-yellow-600 flex items-center justify-center text-black font-extrabold text-2xl shadow-glow-gold">
                    {data.userLevel}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-valixen-gold font-bold">LEVEL {data.userLevel}</span>
                      <Badge variant="cyan" className="text-[10px] font-mono">
                        {data.totalUnlockedCount} OF {data.totalAchievementsCount} BADGES UNLOCKED
                      </Badge>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-0.5">
                      {data.levelTitle}
                    </h2>
                  </div>
                </div>

                <div className="w-full lg:w-96 space-y-2">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-slate-400">XP PROGRESSION</span>
                    <span className="text-white font-bold">
                      {data.currentXp.toLocaleString()} / {data.nextLevelXp.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.08] rounded-full h-3 overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-valixen-gold via-yellow-400 to-valixen-ice h-full rounded-full transition-all duration-700"
                      style={{ width: `${data.levelProgressPercent}%` }}
                    />
                  </div>
                  <div className="text-right text-[11px] font-mono text-slate-400">
                    {data.nextLevelXp - data.currentXp} XP until Level {data.userLevel + 1}
                  </div>
                </div>
              </div>
            </GlassPanel>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono text-slate-400 mr-2">TIER FILTER:</span>
              {['ALL', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    tierFilter === tier
                      ? 'bg-valixen-gold text-black font-bold shadow-glow-gold'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((ach) => {
                const isUnlocked = ach.isUnlocked;

                return (
                  <GlassPanel
                    key={ach.id}
                    variant="prismatic"
                    className={`p-6 flex flex-col justify-between space-y-6 relative overflow-hidden transition-all ${
                      isUnlocked
                        ? 'border-valixen-gold/50 shadow-glow-gold/10'
                        : 'opacity-70 border-white/[0.06] hover:opacity-100'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Tier & Lock Status */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${tierColors[ach.tier] || ''}`}>
                          {ach.tier}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          {isUnlocked ? (
                            <span className="text-valixen-telemetry-profit flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED
                            </span>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" /> LOCKED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Icon & Title */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-display font-bold text-white flex items-center justify-between">
                          <span>{ach.title}</span>
                          <span className="text-xs font-mono text-valixen-gold font-bold">+{ach.xpReward} XP</span>
                        </h3>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {ach.description}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>PROGRESS</span>
                          <span>{ach.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isUnlocked ? 'bg-valixen-gold' : 'bg-valixen-violet'
                            }`}
                            style={{ width: `${ach.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Unlocked Date Footer */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>CATEGORY: {ach.category}</span>
                      {isUnlocked && ach.unlockedAt && (
                        <span>UNLOCKED: {ach.unlockedAt.slice(0, 10)}</span>
                      )}
                    </div>
                  </GlassPanel>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Luxury Footer */}
      <LuxuryFooter />
    </div>
  );
}
