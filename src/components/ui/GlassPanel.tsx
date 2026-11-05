// ==============================================================================
// VALIXEN DESIGN SYSTEM: LIQUID TITANIUM GLASS PANEL
// Architectural building block for all dashboard interfaces
// ==============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'subtle' | 'default' | 'elevated' | 'prismatic' | 'croc';
  interactive?: boolean;
  specularEdge?: boolean;
  electricBorder?: boolean;
  glow?: 'none' | 'violet' | 'ice' | 'profit' | 'risk' | 'gold' | 'electric';
  className?: string;
  children?: React.ReactNode;
  key?: any;
}

export function GlassPanel({
  variant = 'default',
  interactive = false,
  specularEdge = true,
  electricBorder = false,
  glow = 'none',
  className,
  children,
  ...props
}: GlassPanelProps) {
  const variantStyles = {
    subtle: 'bg-[#020A07]/80 backdrop-blur-md border border-amber-400/20 shadow-lg',
    default: 'glass-panel',
    elevated: 'glass-panel-elevated',
    prismatic: 'glass-panel prism-border',
    croc: 'croc-card border border-amber-400/40 electric-border',
  };

  const glowStyles = {
    none: '',
    violet: 'hover:shadow-glow-violet hover:border-valixen-violet/40',
    ice: 'hover:shadow-glow-ice hover:border-valixen-ice/40',
    profit: 'hover:shadow-glow-profit hover:border-valixen-telemetry-profit/40',
    risk: 'hover:shadow-glow-risk hover:border-valixen-telemetry-risk/40',
    gold: 'hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:border-amber-400/80',
    electric: 'hover:shadow-[0_0_35px_rgba(255,215,0,0.5)] hover:border-amber-400/80',
  };

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300 ease-cinematic',
        variantStyles[variant],
        electricBorder && 'electric-border',
        specularEdge && 'glass-specular-edge',
        interactive && 'glass-panel-interactive cursor-pointer',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassPanelHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-white/[0.06] flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassPanelBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function GlassPanelFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-white/[0.06] bg-black/20 flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
