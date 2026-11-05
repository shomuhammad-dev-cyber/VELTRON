// ==============================================================================
// VALIXEN ADVANCED TELEGRAM NOTIFICATION SETTINGS & CONTROLS CENTER
// Route: /settings/notifications
// Granular 10-category opt-in toggles, test dispatches & delivery audit log
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  BarChart2,
  FileText,
  GraduationCap,
  Target,
  Trophy,
  Award,
  Zap,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { TelegramNotificationCategory } from '@/server/services/telegram-notification-center.service';

interface CategoryConfig {
  key: string;
  category: TelegramNotificationCategory;
  name: string;
  icon: any;
  color: string;
  desc: string;
  sampleText: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'marketPrice',
    category: 'MARKET_PRICE',
    name: 'Market Price Alerts',
    icon: TrendingUp,
    color: 'text-valixen-cyan',
    desc: 'Target limit fills, cryptocurrency volatility spikes, and asset breakouts.',
    sampleText: 'BTC/USD crossed $95,000 (+4.8% 24h).',
  },
  {
    key: 'currencyExchange',
    category: 'CURRENCY_EXCHANGE',
    name: 'Currency Exchange Alerts',
    icon: DollarSign,
    color: 'text-emerald-400',
    desc: 'USD/UZS exchange rate shifts and Central Bank of Uzbekistan policy updates.',
    sampleText: 'CBU Refinancing Rate confirmed at 13.50%.',
  },
  {
    key: 'portfolioSummary',
    category: 'PORTFOLIO_SUMMARY',
    name: 'Portfolio Summary Notifications',
    icon: BarChart2,
    color: 'text-valixen-ice',
    desc: 'Daily paper trading equity, Sharpe ratio updates, and margin alerts.',
    sampleText: 'Virtual equity: $102,450.00. Sharpe: 2.14.',
  },
  {
    key: 'weeklyReports',
    category: 'WEEKLY_REPORTS',
    name: 'Weekly Financial Reports',
    icon: FileText,
    color: 'text-amber-400',
    desc: 'Comprehensive sovereign wealth runway digests and savings velocity charts.',
    sampleText: 'Net capital capture: 22.4%. Runway: 6.4 months.',
  },
  {
    key: 'educationalCourses',
    category: 'EDUCATIONAL_COURSES',
    name: 'New Educational Courses',
    icon: GraduationCap,
    color: 'text-valixen-violet',
    desc: 'New financial literacy masterclasses, drills, and wealth architecture lessons.',
    sampleText: 'New course live: "Central Banking & Macro Currencies".',
  },
  {
    key: 'challengeReminders',
    category: 'CHALLENGE_REMINDERS',
    name: 'Challenge Reminders',
    icon: Target,
    color: 'text-rose-400',
    desc: 'Daily habit streaks, 48-hour spending cooling-periods, and sprint deadlines.',
    sampleText: 'Day 5 of 7-Day Zero Impulse Spending Protocol.',
  },
  {
    key: 'achievementAlerts',
    category: 'ACHIEVEMENTS',
    name: 'Achievement Notifications',
    icon: Trophy,
    color: 'text-valixen-gold',
    desc: 'Newly unlocked honor badges, XP milestones, and allocator medals.',
    sampleText: 'Honor unlocked: "Sovereign Accumulator" (+850 XP).',
  },
  {
    key: 'rankingUpdates',
    category: 'RANKING_UPDATES',
    name: 'Ranking Updates',
    icon: Award,
    color: 'text-sky-400',
    desc: 'Global and Uzbekistan leaderboard podium shifts and level promotions.',
    sampleText: 'Your merit rank has climbed to Top 4 in Uzbekistan.',
  },
  {
    key: 'securityAlerts',
    category: 'SECURITY_NOTIFICATIONS',
    name: 'Security Notifications',
    icon: ShieldCheck,
    color: 'text-red-400',
    desc: 'SIEM alerts, multi-factor triggers, new session detections, and password changes.',
    sampleText: 'SOC Center verification: Zero anomalous sessions.',
  },
  {
    key: 'accountActivity',
    category: 'ACCOUNT_ACTIVITY',
    name: 'Account Activity Alerts',
    icon: Zap,
    color: 'text-indigo-400',
    desc: 'Simulated order execution, fiat deposit confirmations, and transfer dispatches.',
    sampleText: 'Paper Trading simulated order filled: Bought 0.25 BTC.',
  },
];

