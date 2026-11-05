// ==============================================================================
// VALIXEN DESIGN SYSTEM: QUANT TELEMETRY BADGE
// ==============================================================================

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide border select-none transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-valixen-violet/15 text-valixen-violet-light border-valixen-violet/30',
        ice: 'bg-valixen-ice/15 text-valixen-ice border-valixen-ice/30',
        profit: 'bg-valixen-telemetry-profit/15 text-valixen-telemetry-profit border-valixen-telemetry-profit/30',
        risk: 'bg-valixen-telemetry-risk/15 text-valixen-telemetry-risk border-valixen-telemetry-risk/30',
        amber: 'bg-valixen-telemetry-amber/15 text-valixen-telemetry-amber border-valixen-telemetry-amber/30',
        neutral: 'bg-white/5 text-slate-300 border-white/10',
        gold: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-600/20 text-[#F5D77F] border-amber-400/60 shadow-[0_0_12px_rgba(212,175,55,0.35)]',
        croc: 'croc-badge text-[#F5D77F] border-amber-400/70 shadow-[0_0_15px_rgba(212,175,55,0.35)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'ice' | 'profit' | 'risk' | 'amber' | 'neutral' | string;
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
}
