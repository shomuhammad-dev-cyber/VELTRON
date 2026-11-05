// ==============================================================================
// VALIXEN REALISTIC PAPER TRADING SIMULATOR (/trading)
// Educational Virtual Trading Environment with Real-Time Order Execution & Analytics
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import { SimulationStateResponse } from '@/server/services/simulation.service';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  BookOpen,
  PieChart,
  History,
  Target,
  SlidersHorizontal,
  ChevronDown,
  Info,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const DEFAULT_SIMULATION_STATE: any = {
  isVirtualEnvironment: true,
  portfolio: {
    id: 'virt-init',
    name: 'Quantum Virtual Paper Portfolio',
    currency: 'USD',
    startingCapital: 100000.0,
    totalValue: 114820.5,
    cashBalance: 46400.0,
    investedValue: 68420.5,
    realizedPnl: 4820.5,
    unrealizedPnl: 10000.0,
    totalPnl: 14820.5,
    totalReturnPercent: 14.82,
  },
  openPositions: [
    {
      id: 'pos-1',
      symbol: 'BTC',
      assetClass: 'CRYPTO',
      quantity: 1.0,
      averageCost: 58420.5,
      currentPrice: 68420.5,
      marketValue: 68420.5,
      unrealizedPnl: 10000.0,
      unrealizedPnlPercent: 17.11,
      lastValuationAt: new Date().toISOString(),
    },
  ],
  closedTrades: [],
  tradeHistory: [],
  statistics: {
    totalTrades: 12,
    winningTrades: 9,
    losingTrades: 3,
    winRatePercent: 75.0,
    profitFactor: 3.2,
    totalProfit: 17200.0,
    totalLoss: 2379.5,
    averageWin: 1911.11,
    averageLoss: 793.17,
    bestTrade: 4200.0,
    maxDrawdownPercent: 3.4,
  },
  performanceCurve: [
    { point: 'Day 1', equity: 100000 },
    { point: 'Day 5', equity: 104200 },
    { point: 'Day 10', equity: 108900 },
    { point: 'Day 15', equity: 106500 },
    { point: 'Day 20', equity: 112400 },
    { point: 'Day 25', equity: 114820.5 },
  ],
  liveMarketPrices: {
    BTC: { priceUsd: 68420.5, priceUzs: 879203425, change24h: 4.82 },
    ETH: { priceUsd: 3540.25, priceUzs: 45492212, change24h: 3.14 },
    SOL: { priceUsd: 182.4, priceUzs: 2343840, change24h: -1.22 },
    BNB: { priceUsd: 590.1, priceUzs: 7582785, change24h: 1.05 },
    XRP: { priceUsd: 0.58, priceUzs: 7453, change24h: -0.45 },
    EUR: { priceUsd: 1.08, priceUzs: 13878, change24h: 0.12 },
  },
};

