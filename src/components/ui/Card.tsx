// ==============================================================================
// VALIXEN DESIGN SYSTEM: LIQUID TITANIUM FROSTED GLASS CARD
// ==============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowOnHover?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  children?: React.ReactNode;
}

export function Card({
  className,
  children,
  glowOnHover = true,
  intensity = 'medium',
  ...props
}: CardProps) {
  const intensityMap = {
    low: 'bg-[#0E121B]/60 backdrop-blur-md border-white/5',
    medium: 'bg-gradient-to-b from-[#141A26]/80 to-[#07090E]/90 backdrop-blur-xl border-white/[0.08]',
    high: 'bg-gradient-to-b from-[#1E2536]/80 via-[#0E121B]/90 to-[#07090E] backdrop-blur-2xl border-white/15',
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 border shadow-glass-card transition-all duration-300 overflow-hidden',
        intensityMap[intensity],
        glowOnHover && 'hover:border-valixen-violet/30 hover:shadow-glow-violet hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {/* Subtle top specular glass highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-bold font-display text-white tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-slate-400 font-sans', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pt-2', className)} {...props}>
      {children}
    </div>
  );
}
