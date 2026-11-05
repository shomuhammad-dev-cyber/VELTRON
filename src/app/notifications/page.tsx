// ==============================================================================
// VALIXEN PERSONALIZED NOTIFICATION CENTER (/notifications)
// High-Priority Telemetry, Market Catalyst Alerts & Security Incident Notifications
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NotificationDTO } from '@/server/services/notifications.service';
import { TelegramConnectCard } from '@/components/telegram/TelegramConnectCard';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import {
  Bell,
  Check,
  Trash2,
  ShieldAlert,
  TrendingUp,
  Target,
  Sparkles,
  Info,
  RefreshCw,
  ArrowRight,
  Filter,
  Send,
} from 'lucide-react';

export default function NotificationsCenterPage() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/notifications');
      const json = await res.json();
      if (json.success && json.data) {
        setNotifications(json.data.notifications || []);
        setUnreadCount(json.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch('/api/v1/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MARK_READ', notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      alert('Failed to mark notification as read.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/v1/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MARK_ALL_READ' }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      alert('Failed to mark all as read.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/v1/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', notificationId: id }),
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      alert('Failed to remove notification.');
    }
  };

  const filtered = notifications.filter((n) => {
    if (selectedCategory !== 'ALL' && n.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090706] text-[#FAF7F1] flex flex-col font-sans selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <LuxuryNavbar />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                TELEMETRY DISPATCHES
              </Badge>
              {unreadCount > 0 && (
                <span className="text-xs font-mono text-valixen-ice font-bold">
                  {unreadCount} UNREAD DISPATCHES
                </span>
              )}
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
              PERSONALIZED NOTIFICATIONS
            </h1>
          </div>

          <Button variant="glass" size="sm" onClick={fetchNotifications} disabled={isLoading} className="text-xs font-mono self-start sm:self-auto">
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>

        {/* Telegram Bot Integration Card */}
        <TelegramConnectCard />

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-4">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> CATEGORY:
          </span>
          {['ALL', 'SECURITY', 'MARKET', 'SAVINGS_GOAL', 'CHALLENGE', 'SYSTEM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-valixen-violet text-white font-bold shadow-glow-violet'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 space-y-3 glass-panel p-8">
            <Bell className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-display font-bold text-white text-base">All Dispatches Clear</h3>
            <p className="text-xs text-slate-400 font-sans">You have zero pending notifications in this category.</p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((item) => {
              const isCrit = item.priority === 'CRITICAL';
              const isHigh = item.priority === 'HIGH';

              return (
                <GlassPanel
                  key={item.id}
                  variant="prismatic"
                  className={`p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    !item.isRead ? 'border-valixen-ice/40 bg-white/[0.02]' : 'opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        !item.isRead
                          ? isCrit
                            ? 'bg-valixen-telemetry-risk animate-ping'
                            : 'bg-valixen-ice'
                          : 'bg-transparent border border-slate-600'
                      }`}
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={isCrit ? 'risk' : isHigh ? 'default' : 'cyan'}
                          className="text-[9px] px-1.5 py-0.2"
                        >
                          {item.priority}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-500">{item.createdAt}</span>
                      </div>

                      <h3 className="text-sm font-display font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">{item.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.06] w-full sm:w-auto justify-end">
                    {item.actionUrl && (
                      <Link href={item.actionUrl}>
                        <Button variant="glass" size="sm" className="font-mono text-xs">
                          VIEW EVENT →
                        </Button>
                      </Link>
                    )}

                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-valixen-ice"
                        title="Mark as Read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-500 hover:text-valixen-telemetry-risk"
                      title="Dismiss"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        )}
      </main>

      {/* Luxury Footer */}
      <LuxuryFooter />
    </div>
  );
}
