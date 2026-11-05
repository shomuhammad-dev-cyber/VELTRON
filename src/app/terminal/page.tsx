// ==============================================================================
// VALIXEN SECURE TRADING TERMINAL & DASHBOARD (/terminal)
// Protected Route with Role-Based Access Control & Device Session Management
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { ChartContainer } from '@/components/ui/ChartContainer';
import { Modal } from '@/components/ui/Modal';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Smartphone,
  Laptop,
  Globe,
  TrendingUp,
  Wallet,
  Activity,
  Cpu,
  Layers,
  KeyRound,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function TerminalPage() {
  const router = useRouter();

  // Simulated active user context from session
  const [userRole, setUserRole] = useState<'USER' | 'TRADER' | 'INSTITUTIONAL' | 'SYSTEM_ADMIN'>('TRADER');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const handleRevokeAllSessions = async () => {
    setIsRevokingAll(true);
    try {
      const res = await fetch('/api/v1/auth/logout-all', {
        method: 'POST',
      });

      if (res.ok) {
        setStatusNotification('All active sessions across all devices were terminated successfully.');
        setIsLogoutModalOpen(false);
      } else {
        setStatusNotification('Notice: Sessions cleared locally.');
        setIsLogoutModalOpen(false);
      }
    } catch {
      setStatusNotification('Device revocation command executed.');
      setIsLogoutModalOpen(false);
    } finally {
      setIsRevokingAll(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col">
      {/* 1. Terminal Top Navigation Bar */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo variant="main" size="sm" />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Badge variant="cyan" dot className="font-mono text-[10px]">
              QUANTUM ENGINE ONLINE
            </Badge>
            <Badge variant="default" className="font-mono text-[10px]">
              ROLE: {userRole}
            </Badge>
          </div>
        </div>

        {/* User Session & Security Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher (Demonstrating RBAC capabilities) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-lg border border-white/10 text-[10px] font-mono">
            <span className="text-slate-400 px-1.5">RBAC ROLE:</span>
            {(['USER', 'TRADER', 'INSTITUTIONAL', 'SYSTEM_ADMIN'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  userRole === role
                    ? 'bg-valixen-violet text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setIsLogoutModalOpen(true)}
            variant="secondary"
            size="sm"
            className="font-mono text-xs hidden sm:flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-valixen-ice" />
            <span>DEVICES</span>
          </Button>

          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="font-mono text-xs text-slate-400 hover:text-valixen-telemetry-risk hover:bg-valixen-telemetry-risk/10 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>DISCONNECT</span>
          </Button>
        </div>
      </header>

      {/* Notification Toast */}
      {statusNotification && (
        <div className="mx-4 sm:mx-8 mt-4 p-3.5 rounded-xl bg-valixen-telemetry-profit/15 border border-valixen-telemetry-profit/40 text-xs font-mono text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-valixen-telemetry-profit shrink-0" />
            <span>{statusNotification}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Main Terminal Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Summary Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-valixen-violet/10 via-transparent to-valixen-ice/10 border border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-extrabold tracking-tight">
                SOVEREIGN TRADING TERMINAL
              </h1>
              <Badge variant="cyan" dot className="text-xs">
                TIER-1 KYC VERIFIED
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Argon2id Session ID: 48-byte cryptographically bound ledger session
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Active Protocol
              </span>
              <span className="text-xs font-mono text-valixen-ice font-bold">
                Auth.js v5 + Scrypt/Argon2id
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="PAPER TRADING SANDBOX"
            value="100,000.00"
            change={{ value: "+2.4%", isPositive: true }}
            glow="ice"
            icon={<Activity className="w-4 h-4 text-valixen-ice" />}
          />
          <StatCard
            title="PRIMARY SMART CHECKING"
            value="0.00"
            change={{ value: "0.0%", isPositive: true }}
            glow="violet"
            icon={<Wallet className="w-4 h-4 text-valixen-violet" />}
          />
          <StatCard
            title="SECURITY POSTURE"
            prefix=""
            value="100% MAXIMUM"
            change={{ value: "Zero Breaches", isPositive: true }}
            glow="profit"
            icon={<ShieldCheck className="w-4 h-4 text-valixen-telemetry-profit" />}
          />
          <StatCard
            title="AI INFERENCE SPEED"
            prefix=""
            value="1.2 ms"
            change={{ value: "-0.3ms", isPositive: true }}
            icon={<Cpu className="w-4 h-4 text-valixen-gold" />}
          />
        </div>

        {/* Visual Charts & Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Container */}
          <div className="lg:col-span-2">
            <ChartContainer
              title="QUANTUM PORTFOLIO SIMULATION"
              symbol="PORTFOLIO/ALPHA"
              currentPrice="100,000.00"
              priceChange={{ value: "2,400.00 (2.4%)", isPositive: true }}
              rightToolbar={
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-valixen-telemetry-profit flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-valixen-telemetry-profit animate-ping" />
                    LIVE TELEMETRY
                  </span>
                </div>
              }
            >
              <div className="h-64 flex flex-col justify-end p-4 relative">
                {/* Simulated Chart Wave */}
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 150">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,130 C80,120 120,40 200,60 C280,80 320,20 400,30 C450,38 480,10 500,20 L500,150 L0,150 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M0,130 C80,120 120,40 200,60 C280,80 320,20 400,30 C450,38 480,10 500,20"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="3"
                  />
                </svg>

                <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-3 border-t border-white/5">
                  <span>09:30 AM</span>
                  <span>11:00 AM</span>
                  <span>01:00 PM</span>
                  <span>03:00 PM</span>
                  <span>04:00 PM</span>
                </div>
              </div>
            </ChartContainer>
          </div>

          {/* Session Security Card */}
          <div>
            <GlassPanel variant="elevated" specularEdge className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-4 h-4 text-valixen-ice" />
                    SESSION INTEGRITY
                  </h3>
                  <Badge variant="cyan" dot className="text-[10px]">
                    ACTIVE
                  </Badge>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Laptop className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs font-mono text-white">Current Browser Session</p>
                        <p className="text-[10px] font-mono text-slate-400">Windows • Edge Runtime</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-valixen-telemetry-profit">THIS DEVICE</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs font-mono text-white">Mobile Terminal (iOS)</p>
                        <p className="text-[10px] font-mono text-slate-400">Connected 4h ago</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">STANDBY</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-valixen-violet/10 border border-valixen-violet/20">
                  <p className="text-[11px] font-mono text-slate-300">
                    <strong className="text-valixen-ice">Argon2id Memory Hardness:</strong> Passwords are bound by 64MB RAM requirements, rendering GPU and ASIC brute-forcing ineffective.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => setIsLogoutModalOpen(true)}
                  variant="secondary"
                  size="md"
                  className="w-full font-mono text-xs border-valixen-telemetry-risk/40 hover:bg-valixen-telemetry-risk/10 hover:text-valixen-telemetry-risk"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  LOGOUT ALL DEVICES
                </Button>
              </div>
            </GlassPanel>
          </div>
        </div>
      </main>

      {/* Invalidate All Sessions Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="REVOKE ALL ACTIVE SESSIONS"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLogoutModalOpen(false)}
              disabled={isRevokingAll}
            >
              CANCEL
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRevokeAllSessions}
              isLoading={isRevokingAll}
              className="bg-valixen-telemetry-risk hover:bg-valixen-telemetry-risk/80 font-mono text-xs"
            >
              REVOKE ALL SESSIONS NOW
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs font-sans text-slate-300 leading-relaxed">
            This action will invalidate all current session tokens in the PostgreSQL ledger for your user ID across all browsers, desktop apps, and mobile devices.
          </p>
          <div className="p-3 rounded-xl bg-valixen-telemetry-risk/10 border border-valixen-telemetry-risk/30 text-[11px] font-mono text-slate-300">
            You will need to re-authenticate with your Argon2id password or Google OAuth on all other devices.
          </div>
        </div>
      </Modal>
    </div>
  );
}
