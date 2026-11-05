// ==============================================================================
// VELTRON ITALIAN ELEGANCE STAT CARD
// Contemporary Classic Luxury Financial Metric Card
// Palette: Espresso Brown (#211714), Deep Burgundy (#54252D), Warm Ivory (#F0E8DC), Antique Gold (#C1A477)
// ==============================================================================

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  change?: {
    value: string | number;
    isPositive: boolean;
    period?: string;
  };
  subtitle?: string;
  sparklineData?: number[];
  icon?: React.ReactNode;
  glow?: 'none' | 'violet' | 'ice' | 'profit' | 'risk';
  className?: string;
}

export function StatCard({
  title,
  value,
  prefix = '$',
  suffix = '',
  change,
  subtitle,
  sparklineData,
  icon,
  glow = 'none',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'italian-card p-6 relative group rounded-2xl border border-[#C1A477]/30 bg-[#1A110E] text-[#F0E8DC] transition-all duration-300 hover:border-[#C1A477] shadow-md',
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-[11px] font-sans tracking-widest text-[#C1A477] font-semibold uppercase">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-[#54252D]/40 border border-[#C1A477]/30 text-[#C1A477] shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* Numerical Financial Value */}
      <div className="flex items-baseline gap-1 my-2">
        {prefix && (
          <span className="text-xl font-bespoke-serif text-[#C1A477] font-medium">{prefix}</span>
        )}
        <span className="text-3xl lg:text-4xl font-bespoke-serif font-bold text-[#FAF7F1] tracking-tight tabular-nums">
          {value}
        </span>
        {suffix && (
          <span className="text-sm font-sans text-[#F0E8DC]/70 font-medium ml-1">{suffix}</span>
        )}
      </div>

      {/* Delta Badge & Subtitle */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#C1A477]/20 mt-4">
        {change && (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-sans font-semibold border flex items-center gap-1',
                change.isPositive
                  ? 'bg-[#54252D] text-[#FAF7F1] border-[#C1A477]/40'
                  : 'bg-[#211714] text-[#F0E8DC]/70 border-[#C1A477]/20'
              )}
            >
              <span>{change.isPositive ? '↑' : '↓'}</span>
              <span>{typeof change.value === 'string' && (change.value.startsWith('+') || change.value.startsWith('-')) ? change.value : `${change.isPositive ? '+' : ''}${change.value}%`}</span>
            </span>
            {change.period && (
              <span className="text-[11px] font-sans text-[#F0E8DC]/50">{change.period}</span>
            )}
          </div>
        )}

        {subtitle && (
          <span className="text-[11px] font-sans text-[#F0E8DC]/60 truncate ml-auto">
            {subtitle}
          </span>
        )}
      </div>

      {/* Optional Mini Progress / Sparkline Bar */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-4 flex items-end gap-1 h-6 pt-2">
          {sparklineData.map((val, idx) => {
            const heightPercent = Math.max(15, Math.min(100, val));
            return (
              <div
                key={idx}
                style={{ height: `${heightPercent}%` }}
                className={cn(
                  'flex-1 rounded-t-sm transition-all duration-300',
                  change?.isPositive
                    ? 'bg-[#C1A477]/50 hover:bg-[#C1A477]'
                    : 'bg-[#54252D]/50 hover:bg-[#54252D]'
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
