// ==============================================================================
// VELTRON DESIGN SYSTEM: QUANTUM LOADING & TELEMETRY SPINNERS
// Cinematic loaders: Prismatic Ring, Cybernetic Radar, and Shimmer Skeleton
// ==============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------------------
   1. PRISMATIC GRADIENT SPINNER
   ------------------------------------------------------------------------------ */

export interface PrismaticSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PrismaticSpinner({ size = 'md', className }: PrismaticSpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <div
        className={cn(
          'rounded-full border-t-valixen-ice border-r-valixen-violet border-b-transparent border-l-transparent animate-spin',
          sizeMap[size]
        )}
      />
      <div
        className={cn(
          'absolute inset-0 rounded-full blur-sm opacity-40 bg-gradient-to-tr from-valixen-violet to-valixen-ice pointer-events-none'
        )}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------------
   2. CYBERNETIC RADAR SCANNER
   ------------------------------------------------------------------------------ */

export interface RadarScannerProps {
  size?: number;
  label?: string;
  className?: string;
}

export function RadarScanner({ size = 120, label = 'QUANT ORACLE SCANNING...', className }: RadarScannerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className="relative rounded-full border border-valixen-violet/30 bg-valixen-obsidian-deep/80 overflow-hidden shadow-inner flex items-center justify-center"
      >
        {/* Concentric distance rings */}
        <div className="absolute inset-4 rounded-full border border-white/[0.06]" />
        <div className="absolute inset-8 rounded-full border border-white/[0.04]" />

        {/* Crosshair grid lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/[0.08]" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.08]" />

        {/* Rotating sweep cone */}
        <div
          className="absolute inset-0 origin-center animate-[spin_3s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 240, 255, 0.35) 360deg)',
          }}
        />

        {/* Center glowing focal point */}
        <div className="w-2.5 h-2.5 rounded-full bg-valixen-ice shadow-[0_0_12px_#00F0FF] z-10" />
      </div>

      {label && (
        <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------------
   3. SKELETON SHIMMER PLACEHOLDER
   ------------------------------------------------------------------------------ */

export interface SkeletonShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function SkeletonShimmer({
  width = 'w-full',
  height = 'h-4',
  rounded = 'md',
  className,
  ...props
}: SkeletonShimmerProps) {
  const roundedMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white/[0.04] border border-white/[0.03]',
        width,
        height,
        roundedMap[rounded],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}