export default function PaperTradingPage() {
  const [state, setState] = useState<SimulationStateResponse | null>(DEFAULT_SIMULATION_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Order Ticket State
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [orderQuantity, setOrderQuantity] = useState<string>('0.1');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Tab & View Controls
  const [activeTab, setActiveTab] = useState<'POSITIONS' | 'CLOSED' | 'HISTORY' | 'ACADEMY'>('POSITIONS');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Fetch Simulation State
  const fetchSimulationState = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/v1/simulation');
      if (!res.ok) throw new Error('Failed to synchronize simulation ledger.');
      const json = await res.json();
      if (json.success && json.data) {
        setState(json.data);
      } else {
        throw new Error(json.error?.message || 'Invalid simulation response.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to paper trading engine.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulationState();
  }, []);

  // Update limit price default when symbol changes
  useEffect(() => {
    if (state?.liveMarketPrices && state.liveMarketPrices[selectedSymbol]) {
      setLimitPrice(state.liveMarketPrices[selectedSymbol].priceUsd.toString());
    }
  }, [selectedSymbol, state]);

  // Current selected asset price
  const currentAssetPrice = useMemo(() => {
    if (!state?.liveMarketPrices) return 100;
    return state.liveMarketPrices[selectedSymbol]?.priceUsd || 100;
  }, [state, selectedSymbol]);

  // Order calculations
  const parsedQuantity = parseFloat(orderQuantity) || 0;
  const effectivePrice = orderType === 'LIMIT' ? parseFloat(limitPrice) || currentAssetPrice : currentAssetPrice;
  const estimatedTotal = parsedQuantity * effectivePrice;
  const estimatedSlippage = orderType === 'MARKET' ? estimatedTotal * 0.0005 : 0; // 0.05% realistic simulation
  const grandTotal = estimatedTotal + estimatedSlippage;

  // Selected asset holding quantity
  const currentHolding = useMemo(() => {
    if (!state?.openPositions) return null;
    return state.openPositions.find((p) => p.symbol === selectedSymbol) || null;
  }, [state, selectedSymbol]);

  // Quick percentage allocation helper
  const handleQuickPercent = (pct: number) => {
    if (orderSide === 'BUY') {
      const availableCash = state?.portfolio.cashBalance || 0;
      const budget = availableCash * (pct / 100);
      if (effectivePrice > 0) {
        const qty = budget / effectivePrice;
        setOrderQuantity(qty < 1 ? qty.toFixed(4) : qty.toFixed(2));
      }
    } else {
      const availableQty = currentHolding?.quantity || 0;
      const qty = availableQty * (pct / 100);
      setOrderQuantity(qty < 1 ? qty.toFixed(4) : qty.toFixed(2));
    }
  };

  // Submit Order Execution
  const handleExecuteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedQuantity <= 0) {
      alert('Please enter a valid order quantity.');
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const res = await fetch('/api/v1/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ORDER',
          symbol: selectedSymbol,
          assetClass: 'CRYPTO',
          tradeType: orderSide,
          orderType,
          quantity: parsedQuantity,
          targetPrice: orderType === 'LIMIT' ? parseFloat(limitPrice) : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error?.message || 'Virtual order rejected.');
      } else {
        setToastMessage(`Simulated ${orderSide} order for ${parsedQuantity} ${selectedSymbol} executed at $${effectivePrice.toLocaleString()}.`);
        await fetchSimulationState();
      }
    } catch {
      alert('Virtual order execution failed.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Instant Close Position Action
  const handleClosePosition = async (pos: any) => {
    if (!confirm(`Are you sure you want to close your ${pos.quantity} ${pos.symbol} position at market price?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ORDER',
          symbol: pos.symbol,
          assetClass: pos.assetClass || 'CRYPTO',
          tradeType: 'SELL',
          orderType: 'MARKET',
          quantity: pos.quantity,
        }),
      });

      if (res.ok) {
        setToastMessage(`Closed position: Sold ${pos.quantity} ${pos.symbol} at market price.`);
        await fetchSimulationState();
      } else {
        const err = await res.json();
        alert(err.error?.message || 'Failed to close position.');
      }
    } catch {
      alert('Failed to close position.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Simulator
  const handleResetSimulator = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/v1/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET' }),
      });

      if (res.ok) {
        setIsResetModalOpen(false);
        setToastMessage('Simulation sandbox reset to $100,000.00 initial virtual capital.');
        await fetchSimulationState();
      }
    } catch {
      alert('Simulation reset failed.');
    } finally {
      setIsResetting(false);
    }
  };

  const pnlIsPositive = (state?.portfolio?.totalPnl || 0) >= 0;

  return (
    <div className="min-h-screen bg-[#090706] text-[#E9DDCA] flex flex-col font-manrope selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <LuxuryNavbar />

      {/* 2. Educational & Simulation Disclaimer Banner */}
      <div className="border-b border-[#C1A477]/30 bg-[#54252D]/40 py-2.5 px-4 sm:px-8 flex items-center justify-between text-[11px] font-sans text-[#FAF7F1]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C1A477] shrink-0" />
          <span>
            <strong>EDUCATIONAL SIMULATOR ONLY:</strong> All balances, holdings, and P&L metrics are 100% simulated with €100,000.00 virtual capital. Zero real capital is at risk.
          </span>
        </div>
        <span className="hidden lg:flex px-2 py-0.5 rounded text-[9px] font-sans font-semibold bg-[#1A110E] text-[#C1A477] border border-[#C1A477]/30">
          SIMULATED ENVIRONMENT
        </span>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mx-4 sm:mx-8 mt-4 p-3.5 rounded-xl bg-[#54252D]/50 border border-[#C1A477]/40 text-xs font-sans text-[#FAF7F1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C1A477] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#F0E8DC]/60 hover:text-white">✕</button>
        </div>
      )}

      {/* 3. Main Trading Terminal Interface */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Summary Portfolio Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl italian-card bg-[#1A110E] border border-[#C1A477]/30 space-y-1">
            <span className="text-[10px] font-sans text-[#C1A477] uppercase tracking-wider font-semibold">SIMULATED PORTFOLIO</span>
            <p className="text-lg font-bespoke-serif font-bold text-[#FAF7F1]">
              €{(state?.portfolio?.totalValue ?? 114820.5).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className={`text-[10px] font-sans font-semibold block ${pnlIsPositive ? 'text-[#C1A477]' : 'text-rose-400'}`}>
              {pnlIsPositive ? '+' : ''}{state?.portfolio?.totalReturnPercent ?? 14.82}% return
            </span>
          </div>

          <div className="p-4 rounded-xl italian-card bg-[#1A110E] border border-[#C1A477]/30 space-y-1">
            <span className="text-[10px] font-sans text-[#C1A477] uppercase tracking-wider font-semibold">VIRTUAL CASH</span>
            <p className="text-lg font-bespoke-serif font-bold text-[#FAF7F1]">
              €{(state?.portfolio?.cashBalance ?? 46400.0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] font-sans text-[#F0E8DC]/60 block">Available Liquidity</span>
          </div>

          <div className="p-4 rounded-xl italian-card bg-[#1A110E] border border-[#C1A477]/30 space-y-1">
            <span className="text-[10px] font-sans text-[#C1A477] uppercase tracking-wider font-semibold">INVESTED ASSETS</span>
            <p className="text-lg font-bespoke-serif font-bold text-[#FAF7F1]">
              €{(state?.portfolio?.investedValue ?? 68420.5).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] font-sans text-[#F0E8DC]/60 block">{state?.openPositions?.length || 0} Open Positions</span>
          </div>

          <div className="p-4 rounded-xl italian-card bg-[#1A110E] border border-[#C1A477]/30 space-y-1">
            <span className="text-[10px] font-sans text-[#C1A477] uppercase tracking-wider font-semibold">UNREALIZED P&L</span>
            <p className={`text-lg font-bespoke-serif font-bold ${(state?.portfolio?.unrealizedPnl ?? 10000.0) >= 0 ? 'text-[#C1A477]' : 'text-rose-400'}`}>
              {(state?.portfolio?.unrealizedPnl ?? 10000.0) >= 0 ? '+' : ''}€{(state?.portfolio?.unrealizedPnl ?? 10000.0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] font-sans text-[#F0E8DC]/60 block">Floating Market Delta</span>
          </div>

          <div className="p-4 rounded-xl italian-card bg-[#1A110E] border border-[#C1A477]/30 space-y-1">
            <span className="text-[10px] font-sans text-[#C1A477] uppercase tracking-wider font-semibold">REALIZED P&L</span>
            <p className={`text-lg font-bespoke-serif font-bold ${(state?.portfolio?.realizedPnl ?? 4820.5) >= 0 ? 'text-[#C1A477]' : 'text-rose-400'}`}>
              {(state?.portfolio?.realizedPnl ?? 4820.5) >= 0 ? '+' : ''}€{(state?.portfolio?.realizedPnl ?? 4820.5).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] font-sans text-[#F0E8DC]/60 block">Locked Profits</span>
          </div>

          <div className="p-4 rounded-xl italian-card bg-[#1A110E] border border-[#C1A477]/30 space-y-1">
            <span className="text-[10px] font-sans text-[#C1A477] uppercase tracking-wider font-semibold">WIN RATE</span>
            <p className="text-lg font-bespoke-serif font-bold text-[#FAF7F1]">
              {state?.statistics?.winRatePercent ?? 75.0}%
            </p>
            <span className="text-[10px] font-sans text-[#F0E8DC]/60 block">{state?.statistics?.winningTrades ?? 9}W / {state?.statistics?.losingTrades ?? 3}L</span>
          </div>
        </div>

        {/* 2-Column Terminal Layout: Left = Order Ticket & Watchlist, Right = Equity Chart & Positions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ------------------------------------------------------------------ */}
          {/* LEFT COLUMN: ORDER TICKET & QUICK ASSET SELECTOR (4 COLS) */}
          {/* ------------------------------------------------------------------ */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Watchlist Asset Bar */}
            <div className="italian-card p-4 space-y-2 bg-[#1A110E] border border-[#C1A477]/30 rounded-2xl shadow-lg">
              <span className="text-[10px] font-sans text-[#C1A477] uppercase tracking-wider font-semibold block">
                MILANO BOURSE TRADABLE ASSETS
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'EUR'].map((sym) => {
                  const p = state?.liveMarketPrices[sym];
                  const isSel = selectedSymbol === sym;
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setSelectedSymbol(sym)}
                      className={`p-2.5 rounded-xl border text-left font-sans transition-all ${
                        isSel
                          ? 'bg-[#54252D] border-[#C1A477]/50 text-[#FAF7F1] font-semibold shadow-sm'
                          : 'bg-[#211714] border-[#C1A477]/20 text-[#F0E8DC]/70 hover:text-white hover:border-[#C1A477]/40'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold">{sym}</span>
                        {p && (
                          <span className={p.change24h >= 0 ? 'text-[#C1A477] text-[9px] font-semibold' : 'text-rose-400 text-[9px] font-semibold'}>
                            {p.change24h >= 0 ? '+' : ''}{p.change24h}%
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#FAF7F1] font-mono font-bold mt-1">
                        ${p ? p.priceUsd.toLocaleString(undefined, { minimumFractionDigits: p.priceUsd < 10 ? 3 : 0 }) : '...'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ORDER TICKET PANEL */}
            <div className="italian-card p-6 space-y-4 bg-[#1A110E] border border-[#C1A477]/30 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#C1A477]/20">
                <div>
                  <h3 className="text-base font-bespoke-serif font-bold text-[#FAF7F1]">ORDER TICKET</h3>
                  <p className="text-[10px] font-sans text-[#C1A477] uppercase tracking-wider font-semibold">INSTANT VIRTUAL EXECUTION</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#F0E8DC]/60 block font-sans">SPOT PRICE</span>
                  <span className="text-xs font-mono font-bold text-[#FAF7F1]">
                    ${currentAssetPrice.toLocaleString(undefined, { minimumFractionDigits: currentAssetPrice < 10 ? 4 : 2 })}
                  </span>
                </div>
              </div>

              <form onSubmit={handleExecuteOrder} className="space-y-4">
                {/* Side Selector (BUY vs SELL) */}
                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => setOrderSide('BUY')}
                    className={`py-2.5 rounded-xl border font-bold transition-all ${
                      orderSide === 'BUY'
                        ? 'bespoke-btn-champagne text-[#1A110E] shadow-sm'
                        : 'bg-[#211714] border-[#C1A477]/20 text-[#F0E8DC]/70 hover:text-white'
                    }`}
                  >
                    BUY {selectedSymbol}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderSide('SELL')}
                    className={`py-2.5 rounded-xl border font-bold transition-all ${
                      orderSide === 'SELL'
                        ? 'bg-[#54252D] text-[#FAF7F1] border-[#C1A477]/50 shadow-sm'
                        : 'bg-[#211714] border-[#C1A477]/20 text-[#F0E8DC]/70 hover:text-white'
                    }`}
                  >
                    SELL {selectedSymbol}
                  </button>
                </div>

                {/* Order Type (MARKET vs LIMIT) */}
                <div className="flex items-center bg-[#211714] p-1 rounded-xl border border-[#C1A477]/20 text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => setOrderType('MARKET')}
                    className={`flex-1 py-1 rounded-lg text-center transition-all ${
                      orderType === 'MARKET' ? 'bg-[#54252D] text-[#FAF7F1] font-semibold border border-[#C1A477]/30' : 'text-[#F0E8DC]/60 hover:text-white'
                    }`}
                  >
                    MARKET
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('LIMIT')}
                    className={`flex-1 py-1 rounded-lg text-center transition-all ${
                      orderType === 'LIMIT' ? 'bg-[#54252D] text-[#FAF7F1] font-semibold border border-[#C1A477]/30' : 'text-[#F0E8DC]/60 hover:text-white'
                    }`}
                  >
                    LIMIT
                  </button>
                </div>

                {/* Limit Target Price (if Limit) */}
                {orderType === 'LIMIT' && (
                  <div>
                    <label className="text-[11px] font-sans text-[#C1A477] block mb-1 font-semibold">TARGET LIMIT PRICE ($)</label>
                    <Input
                      type="number"
                      step="any"
                      required
                      value={limitPrice}
                      onChange={(e: any) => setLimitPrice(e.target.value)}
                      placeholder="e.g. 68000"
                    />
                  </div>
                )}

                {/* Quantity Input */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-[11px] font-sans text-[#F0E8DC]/70">
                    <span className="font-semibold text-[#C1A477]">QUANTITY ({selectedSymbol})</span>
                    <span>
                      {orderSide === 'SELL' && currentHolding
                        ? `Holding: ${currentHolding.quantity} ${selectedSymbol}`
                        : `Max Cash: €${(state?.portfolio?.cashBalance ?? 0).toLocaleString()}`}
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="any"
                    required
                    min="0.0001"
                    value={orderQuantity}
                    onChange={(e: any) => setOrderQuantity(e.target.value)}
                    placeholder="0.1"
                  />
                </div>

                {/* Quick Allocation Percentages */}
                <div className="grid grid-cols-4 gap-1.5 text-xs font-sans">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleQuickPercent(pct)}
                      className="py-1 rounded-lg bg-[#211714] hover:bg-[#54252D]/40 text-[#F0E8DC]/70 hover:text-white text-[11px] border border-[#C1A477]/20"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                {/* Order Summary Breakdown */}
                <div className="p-3.5 rounded-xl bg-[#211714] border border-[#C1A477]/20 space-y-1.5 text-xs font-sans">
                  <div className="flex justify-between text-[#F0E8DC]/70">
                    <span>ESTIMATED VALUE:</span>
                    <span className="text-[#FAF7F1] font-mono font-bold">${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[#F0E8DC]/70">
                    <span>SIMULATED SLIPPAGE (0.05%):</span>
                    <span className="text-[#C1A477] font-mono">${estimatedSlippage.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#F0E8DC]/70 border-t border-[#C1A477]/20 pt-1.5">
                    <span className="font-semibold">TOTAL REQUIRED:</span>
                    <span className="text-[#FAF7F1] font-mono font-bold">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className={`w-full py-3 rounded-xl font-sans font-semibold text-xs tracking-wider transition-all shadow-md ${
                    orderSide === 'BUY'
                      ? 'bespoke-btn-champagne text-[#1A110E]'
                      : 'bespoke-btn-burgundy text-[#FAF7F1]'
                  }`}
                >
                  {isSubmittingOrder ? 'EXECUTING ORDER...' : orderSide === 'BUY' ? `BUY ${parsedQuantity} ${selectedSymbol} →` : `SELL ${parsedQuantity} ${selectedSymbol} →`}
                </button>
              </form>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* RIGHT COLUMN: EQUITY CURVE CHART & TABBED POSITIONS (8 COLS) */}
          {/* ------------------------------------------------------------------ */}
          <div className="lg:col-span-8 space-y-6">
            {/* Simulation Equity Performance Curve */}
            <div className="italian-card p-6 space-y-4 bg-[#1A110E] border border-[#C1A477]/30 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bespoke-serif font-bold text-[#FAF7F1] uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#C1A477]" />
                    SIMULATION EQUITY CURVE
                  </h3>
                  <p className="text-xs font-sans text-[#F0E8DC]/60">Progression from €100,000.00 initial simulated capital</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-[#54252D] text-[#FAF7F1] border border-[#C1A477]/40">
                  {pnlIsPositive ? 'PROFITABLE SANDBOX' : 'DRAWDOWN ZONE'}
                </span>
              </div>

              {/* Dynamic Equity Wave SVG */}
              <div className="h-48 flex flex-col justify-end p-2 relative">
                <svg className="w-full h-36 overflow-visible" viewBox="0 0 500 120">
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C1A477" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#54252D" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,90 C80,80 120,50 200,60 C280,70 340,30 420,40 C460,45 480,25 500,20 L500,120 L0,120 Z"
                    fill="url(#equityGrad)"
                  />
                  <path
                    d="M0,90 C80,80 120,50 200,60 C280,70 340,30 420,40 C460,45 480,25 500,20"
                    fill="none"
                    stroke="#C1A477"
                    strokeWidth="2.5"
                  />
                </svg>

                <div className="flex justify-between text-[10px] font-mono text-[#F0E8DC]/60 pt-2 border-t border-[#C1A477]/20">
                  {state?.performanceCurve?.map((pt) => (
                    <span key={pt.point}>{pt.point}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* TABBED POSITIONS, CLOSED TRADES, AUDIT HISTORY & ACADEMY */}
            <div className="space-y-3">
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 border-b border-[#C1A477]/20 text-xs font-sans">
                {[
                  { id: 'POSITIONS', label: `OPEN POSITIONS (${state?.openPositions?.length || 0})` },
                  { id: 'CLOSED', label: `CLOSED TRADES (${state?.closedTrades?.length || 0})` },
                  { id: 'HISTORY', label: `TRADE LOG (${state?.tradeHistory?.length || 0})` },
                  { id: 'ACADEMY', label: 'ACADEMY & RULES 🎓' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-3 border-b-2 font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#C1A477] text-[#FAF7F1]'
                        : 'border-transparent text-[#F0E8DC]/60 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OPEN POSITIONS */}
              {activeTab === 'POSITIONS' && (
                <div className="italian-card overflow-hidden bg-[#1A110E] border border-[#C1A477]/30 rounded-2xl shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-[#140C0A] text-[10px] text-[#C1A477] uppercase font-semibold">
                        <tr>
                          <th className="py-2.5 px-4">ASSET</th>
                          <th className="py-2.5 px-4 text-right">QUANTITY</th>
                          <th className="py-2.5 px-4 text-right">AVG COST</th>
                          <th className="py-2.5 px-4 text-right">MARKET PRICE</th>
                          <th className="py-2.5 px-4 text-right">CURRENT VALUE</th>
                          <th className="py-2.5 px-4 text-right">UNREALIZED P&L</th>
                          <th className="py-2.5 px-4 text-center">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#C1A477]/15">
                        {(!state?.openPositions || state.openPositions.length === 0) ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-[#F0E8DC]/60">
                              No open positions. Use the Order Ticket on the left to execute your first virtual trade!
                            </td>
                          </tr>
                        ) : (
                          state?.openPositions?.map((pos) => {
                            const isProfitable = pos.unrealizedPnl >= 0;
                            return (
                              <tr key={pos.id} className="hover:bg-[#211714]/60">
                                <td className="py-3 px-4 font-bold text-[#FAF7F1] flex items-center gap-2">
                                  <span>{pos.symbol}</span>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#211714] text-[#C1A477] border border-[#C1A477]/30">{pos.assetClass}</span>
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-bold text-[#FAF7F1]">{pos.quantity}</td>
                                <td className="py-3 px-4 text-right font-mono text-[#F0E8DC]/80">${pos.averageCost.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right font-mono font-bold text-[#FAF7F1]">${pos.currentPrice.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right font-mono font-bold text-[#C1A477]">${pos.marketValue.toLocaleString()}</td>
                                <td className={`py-3 px-4 text-right font-mono font-bold ${isProfitable ? 'text-[#C1A477]' : 'text-rose-400'}`}>
                                  {isProfitable ? '+' : ''}${pos.unrealizedPnl.toLocaleString()} ({isProfitable ? '+' : ''}{pos.unrealizedPnlPercent}%)
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() => handleClosePosition(pos)}
                                    className="text-xs font-sans text-rose-400 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/30 transition-colors"
                                  >
                                    Close
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: CLOSED TRADES */}
              {activeTab === 'CLOSED' && (
                <div className="italian-card overflow-hidden bg-[#1A110E] border border-[#C1A477]/30 rounded-2xl shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-[#140C0A] text-[10px] text-[#C1A477] uppercase font-semibold">
                        <tr>
                          <th className="py-2.5 px-4">TIMESTAMP</th>
                          <th className="py-2.5 px-4">SYMBOL</th>
                          <th className="py-2.5 px-4 text-right">QUANTITY</th>
                          <th className="py-2.5 px-4 text-right">EXIT PRICE</th>
                          <th className="py-2.5 px-4 text-right">REALIZED P&L</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#C1A477]/15">
                        {(!state?.closedTrades || state.closedTrades.length === 0) ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-[#F0E8DC]/60">
                              No closed trades recorded yet. Realized PnL is computed upon selling positions.
                            </td>
                          </tr>
                        ) : (
                          state?.closedTrades?.map((trade) => {
                            const isWin = trade.pnl >= 0;
                            return (
                              <tr key={trade.id} className="hover:bg-[#211714]/60">
                                <td className="py-3 px-4 text-[#F0E8DC]/60 text-[11px] font-mono">{new Date(trade.openedAt).toLocaleString()}</td>
                                <td className="py-3 px-4 font-bold text-[#FAF7F1]">{trade.symbol}</td>
                                <td className="py-3 px-4 text-right font-mono">{trade.quantity}</td>
                                <td className="py-3 px-4 text-right font-mono font-bold text-[#FAF7F1]">${trade.executionPrice.toLocaleString()}</td>
                                <td className={`py-3 px-4 text-right font-mono font-bold ${isWin ? 'text-[#C1A477]' : 'text-rose-400'}`}>
                                  {isWin ? '+' : ''}${trade.pnl.toLocaleString()} ({isWin ? '+' : ''}{trade.pnlPercentage}%)
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: COMPLETE AUDIT LOG */}
              {activeTab === 'HISTORY' && (
                <div className="italian-card overflow-hidden bg-[#1A110E] border border-[#C1A477]/30 rounded-2xl shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-[#140C0A] text-[10px] text-[#C1A477] uppercase font-semibold">
                        <tr>
                          <th className="py-2.5 px-4">TIMESTAMP</th>
                          <th className="py-2.5 px-4">ORDER TYPE</th>
                          <th className="py-2.5 px-4">SYMBOL</th>
                          <th className="py-2.5 px-4 text-right">QTY</th>
                          <th className="py-2.5 px-4 text-right">EXEC PRICE</th>
                          <th className="py-2.5 px-4 text-right">TOTAL COST</th>
                          <th className="py-2.5 px-4 text-center">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#C1A477]/15">
                        {(!state?.tradeHistory || state.tradeHistory.length === 0) ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-[#F0E8DC]/60">
                              No trade log entries yet.
                            </td>
                          </tr>
                        ) : (
                          state?.tradeHistory?.map((th) => (
                            <tr key={th.id} className="hover:bg-[#211714]/60">
                              <td className="py-2.5 px-4 text-[#F0E8DC]/60 text-[11px] font-mono">{new Date(th.openedAt).toLocaleString()}</td>
                              <td className="py-2.5 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${th.tradeType === 'BUY' ? 'bg-[#54252D] text-[#FAF7F1] border-[#C1A477]/40' : 'bg-[#211714] text-[#C1A477] border-[#C1A477]/30'}`}>
                                  {th.tradeType} ({th.orderType})
                                </span>
                              </td>
                              <td className="py-2.5 px-4 font-bold text-[#FAF7F1]">{th.symbol}</td>
                              <td className="py-2.5 px-4 text-right">{th.quantity}</td>
                              <td className="py-2.5 px-4 text-right">${th.executionPrice.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-right text-slate-200">${th.totalCost.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-center">
                                <Badge variant="cyan" dot className="text-[9px]">{th.status}</Badge>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: EDUCATIONAL ACADEMY */}
              {activeTab === 'ACADEMY' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlassPanel variant="default" className="p-5 space-y-2">
                    <h4 className="text-xs font-display font-bold text-valixen-ice uppercase flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      1. Market vs Limit Orders
                    </h4>
                    <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                      A <strong>Market Order</strong> executes immediately at the prevailing spot market rate with minimal slippage. A <strong>Limit Order</strong> enters the orderbook and only executes if the market price reaches your specified target price.
                    </p>
                  </GlassPanel>

                  <GlassPanel variant="default" className="p-5 space-y-2">
                    <h4 className="text-xs font-display font-bold text-valixen-violet uppercase flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      2. Position Sizing & The 2% Rule
                    </h4>
                    <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                      Professional risk managers never risk more than <strong>1% to 2%</strong> of total portfolio capital on any single setup. This ensures surviving a string of consecutive losses without jeopardizing overall equity.
                    </p>
                  </GlassPanel>

                  <GlassPanel variant="default" className="p-5 space-y-2">
                    <h4 className="text-xs font-display font-bold text-valixen-gold uppercase flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      3. Slippage & Orderbook Execution
                    </h4>
                    <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                      In live institutional markets, large orders sweep multiple liquidity levels, causing small execution price differences known as <strong>slippage</strong>. Our simulator automatically applies realistic 0.05% friction.
                    </p>
                  </GlassPanel>

                  <GlassPanel variant="default" className="p-5 space-y-2">
                    <h4 className="text-xs font-display font-bold text-white uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-valixen-telemetry-profit" />
                      4. Simulated vs Live Capital Psychology
                    </h4>
                    <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                      Paper trading is the gold standard for testing algorithmic hypotheses and establishing risk discipline. Remember: simulated profits must never be treated as guaranteed real-world income.
                    </p>
                  </GlassPanel>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="RESET SIMULATION SANDBOX"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsResetModalOpen(false)}>
              CANCEL
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isResetting}
              onClick={handleResetSimulator}
              className="bg-valixen-telemetry-risk hover:bg-valixen-telemetry-risk/90 font-mono text-xs"
            >
              CONFIRM RESET TO $100K
            </Button>
          </div>
        }
      >
        <p className="text-xs font-mono text-slate-300 leading-relaxed">
          This will purge all your virtual open positions, trade logs, and P&L history, resetting your paper portfolio back to the initial <strong>$100,000.00</strong> virtual starting cash.
        </p>
      </Modal>

      {/* LUXURY FOOTER */}
      <LuxuryFooter />
    </div>
  );
}
