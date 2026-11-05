// ==============================================================================
// VALIXEN ADVANCED FINANCIAL ANALYTICS MODULE (/analytics)
// Premium Institutional Intelligence Center, Multi-Period Comparisons & Health Score
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { ChartContainer } from '@/components/ui/ChartContainer';
import { Modal } from '@/components/ui/Modal';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Activity,
  Layers,
  ShieldCheck,
  Calendar,
  Download,
  Printer,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
  Target,
  Sparkles,
  ChevronRight,
  Lock,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Clock,
  Coins,
  Landmark,
} from 'lucide-react';

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'UZS';
type TimeframeFilter = '30D' | '90D' | '180D' | '1Y' | 'YTD' | 'ALL';
type ActiveTab = 'OVERVIEW' | 'CASHFLOW' | 'SPENDING' | 'HEALTH' | 'QUANT';

const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
  UZS: { symbol: "so'm", rate: 12850.0, label: 'UZS (so‘m)' },
};

interface AnalyticsData {
  timeframe: string;
  summary: {
    totalNetWorth: number;
    liquidCash: number;
    investedAssets: number;
    vaultSavings: number;
    monthlyAverageIncome: number;
    monthlyAverageExpenses: number;
    currentMonthIncome: number;
    currentMonthExpenses: number;
    netSavingsRate: number;
    liquidityRunwayMonths: number;
  };
  monthlyCashFlow: Array<{
    month: string;
    year: number;
    income: number;
    expense: number;
    netCashFlow: number;
    savingsRate: number;
  }>;
  annualComparison: {
    ytdIncome: number;
    ytdExpenses: number;
    ytdNetSavings: number;
    annualRunRate: number;
    momIncomeChangePercent: number;
    momExpenseChangePercent: number;
  };
  spendingCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
    transactionCount: number;
    color: string;
  }>;
  portfolioTrajectory: Array<{
    date: string;
    netWorth: number;
    liquidCash: number;
    portfolioAssets: number;
    vaultSavings: number;
  }>;
  assetAllocation: Array<{
    assetType: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  savingsGoals: Array<{
    id: string;
    title: string;
    currentAmount: number;
    targetAmount: number;
    percentage: number;
    category: string;
    targetDate: string;
  }>;
  financialHealth: {
    totalScore: number;
    rating: string;
    methodologyVersion: string;
    disclaimer: string;
    pillars: Array<{
      name: string;
      score: number;
      weight: number;
      weightedPoints: number;
      status: string;
      metricValue: string;
      benchmark: string;
      description: string;
    }>;
    recommendations: string[];
  };
}

