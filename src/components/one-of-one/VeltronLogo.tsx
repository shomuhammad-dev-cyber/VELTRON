// ==============================================================================
// VELTRON BESPOKE LUXURY MONOGRAM & WORDMARK
// Exact recreation of the sharp winged \V/ chevron crest & luxury serif wordmark
// ==============================================================================

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface VeltronLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
}

export function VeltronLogo({
  size = 'md',
  showWordmark = true,
  showTagline = true,
  className,
  ...props
}: VeltronLogoProps) {
  const sizeMap = {
    sm: { symbol: 'w-7 h-7', text: 'text-lg', spacing: 'tracking-[0.24em]' },
    md: { symbol: 'w-8 h-8', text: 'text-xl', spacing: 'tracking-[0.28em]' },
    lg: { symbol: 'w-10 h-10', text: 'text-2xl', spacing: 'tracking-[0.32em]' },
    xl: { symbol: 'w-14 h-14', text: 'text-3xl', spacing: 'tracking-[0.36em]' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={cn('inline-flex items-center gap-3 select-none group', className)}
      {...props}
    >
      {/* Precision Double-Winged \V/ Crest Icon */}
      <svg
        className={cn(currentSize.symbol, 'shrink-0 transition-transform duration-300 group-hover:scale-105')}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="veltronWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5EDDE" />
            <stop offset="45%" stopColor="#C6A477" />
            <stop offset="100%" stopColor="#8C6E45" />
          </linearGradient>
          <linearGradient id="veltronInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E9DDCA" />
            <stop offset="100%" stopColor="#A88B5B" />
          </linearGradient>
        </defs>

        {/* Outer Left Wing */}
        <polygon
          points="8,10 18,10 32,54 22,54"
          fill="url(#veltronWingGrad)"
        />
        {/* Inner Left Wing Accent */}
        <polygon
          points="22,14 30,14 34,44 28,44"
          fill="url(#veltronInnerGrad)"
          opacity="0.85"
        />

        {/* Outer Right Wing */}
        <polygon
          points="56,10 46,10 32,54 42,54"
          fill="url(#veltronWingGrad)"
        />
        {/* Inner Right Wing Accent */}
        <polygon
          points="42,14 34,14 30,44 36,44"
          fill="url(#veltronInnerGrad)"
          opacity="0.85"
        />
      </svg>

      {/* VELTRON Luxury Serif Wordmark */}
      {showWordmark && (
        <span
          className={cn(
            'font-cormorant font-normal text-[#E9DDCA] leading-none uppercase',
            currentSize.text,
            currentSize.spacing
          )}
        >
          VELTRON
        </span>
      )}
    </div>
  );
}
