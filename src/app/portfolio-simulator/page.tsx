// ==============================================================================
// VALIXEN PORTFOLIO SIMULATOR & BACKTESTING ENGINE (/portfolio-simulator)
// Macro Allocation Models, Crisis Stress-Testing & Convexity Simulation
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { PortfolioStrategyModel, PRESET_STRATEGIES } from '@/server/services/portfolio-simulator.service';
import {
  PieChart,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ArrowRight,
  Info,
  Zap,
} from 'lucide-react';

export default function PortfolioSimulatorPage() {
  const [strategies, setStrategies] = useState<PortfolioStrategyModel[]>(PRESET_STRATEGIES);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('all-weather');
  const [startingCapital, setStartingCapital] = useState<number>(100000);
  const [customWeights, setCustomWeights] = useState<Record<string, number>>({
    SPY: 35,
    QQQ: 20,
    TLT: 20,
    GLD: 15,
    BTC: 10,
  });
  const [customResult, setCustomResult] = useState<any>(null);
  const [isSimulatingCustom, setIsSimulatingCustom] = useState(false);

  const activeStrategy = strategies.find((s) => s.id === selectedStrategyId) || strategies[0];

  const handleRunCustomSimulation = async () => {
    setIsSimulatingCustom(true);
    try {
      const res = await fetch('/api/v1/portfolio-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights: customWeights, startingCapital }),
      });
      const json = await res.json();
      if (json.success && json.data?.simulation) {
        setCustomResult(json.data.simulation);
      }
    } catch (err) {
      console.error('Custom simulation error:', err);
    } finally {
      setIsSimulatingCustom(false);
    }
  };

  useEffect(() => {
    handleRunCustomSimulation();
  }, [customWeights, startingCapital]);

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans selection:bg-valixen-violet selection:text-white">
      {/* 1. Navigation Header */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="main" size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">/</span>
            <span className="text-valixen-ice font-bold">PORTFOLIO SIMULATOR</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/trading">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-slate-300">
              Paper Trading
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="glass" size="sm" className="font-mono text-xs">
              Live Analytics →
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
                MACRO CONVEXITY ENGINE
              </Badge>
              <span className="text-xs font-mono text-slate-400">HISTORICAL CRISIS BACKTESTING</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              PORTFOLIO SIMULATOR
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Test institutional asset allocations against historical economic crises. Model Sharpe ratios, max drawdowns, and multi-decade wealth trajectory curves.
            </p>
          </div>

          {/* Strategy Preset Switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-white/[0.03] p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
            {strategies.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStrategyId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedStrategyId === s.id
                    ? 'bg-valixen-violet text-white font-bold shadow-glow-violet'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Strategy Header Card */}
        <GlassPanel variant="prismatic" className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="cyan" className="text-[10px] font-mono font-bold">
                  {activeStrategy.targetRisk} ALLOCATION
                </Badge>
                <span className="text-xs font-mono text-slate-400">BENCHMARK MODEL</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-white">{activeStrategy.name}</h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl leading-relaxed">
                {activeStrategy.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-right self-start lg:self-auto font-mono">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Historical CAGR</div>
                <div className="text-xl font-bold text-valixen-telemetry-profit">+{activeStrategy.historicalCagr}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Sharpe Ratio</div>
                <div className="text-xl font-bold text-valixen-ice">{activeStrategy.sharpeRatio}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Max Drawdown</div>
                <div className="text-xl font-bold text-valixen-telemetry-risk">{activeStrategy.maxHistoricalDrawdown}%</div>
              </div>
            </div>
          </div>

          {/* Allocation Weights Bar */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-mono text-slate-400 uppercase">Asset Allocation Breakdown:</div>
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-white/[0.05] p-0.5">
              {activeStrategy.weights.map((w, idx) => (
                <div
                  key={idx}
                  style={{ width: `${w.weightPercent}%`, backgroundColor: w.color }}
                  title={`${w.asset} (${w.weightPercent}%)`}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all"
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-mono pt-1">
              {activeStrategy.weights.map((w, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.color }} />
                  <span className="text-white font-bold">{w.symbol}</span>
                  <span className="text-slate-400">{w.weightPercent}% ({w.asset})</span>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* Crisis Stress-Testing Matrix */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-valixen-telemetry-risk" />
            <h3 className="font-display font-bold text-white text-lg">HISTORICAL CRISIS STRESS TESTS</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 2008 GFC */}
            <GlassPanel variant="prismatic" className="p-6 space-y-4 border-valixen-telemetry-risk/20">
              <div className="flex justify-between items-baseline">
                <h4 className="font-display font-bold text-white text-base">2008 Global Credit Crash</h4>
                <Badge variant="risk" className="text-[9px]">SYSTEMIC SHOCK</Badge>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Equity Benchmark (SPY):</span>
                  <span className="text-valixen-telemetry-risk font-bold">{activeStrategy.crisisStressTests.gfc2008.benchmarkDrop}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Strategy Defense:</span>
                  <span className="text-valixen-ice font-bold">{activeStrategy.crisisStressTests.gfc2008.strategyDrop}%</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/[0.06]">
                  <span className="text-slate-400">Recovery Duration:</span>
                  <span className="text-white font-bold">{activeStrategy.crisisStressTests.gfc2008.recoveryMonths} Months</span>
                </div>
              </div>
            </GlassPanel>

            {/* 2020 COVID */}
            <GlassPanel variant="prismatic" className="p-6 space-y-4 border-amber-500/20">
              <div className="flex justify-between items-baseline">
                <h4 className="font-display font-bold text-white text-base">2020 COVID-19 Flash Crash</h4>
                <Badge variant="default" className="text-[9px]">LIQUIDITY FREEZE</Badge>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Equity Benchmark (SPY):</span>
                  <span className="text-valixen-telemetry-risk font-bold">{activeStrategy.crisisStressTests.covid2020.benchmarkDrop}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Strategy Defense:</span>
                  <span className="text-valixen-ice font-bold">{activeStrategy.crisisStressTests.covid2020.strategyDrop}%</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/[0.06]">
                  <span className="text-slate-400">Recovery Duration:</span>
                  <span className="text-white font-bold">{activeStrategy.crisisStressTests.covid2020.recoveryMonths} Months</span>
                </div>
              </div>
            </GlassPanel>

            {/* 2022 Inflation */}
            <GlassPanel variant="prismatic" className="p-6 space-y-4 border-cyan-500/20">
              <div className="flex justify-between items-baseline">
                <h4 className="font-display font-bold text-white text-base">2022 Global Rate Shock</h4>
                <Badge variant="cyan" className="text-[9px]">INFLATION SPIKE</Badge>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Equity Benchmark (SPY):</span>
                  <span className="text-valixen-telemetry-risk font-bold">{activeStrategy.crisisStressTests.inflation2022.benchmarkDrop}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Strategy Defense:</span>
                  <span className="text-valixen-ice font-bold">{activeStrategy.crisisStressTests.inflation2022.strategyDrop}%</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/[0.06]">
                  <span className="text-slate-400">Recovery Duration:</span>
                  <span className="text-white font-bold">{activeStrategy.crisisStressTests.inflation2022.recoveryMonths} Months</span>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Forward Wealth Trajectory Curve */}
        <GlassPanel variant="prismatic" className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-white text-lg">COMPOUNDING WEALTH HORIZON ($100,000 BASELINE)</h3>
              <p className="text-xs text-slate-400 font-sans">Simulated growth assuming constant asset-class risk premiums and annual rebalancing.</p>
            </div>
            <span className="text-xs font-mono text-valixen-ice font-bold">10-YEAR HORIZON</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-center">
            {activeStrategy.trajectoryPoints.map((pt, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06]">
                <div className="text-[10px] text-slate-500 uppercase">{pt.year}</div>
                <div className="text-sm sm:text-base font-bold text-white mt-1">${pt.balance.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Custom Allocation Sliders Engine */}
        <GlassPanel variant="elevated" className="p-6 sm:p-8 space-y-6 border-valixen-ice/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-valixen-ice" />
                <h3 className="font-display font-bold text-white text-lg">CUSTOM CONVEXITY ALLOCATOR</h3>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Adjust weighting percentages to recalculate blended expected return and Sharpe ratio dynamically.
              </p>
            </div>

            {customResult && (
              <div className="flex items-center gap-4 font-mono text-right">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Blended Return</div>
                  <div className="text-base sm:text-lg font-bold text-valixen-telemetry-profit">+{customResult.blendedReturn}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Sharpe Ratio</div>
                  <div className="text-base sm:text-lg font-bold text-valixen-ice">{customResult.sharpeRatio}</div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[
              { sym: 'SPY', label: 'US Equities (S&P 500)' },
              { sym: 'QQQ', label: 'Tech & Semiconductors' },
              { sym: 'TLT', label: 'Long-Term Sovereign Bonds' },
              { sym: 'GLD', label: 'Gold Bullion Reserves' },
              { sym: 'BTC', label: 'Bitcoin Spot Asset' },
            ].map((item) => (
              <div key={item.sym} className="space-y-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white font-bold">{item.sym}</span>
                  <span className="text-valixen-ice font-bold">{customWeights[item.sym] || 0}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={customWeights[item.sym] || 0}
                  onChange={(e) =>
                    setCustomWeights({ ...customWeights, [item.sym]: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-valixen-ice cursor-pointer"
                />
                <div className="text-[10px] text-slate-400 font-sans">{item.label}</div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </main>
    </div>
  );
}