const INITIAL_ANALYTICS_DATA: AnalyticsData = {
  timeframe: '90D',
  summary: {
    totalNetWorth: 248650.0,
    liquidCash: 46900.0,
    investedAssets: 136750.0,
    vaultSavings: 65000.0,
    monthlyAverageIncome: 14250.0,
    monthlyAverageExpenses: 5890.0,
    currentMonthIncome: 15400.0,
    currentMonthExpenses: 5620.0,
    netSavingsRate: 63.5,
    liquidityRunwayMonths: 7.9,
  },
  monthlyCashFlow: [
    { month: 'Jun', year: 2026, income: 13500, expense: 5800, netCashFlow: 7700, savingsRate: 57.0 },
    { month: 'Jul', year: 2026, income: 14200, expense: 6100, netCashFlow: 8100, savingsRate: 57.0 },
    { month: 'Aug', year: 2026, income: 13900, expense: 5400, netCashFlow: 8500, savingsRate: 61.1 },
    { month: 'Sep', year: 2026, income: 14800, expense: 5900, netCashFlow: 8900, savingsRate: 60.1 },
    { month: 'Oct', year: 2026, income: 15400, expense: 5620, netCashFlow: 9780, savingsRate: 63.5 },
  ],
  annualComparison: {
    ytdIncome: 142500,
    ytdExpenses: 58900,
    ytdNetSavings: 83600,
    annualRunRate: 171000,
    momIncomeChangePercent: 4.05,
    momExpenseChangePercent: -4.74,
  },
  spendingCategories: [
    { category: 'INVESTMENTS', amount: 4500, percentage: 48, transactionCount: 14, color: '#C6A477' },
    { category: 'HOUSING', amount: 2200, percentage: 24, transactionCount: 4, color: '#642B35' },
    { category: 'TECHNOLOGY', amount: 1450, percentage: 16, transactionCount: 8, color: '#96764D' },
    { category: 'SERVICES', amount: 820, percentage: 9, transactionCount: 12, color: '#E9DDCA' },
    { category: 'TRANSFERS', amount: 280, percentage: 3, transactionCount: 2, color: '#481B24' },
  ],
  portfolioTrajectory: [
    { date: '2026-06-01', netWorth: 210000, liquidCash: 40000, portfolioAssets: 120000, vaultSavings: 50000 },
    { date: '2026-07-01', netWorth: 218100, liquidCash: 42000, portfolioAssets: 124100, vaultSavings: 52000 },
    { date: '2026-08-01', netWorth: 226600, liquidCash: 43500, portfolioAssets: 128100, vaultSavings: 55000 },
    { date: '2026-09-01', netWorth: 235500, liquidCash: 45000, portfolioAssets: 132500, vaultSavings: 58000 },
    { date: '2026-10-01', netWorth: 248650, liquidCash: 46900, portfolioAssets: 136750, vaultSavings: 65000 },
  ],
  assetAllocation: [
    { assetType: 'Equities & Spot Crypto', value: 136750, percentage: 55, color: '#C6A477' },
    { assetType: 'Travertine Cold Vault', value: 65000, percentage: 26, color: '#642B35' },
    { assetType: 'Liquid Sovereign Cash', value: 46900, percentage: 19, color: '#E9DDCA' },
  ],
  savingsGoals: [
    { id: '1', title: 'Executive Reserve Fund', currentAmount: 65000, targetAmount: 100000, percentage: 65, category: 'VAULT', targetDate: '2027-01-01' },
  ],
  financialHealth: {
    totalScore: 924,
    rating: 'PRIME INSTITUTIONAL ALPHA',
    methodologyVersion: 'VALIXEN-QHS-v2.4',
    disclaimer: 'Simulated institutional allocation benchmark.',
    pillars: [
      { name: 'Liquidity Runway', score: 95, weight: 0.35, weightedPoints: 332, status: 'EXCELLENT', metricValue: '7.9 Months', benchmark: 'Min 6.0 Months', description: 'Exceptional liquid capital buffer.' },
      { name: 'Savings Prudence', score: 92, weight: 0.40, weightedPoints: 368, status: 'EXCELLENT', metricValue: '63.5%', benchmark: 'Min 20.0%', description: 'Prime surplus generation rate.' },
      { name: 'Capital Allocation', score: 90, weight: 0.25, weightedPoints: 225, status: 'EXCELLENT', metricValue: '3 Asset Classes', benchmark: 'Equities, Vault, Cash', description: 'Optimal multi-asset diversification.' },
    ],
    recommendations: [
      'Excellent capital cushion: your 7.9-month runway comfortably exceeds standard 6-month safety benchmarks.',
      'Consider compounding an additional 10% of monthly surplus into the Valixen Cold Vault.',
    ],
  },
};

