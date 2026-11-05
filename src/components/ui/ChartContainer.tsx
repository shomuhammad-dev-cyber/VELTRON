// ==============================================================================
// VELTRON ITALIAN ELEGANCE FINANCIAL CHART CONTAINER
// Contemporary Classic Luxury Chart Viewport — Antique Gold & Deep Burgundy
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Activity, BarChart2, Layers } from 'lucide-react';

export interface ChartContainerProps {
  title?: string;
  symbol?: string;
  currentPrice?: string | number;
  priceChange?: {
    value: string | number;
    isPositive: boolean;
  };
  timeframes?: string[];
  activeTimeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  children?: React.ReactNode;
  rightToolbar?: React.ReactNode;
  className?: string;
}

export function ChartContainer({
  title = 'AI PREDICTIVE MARKET VECTOR',
  symbol = 'BTC/EUR',
  currentPrice = '63,420.50',
  priceChange = { value: '4.82', isPositive: true },
  timeframes = ['1H', '1D', '1W', '1M', '1Y', 'ALL'],
  activeTimeframe = '1D',
  onTimeframeChange,
  children,
  rightToolbar,
  className,
}: ChartContainerProps) {
  const [selectedTf, setSelectedTf] = useState(activeTimeframe);

  const handleTfClick = (tf: string) => {
    setSelectedTf(tf);
    onTimeframeChange?.(tf);
  };

  return (
    <div
      className={cn(
        'italian-card flex flex-col rounded-2xl bg-[#1A110E] border border-[#C1A477]/30 text-[#F0E8DC] shadow-xl overflow-hidden',
        className
      )}
    >
      {/* Top Chart Header & Live Telemetry Bar */}
      <div className="px-6 py-4 border-b border-[#C1A477]/20 flex flex-wrap items-center justify-between gap-4">
        {/* Symbol & Price Overview */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#54252D]/40 border border-[#C1A477]/30 flex items-center justify-center text-[#C1A477]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bespoke-serif font-bold text-[#FAF7F1] text-lg tracking-wide">
                  {symbol}
                </span>
                <span className="text-[10px] font-sans tracking-widest text-[#C1A477] uppercase font-semibold">
                  {title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bespoke-serif font-bold text-[#FAF7F1] tracking-tight tabular-nums">
                  {currentPrice}
                </span>
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold border flex items-center gap-1',
                    priceChange.isPositive
                      ? 'bg-[#54252D] text-[#FAF7F1] border-[#C1A477]/40'
                      : 'bg-[#211714] text-[#F0E8DC]/70 border-[#C1A477]/20'
                  )}
                >
                  {priceChange.isPositive ? '↑ +' : '↓ -'}
                  {priceChange.value}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeframe Selector & Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-[#211714] border border-[#C1A477]/20">
            {timeframes.map((tf) => {
              const isActive = tf === selectedTf;
              return (
                <button
                  key={tf}
                  onClick={() => handleTfClick(tf)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-[#54252D] text-[#FAF7F1] border border-[#C1A477]/40 shadow-sm'
                      : 'text-[#F0E8DC]/60 hover:text-[#FAF7F1] hover:bg-[#1A110E]'
                  )}
                >
                  {tf}
                </button>
              );
            })}
          </div>

          {rightToolbar}
        </div>
      </div>

      {/* Main Chart Viewport Slot */}
      <div className="relative min-h-[360px] w-full p-6 flex flex-col justify-between overflow-hidden">
        {/* Chart Content Slot or Visual Placeholder */}
        <div className="relative z-10 w-full h-full flex-1 flex items-center justify-center">
          {children || (
            <div className="w-full h-72 flex flex-col items-center justify-center text-[#C1A477] space-y-3">
              <svg className="w-full h-48 stroke-[#C1A477]" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="chartGradientBrass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C1A477" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#54252D" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,150 Q100,120 150,140 T300,70 T450,90 T600,30 L600,200 L0,200 Z"
                  fill="url(#chartGradientBrass)"
                />
                <path
                  d="M0,150 Q100,120 150,140 T300,70 T450,90 T600,30"
                  fill="none"
                  strokeWidth="2.5"
                  className="stroke-[#C1A477]"
                />
              </svg>
              <span className="text-xs font-sans tracking-widest text-[#C1A477] uppercase font-semibold">
                MILANO BOURSE ALGORITHMIC VECTOR • REAL-TIME AUDITED TELEMETRY
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Chart Status Bar */}
      <div className="px-6 py-2.5 border-t border-[#C1A477]/20 bg-[#140C0A] flex items-center justify-between text-xs font-sans text-[#F0E8DC]/70">
        <div className="flex items-center gap-4">
          <span>VOLUME (24H): <strong className="text-[#FAF7F1]">€4.28B</strong></span>
          <span className="hidden sm:inline">HIGH: <strong className="text-[#C1A477]">€64,120.00</strong></span>
          <span className="hidden sm:inline">LOW: <strong className="text-[#F0E8DC]/80">€61,410.50</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C1A477] animate-pulse" />
          <span className="text-[#FAF7F1] font-semibold">LIVE INSTITUTIONAL FEED</span>
        </div>
      </div>
    </div>
  );
}
