// ==============================================================================
// VALIXEN FUTURISTIC LEADERBOARD VIEW COMPONENT
// Premium Dark Glass Panels, Animated Podiums, Badges & Privacy Opt-Out
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import {
  LeaderboardEntryDTO,
  UserGamificationProfileDTO,
  LEVEL_TIERS,
} from '@/server/services/gamification.service';
import {
  Trophy,
  Award,
  Flame,
  Globe,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  BookOpen,
  Target,
  ArrowRight,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface LeaderboardViewProps {
  initialScope: 'GLOBAL' | 'COUNTRY' | 'WEEKLY' | 'MONTHLY';
  pageTitle: string;
  pageSubtitle: string;
}

const COUNTRY_FLAGS: Record<string, { label: string; flag: string }> = {
  ALL: { label: 'ALL NATIONS', flag: '🌐' },
  UZ: { label: 'UZBEKISTAN', flag: '🇺🇿' },
  US: { label: 'UNITED STATES', flag: '🇺🇸' },
  GB: { label: 'UNITED KINGDOM', flag: '🇬🇧' },
  DE: { label: 'GERMANY', flag: '🇩🇪' },
  SG: { label: 'SINGAPORE', flag: '🇸🇬' },
  AE: { label: 'UAE (DUBAI)', flag: '🇦🇪' },
  JP: { label: 'JAPAN', flag: '🇯🇵' },
  SE: { label: 'SWEDEN', flag: '🇸🇪' },
  CH: { label: 'SWITZERLAND', flag: '🇨🇭' },
};

export function LeaderboardView({ initialScope, pageTitle, pageSubtitle }: LeaderboardViewProps) {
  const pathname = usePathname();
  const [scope, setScope] = useState<'GLOBAL' | 'COUNTRY' | 'WEEKLY' | 'MONTHLY'>(initialScope);
  const [countryCode, setCountryCode] = useState('ALL');
  const [entries, setEntries] = useState<LeaderboardEntryDTO[]>([]);
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntryDTO | null>(null);
  const [userProfile, setUserProfile] = useState<UserGamificationProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);

  // Fetch Leaderboard
  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const q = new URLSearchParams();
      q.set('scope', scope);
      if (scope === 'COUNTRY' && countryCode !== 'ALL') {
        q.set('country', countryCode);
      }

      const res = await fetch(`/api/v1/gamification/leaderboard?${q.toString()}`);
      if (!res.ok) throw new Error('Failed to load leaderboard data.');
      const json = await res.json();
      if (json.success && json.data) {
        setEntries(json.data.entries || []);
        setCurrentUserEntry(json.data.currentUserEntry || null);
      } else {
        throw new Error(json.error?.message || 'Invalid server response structure.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to ranking telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Personal Progress Profile
  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/v1/gamification/progress');
      const json = await res.json();
      if (json.success && json.data) {
        setUserProfile(json.data);
      }
    } catch {
      // silently handle
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [scope, countryCode]);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Toggle Public Opt-Out
  const handleToggleOptOut = async () => {
    if (!userProfile) return;
    setIsUpdatingPrivacy(true);
    try {
      const newOptOut = !userProfile.isOptedOut;
      const res = await fetch('/api/v1/gamification/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOptedOut: newOptOut }),
      });
      const json = await res.json();
      if (json.success) {
        setUserProfile((prev) => (prev ? { ...prev, isOptedOut: newOptOut } : prev));
        fetchLeaderboard();
      }
    } catch {
      alert('Failed to update privacy preference.');
    } finally {
      setIsUpdatingPrivacy(false);
    }
  };

  const topThree = entries.slice(0, 3);
  const remainingEntries = entries.slice(3);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'LEGEND':
        return 'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-500/10 shadow-glow-violet';
      case 'MASTER':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-glow-gold';
      case 'EXPERT':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-glow-profit';
      case 'STRATEGIST':
        return 'text-purple-400 border-purple-500/40 bg-purple-500/10';
      case 'ANALYST':
        return 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10';
      case 'EXPLORER':
        return 'text-sky-400 border-sky-500/40 bg-sky-500/10';
      default:
        return 'text-slate-400 border-slate-500/40 bg-slate-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans selection:bg-valixen-violet selection:text-white">
      {/* 1. Header Navigation */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="main" size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">/</span>
            <span className="text-valixen-gold font-bold">SOVEREIGN ALLOCATOR RANKINGS</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/achievements">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-valixen-gold" /> Achievements
            </Button>
          </Link>
          <Link href="/challenges">
            <Button variant="glass" size="sm" className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-valixen-ice" /> Challenges
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="font-mono text-xs">
              Dashboard →
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title and Top Level Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                MERIT-BASED TELEMETRY
              </Badge>
              <span className="text-xs font-mono text-slate-400">ZERO WEALTH BIAS • 100% EDUCATIONAL MERIT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              {pageSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {userProfile && (
              <Button
                variant={userProfile.isOptedOut ? 'secondary' : 'glass'}
                size="sm"
                onClick={handleToggleOptOut}
                disabled={isUpdatingPrivacy}
                className="flex items-center gap-2 text-xs font-mono"
                title={userProfile.isOptedOut ? 'Currently hidden from public leaderboards' : 'Currently visible on public leaderboards'}
              >
                {userProfile.isOptedOut ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-valixen-gold" /> ANONYMOUS MODE
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-valixen-ice" /> PUBLIC RANKING ON
                  </>
                )}
              </Button>
            )}

            <Button
              variant="glass"
              size="sm"
              onClick={fetchLeaderboard}
              disabled={isLoading}
              className="flex items-center gap-2 text-xs font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              SYNC
            </Button>
          </div>
        </div>

        {/* User Progress Diagnostic Banner */}
        {userProfile && (
          <GlassPanel variant="prismatic" className="p-6 relative overflow-hidden border-valixen-gold/30">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-valixen-gold/10 border border-valixen-gold/30 flex items-center justify-center text-valixen-gold font-display font-bold text-xl shadow-glow-gold">
                  {userProfile.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-display font-bold text-white">{userProfile.username}</span>
                    <span className="text-xs">{COUNTRY_FLAGS[userProfile.countryCode]?.flag || '🌐'}</span>
                    <Badge variant="gold" className="text-[10px] px-2 py-0.5 font-mono">
                      {userProfile.levelTitle}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Total Validated XP: <strong className="text-white">{userProfile.totalXp.toLocaleString()} XP</strong> • Active Streak: <strong className="text-valixen-gold">{userProfile.streakDays} Days 🔥</strong>
                  </p>
                </div>
              </div>

              {/* Progress to Next Tier */}
              {userProfile.nextLevel.level && (
                <div className="w-full lg:w-72 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>NEXT: <strong className="text-valixen-ice">{userProfile.nextLevel.levelTitle}</strong></span>
                    <span>{userProfile.nextLevel.xpRemaining} XP remaining</span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-0.5 border border-white/[0.08]">
                    <div
                      className="h-full bg-gradient-to-r from-valixen-violet via-valixen-ice to-valixen-gold rounded-full transition-all duration-500 shadow-glow-cyan"
                      style={{ width: `${userProfile.nextLevel.progressPercent}%` }}
                    />
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    {userProfile.nextLevel.progressPercent}% Progress toward promotion
                  </div>
                </div>
              )}
            </div>
          </GlassPanel>
        )}

        {/* Telemetry Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="GLOBAL RANKING POSITION"
            value={userProfile ? `#${userProfile.ranks.global}` : '#8'}
            change={{ value: 'Top 5% of all allocators', isPositive: true }}
            icon={<Trophy className="w-4 h-4 text-valixen-gold" />}
          />
          <StatCard
            title="COUNTRY POSITION"
            value={userProfile ? `#${userProfile.ranks.country} in UZ` : '#4 in UZ'}
            change={{ value: 'Uzbekistan Sovereign Tier', isPositive: true }}
            icon={<Globe className="w-4 h-4 text-valixen-ice" />}
          />
          <StatCard
            title="CURRENT LEVEL MASTERY"
            value={userProfile ? userProfile.levelTitle : 'Capital Strategist'}
            change={{ value: 'Zero Real-Capital Risk', isPositive: true }}
            icon={<ShieldCheck className="w-4 h-4 text-valixen-violet" />}
          />
          <StatCard
            title="VALIDATED KNOWLEDGE XP"
            value={userProfile ? `${userProfile.totalXp.toLocaleString()} XP` : '3,850 XP'}
            change={{ value: '+650 XP earned this week', isPositive: true }}
            icon={<Sparkles className="w-4 h-4 text-valixen-telemetry-profit" />}
          />
        </div>

        {/* Subnavigation Bar: View Switcher */}
        <GlassPanel variant="subtle" className="p-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'GLOBAL', label: 'GLOBAL LEADERBOARD', href: '/ranking/global', icon: Globe },
              { id: 'COUNTRY', label: 'BY NATION', href: '/ranking/country', icon: Globe },
              { id: 'WEEKLY', label: 'WEEKLY SPRINT', href: '/ranking/weekly', icon: Clock },
              { id: 'MONTHLY', label: 'MONTHLY APEX', href: '/ranking/monthly', icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = (tab.id === 'GLOBAL' && (pathname === '/ranking' || pathname === '/ranking/global')) || pathname === tab.href;
              return (
                <Link key={tab.id} href={tab.href}>
                  <button
                    onClick={() => setScope(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-valixen-gold text-black font-bold shadow-glow-gold'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Country Filter (when in country scope) */}
          {scope === 'COUNTRY' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">JURISDICTION:</span>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-black/40 border border-white/[0.1] text-xs font-mono text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-valixen-gold"
              >
                {Object.entries(COUNTRY_FLAGS).map(([code, info]) => (
                  <option key={code} value={code} className="bg-slate-900 text-white">
                    {info.flag} {info.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </GlassPanel>

        {/* 3. Top Three Podium Showcase */}
        {topThree.length >= 3 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
            {/* Rank 2 (Silver) */}
            <GlassPanel
              variant="prismatic"
              className="p-6 order-2 md:order-1 text-center relative border-slate-300/30 flex flex-col items-center justify-between min-h-[220px]"
            >
              <div className="w-10 h-10 rounded-full bg-slate-300/10 border border-slate-300/40 text-slate-300 flex items-center justify-center font-bold text-sm mb-2">
                #2
              </div>
              <div className="space-y-1">
                <span className="text-xl">{COUNTRY_FLAGS[topThree[1].countryCode]?.flag || '🌐'}</span>
                <h3 className="text-base font-display font-bold text-white line-clamp-1">{topThree[1].username}</h3>
                <Badge variant="cyan" className="text-[10px] px-2 py-0.5 font-mono">
                  {topThree[1].levelTitle}
                </Badge>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] w-full text-xs font-mono text-slate-300">
                <strong className="text-white text-base">{topThree[1].totalXp.toLocaleString()}</strong> XP
                <div className="text-[10px] text-slate-500 mt-0.5">{topThree[1].streakDays} Days Streak 🔥</div>
              </div>
            </GlassPanel>

            {/* Rank 1 (Gold Apex) */}
            <GlassPanel
              variant="prismatic"
              className="p-8 order-1 md:order-2 text-center relative border-valixen-gold/50 shadow-glow-gold flex flex-col items-center justify-between min-h-[260px] bg-gradient-to-b from-valixen-gold/10 to-transparent"
            >
              <div className="relative">
                <Trophy className="w-7 h-7 text-valixen-gold mx-auto -mt-2 mb-1 animate-pulse" />
                <div className="w-12 h-12 rounded-full bg-valixen-gold/20 border-2 border-valixen-gold text-valixen-gold flex items-center justify-center font-extrabold text-base mx-auto">
                  #1
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-2xl">{COUNTRY_FLAGS[topThree[0].countryCode]?.flag || '🌐'}</span>
                <h3 className="text-lg font-display font-extrabold text-white line-clamp-1">{topThree[0].username}</h3>
                <Badge variant="gold" className="text-[10px] px-2.5 py-0.5 font-mono shadow-glow-gold">
                  {topThree[0].levelTitle}
                </Badge>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.08] w-full text-xs font-mono text-valixen-gold">
                <strong className="text-white text-lg">{topThree[0].totalXp.toLocaleString()}</strong> XP
                <div className="text-[10px] text-slate-400 mt-0.5">{topThree[0].streakDays} Days Streak 🔥</div>
              </div>
            </GlassPanel>

            {/* Rank 3 (Bronze) */}
            <GlassPanel
              variant="prismatic"
              className="p-6 order-3 text-center relative border-amber-700/30 flex flex-col items-center justify-between min-h-[200px]"
            >
              <div className="w-10 h-10 rounded-full bg-amber-700/10 border border-amber-700/40 text-amber-500 flex items-center justify-center font-bold text-sm mb-2">
                #3
              </div>
              <div className="space-y-1">
                <span className="text-xl">{COUNTRY_FLAGS[topThree[2].countryCode]?.flag || '🌐'}</span>
                <h3 className="text-base font-display font-bold text-white line-clamp-1">{topThree[2].username}</h3>
                <Badge variant="default" className="text-[10px] px-2 py-0.5 font-mono">
                  {topThree[2].levelTitle}
                </Badge>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] w-full text-xs font-mono text-slate-400">
                <strong className="text-white text-base">{topThree[2].totalXp.toLocaleString()}</strong> XP
                <div className="text-[10px] text-slate-500 mt-0.5">{topThree[2].streakDays} Days Streak 🔥</div>
              </div>
            </GlassPanel>
          </div>
        )}

        {/* 4. Complete Leaderboard Table */}
        <GlassPanel variant="prismatic" className="p-0 overflow-hidden">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
            <span className="text-xs font-mono text-slate-400">
              SHOWING TOP {entries.length} VERIFIED SOVEREIGN ALLOCATORS
            </span>
            <span className="text-xs font-mono text-valixen-ice">
              UPDATED LIVE • LATENCY 14ms
            </span>
          </div>

          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
              ))}
            </div>
          ) : errorMessage ? (
            <div className="p-12 text-center space-y-3 font-mono text-xs text-valixen-telemetry-risk">
              <p>{errorMessage}</p>
              <Button variant="glass" size="sm" onClick={fetchLeaderboard}>
                RETRY CONNECTION
              </Button>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center space-y-3 font-mono text-xs text-slate-500">
              <p>NO ALLOCATORS RECORDED FOR THIS JURISDICTION YET.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {entries.map((entry) => {
                const isTopThree = entry.rank <= 3;
                return (
                  <div
                    key={entry.userId}
                    className={`px-4 sm:px-6 py-4 flex items-center justify-between gap-4 transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-valixen-gold/10 border-l-4 border-valixen-gold'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Rank & User Identity */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          entry.rank === 1
                            ? 'bg-valixen-gold text-black shadow-glow-gold'
                            : entry.rank === 2
                            ? 'bg-slate-300 text-black'
                            : entry.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-white/[0.05] text-slate-400'
                        }`}
                      >
                        {entry.rank}
                      </div>

                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg shrink-0">{COUNTRY_FLAGS[entry.countryCode]?.flag || '🌐'}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-display font-bold text-white truncate">
                              {entry.username}
                            </span>
                            {entry.isCurrentUser && (
                              <span className="text-[10px] font-mono bg-valixen-gold/20 text-valixen-gold px-1.5 py-0.5 rounded">
                                YOU
                              </span>
                            )}
                            {entry.isAnonymous && (
                              <span className="text-[10px] font-mono text-slate-500">
                                (Privately Opted Out)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {entry.levelTitle}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Badges, Streak, and XP Total */}
                    <div className="flex items-center gap-4 sm:gap-8 shrink-0 text-right font-mono">
                      <div className="hidden sm:block">
                        <div className="text-[10px] text-slate-500 uppercase">Streak</div>
                        <div className="text-xs text-valixen-gold font-bold">
                          {entry.streakDays} Days 🔥
                        </div>
                      </div>

                      <div className="hidden md:block">
                        <div className="text-[10px] text-slate-500 uppercase">Badges</div>
                        <div className="text-xs text-slate-300">
                          {entry.badgesCount} Unlocked
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">
                          {scope === 'WEEKLY' ? 'Weekly XP' : scope === 'MONTHLY' ? 'Monthly XP' : 'Total XP'}
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-white">
                          {(scope === 'WEEKLY' ? entry.weeklyXp : scope === 'MONTHLY' ? entry.monthlyXp : entry.totalXp).toLocaleString()} XP
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassPanel>

        {/* 5. Level Hierarchy Transparency Guide */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-valixen-gold" /> SOVEREIGN ALLOCATOR PROGRESSION TIERS
            </h2>
            <Link href="/challenges">
              <Button variant="ghost" size="sm" className="text-xs font-mono text-valixen-ice flex items-center gap-1">
                Earn XP in Challenges <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {LEVEL_TIERS.map((tier) => (
              <GlassPanel key={tier.level} variant="subtle" className="p-3 text-center space-y-1">
                <div
                  className="w-7 h-7 rounded-lg mx-auto flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: `${tier.badgeColor}20`, color: tier.badgeColor }}
                >
                  ★
                </div>
                <div className="text-xs font-display font-bold text-white truncate">{tier.level}</div>
                <div className="text-[10px] font-mono text-slate-400">
                  {tier.maxXp ? `${tier.minXp} - ${tier.maxXp} XP` : `${tier.minXp}+ XP`}
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