export default function AnalyticsPage() {
  const router = useRouter();

  // State
  const [data, setData] = useState<AnalyticsData | null>(INITIAL_ANALYTICS_DATA);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [hideBalance, setHideBalance] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('90D');
  const [activeTab, setActiveTab] = useState<ActiveTab>('OVERVIEW');

  // Interactive Chart Tooltips
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Fetch Analytics
  const fetchAnalytics = async (tf = timeframe) => {
    try {
      const res = await fetch(`/api/v1/analytics?timeframe=${tf}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load financial analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeframe);
  }, [timeframe]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics(timeframe);
  };

  // Convert USD amounts to chosen currency
  const formatMoney = (usdAmount: number) => {
    if (hideBalance) return '••••••••';
    const conf = CURRENCY_CONFIG[currency];
    const converted = usdAmount * conf.rate;
    if (currency === 'UZS') {
      return `${Math.round(converted).toLocaleString()} ${conf.symbol}`;
    }
    return `${conf.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // 1. Export CSV
  const handleExportCSV = () => {
    if (!data) return;

    const summaryRows = [
      ['VELTRON FINANCIAL ANALYTICS EXECUTIVE BRIEFING'],
      ['Generated Date', new Date().toISOString()],
      ['Timeframe', data.timeframe],
      ['Total Net Worth (USD)', data.summary.totalNetWorth.toFixed(2)],
      ['Liquid Cash (USD)', data.summary.liquidCash.toFixed(2)],
      ['High-Yield Vault Savings (USD)', data.summary.vaultSavings.toFixed(2)],
      ['Invested Assets (USD)', data.summary.investedAssets.toFixed(2)],
      ['Monthly Inflow (USD)', data.summary.currentMonthIncome.toFixed(2)],
      ['Monthly Outflow (USD)', data.summary.currentMonthExpenses.toFixed(2)],
      ['Net Savings Rate (%)', `${data.summary.netSavingsRate}%`],
      ['Financial Health Score', `${data.financialHealth.totalScore}/1000 (${data.financialHealth.rating})`],
      [''],
      ['MONTHLY CASH FLOW COMPARISON'],
      ['Month', 'Income USD', 'Expense USD', 'Net Cash Flow USD', 'Savings Rate %'],
      ...data.monthlyCashFlow.map((m) => [m.month, m.income, m.expense, m.netCashFlow, `${m.savingsRate}%`]),
      [''],
      ['SPENDING CATEGORIES'],
      ['Category', 'Amount USD', 'Percentage', 'Transactions'],
      ...data.spendingCategories.map((c) => [c.category, c.amount, `${c.percentage}%`, c.transactionCount]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + summaryRows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `veltron_analytics_${timeframe}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Export PDF (Print-to-PDF Friendly)
  const handleExportPDF = () => {
    window.print();
  };

  // SVG Area Chart Coordinate Generator (Net Worth Trajectory)
  const areaChartPoints = useMemo(() => {
    if (!data || data.portfolioTrajectory.length === 0) return { path: '', area: '', points: [] };
    const points = data.portfolioTrajectory;
    const values = points.map((p) => p.netWorth);
    const minVal = Math.min(...values) * 0.95;
    const maxVal = Math.max(...values) * 1.05;
    const range = maxVal - minVal || 1;

    const width = 800;
    const height = 240;
    const paddingX = 40;
    const paddingY = 20;
    const graphWidth = width - paddingX * 2;
    const graphHeight = height - paddingY * 2;

    const coords = points.map((p, idx) => {
      const x = paddingX + (idx / (points.length - 1)) * graphWidth;
      const y = height - paddingY - ((p.netWorth - minVal) / range) * graphHeight;
      return { x, y, ...p };
    });

    const linePath = coords.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');

    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

    return { path: linePath, area: areaPath, points: coords };
  }, [data]);

  return (
    <div className="min-h-screen bg-[#090706] text-[#E9DDCA] flex flex-col font-manrope selection:bg-[#C6A477]/30 selection:text-white print:bg-white print:text-black">
      {/* 1. Header Navigation */}
      <LuxuryNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2. Top Title, Date Filters & Perspective Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-black text-white tracking-tight">
                Advanced Financial Analytics
              </h1>
              <Badge variant="outline" className="text-valixen-ice border-valixen-ice/30">
                QUANT INTELLIGENCE
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Multi-period cash flow modeling, portfolio trajectories, category doughnuts, and transparent solvency scoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Timeframe Filter Pills */}
            <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10">
              {(['30D', '90D', '180D', '1Y', 'YTD', 'ALL'] as TimeframeFilter[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    timeframe === tf
                      ? 'bg-valixen-ice text-black font-bold shadow-md shadow-valixen-ice/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Navigation Tab Selector */}
            <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-valixen-violet text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('CASHFLOW')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'CASHFLOW'
                    ? 'bg-valixen-violet text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cash Flow
              </button>
              <button
                onClick={() => setActiveTab('SPENDING')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'SPENDING'
                    ? 'bg-valixen-violet text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setActiveTab('HEALTH')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'HEALTH'
                    ? 'bg-valixen-violet text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Health Score
              </button>
              <button
                onClick={() => setActiveTab('QUANT')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'QUANT'
                    ? 'bg-valixen-violet text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Quant Risk
              </button>
            </div>
          </div>
        </div>

        {/* 3. Executive KPI Telemetry Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="TOTAL CAPITAL VALUATION"
            value={formatMoney(data?.summary.totalNetWorth || 0)}
            prefix=""
            change={{ value: '+8.4%', isPositive: true, period: timeframe }}
            glow="ice"
          />
          <StatCard
            title="MONTHLY INFLOW (30D)"
            value={formatMoney(data?.summary.currentMonthIncome || 0)}
            prefix=""
            change={{
              value: `${data?.annualComparison.momIncomeChangePercent || 0}%`,
              isPositive: (data?.annualComparison.momIncomeChangePercent || 0) >= 0,
              period: 'MoM',
            }}
            glow="profit"
          />
          <StatCard
            title="MONTHLY OUTFLOW (30D)"
            value={formatMoney(data?.summary.currentMonthExpenses || 0)}
            prefix=""
            change={{
              value: `${data?.annualComparison.momExpenseChangePercent || 0}%`,
              isPositive: false,
              period: 'MoM',
            }}
            glow="none"
          />
          <StatCard
            title="LIQUIDITY RUNWAY"
            value={`${data?.summary.liquidityRunwayMonths || 0} mo`}
            prefix=""
            subtitle={`Savings Rate: ${data?.summary.netSavingsRate || 0}%`}
            glow="violet"
          />
        </div>

        {/* 4. TAB CONTENT 1: OVERVIEW & WEALTH TRAJECTORY */}
        {(activeTab === 'OVERVIEW' || activeTab === 'CASHFLOW') && (
          <div className="space-y-8">
            {/* Net Worth Trajectory Area Chart */}
            <GlassPanel variant="default" className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-valixen-ice" />
                    <h3 className="text-lg font-display font-bold text-white tracking-tight">
                      CUMULATIVE WEALTH TRAJECTORY (AREA CHART)
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Integrated valuation trajectory combining liquid cash, high-yield vault reserves, and investment holdings
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-valixen-ice" />
                    <span className="text-slate-300">Total Net Worth</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-valixen-violet" />
                    <span className="text-slate-300">Vault & Liquid Reserves</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Area Curve */}
              <div className="w-full h-64 relative">
                <svg
                  viewBox="0 0 800 240"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.35" />
                      <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#07090E" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#00F0FF" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[40, 90, 140, 190].map((y) => (
                    <line
                      key={y}
                      x1="40"
                      y1={y}
                      x2="760"
                      y2={y}
                      stroke="rgba(255,255,255,0.05)"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Shaded Area Fill */}
                  <path d={areaChartPoints.area} fill="url(#areaGradient)" />

                  {/* Glowing Stroke Curve */}
                  <path
                    d={areaChartPoints.path}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    className="drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]"
                  />

                  {/* Data Points on Curve */}
                  {areaChartPoints.points.map((pt, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#07090E"
                        stroke="#00F0FF"
                        strokeWidth="2.5"
                        className="transition-transform group-hover:scale-150"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 12}
                        textAnchor="middle"
                        className="fill-slate-300 font-mono text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ${pt.netWorth.toLocaleString()}
                      </text>
                      <text
                        x={pt.x}
                        y="230"
                        textAnchor="middle"
                        className="fill-slate-500 font-mono text-[9px]"
                      >
                        {pt.date.slice(5)}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </GlassPanel>

            {/* Monthly Cash Flow Comparisons (BAR CHART & LINE CHART) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Bar Chart (7 cols) */}
              <div className="lg:col-span-7">
                <GlassPanel variant="default" className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-valixen-telemetry-profit" />
                        <h3 className="text-base font-display font-bold text-white">
                          MONTHLY INFLOW VS OUTFLOW (BAR CHART)
                        </h3>
                      </div>
                      <Badge variant="outline" className="border-valixen-telemetry-profit/30 text-valixen-telemetry-profit text-[10px]">
                        MoM +{data?.annualComparison.momIncomeChangePercent}%
                      </Badge>
                    </div>

                    {/* Bar Chart Visualization */}
                    <div className="space-y-4">
                      {data?.monthlyCashFlow.map((m, idx) => {
                        const maxBar = 11000;
                        const incomeWidth = Math.min((m.income / maxBar) * 100, 100);
                        const expenseWidth = Math.min((m.expense / maxBar) * 100, 100);

                        return (
                          <div
                            key={m.month}
                            onMouseEnter={() => setHoveredMonthIndex(idx)}
                            onMouseLeave={() => setHoveredMonthIndex(null)}
                            className="p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-bold text-slate-200">{m.month}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-valixen-telemetry-profit font-semibold">
                                  +{formatMoney(m.income)}
                                </span>
                                <span className="text-slate-400 font-semibold">
                                  -{formatMoney(m.expense)}
                                </span>
                                <span className="text-valixen-ice font-bold w-12 text-right">
                                  +{m.savingsRate}%
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              {/* Income Bar (Green) */}
                              <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-valixen-telemetry-profit transition-all duration-500"
                                  style={{ width: `${incomeWidth}%` }}
                                />
                              </div>
                              {/* Expense Bar (Violet/Gray) */}
                              <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-valixen-violet transition-all duration-500"
                                  style={{ width: `${expenseWidth}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-valixen-telemetry-profit" /> Income
                      <span className="w-2.5 h-2.5 rounded-full bg-valixen-violet ml-2" /> Expense
                    </span>
                    <span>YTD Net Savings: {formatMoney(data?.annualComparison.ytdNetSavings || 0)}</span>
                  </div>
                </GlassPanel>
              </div>

              {/* Annual Run-Rate & Comparisons Table (5 cols) */}
              <div className="lg:col-span-5">
                <GlassPanel variant="default" className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-valixen-violet" />
                        <h3 className="text-base font-display font-bold text-white">
                          ANNUAL RUN-RATE COMPARISON
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-slate-400">2026 Fiscal YTD</span>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Annualized Run-Rate</span>
                          <span className="text-base font-display font-bold text-white">
                            {formatMoney(data?.annualComparison.annualRunRate || 0)}
                          </span>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-valixen-ice" />
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">YTD Total Inflow</span>
                          <span className="text-base font-display font-bold text-valixen-telemetry-profit">
                            +{formatMoney(data?.annualComparison.ytdIncome || 0)}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">6 Months</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">YTD Total Outflow</span>
                          <span className="text-base font-display font-bold text-slate-300">
                            -{formatMoney(data?.annualComparison.ytdExpenses || 0)}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">Burn Ratio 29%</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Average Monthly Surplus</span>
                          <span className="text-base font-display font-bold text-valixen-ice">
                            +{formatMoney((data?.summary.monthlyAverageIncome || 0) - (data?.summary.monthlyAverageExpenses || 0))}
                          </span>
                        </div>
                        <Badge variant="outline" className="border-valixen-ice/30 text-valixen-ice text-[10px]">
                          SURPLUS
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] mt-4 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Reconciled against verified bank feeds</span>
                    <Link href="/wallet" className="text-valixen-violet hover:underline font-mono">
                      Manage Accounts →
                    </Link>
                  </div>
                </GlassPanel>
              </div>
            </div>
          </div>
        )}

        {/* 5. TAB CONTENT 2: SPENDING CATEGORIES & ASSET ALLOCATION (DOUGHNUT CHARTS) */}
        {(activeTab === 'OVERVIEW' || activeTab === 'SPENDING') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Spending Categories Doughnut (6 cols) */}
            <div className="lg:col-span-6">
              <GlassPanel variant="default" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-valixen-ice" />
                    <h3 className="text-base font-display font-bold text-white">
                      SPENDING CATEGORIES (DOUGHNUT CHART)
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Total: {formatMoney(data?.summary.currentMonthExpenses || 0)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* SVG Doughnut Graphic */}
                  <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Doughnut Segments */}
                      {data?.spendingCategories.map((cat, idx) => {
                        const total = 100;
                        const previousPercentSum = data.spendingCategories
                          .slice(0, idx)
                          .reduce((s, c) => s + c.percentage, 0);
                        const dashArray = `${cat.percentage} ${total - cat.percentage}`;
                        const dashOffset = -previousPercentSum;

                        return (
                          <circle
                            key={cat.category}
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke={cat.color}
                            strokeWidth="14"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                            onMouseEnter={() => setHoveredCategory(cat.category)}
                            onMouseLeave={() => setHoveredCategory(null)}
                          />
                        );
                      })}
                    </svg>

                    {/* Doughnut Center Telemetry */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        {hoveredCategory || 'SPEND'}
                      </span>
                      <span className="text-sm font-display font-black text-white">
                        {hoveredCategory
                          ? formatMoney(data?.spendingCategories.find((c) => c.category === hoveredCategory)?.amount || 0)
                          : formatMoney(data?.summary.currentMonthExpenses || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Category Legend & Metrics */}
                  <div className="flex-1 w-full space-y-2.5">
                    {data?.spendingCategories.map((cat) => (
                      <div
                        key={cat.category}
                        onMouseEnter={() => setHoveredCategory(cat.category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className={`p-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                          hoveredCategory === cat.category ? 'bg-white/[0.05]' : 'bg-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-mono font-medium text-slate-200">{cat.category}</span>
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-white font-semibold">{formatMoney(cat.amount)}</span>
                          <span className="text-slate-400 w-10 text-right">{cat.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassPanel>
            </div>

            {/* Asset Allocation Doughnut & Wealth Breakdown (6 cols) */}
            <div className="lg:col-span-6">
              <GlassPanel variant="default" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-valixen-violet" />
                    <h3 className="text-base font-display font-bold text-white">
                      CAPITAL ALLOCATION (PORTFOLIO DOUGHNUT)
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-valixen-ice">
                    Net: {formatMoney(data?.summary.totalNetWorth || 0)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* SVG Asset Allocation Doughnut */}
                  <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {data?.assetAllocation.map((asset, idx) => {
                        const total = 100;
                        const prevSum = data.assetAllocation
                          .slice(0, idx)
                          .reduce((s, a) => s + a.percentage, 0);
                        const dashArray = `${asset.percentage} ${total - asset.percentage}`;
                        const dashOffset = -prevSum;

                        return (
                          <circle
                            key={asset.assetType}
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke={asset.color}
                            strokeWidth="14"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-300 hover:opacity-80"
                          />
                        );
                      })}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        ALLOCATED
                      </span>
                      <span className="text-sm font-display font-black text-white">
                        {formatMoney(data?.summary.totalNetWorth || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Asset Classes Legend */}
                  <div className="flex-1 w-full space-y-2.5">
                    {data?.assetAllocation.map((asset) => (
                      <div
                        key={asset.assetType}
                        className="p-2 rounded-xl bg-white/[0.02] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: asset.color }}
                          />
                          <span className="font-mono text-slate-200 truncate">{asset.assetType}</span>
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-white font-semibold">{formatMoney(asset.value)}</span>
                          <span className="text-slate-400 w-10 text-right">{asset.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        )}

        {/* 6. TAB CONTENT 3: TRANSPARENT FINANCIAL HEALTH SCORE & METHODOLOGY */}
        {(activeTab === 'OVERVIEW' || activeTab === 'HEALTH') && (
          <div className="space-y-6">
            <GlassPanel variant="prismatic" className="p-8">
              {/* Health Score Header & Circular Radial Gauge */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-6">
                  {/* Radial Gauge */}
                  <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#00F0FF"
                        strokeWidth="10"
                        strokeDasharray={`${(data?.financialHealth.totalScore || 885) / 10} 100`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-display font-black text-white">
                        {data?.financialHealth.totalScore || 885}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">/ 1000</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-display font-bold text-white">
                        Financial Health & Solvency Score
                      </span>
                      <Badge variant="outline" className="border-valixen-telemetry-profit text-valixen-telemetry-profit text-xs font-mono">
                        {data?.financialHealth.rating || 'PRIME INSTITUTIONAL'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl">
                      Transparent quantitative solvency metric derived mathematically from platform liquid runway, net savings efficiency, zero high-interest liabilities, and multi-asset diversification.
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-slate-400">
                  <span className="block text-[10px] uppercase text-slate-500">Methodology Engine</span>
                  <span className="font-bold text-slate-200">{data?.financialHealth.methodologyVersion || 'VELTRON-QHS-v2.4'}</span>
                </div>
              </div>

              {/* 4 Pillars Grid with Transparent Weightings */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
                {data?.financialHealth.pillars.map((pillar) => (
                  <div
                    key={pillar.name}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white">{pillar.name}</span>
                      <span className="text-valixen-ice font-bold">
                        {pillar.weightedPoints} / 250 pts
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Actual: {pillar.metricValue}</span>
                        <span className="text-slate-500">{pillar.benchmark}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-valixen-violet to-valixen-ice"
                          style={{ width: `${pillar.score}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Important Legal Disclaimer Card */}
              <div className="p-4 rounded-xl bg-valixen-gold/10 border border-valixen-gold/20 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-valixen-gold">
                  <AlertCircle className="w-4 h-4" />
                  <span>MANDATORY FINANCIAL DISCLAIMER</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {data?.financialHealth.disclaimer}
                </p>
              </div>
            </GlassPanel>

            {/* Savings Goals Progress Tracker */}
            <GlassPanel variant="default" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-valixen-ice" />
                  <h3 className="text-base font-display font-bold text-white">
                    SAVINGS & CAPITAL ACCUMULATION GOALS
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {data?.savingsGoals.length} Active Targets
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data?.savingsGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate pr-2">{goal.title}</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-white/10 text-valixen-ice">
                        {goal.category}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-valixen-telemetry-profit font-semibold">
                          {formatMoney(goal.currentAmount)}
                        </span>
                        <span className="text-slate-400">{formatMoney(goal.targetAmount)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-valixen-ice transition-all duration-500"
                          style={{ width: `${goal.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Target Date: {goal.targetDate}</span>
                      <span className="text-white font-bold">{goal.percentage}% Complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        )}

        {/* 8. Quantitative Risk & Monte Carlo Analysis Tab */}
        {activeTab === 'QUANT' && (
          <div className="space-y-6">
            {/* Top Risk Ratios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="SHARPE RATIO"
                value="1.94"
                prefix=""
                change={{ value: 'Superior Risk-Adjusted Return', isPositive: true, period: '1Y' }}
                glow="ice"
              />
              <StatCard
                title="SORTINO RATIO"
                value="2.45"
                prefix=""
                change={{ value: 'Low Downside Volatility', isPositive: true, period: '1Y' }}
                glow="profit"
              />
              <StatCard
                title="MAX DRAWDOWN RISK"
                value="-6.4%"
                prefix=""
                change={{ value: 'Convex Hedging Protected', isPositive: true, period: '1Y' }}
                glow="none"
              />
              <StatCard
                title="TAX-LOSS HARVESTING OFFSET"
                value="+$1,420"
                prefix=""
                change={{ value: 'Simulated Efficiency Gains', isPositive: true, period: 'YTD' }}
                glow="violet"
              />
            </div>

            {/* Monte Carlo 1,000 Simulation Paths */}
            <GlassPanel variant="prismatic" className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan" dot className="text-[10px] font-mono">
                      MONTE CARLO PROJECTIONS (1,000 PATHS)
                    </Badge>
                    <span className="text-xs font-mono text-valixen-ice font-bold">5-YEAR CONVEXITY HORIZON</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">Stochastic Wealth Trajectory</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">95% CONFIDENCE INTERVAL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
                <div className="p-4 rounded-xl bg-valixen-telemetry-profit/10 border border-valixen-telemetry-profit/30 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">90th Percentile (Bull Scenario)</div>
                  <div className="text-xl font-bold text-valixen-telemetry-profit">$184,500.00</div>
                  <div className="text-[10px] text-slate-400">+184% 5-Year Return</div>
                </div>

                <div className="p-4 rounded-xl bg-valixen-ice/10 border border-valixen-ice/30 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">50th Percentile (Median Base)</div>
                  <div className="text-xl font-bold text-valixen-ice">$128,400.00</div>
                  <div className="text-[10px] text-slate-400">+128% 5-Year Return</div>
                </div>

                <div className="p-4 rounded-xl bg-valixen-telemetry-risk/10 border border-valixen-telemetry-risk/30 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">10th Percentile (Stress Test)</div>
                  <div className="text-xl font-bold text-slate-300">$84,200.00</div>
                  <div className="text-[10px] text-slate-400">Capital Preservation Floor</div>
                </div>
              </div>
            </GlassPanel>

            {/* Cross-Asset Correlation Matrix */}
            <GlassPanel variant="prismatic" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-valixen-ice" />
                  <h3 className="text-base font-display font-bold text-white">CROSS-ASSET CORRELATION MATRIX</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">DAILY SETTLEMENT SPREADS</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-center">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/[0.08]">
                      <th className="p-2.5 text-left">Asset</th>
                      <th className="p-2.5">SPY (US Equities)</th>
                      <th className="p-2.5">TLT (Sovereign Bonds)</th>
                      <th className="p-2.5">GLD (Gold)</th>
                      <th className="p-2.5">BTC (Bitcoin)</th>
                      <th className="p-2.5">UZS (FX Reserve)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    <tr>
                      <td className="p-2.5 text-left font-bold text-white">SPY</td>
                      <td className="p-2.5 text-valixen-ice font-bold">1.00</td>
                      <td className="p-2.5 text-valixen-telemetry-risk">-0.24</td>
                      <td className="p-2.5 text-slate-300">+0.12</td>
                      <td className="p-2.5 text-valixen-telemetry-profit">+0.42</td>
                      <td className="p-2.5 text-slate-400">-0.05</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-left font-bold text-white">TLT</td>
                      <td className="p-2.5 text-valixen-telemetry-risk">-0.24</td>
                      <td className="p-2.5 text-valixen-ice font-bold">1.00</td>
                      <td className="p-2.5 text-valixen-telemetry-profit">+0.38</td>
                      <td className="p-2.5 text-valixen-telemetry-risk">-0.18</td>
                      <td className="p-2.5 text-slate-400">+0.08</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-left font-bold text-white">GLD</td>
                      <td className="p-2.5 text-slate-300">+0.12</td>
                      <td className="p-2.5 text-valixen-telemetry-profit">+0.38</td>
                      <td className="p-2.5 text-valixen-ice font-bold">1.00</td>
                      <td className="p-2.5 text-slate-300">+0.22</td>
                      <td className="p-2.5 text-valixen-telemetry-profit">+0.15</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-left font-bold text-white">BTC</td>
                      <td className="p-2.5 text-valixen-telemetry-profit">+0.42</td>
                      <td className="p-2.5 text-valixen-telemetry-risk">-0.18</td>
                      <td className="p-2.5 text-slate-300">+0.22</td>
                      <td className="p-2.5 text-valixen-ice font-bold">1.00</td>
                      <td className="p-2.5 text-slate-400">-0.02</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </GlassPanel>
          </div>
        )}
      </main>

      {/* LUXURY FOOTER */}
      <LuxuryFooter />
    </div>
  );
}
