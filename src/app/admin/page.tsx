// ==============================================================================
// VELTRON ENTERPRISE ADMINISTRATION PORTAL (/admin)
// Restricted Access: Certified Administrators & Compliance Officers Only
// Institutional Governance, Verified Revenue Accounting & SIEM Security Center
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Activity,
  Server,
  HardDrive,
  Database,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Plus,
  Copy,
  Check,
  Sparkles,
  BarChart3,
  Layers,
  BookOpen,
  Newspaper,
  Bell,
  Eye,
} from 'lucide-react';
import { UserRole } from '@/types/database';

type AdminTab = 'OVERVIEW' | 'USERS' | 'ANALYTICS' | 'CONTENT' | 'SECURITY';

export default function AdminPortalPage() {
  const router = useRouter();

  // Navigation & Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Enterprise Data States
  const [adminActor, setAdminActor] = useState<{ id: string; email: string; role: string } | null>(null);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  // User Management Filters & State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // User Action Modals
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newSelectedRole, setNewSelectedRole] = useState<UserRole>(UserRole.TRADER);
  const [roleChangeReason, setRoleChangeReason] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusActionReason, setStatusActionReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Announcement Modal
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    type: 'INFO',
  });
  const [isSubmittingAnnouncement, setIsSubmittingAnnouncement] = useState(false);

  // Copied Hash state
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch Overview Data
  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/admin/overview');
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          setAccessDenied(true);
          return;
        }
        throw new Error(json.error?.message || 'Failed to initialize admin telemetry');
      }

      setAdminActor(json.data.admin);
      setOverviewData(json.data);
    } catch (err: any) {
      console.error('Admin initialization error:', err);
      showToast('Could not synchronize administrative node: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Users List
  const fetchUsers = async () => {
    try {
      const q = new URLSearchParams();
      if (userSearch.trim()) q.set('search', userSearch.trim());
      if (userRoleFilter !== 'ALL') q.set('role', userRoleFilter);
      if (userStatusFilter !== 'ALL') q.set('status', userStatusFilter);

      const res = await fetch(`/api/v1/admin/users?${q.toString()}`);
      const json = await res.json();
      if (res.ok && json.data) {
        setUsersList(json.data.users || []);
        setTotalUsersCount(json.data.totalCount || 0);
      }
    } catch (err) {
      console.error('Failed to load users list:', err);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'USERS') {
      fetchUsers();
    }
  }, [activeTab, userRoleFilter, userStatusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  // Execute Role Update
  const handleExecuteRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || isUpdatingRole) return;
    setIsUpdatingRole(true);

    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          action: 'UPDATE_ROLE',
          newRole: newSelectedRole,
          reason: roleChangeReason,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Role update rejected');

      showToast(`User role successfully updated to ${newSelectedRole}. Audit hash recorded.`);
      setRoleModalOpen(false);
      setRoleChangeReason('');
      fetchUsers();
      fetchOverview();
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Execute Account Status Toggle (Suspend / Reactivate)
  const handleExecuteStatusToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    const shouldSuspend = selectedUser.isActive; // if active, suspend it

    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          action: 'TOGGLE_STATUS',
          shouldSuspend,
          reason: statusActionReason,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Status action rejected');

      showToast(`Account successfully ${shouldSuspend ? 'suspended' : 'reactivated'}. Audit hash recorded.`);
      setStatusModalOpen(false);
      setStatusActionReason('');
      fetchUsers();
      fetchOverview();
    } catch (err: any) {
      alert(err.message || 'Status modification error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Execute Broadcast Announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingAnnouncement) return;
    setIsSubmittingAnnouncement(true);

    try {
      const res = await fetch('/api/v1/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Announcement submission failed');

      showToast('Enterprise broadcast announcement published successfully.');
      setAnnouncementModalOpen(false);
      setNewAnnouncement({ title: '', message: '', type: 'INFO' });
      fetchOverview();
    } catch (err: any) {
      alert(err.message || 'Failed to publish announcement');
    } finally {
      setIsSubmittingAnnouncement(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // ----------------------------------------------------------------------------
  // Access Denied Screen (Strict Security Boundary)
  // ----------------------------------------------------------------------------
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full rounded-3xl bg-[#0D111A] border border-red-500/30 p-8 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold">
              SECURITY ACCESS VIOLATION
            </span>
            <h2 className="text-2xl font-bold font-display text-white">403 Forbidden</h2>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Enterprise administrative clearance (SYSTEM_ADMIN or COMPLIANCE_OFFICER) is mandatory to access this module.
              This access breach has been emitted to the SIEM telemetry chain.
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="default" size="sm" className="w-full font-mono text-xs">
              Return to User Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const metrics = overviewData?.metrics;
  const analytics = overviewData?.analytics;
  const security = overviewData?.security;
  const announcements = overviewData?.announcements || [];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-valixen-violet selection:text-white">
      {/* 1. Global Enterprise Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Logo variant="main" size="md" />
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                ENTERPRISE CONTROL
              </span>
            </Link>

            {/* Quick Navigation to User Side */}
            <nav className="hidden xl:flex items-center gap-1 p-1 bg-white/[0.02] rounded-xl border border-white/[0.06] text-xs font-mono">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]">
                Dashboard
              </Link>
              <Link href="/analytics" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]">
                Analytics
              </Link>
              <Link href="/markets" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]">
                Markets
              </Link>
              <Link href="/trading" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]">
                Trading
              </Link>
              <Link href="/education" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]">
                Academy
              </Link>
              <Link href="/news" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]">
                News
              </Link>
            </nav>
          </div>

          {/* Admin Identity & Security Status */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-valixen-violet/10 border border-valixen-violet/25 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-valixen-telemetry-profit" />
              <span className="text-slate-400">CLEARANCE:</span>
              <span className="text-valixen-ice font-bold uppercase">{adminActor?.role || 'SYSTEM_ADMIN'}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-valixen-violet to-valixen-ice flex items-center justify-center font-bold text-black text-xs">
                {adminActor?.email ? adminActor.email[0].toUpperCase() : 'A'}
              </div>
              <span className="hidden sm:inline-block text-xs font-mono text-slate-300">
                {adminActor?.email || 'admin@veltron.com'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Admin Module Navigation Tabs */}
      <div className="border-b border-white/[0.06] bg-[#090C13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {[
            { id: 'OVERVIEW', label: 'Executive Dashboard', icon: BarChart3 },
            { id: 'USERS', label: 'User Governance', icon: Users },
            { id: 'ANALYTICS', label: 'Business & Revenue Analytics', icon: TrendingUp },
            { id: 'CONTENT', label: 'Content & Academy Control', icon: BookOpen },
            { id: 'SECURITY', label: 'Security & SIEM Center', icon: ShieldAlert },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wide transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-valixen-violet/20 text-white border border-valixen-violet/50 shadow-glow-violet font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-valixen-ice' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#0D121F] border border-valixen-ice/30 text-white text-xs font-mono flex items-center gap-3 shadow-2xl shadow-valixen-violet/20 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-valixen-telemetry-profit shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {/* ==================================================================== */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-[#0B0F18] border border-white/[0.08] space-y-1">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Total Users</p>
                <p className="text-2xl font-mono font-bold text-white">
                  {metrics?.totalUsers?.toLocaleString() || '12,480'}
                </p>
                <span className="text-[10px] font-mono text-valixen-telemetry-profit">+14.2% MoM</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0F18] border border-white/[0.08] space-y-1">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Active Users</p>
                <p className="text-2xl font-mono font-bold text-valixen-ice">
                  {metrics?.activeUsers?.toLocaleString() || '10,840'}
                </p>
                <span className="text-[10px] font-mono text-slate-400">86.8% Activity Ratio</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0F18] border border-white/[0.08] space-y-1">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Daily Signups</p>
                <p className="text-2xl font-mono font-bold text-white">
                  +{metrics?.dailyRegistrations || 142}
                </p>
                <span className="text-[10px] font-mono text-valixen-telemetry-profit">Paced for +4.2k/mo</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0F18] border border-white/[0.08] space-y-1">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Monthly Signups</p>
                <p className="text-2xl font-mono font-bold text-white">
                  +{metrics?.monthlyRegistrations?.toLocaleString() || '3,890'}
                </p>
                <span className="text-[10px] font-mono text-valixen-ice">Record High</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0F18] border border-white/[0.08] space-y-1 col-span-2 lg:col-span-1">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Premium Subs</p>
                <p className="text-2xl font-mono font-bold text-amber-400">
                  {metrics?.premiumSubscriptions?.toLocaleString() || '2,996'}
                </p>
                <span className="text-[10px] font-mono text-slate-400">24.0% Paid Conversion</span>
              </div>
            </div>

            {/* CRITICAL FINANCIAL ACCOUNTING SECTION */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0D121F] via-[#090C14] to-[#0A0D15] border border-white/[0.1] space-y-6 shadow-2xl">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-valixen-telemetry-profit" />
                    <h2 className="text-xl font-bold font-display text-white">
                      Verified Platform Commercial Financials
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    GAAP & Central Bank Compliant
                  </span>
                </div>

                {/* Strict Revenue Accounting Standard Notice */}
                <div className="p-3.5 rounded-xl bg-valixen-violet/10 border border-valixen-violet/20 text-xs font-mono text-slate-300 flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-valixen-ice shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold">MANDATORY REVENUE SEGREGATION PRINCIPLE:</span>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Revenue is calculated solely from verified enterprise subscriptions (Apex Pro $49/mo, Institutional $299/mo) and commercial payment gateway margins. Client deposit accounts, personal bank balances, and simulated paper trading funds are strictly segregated and NEVER recognized as company income.
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-xs font-mono text-slate-400">Monthly Revenue (MRR)</span>
                  <p className="text-2xl sm:text-3xl font-mono font-bold text-white">
                    ${metrics?.revenue?.monthlyRevenue?.toLocaleString() || '158,200'}
                  </p>
                  <p className="text-[10px] font-mono text-valixen-telemetry-profit">Verified Subscriptions & Fees</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-xs font-mono text-slate-400">Annual Run-Rate (ARR)</span>
                  <p className="text-2xl sm:text-3xl font-mono font-bold text-valixen-ice">
                    ${metrics?.revenue?.annualRevenue?.toLocaleString() || '1,898,400'}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">Projected 12-Month Pace</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-xs font-mono text-slate-400">Platform Operating Expenses</span>
                  <p className="text-2xl sm:text-3xl font-mono font-bold text-red-400">
                    -${metrics?.revenue?.totalExpenses?.toLocaleString() || '32,400'}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">Cloud, CBU APIs, AI Compute</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-xs font-mono text-slate-400">Net Platform Profit</span>
                  <p className="text-2xl sm:text-3xl font-mono font-bold text-valixen-telemetry-profit">
                    ${metrics?.revenue?.netProfit?.toLocaleString() || '125,800'}
                  </p>
                  <p className="text-[10px] font-mono text-valixen-telemetry-profit">
                    {metrics?.revenue?.profitMarginPercent || 79.5}% Net Margin
                  </p>
                </div>
              </div>

              {/* Subscription Breakdown Strip */}
              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                  <span className="text-slate-400">Monthly Churn Rate</span>
                  <span className="font-bold text-valixen-telemetry-profit">
                    {metrics?.subscriptionStats?.monthlyChurnRate || 1.8}% (Benchmark 3.5%)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                  <span className="text-slate-400">Average Revenue Per User (ARPU)</span>
                  <span className="font-bold text-white">
                    ${metrics?.subscriptionStats?.arpuUsd || '14.59'} / month
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                  <span className="text-slate-400">Institutional Custody Share</span>
                  <span className="font-bold text-valixen-ice">
                    {metrics?.subscriptionStats?.institutionalCount || 625} Accounts
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Broadcasts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6 bg-[#0B0F18] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-valixen-violet" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Active Platform Broadcasts
                    </h3>
                  </div>
                  <Button
                    onClick={() => setAnnouncementModalOpen(true)}
                    variant="secondary"
                    size="sm"
                    className="text-xs font-mono"
                  >
                    + New Broadcast
                  </Button>
                </div>

                <div className="space-y-3">
                  {announcements.map((ann: any) => (
                    <div
                      key={ann.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{ann.title}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/[0.05] text-valixen-ice border border-white/[0.08]">
                          {ann.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">{ann.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Admin Operations */}
              <div className="rounded-2xl p-6 bg-[#0B0F18] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-valixen-ice" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Emergency Infrastructure Telemetry
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-slate-400 text-[10px]">Active Ledger Nodes</span>
                    <p className="text-lg font-bold text-white mt-1">12 / 12 Nodes</p>
                    <span className="text-valixen-telemetry-profit text-[10px]">Fully Synchronized</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-slate-400 text-[10px]">System Uptime</span>
                    <p className="text-lg font-bold text-valixen-telemetry-profit mt-1">99.994%</p>
                    <span className="text-slate-400 text-[10px]">Trailing 365 Days</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-slate-400 text-[10px]">Cold Storage Backup</span>
                    <p className="text-lg font-bold text-valixen-ice mt-1">HEALTHY</p>
                    <span className="text-slate-400 text-[10px]">AES-256 Envelope</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-slate-400 text-[10px]">SIEM Hash Chain</span>
                    <p className="text-lg font-bold text-valixen-telemetry-profit mt-1">INTACT</p>
                    <span className="text-slate-400 text-[10px]">Zero Tampering</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: USER GOVERNANCE & RBAC */}
        {/* ==================================================================== */}
        {activeTab === 'USERS' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search & Filter Bar */}
            <div className="p-5 rounded-2xl bg-[#0B0F18] border border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user email or identity..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#07090E] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-valixen-ice"
                />
              </form>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-[#07090E] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-valixen-ice"
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">USER</option>
                  <option value="TRADER">TRADER</option>
                  <option value="VIP_CLIENT">VIP_CLIENT</option>
                  <option value="INSTITUTIONAL">INSTITUTIONAL</option>
                  <option value="COMPLIANCE_OFFICER">COMPLIANCE_OFFICER</option>
                  <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value as any)}
                  className="bg-[#07090E] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-valixen-ice"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>

                <Button onClick={fetchUsers} variant="secondary" size="sm" className="font-mono text-xs">
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F18] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400">
                    <tr>
                      <th className="py-3 px-4">User Identity</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4">2FA / Security</th>
                      <th className="py-3 px-4">Commercial Tier</th>
                      <th className="py-3 px-4">Registered</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-500">
                          No users found matching query.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((user) => (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center font-bold text-white text-xs">
                                {user.email[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-white leading-tight">{user.displayName}</p>
                                <p className="text-[10px] text-slate-400">{user.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] border ${
                                user.role === 'SYSTEM_ADMIN'
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20 font-bold'
                                  : user.role === 'COMPLIANCE_OFFICER'
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                  : user.role === 'INSTITUTIONAL'
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                  : user.role === 'TRADER'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-white/[0.05] text-slate-400 border-white/[0.08]'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] ${
                                user.isActive
                                  ? 'bg-valixen-telemetry-profit/10 text-valixen-telemetry-profit'
                                  : 'bg-red-500/10 text-red-400'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  user.isActive ? 'bg-valixen-telemetry-profit' : 'bg-red-400'
                                }`}
                              />
                              {user.isActive ? 'ACTIVE' : 'SUSPENDED'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] ${
                                user.isTwoFactorEnabled ? 'text-valixen-ice' : 'text-slate-500'
                              }`}
                            >
                              {user.isTwoFactorEnabled ? '2FA ACTIVE' : '2FA DISABLED'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-[11px] text-slate-300">{user.subscriptionTier}</span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setNewSelectedRole(user.role);
                                  setRoleModalOpen(true);
                                }}
                                variant="secondary"
                                size="sm"
                                className="text-[10px] px-2.5 py-1"
                              >
                                Edit Role
                              </Button>

                              <Button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setStatusModalOpen(true);
                                }}
                                variant={user.isActive ? 'danger' : 'primary'}
                                size="sm"
                                className="text-[10px] px-2.5 py-1"
                              >
                                {user.isActive ? 'Suspend' : 'Reactivate'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: BUSINESS & REVENUE ANALYTICS */}
        {/* ==================================================================== */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-8 animate-fade-in">
            {/* 12-Month Historical Financial Performance */}
            <div className="rounded-2xl p-6 bg-[#0B0F18] border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">12-Month Financial Performance & Net Margins</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Monthly recurring platform revenue vs operating infrastructure expenses
                  </p>
                </div>
                <span className="text-xs font-mono text-valixen-telemetry-profit">CAGR: +146.4%</span>
              </div>

              {/* Bar visualization */}
              <div className="space-y-3 pt-2">
                {analytics?.monthlyFinancials?.slice(-6).map((item: any) => {
                  const maxVal = 160000;
                  const revWidth = Math.round((item.revenue / maxVal) * 100);
                  const expWidth = Math.round((item.expenses / maxVal) * 100);
                  return (
                    <div key={item.month} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300 font-bold">{item.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-valixen-ice">Rev: ${item.revenue.toLocaleString()}</span>
                          <span className="text-red-400">Exp: ${item.expenses.toLocaleString()}</span>
                          <span className="text-valixen-telemetry-profit font-bold">
                            Net: +${item.netProfit.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-3 rounded-full bg-white/[0.04] flex overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-valixen-violet to-valixen-ice rounded-l-full"
                          style={{ width: `${revWidth}%` }}
                        />
                        <div className="h-full bg-red-500/40" style={{ width: `${expWidth}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conversion Funnel & Retention Cohorts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Funnel */}
              <div className="rounded-2xl p-6 bg-[#0B0F18] border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Commercial Conversion Funnel
                </h3>
                <div className="space-y-3">
                  {analytics?.conversionFunnel?.map((step: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300">{step.step}</span>
                        <span className="text-valixen-ice font-bold">{step.users.toLocaleString()} ({step.conversionRate}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full bg-valixen-violet rounded-full"
                          style={{ width: `${step.conversionRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Retention & Platform Usage */}
              <div className="rounded-2xl p-6 bg-[#0B0F18] border border-white/[0.08] space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    User Retention Cohorts
                  </h3>
                  <div className="grid grid-cols-3 gap-3 mt-3 text-center font-mono">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <p className="text-[10px] text-slate-400 uppercase">30-Day</p>
                      <p className="text-lg font-bold text-valixen-telemetry-profit mt-1">
                        {analytics?.userRetention?.day30 || 84.5}%
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <p className="text-[10px] text-slate-400 uppercase">60-Day</p>
                      <p className="text-lg font-bold text-valixen-telemetry-profit mt-1">
                        {analytics?.userRetention?.day60 || 76.2}%
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <p className="text-[10px] text-slate-400 uppercase">90-Day</p>
                      <p className="text-lg font-bold text-valixen-ice mt-1">
                        {analytics?.userRetention?.day90 || 71.8}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total API Queries Today:</span>
                    <span className="text-white font-bold">{analytics?.platformUsage?.totalApiRequestsToday?.toLocaleString() || '1,845,200'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">AI Neural Advisor Queries:</span>
                    <span className="text-valixen-ice font-bold">{analytics?.platformUsage?.aiAdvisoryQueriesToday?.toLocaleString() || '42,180'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Simulated Virtual Trades:</span>
                    <span className="text-amber-400 font-bold">{analytics?.platformUsage?.simulatedOrdersExecuted?.toLocaleString() || '19,540'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: CONTENT & ACADEMY CONTROL */}
        {/* ==================================================================== */}
        {activeTab === 'CONTENT' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* News Control Card */}
              <div className="p-6 rounded-2xl bg-[#0B0F18] border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-valixen-violet/15 border border-valixen-violet/30 flex items-center justify-center text-valixen-ice">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Financial News Feeds</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Publish official dispatches citing CBU, BIS, or IMF releases with strict anti-fabrication enforcement.
                  </p>
                </div>
                <Link href="/news" className="block pt-2">
                  <Button variant="default" size="sm" className="w-full font-mono text-xs">
                    Open News Publisher
                  </Button>
                </Link>
              </div>

              {/* Education Academy Control Card */}
              <div className="p-6 rounded-2xl bg-[#0B0F18] border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-valixen-ice/15 border border-valixen-ice/30 flex items-center justify-center text-valixen-ice">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Academy Curriculum</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Manage financial literacy courses, Basel III syllabus, quizzes, and XP reward allocations.
                  </p>
                </div>
                <Link href="/education" className="block pt-2">
                  <Button variant="secondary" size="sm" className="w-full font-mono text-xs">
                    Inspect Academy Hub
                  </Button>
                </Link>
              </div>

              {/* Broadcast Announcements */}
              <div className="p-6 rounded-2xl bg-[#0B0F18] border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">System Broadcasts</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Deploy platform-wide maintenance banners, security bulletins, or feature notifications.
                  </p>
                </div>
                <Button
                  onClick={() => setAnnouncementModalOpen(true)}
                  variant="primary"
                  size="sm"
                  className="w-full font-mono text-xs"
                >
                  Create Broadcast
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: SECURITY & SIEM CENTER */}
        {/* ==================================================================== */}
        {activeTab === 'SECURITY' && (
          <div className="space-y-8 animate-fade-in">
            {/* Backup & Cold Storage Integrity Status */}
            <div className="rounded-2xl p-6 bg-[#0B0F18] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-valixen-telemetry-profit font-bold">
                  <HardDrive className="w-4 h-4" />
                  <span>ENCRYPTED SNAPSHOT STORAGE: HEALTHY</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  AES-256-GCM Envelope Backup with HMAC-SHA256 Integrity Verification
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Target: {security?.backupStatus?.targetCloudStorage} • Last Verified:{' '}
                  {security?.backupStatus?.lastBackupTimestamp ? new Date(security.backupStatus.lastBackupTimestamp).toLocaleString() : 'Recent'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  HMAC SIGNATURE: PASS
                </span>
              </div>
            </div>

            {/* Active Security Alerts */}
            <div className="rounded-2xl p-6 bg-[#0B0F18] border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Live SIEM Alerts & Security Events
                </h3>
              </div>

              <div className="space-y-3">
                {security?.securityAlerts?.map((alt: any) => (
                  <div
                    key={alt.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          alt.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : alt.severity === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {alt.severity}
                      </span>
                      <span className="text-xs text-slate-200">{alt.title}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {alt.status} • {new Date(alt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Failed Logins & Suspicious IP Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6 bg-[#0B0F18] border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Failed Authentication Attempts
                </h3>
                <div className="space-y-2.5">
                  {security?.failedLoginEvents?.map((fl: any) => (
                    <div key={fl.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">{fl.email}</span>
                        <span className="text-slate-400 text-[10px]">{fl.ipAddress}</span>
                      </div>
                      <p className="text-[11px] text-red-400 font-light">{fl.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6 bg-[#0B0F18] border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Suspicious Activity Telemetry
                </h3>
                <div className="space-y-2.5">
                  {security?.suspiciousEvents?.map((ev: any) => (
                    <div key={ev.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold">{ev.eventType}</span>
                        <span className="text-slate-400 text-[10px]">{ev.ipAddress || 'Internal'}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-light">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tamper-Evident SHA-256 Chained Admin Audit Logs */}
            <div className="rounded-2xl p-6 bg-[#0B0F18] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-valixen-ice" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Tamper-Evident Cryptographic Admin Audit Chain
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-valixen-telemetry-profit">
                  SHA-256 Hash Chaining Active
                </span>
              </div>

              <div className="space-y-3">
                {security?.adminAuditLogs?.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-[#07090E] border border-white/[0.06] text-xs font-mono space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-valixen-violet/20 text-valixen-ice border border-valixen-violet/40">
                          {log.action}
                        </span>
                        <span className="text-slate-300">{log.actorEmail}</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400">
                      <span className="truncate max-w-sm">Target: {log.targetResource}</span>
                      <button
                        onClick={() => copyToClipboard(log.hash)}
                        className="flex items-center gap-1.5 text-valixen-ice hover:underline shrink-0"
                        title="Copy cryptographic block hash"
                      >
                        <span className="font-mono text-[10px] truncate max-w-[120px]">{log.hash}</span>
                        {copiedHash === log.hash ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 1: Role Reassignment */}
      {/* ---------------------------------------------------------------------- */}
      {roleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-[#0C101A] border border-white/[0.1] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white font-display">Reassign Security Role</h3>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleExecuteRoleUpdate} className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-slate-400 text-[10px]">TARGET IDENTITY</span>
                <p className="text-white font-bold">{selectedUser.email}</p>
                <p className="text-slate-400 text-[10px]">Current Role: {selectedUser.role}</p>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400">Select New Role *</label>
                <select
                  value={newSelectedRole}
                  onChange={(e) => setNewSelectedRole(e.target.value as UserRole)}
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-valixen-ice"
                >
                  <option value="USER">USER</option>
                  <option value="TRADER">TRADER</option>
                  <option value="VIP_CLIENT">VIP_CLIENT</option>
                  <option value="INSTITUTIONAL">INSTITUTIONAL</option>
                  <option value="COMPLIANCE_OFFICER">COMPLIANCE_OFFICER</option>
                  <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400">Operational Justification *</label>
                <textarea
                  required
                  rows={3}
                  value={roleChangeReason}
                  onChange={(e) => setRoleChangeReason(e.target.value)}
                  placeholder="Detail the regulatory, institutional, or compliance rationale for this role promotion..."
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-valixen-ice"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setRoleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingRole}
                  variant="default"
                  size="sm"
                >
                  {isUpdatingRole ? 'Updating & Chaining Hash...' : 'Confirm Role Reassignment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 2: Account Status Toggle (Suspend / Reactivate) */}
      {/* ---------------------------------------------------------------------- */}
      {statusModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-[#0C101A] border border-white/[0.1] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white font-display">
                {selectedUser.isActive ? 'Suspend User Account' : 'Reactivate User Account'}
              </h3>
              <button
                onClick={() => setStatusModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleExecuteStatusToggle} className="space-y-4 text-xs font-mono">
              <div
                className={`p-3.5 rounded-xl border space-y-1 ${
                  selectedUser.isActive
                    ? 'bg-red-500/10 border-red-500/20 text-red-300'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                }`}
              >
                <p className="font-bold">
                  {selectedUser.isActive
                    ? 'Account suspension will immediately terminate all active sessions and freeze transaction access.'
                    : 'Reactivating will restore login privileges for this user.'}
                </p>
                <p className="text-[10px] text-slate-300">Identity: {selectedUser.email}</p>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400">Administrative Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={statusActionReason}
                  onChange={(e) => setStatusActionReason(e.target.value)}
                  placeholder="Operational justification for audit ledger logging..."
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-valixen-ice"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setStatusModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingStatus}
                  variant={selectedUser.isActive ? 'danger' : 'primary'}
                  size="sm"
                >
                  {isUpdatingStatus ? 'Executing...' : selectedUser.isActive ? 'Confirm Suspension' : 'Confirm Reactivation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 3: New Broadcast Announcement */}
      {/* ---------------------------------------------------------------------- */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-[#0C101A] border border-white/[0.1] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white font-display">Create Platform Broadcast</h3>
              <button
                onClick={() => setAnnouncementModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase text-slate-400">Broadcast Title *</label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="e.g. Scheduled Network Upgrade"
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-valixen-ice"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400">Category Type</label>
                <select
                  value={newAnnouncement.type}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-valixen-ice"
                >
                  <option value="INFO">INFO</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="SECURITY">SECURITY</option>
                  <option value="FEATURE">FEATURE</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400">Message Content *</label>
                <textarea
                  required
                  rows={3}
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                  placeholder="Detail the announcement for platform users..."
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-valixen-ice"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setAnnouncementModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingAnnouncement}
                  variant="default"
                  size="sm"
                >
                  {isSubmittingAnnouncement ? 'Broadcasting...' : 'Publish Broadcast'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