export default function TelegramNotificationSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingCategory, setTestingCategory] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [linkStatus, setLinkStatus] = useState<{
    isLinked: boolean;
    telegramChatId: string | null;
    telegramUsername: string | null;
  }>({
    isLinked: false,
    telegramChatId: null,
    telegramUsername: null,
  });

  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    enabled: true,
    marketPrice: true,
    currencyExchange: true,
    portfolioSummary: true,
    weeklyReports: true,
    educationalCourses: true,
    challengeReminders: true,
    achievementAlerts: true,
    rankingUpdates: true,
    securityAlerts: true,
    accountActivity: true,
  });

  const [history, setHistory] = useState<any[]>([]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load preferences
      const prefRes = await fetch('/api/v1/telegram/notifications/settings');
      const prefJson = await prefRes.json();
      if (prefJson.success && prefJson.data) {
        setLinkStatus({
          isLinked: prefJson.data.isLinked,
          telegramChatId: prefJson.data.telegramChatId,
          telegramUsername: prefJson.data.telegramUsername,
        });
        setPreferences(prefJson.data.preferences);
      }

      // 2. Load delivery history
      const histRes = await fetch('/api/v1/telegram/notifications/history?limit=10');
      const histJson = await histRes.json();
      if (histJson.success && histJson.data) {
        setHistory(histJson.data.history || []);
      }
    } catch (err) {
      console.error('Failed to load notification settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (key: string) => {
    const nextVal = !preferences[key];
    const updated = { ...preferences, [key]: nextVal };
    setPreferences(updated);

    try {
      setSaving(true);
      await fetch('/api/v1/telegram/notifications/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: nextVal }),
      });
      showToast('Notification preference saved and synchronized.');
    } catch {
      showToast('Failed to save preference.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestDispatch = async (category: TelegramNotificationCategory) => {
    setTestingCategory(category);
    try {
      const res = await fetch('/api/v1/telegram/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Test dispatch for ${category} queued to Telegram!`);
        // Refresh history
        setTimeout(loadData, 500);
      } else {
        showToast(json.error || 'Failed to dispatch test notification.');
      }
    } catch {
      showToast('Dispatch network failure.');
    } finally {
      setTestingCategory(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans selection:bg-valixen-violet selection:text-white sm:px-0 md:px-0 lg:px-0">
      {/* 1. Header Toolbar */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="main" size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">SETTINGS</span>
            <span className="text-slate-500">/</span>
            <span className="text-valixen-ice font-bold">TELEGRAM NOTIFICATION CENTER</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/notifications">
            <Button variant="glass" size="sm" className="font-mono text-xs">
              Notifications Hub →
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="font-mono text-xs bg-valixen-violet text-white">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Floating Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-valixen-violet text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-glow-violet flex items-center gap-2 border border-white/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* 2. Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                SOVEREIGN TELEMETRY DISPATCHES
              </Badge>
              {linkStatus.isLinked ? (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> LINKED TO @{linkStatus.telegramUsername || 'Allocator'}
                </span>
              ) : (
                <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> NOT CONNECTED TO TELEGRAM
                </span>
              )}
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
              TELEGRAM NOTIFICATION CENTER
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
              Independently configure which financial signals, macroeconomic catalysts, and security alerts are delivered to your Telegram node.
            </p>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="text-xs font-mono self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>

        {/* Telegram Connection Alert Banner */}
        {!linkStatus.isLinked && (
          <GlassPanel variant="prismatic" className="p-4 sm:p-5 border-amber-500/30 bg-amber-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold text-white">Telegram Account Not Connected</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Connect your Telegram account to start receiving these real-time sovereign notifications.
                  </p>
                </div>
              </div>
              <Link href="/notifications">
                <Button variant="primary" size="sm" className="font-mono text-xs bg-sky-500 text-black font-bold whitespace-nowrap">
                  Connect Telegram Bot →
                </Button>
              </Link>
            </div>
          </GlassPanel>
        )}

        {/* Master Toggle Card */}
        <div className="p-5 rounded-2xl bg-[#0A0D14] border border-white/[0.08] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-sm font-display font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-valixen-ice" /> Master Dispatch Switch
            </span>
            <p className="text-xs text-slate-400 font-sans">
              Master control: globally enable or silence all Telegram outbound notifications.
            </p>
          </div>

          <button
            onClick={() => handleToggle('enabled')}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              preferences.enabled ? 'bg-valixen-violet' : 'bg-white/[0.1]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                preferences.enabled ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* 10 Granular Category Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              10 INDEPENDENT NOTIFICATION CATEGORIES
            </span>
            {saving && <span className="text-[10px] font-mono text-valixen-ice animate-pulse">Synchronizing...</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isChecked = Boolean(preferences[cat.key]);
              const isTesting = testingCategory === cat.category;

              return (
                <GlassPanel
                  key={cat.key}
                  variant="subtle"
                  className={`p-4 transition-all border ${
                    isChecked
                      ? 'border-white/[0.1] bg-[#0A0D14]/90'
                      : 'border-white/[0.04] bg-[#0A0D14]/40 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] ${cat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-display font-bold text-white">{cat.name}</h4>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">{cat.category}</span>
                      </div>
                    </div>

                    {/* Category Switch */}
                    <button
                      onClick={() => handleToggle(cat.key)}
                      disabled={!preferences.enabled}
                      className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                        isChecked && preferences.enabled ? 'bg-valixen-violet' : 'bg-white/[0.1]'
                      } ${!preferences.enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                          isChecked && preferences.enabled ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-3">{cat.desc}</p>

                  {/* Sample Alert & Test Dispatch Button */}
                  <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500 truncate max-w-[200px]" title={cat.sampleText}>
                      Sample: {cat.sampleText}
                    </span>

                    <button
                      disabled={isTesting || !linkStatus.isLinked}
                      onClick={() => handleTestDispatch(cat.category)}
                      className="text-valixen-ice hover:text-white px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors shrink-0 flex items-center gap-1"
                    >
                      <Send className="w-2.5 h-2.5" />
                      {isTesting ? 'Sending...' : 'Test Alert'}
                    </button>
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        </div>

        {/* 3. Delivery Status Log Table */}
        <div className="p-5 rounded-2xl bg-[#0A0D14] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                RECENT TELEGRAM DELIVERY AUDIT LEDGER
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">IDEMPOTENT & RETRIED</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-slate-500">
              No recent dispatches logged. Use "Test Alert" above to verify delivery.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/[0.06] text-slate-500 text-[10px]">
                    <th className="pb-2">CATEGORY</th>
                    <th className="pb-2">ALERT TITLE</th>
                    <th className="pb-2">STATUS</th>
                    <th className="pb-2">ATTEMPTS</th>
                    <th className="pb-2 text-right">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 text-valixen-ice font-bold">{record.category}</td>
                      <td className="py-2.5 text-white max-w-xs truncate">{record.title}</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            record.status === 'DELIVERED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : record.status === 'SKIPPED'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400">
                        {record.attempts}/{record.maxAttempts}
                      </td>
                      <td className="py-2.5 text-right text-slate-500 text-[11px]">
                        {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
