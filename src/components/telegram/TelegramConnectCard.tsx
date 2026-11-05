// ==============================================================================
// VELTRON TELEGRAM BOT CONNECT & PREFERENCES UI CARD
// Secure One-Time Passkey Generation & Notification Granular Toggles
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Send,
  ShieldCheck,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Trash2,
  Sparkles,
  Lock,
} from 'lucide-react';

export function TelegramConnectCard() {
  const [status, setStatus] = useState<{
    isTelegramLinked: boolean;
    telegramUsername: string | null;
    telegramChatId: string | null;
    telegramLinkedAt: string | null;
    preferences: {
      enabled: boolean;
      market: boolean;
      security: boolean;
      reports: boolean;
      education: boolean;
    };
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkingData, setLinkingData] = useState<{
    token: string;
    deepLink: string;
    botUsername: string;
    expiresAt: string;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/telegram/link');
      const json = await res.json();
      if (json.success && json.data) {
        setStatus(json.data);
      }
    } catch {
      // silently handle
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleGenerateToken = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/v1/telegram/link', { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        setLinkingData(json.data);
        showToast('Generated 10-minute one-time authentication key.');
      } else {
        throw new Error(json.error?.message || 'Failed to generate token');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating linking key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTogglePref = async (key: string, val: boolean) => {
    if (!status) return;
    try {
      await fetch('/api/v1/telegram/link', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: val }),
      });
      setStatus((prev: any) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key.replace('telegramNotify', '').toLowerCase()]: val,
        },
      }));
      showToast('Notification preferences updated.');
    } catch {
      alert('Failed to update preference.');
    }
  };

  const handleUnlink = async () => {
    if (!confirm('Are you sure you want to unlink your Telegram account? You will no longer receive real-time security alerts on Telegram.')) return;
    try {
      await fetch('/api/v1/telegram/link', { method: 'DELETE' });
      setStatus((prev: any) => ({
        ...prev,
        isTelegramLinked: false,
        telegramUsername: null,
      }));
      setLinkingData(null);
      showToast('Telegram account unlinked.');
    } catch {
      alert('Failed to unlink account.');
    }
  };

  if (isLoading) {
    return <div className="h-48 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />;
  }

  return (
    <GlassPanel variant="prismatic" className="p-6 relative overflow-hidden border-sky-500/30">
      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-4 right-4 z-20 p-2.5 px-3.5 rounded-lg bg-valixen-obsidian-card border border-sky-400 text-xs font-mono text-white flex items-center gap-2 shadow-glow-cyan">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-display font-bold text-white">
                Official Telegram Intelligence Bot
              </h3>
              {status?.isTelegramLinked ? (
                <Badge variant="cyan" dot className="text-[10px] font-mono">
                  LINKED & VERIFIED
                </Badge>
              ) : (
                <Badge variant="default" className="text-[10px] font-mono text-slate-400">
                  NOT CONNECTED
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl font-sans leading-relaxed">
              Receive instant cybersecurity incident notifications, central bank rate alerts, and interact with your personal portfolio directly inside Telegram.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Link
            href="/tma"
            className="font-mono text-xs px-3.5 py-2 rounded-xl bg-valixen-violet/20 hover:bg-valixen-violet/30 border border-valixen-violet/40 text-valixen-ice font-bold flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-valixen-ice" />
            <span>OPEN TMA</span>
          </Link>
          {status?.isTelegramLinked ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUnlink}
              className="font-mono text-xs text-valixen-telemetry-risk hover:bg-red-500/10 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> UNLINK BOT
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateToken}
              disabled={isGenerating}
              className="font-mono text-xs bg-sky-500 hover:bg-sky-400 text-black font-bold flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              {isGenerating ? 'GENERATING KEY...' : 'CONNECT TELEGRAM BOT'}
            </Button>
          )}
        </div>
      </div>

      {/* Linking Token Modal / Banner */}
      {!status?.isTelegramLinked && linkingData && (
        <div className="mt-6 p-5 rounded-xl bg-sky-950/30 border border-sky-500/30 space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs text-sky-300 font-bold flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-sky-400" /> ONE-TIME PASSKEY GENERATED (10 MIN VALIDITY)
            </span>
            <span className="text-[10px] text-slate-400">EXPIRES AT: {new Date(linkingData.expiresAt).toLocaleTimeString()}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 bg-black/40 rounded-lg border border-white/[0.08]">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">One-Time Token</div>
              <div className="text-sm font-bold text-white select-all">{linkingData.token}</div>
            </div>

            <a
              href={linkingData.deepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-black font-bold text-xs hover:bg-sky-400 transition-colors shadow-glow-cyan"
            >
              <Send className="w-3.5 h-3.5" /> OPEN TELEGRAM BOT →
            </a>
          </div>

          <p className="text-[11px] text-slate-400 font-sans">
            Tap the button above to launch <b>@{linkingData.botUsername}</b> with your encrypted passkey. Your identity will be verified automatically with zero passwords required.
          </p>
        </div>
      )}

      {/* Linked State: Preferences Toggles */}
      {status?.isTelegramLinked && (
        <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400">
              CONNECTED HANDLE: <strong className="text-white">@{status.telegramUsername || 'Allocator'}</strong> (Chat ID: {status.telegramChatId || 'Verified'})
            </span>
            <span className="text-slate-500 text-[10px]">
              ENCRYPTED TELEGRAM WEBHOOK SHA-256
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            {[
              { id: 'telegramNotifySecurity', label: 'SOC Security Alerts', active: status.preferences?.security, desc: 'Critical logins & MFA triggers' },
              { id: 'telegramNotifyMarket', label: 'Macro Catalysts', active: status.preferences?.market, desc: 'Central bank rate decisions' },
              { id: 'telegramNotifyReports', label: 'Weekly Wealth Digest', active: status.preferences?.reports, desc: 'Net savings pace & budget cuts' },
              { id: 'telegramNotifyEducation', label: 'Education Challenges', active: status.preferences?.education, desc: 'XP sprints & new badges' },
            ].map((pref) => (
              <div
                key={pref.id}
                onClick={() => handleTogglePref(pref.id, !pref.active)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  pref.active
                    ? 'bg-sky-500/10 border-sky-500/40'
                    : 'bg-white/[0.02] border-white/[0.06] opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={pref.active}
                  readOnly
                  className="mt-0.5 w-3.5 h-3.5 rounded bg-black/40 border-white/20 text-sky-500 pointer-events-none"
                />
                <div>
                  <div className="font-bold text-white text-[11px]">{pref.label}</div>
                  <div className="text-[10px] text-slate-400 font-sans mt-0.5">{pref.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Telegram Mini App Direct Deep-Link Launchers */}
          <div className="p-4 rounded-xl bg-valixen-violet/10 border border-valixen-violet/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div>
              <span className="font-bold text-white block">🚀 Official Telegram Mini App Available</span>
              <span className="text-[10px] text-slate-400">Launch the mobile sovereign terminal directly within Telegram</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://t.me/VeltronOfficialBot?startapp=dashboard"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-valixen-violet hover:bg-valixen-violet/80 text-white font-bold flex items-center gap-1.5 transition-colors shadow-glow-violet"
              >
                <Sparkles className="w-3.5 h-3.5" /> Launch TMA
              </a>
              <a
                href="/tma"
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 hover:text-white transition-colors"
              >
                Web Preview (/tma)
              </a>
            </div>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
