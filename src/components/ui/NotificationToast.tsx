// ==============================================================================
// VALIXEN DESIGN SYSTEM: QUANT TELEMETRY NOTIFICATION TOAST
// Real-time financial alerts, order execution confirmations, and risk warnings
// ==============================================================================

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Activity, Sparkles } from 'lucide-react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'risk';

export interface ToastProps {
  id?: string;
  variant?: ToastVariant;
  title: string;
  message: string;
  timestamp?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export function NotificationToast({
  variant = 'info',
  title,
  message,
  timestamp = 'JUST NOW',
  action,
  onDismiss,
  className,
}: ToastProps) {
  const config = {
    info: {
      borderColor: 'border-valixen-ice/40',
      glow: 'shadow-[0_10px_30px_rgba(0,240,255,0.2)]',
      indicatorColor: 'bg-valixen-ice',
      textColor: 'text-valixen-ice',
    },
    success: {
      borderColor: 'border-valixen-telemetry-profit/40',
      glow: 'shadow-[0_10px_30px_rgba(0,229,153,0.2)]',
      indicatorColor: 'bg-valixen-telemetry-profit',
      textColor: 'text-valixen-telemetry-profit',
    },
    warning: {
      borderColor: 'border-valixen-telemetry-amber/40',
      glow: 'shadow-[0_10px_30px_rgba(245,158,11,0.2)]',
      indicatorColor: 'bg-valixen-telemetry-amber',
      textColor: 'text-valixen-telemetry-amber',
    },
    risk: {
      borderColor: 'border-valixen-telemetry-risk/40',
      glow: 'shadow-[0_10px_30px_rgba(255,51,102,0.25)]',
      indicatorColor: 'bg-valixen-telemetry-risk',
      textColor: 'text-valixen-telemetry-risk',
    },
  };

  const current = config[variant];

  return (
    <div
      className={cn(
        'relative w-full max-w-sm rounded-xl bg-valixen-obsidian-surface/95 backdrop-blur-2xl border p-4 transition-all duration-300 ease-cinematic',
        current.borderColor,
        current.glow,
        className
      )}
    >
      {/* Specular Top Sheen */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex items-start gap-3">
        {/* Glowing Indicator Pill */}
        <span
          className={cn(
            'w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-sm animate-pulse',
            current.indicatorColor
          )}
        />

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className={cn('text-xs font-mono font-bold tracking-wide uppercase', current.textColor)}>
              {title}
            </h4>
            <span className="text-[10px] font-mono text-slate-500">{timestamp}</span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">{message}</p>

          {action && (
            <div className="pt-2">
              <button
                onClick={action.onClick}
                className="text-xs font-mono font-semibold text-white underline underline-offset-4 hover:text-valixen-ice transition-colors"
              >
                {action.label} →
              </button>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-md text-slate-500 hover:text-white transition-colors"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
