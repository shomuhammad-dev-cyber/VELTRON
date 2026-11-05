// ==============================================================================
// VELTRON ITALIAN ELEGANCE BUTTON SYSTEM
// Contemporary Classic Luxury Action Elements — Antique Gold & Deep Burgundy
// ==============================================================================

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center rounded-xl text-xs font-sans font-semibold tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C1A477] disabled:pointer-events-none disabled:opacity-50 select-none overflow-hidden group',
  {
    variants: {
      variant: {
        primary:
          'bespoke-btn-champagne text-[#1A110E] font-bold shadow-sm hover:brightness-105 active:scale-[0.98]',
        secondary:
          'bg-[#54252D] text-[#FAF7F1] font-semibold border border-[#C1A477]/40 hover:bg-[#54252D]/90 active:scale-[0.98]',
        glass:
          'bg-[#1A110E] border border-[#C1A477]/30 text-[#F0E8DC] hover:text-[#FAF7F1] hover:border-[#C1A477] active:scale-[0.98]',
        croc:
          'bg-[#1A110E] border border-[#C1A477]/30 text-[#F0E8DC] hover:text-[#FAF7F1] hover:border-[#C1A477] active:scale-[0.98]',
        outline:
          'border border-[#C1A477]/40 text-[#F0E8DC] hover:bg-[#211714] hover:border-[#C1A477] active:scale-[0.98]',
        ghost:
          'text-[#F0E8DC]/80 hover:text-[#FAF7F1] hover:bg-[#211714]',
        telemetry:
          'bg-[#211714] text-[#C1A477] border border-[#C1A477]/30 hover:border-[#C1A477]',
      },
      size: {
        sm: 'h-8 px-3.5 text-[11px] rounded-lg gap-1.5',
        md: 'h-10 px-5 py-2 gap-2',
        lg: 'h-12 px-8 text-xs rounded-xl gap-2.5',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }: ButtonProps, ref: any) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Specular sheen line on hover */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current mr-2" />
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
