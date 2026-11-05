// ==============================================================================
// VALIXEN FINANCIAL EDUCATION CHALLENGES (/challenges)
// Gamified Behavioral Milestones, Task Execution & XP Mastery Badges
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { ChallengeDTO } from '@/server/services/challenges.service';
import {
  Trophy,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Target,
  ArrowRight,
  Zap,
} from 'lucide-react';

export default function EducationChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/challenges');
      const json = await res.json();
      if (json.success && json.data?.challenges) {
        setChallenges(json.data.challenges);
      }
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleToggleTask = async (challengeId: string, taskId: string, taskTitle: string) => {
    try {
      const res = await fetch('/api/v1/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, taskId }),
      });
      const json = await res.json();
      if (res.ok) {
        showToast(`Task completed! Earned +${json.data.earnedXp} XP for '${taskTitle}'.`);
        // Optimistically update task
        setChallenges((prev) =>
          prev.map((c) => {
            if (c.id === challengeId && c.userProgress) {
              const current = c.userProgress.completedTaskIds || [];
              const updated = current.includes(taskId) ? current : [...current, taskId];
              const pct = Math.round((updated.length / c.tasks.length) * 100);
              return {
                ...c,
                userProgress: {
                  ...c.userProgress,
                  completedTaskIds: updated,
                  progressPercent: pct,
                  isCompleted: pct === 100,
                },
              };
            }
            return c;
          })
        );
      }
    } catch {
      alert('Failed to record task progress.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans selection:bg-valixen-violet selection:text-white">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-valixen-obsidian-card border border-valixen-ice/40 shadow-glow-cyan text-xs font-mono text-white flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-valixen-ice shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Navigation Header */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="main" size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">/</span>
            <span className="text-valixen-gold font-bold">FINANCIAL CHALLENGES</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/ranking">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-valixen-gold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Leaderboards
            </Button>
          </Link>
          <Link href="/education">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-slate-300">
              Academy
            </Button>
          </Link>
          <Link href="/achievements">
            <Button variant="glass" size="sm" className="font-mono text-xs">
              Achievements Hub →
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
              <Badge variant="gold" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                GAMIFIED ALLOCATOR PROTOCOLS
              </Badge>
              <span className="text-xs font-mono text-slate-400">FINANCIAL DISCIPLINE SPRINT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              EDUCATION CHALLENGES
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Complete structured quantitative challenges to forge unbreakable capital management habits and unlock sovereign mastery badges.
            </p>
          </div>

          <Button variant="glass" size="sm" onClick={fetchChallenges} disabled={isLoading} className="text-xs font-mono self-start md:self-auto">
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>

        {/* Telemetry Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="ACTIVE SPRINT CHALLENGES"
            value="4 Structured"
            change={{ value: 'Zero Real-Capital Risk', isPositive: true }}
            icon={<Target className="w-4 h-4 text-valixen-ice" />}
          />
          <StatCard
            title="XP REWARD POOL"
            value="2,200 XP Total"
            change={{ value: 'Level Progression', isPositive: true }}
            icon={<Zap className="w-4 h-4 text-valixen-gold" />}
          />
          <StatCard
            title="DISCIPLINE BADGES"
            value="4 Sovereign Badges"
            change={{ value: 'Cryptographic Certificates', isPositive: true }}
            icon={<Award className="w-4 h-4 text-valixen-violet" />}
          />
          <StatCard
            title="COMMUNITY COMPLETION"
            value="89.4% Pass Rate"
            change={{ value: '1,850+ Allocators', isPositive: true }}
            icon={<Trophy className="w-4 h-4 text-valixen-telemetry-profit" />}
          />
        </div>

        {/* Challenge Filter Tabs */}
        <GlassPanel variant="subtle" className="p-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded-lg text-xs font-mono bg-valixen-gold text-black font-bold shadow-glow-gold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> ALL PROTOCOLS (4)
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> WEEKLY SPRINTS (2)
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> MONTHLY APEX (2)
            </button>
          </div>
          <Link href="/ranking/weekly">
            <span className="text-xs font-mono text-valixen-ice hover:underline flex items-center gap-1">
              View Weekly Leaderboard →
            </span>
          </Link>
        </GlassPanel>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        )}

        {/* Challenges Grid */}
        {!isLoading && challenges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((ch) => {
              const progress = ch.userProgress?.progressPercent || 0;
              const isCompleted = ch.userProgress?.isCompleted || false;

              return (
                <GlassPanel
                  key={ch.id}
                  variant="prismatic"
                  className="p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-valixen-gold/40 transition-all"
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={ch.difficulty === 'ADVANCED' ? 'risk' : ch.difficulty === 'INTERMEDIATE' ? 'default' : 'cyan'}
                          className="text-[10px] px-2 py-0.5"
                        >
                          {ch.difficulty}
                        </Badge>
                        <Badge variant="ice" className="text-[10px] px-2 py-0.5">
                          {ch.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-valixen-gold font-bold">
                        <Flame className="w-3.5 h-3.5" /> +{ch.xpReward} XP
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-valixen-gold transition-colors">
                        {ch.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                        {ch.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">CHALLENGE COMPLETION</span>
                        <span className="text-white font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-valixen-telemetry-profit' : 'bg-gradient-to-r from-valixen-gold to-yellow-300'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Tasks Checklist */}
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">Interactive Action Tasks:</div>
                      {ch.tasks.map((task) => {
                        const isTaskDone = ch.userProgress?.completedTaskIds?.includes(task.id);

                        return (
                          <div
                            key={task.id}
                            onClick={() => handleToggleTask(ch.id, task.id, task.title)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                              isTaskDone
                                ? 'bg-valixen-telemetry-profit/10 border-valixen-telemetry-profit/30'
                                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isTaskDone}
                              readOnly
                              className="mt-0.5 w-4 h-4 rounded bg-[#0E121B] border-white/20 text-valixen-gold focus:ring-0 cursor-pointer pointer-events-none"
                            />
                            <div className="space-y-0.5 flex-1">
                              <div className="flex justify-between items-baseline">
                                <span className={`text-xs font-mono font-bold ${isTaskDone ? 'text-white line-through opacity-70' : 'text-white'}`}>
                                  {task.title}
                                </span>
                                <span className="text-[10px] font-mono text-valixen-gold font-bold">+{task.xpReward} XP</span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-sans">{task.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Badge Reward Footer */}
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-valixen-ice" /> UNLOCKS: <strong className="text-white">{ch.badgeName}</strong>
                    </span>
                    <span className="text-slate-500">{ch.durationDays} DAYS PROTOCOL</span>
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
