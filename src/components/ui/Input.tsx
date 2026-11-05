// ==============================================================================
// VALIXEN DESIGN SYSTEM: HIGH-CONTRAST DATA INPUT
// ==============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  [key: string]: any;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, leftIcon, rightElement, disabled, ...props }: InputProps, ref: any) => {
    return (
      <div className="w-full space-y-1">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full h-11 rounded-xl bg-[#211714] border border-[#C1A477]/30 px-4 text-xs text-[#FAF7F1] placeholder:text-[#F0E8DC]/40 font-sans shadow-inner transition-all duration-200 focus:outline-none focus:border-[#C1A477] focus:ring-1 focus:ring-[#C1A477] disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightElement && 'pr-12',
              error && 'border-[#54252D] focus:border-[#54252D] focus:ring-[#54252D]',
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 text-slate-400 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p className="text-[11px] font-mono text-valixen-telemetry-risk pl-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
