// ==============================================================================
// VALIXEN SMART SAVINGS GOALS (/goals)
// High-Yield Automated Wealth Targets, Dynamic Velocity & Milestones
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { SavingsGoalDTO } from '@/server/services/goals.service';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import {
  Target,
  Plus,
  Coins,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Zap,
  Lock,
} from 'lucide-react';

export default function SmartSavingsGoalsPage() {
  const [goals, setGoals] = useState<SavingsGoalDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoalDTO | null>(null);
  const [contributionAmount, setContributionAmount] = useState('250');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Goal Form State
  const [newTitle, setNewTitle] = useState('Emergency Citadel Reserve');
  const [newTarget, setNewTarget] = useState('12000');
  const [newInitial, setNewInitial] = useState('1500');
  const [newCategory, setNewCategory] = useState('EMERGENCY_FUND');
  const [newTargetDate, setNewTargetDate] = useState('2027-06-30');
  const [newAutoFreq, setNewAutoFreq] = useState('MONTHLY');
  const [newAutoAmount, setNewAutoAmount] = useState('500');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchGoals = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/v1/goals');
      if (!res.ok) throw new Error('Failed to load smart savings goals.');
      const json = await res.json();
      if (json.success && json.data?.goals) {
        setGoals(json.data.goals);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to savings ledger.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Handle Create Goal
  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          title: newTitle,
          targetAmount: parseFloat(newTarget),
          initialDeposit: parseFloat(newInitial) || 0,
          category: newCategory,
          targetDate: newTargetDate,
          autoSaveFrequency: newAutoFreq,
          autoSaveAmount: parseFloat(newAutoAmount) || 0,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to create goal');

      setIsCreateModalOpen(false);
      showToast(`Savings target '${newTitle}' established successfully.`);
      fetchGoals();
    } catch (err: any) {
      alert(err.message || 'Goal creation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Contribute
  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CONTRIBUTE',
          goalId: selectedGoal.id,
          amount: parseFloat(contributionAmount),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Contribution failed');

      setIsContributeModalOpen(false);
      showToast(`Contributed $${parseFloat(contributionAmount).toLocaleString()} to '${selectedGoal.title}'.`);
      fetchGoals();
    } catch (err: any) {
      alert(err.message || 'Contribution failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (goalId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete goal '${title}'?`)) return;
    try {
      await fetch('/api/v1/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', goalId }),
      });
      showToast(`Goal '${title}' removed.`);
      fetchGoals();
    } catch {
      alert('Failed to delete goal.');
    }
  };

  // Aggregate Stats
  const totalSaved = useMemo(() => goals.reduce((acc, g) => acc + g.currentAmount, 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((acc, g) => acc + g.targetAmount, 0), [goals]);
  const overallPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

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
              <Badge variant="cyan" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                AUTONOMOUS VAULT ACCELERATOR
              </Badge>
              <span className="text-xs font-mono text-slate-400">COMPOUNDING WEALTH MILESTONES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              SMART SAVINGS GOALS
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Algorithmic target milestones with real-time velocity projections, automated cashflow allocation, and emergency reserve shielding.
            </p>
          </div>

          <Button variant="glass" size="sm" onClick={fetchGoals} disabled={isLoading} className="text-xs font-mono self-start md:self-auto">
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>

        {/* Telemetry Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="TOTAL CAPITAL RESERVED"
            value={`$${totalSaved.toLocaleString()}`}
            change={{ value: `${overallPercent}% of total target`, isPositive: true }}
            icon={<Target className="w-4 h-4 text-valixen-ice" />}
          />
          <StatCard
            title="AGGREGATE TARGET HORIZON"
            value={`$${totalTarget.toLocaleString()}`}
            change={{ value: `${goals.length} active goals`, isPositive: true }}
            icon={<Coins className="w-4 h-4 text-valixen-violet" />}
          />
          <StatCard
            title="AUTOMATED SAVINGS RATE"
            value="$1,250 / mo"
            change={{ value: 'Continuous Vault Feed', isPositive: true }}
            icon={<Zap className="w-4 h-4 text-valixen-telemetry-profit" />}
          />
          <StatCard
            title="SHIELDED RUNWAY"
            value="6.2 Months"
            change={{ value: 'Zero Volatility Risk', isPositive: true }}
            icon={<ShieldCheck className="w-4 h-4 text-valixen-ice" />}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && goals.length === 0 && (
          <div className="text-center py-20 space-y-4 glass-panel p-8 max-w-lg mx-auto">
            <Target className="w-12 h-12 text-valixen-ice mx-auto opacity-70" />
            <h3 className="font-display font-bold text-white text-lg">No Active Savings Goals</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Initialize your first autonomous wealth target to begin automated cashflow allocation toward emergency reserves or capital goals.
            </p>
            <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)} className="font-mono text-xs">
              <Plus className="w-4 h-4 mr-2" /> CREATE FIRST GOAL
            </Button>
          </div>
        )}

        {/* Goals Grid */}
        {!isLoading && goals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const isAchieved = goal.isReached;

              return (
                <GlassPanel
                  key={goal.id}
                  variant="prismatic"
                  className="p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-valixen-ice/40 transition-all"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <Badge
                        variant={isAchieved ? 'default' : goal.velocityStatus === 'AHEAD_OF_SCHEDULE' ? 'cyan' : 'ice'}
                        dot
                        className="text-[10px] px-2 py-0.5"
                      >
                        {goal.velocityStatus.replace(/_/g, ' ')}
                      </Badge>

                      <button
                        onClick={() => handleDelete(goal.id, goal.title)}
                        className="text-slate-500 hover:text-valixen-telemetry-risk transition-colors p-1"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-display font-bold text-white group-hover:text-valixen-ice transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">CATEGORY: {goal.category.replace(/_/g, ' ')}</p>
                  </div>

                  {/* Financial Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between font-mono">
                      <span className="text-2xl font-extrabold text-white">
                        ${goal.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400">
                        of ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/[0.08] rounded-full h-2.5 overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isAchieved
                            ? 'bg-valixen-telemetry-profit'
                            : 'bg-gradient-to-r from-valixen-violet to-valixen-ice'
                        }`}
                        style={{ width: `${goal.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>{goal.progressPercent}% FUNDED</span>
                      <span>{goal.daysRemaining} DAYS REMAINING</span>
                    </div>
                  </div>

                  {/* Velocity Insight */}
                  <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06] text-xs font-mono text-slate-300 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3 text-valixen-ice" /> SUGGESTED SAVINGS PACE
                    </div>
                    <div className="text-sm font-bold text-valixen-ice">
                      ${goal.suggestedMonthlyPace.toLocaleString()} / month
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button
                      variant={isAchieved ? 'glass' : 'primary'}
                      size="sm"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setIsContributeModalOpen(true);
                      }}
                      className="w-full font-mono text-xs"
                    >
                      {isAchieved ? 'ADD TO OVERFLOW →' : 'CONTRIBUTE CAPITAL →'}
                    </Button>
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        )}
      </main>

      {/* 3. Create Goal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size="md"
        title={
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-valixen-ice" />
            <span className="font-display font-bold text-white">NEW SMART SAVINGS GOAL</span>
          </div>
        }
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Goal Title</label>
            <Input
              type="text"
              required
              value={newTitle}
              onChange={(e: any) => setNewTitle(e.target.value)}
              placeholder="e.g. Sovereign Vault Cushion"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Target Amount ($)</label>
              <Input
                type="number"
                required
                min="10"
                value={newTarget}
                onChange={(e: any) => setNewTarget(e.target.value)}
                placeholder="10000"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Initial Deposit ($)</label>
              <Input
                type="number"
                min="0"
                value={newInitial}
                onChange={(e: any) => setNewInitial(e.target.value)}
                placeholder="1000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[#0E121B] border border-white/10 rounded-xl text-xs font-mono text-white px-3 py-2.5 outline-none focus:border-valixen-ice"
              >
                <option value="EMERGENCY_FUND">EMERGENCY BUFFER</option>
                <option value="REAL_ESTATE">REAL ESTATE ACQUISITION</option>
                <option value="CRYPTO_RESERVE">CRYPTO SPOT HEDGE</option>
                <option value="RETIREMENT">HIGH-YIELD VAULT</option>
                <option value="TRAVEL">GLOBAL EXPEDITION</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Target Date</label>
              <Input
                type="date"
                required
                value={newTargetDate}
                onChange={(e: any) => setNewTargetDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Auto-Save Schedule</label>
              <select
                value={newAutoFreq}
                onChange={(e) => setNewAutoFreq(e.target.value)}
                className="w-full bg-[#0E121B] border border-white/10 rounded-xl text-xs font-mono text-white px-3 py-2.5 outline-none focus:border-valixen-ice"
              >
                <option value="MONTHLY">MONTHLY</option>
                <option value="WEEKLY">WEEKLY</option>
                <option value="DAILY">DAILY</option>
                <option value="OFF">MANUAL ONLY</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Auto-Save Amount ($)</label>
              <Input
                type="number"
                min="0"
                value={newAutoAmount}
                onChange={(e: any) => setNewAutoAmount(e.target.value)}
                placeholder="250"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} isLoading={isSubmitting}>
              INITIALIZE GOAL →
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. Contribute Modal */}
      <Modal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        size="sm"
        title={
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-valixen-ice" />
            <span className="font-display font-bold text-white">CONTRIBUTE TO GOAL</span>
          </div>
        }
      >
        <form onSubmit={handleContribute} className="space-y-4">
          <p className="text-xs text-slate-400 font-sans">
            Transfer capital toward <strong className="text-white">{selectedGoal?.title}</strong>.
          </p>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Contribution Amount ($)</label>
            <Input
              type="number"
              required
              min="1"
              value={contributionAmount}
              onChange={(e: any) => setContributionAmount(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {[100, 250, 500, 1000].map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => setContributionAmount(amt.toString())}
                className="flex-1 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 border border-white/10"
              >
                +${amt}
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsContributeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} isLoading={isSubmitting}>
              CONFIRM DEPOSIT →
            </Button>
          </div>
        </form>
      </Modal>

      {/* Luxury Footer */}
      <LuxuryFooter />
    </div>
  );
}
