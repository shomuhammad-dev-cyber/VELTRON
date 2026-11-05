// ==============================================================================
// VELTRON ITALIAN ELEGANCE LOGO SYSTEM
// Milan Luxury Architecture & Sovereign Capital Emblem
// Palette: Espresso Brown (#241512), Deep Burgundy (#501E27), Warm Ivory (#E9DFCE), Antique Gold (#B49A72)
// ==============================================================================

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'main' | 'symbol' | 'monochrome' | 'appIcon' | 'favicon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export function Logo({
  variant = 'main',
  size = 'md',
  showTagline = true,
  className,
  ...props
}: LogoProps) {
  const sizeMap = {
    sm: { symbol: 'w-6 h-6', text: 'text-base', tagline: 'text-[8px]' },
    md: { symbol: 'w-8 h-8', text: 'text-xl', tagline: 'text-[9px]' },
    lg: { symbol: 'w-10 h-10', text: 'text-2xl', tagline: 'text-[10px]' },
    xl: { symbol: 'w-14 h-14', text: 'text-3xl', tagline: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  // Architectural Roman Arch & Sovereign V Keystone
  const renderGlyph = (isMono: boolean = false) => (
    <svg
      className={cn(currentSize.symbol, 'transition-transform duration-500 group-hover:scale-105')}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="vltArchBrass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4C09E" />
          <stop offset="50%" stopColor="#B49A72" />
          <stop offset="100%" stopColor="#8C7456" />
        </linearGradient>
      </defs>

      {/* Classical Arch Frame */}
      <rect
        x="2"
        y="2"
        width="56"
        height="56"
        rx="4"
        stroke={isMono ? '#FFFFFF' : 'url(#vltArchBrass)'}
        strokeWidth="1.2"
        opacity={isMono ? 0.9 : 0.65}
      />

      {/* Milanese Keystone & Arch */}
      <path
        d="M 16 44 L 16 26 C 16 18.268 22.268 12 30 12 C 37.732 12 44 18.268 44 26 L 44 44"
        stroke={isMono ? '#FFFFFF' : 'url(#vltArchBrass)'}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Monogram Sovereign Chevron V */}
      <path
        d="M 22 24 L 30 38 L 38 24"
        stroke={isMono ? '#FFFFFF' : '#E9DFCE'}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Keystone Dot */}
      <circle cx="30" cy="12" r="2" fill={isMono ? '#FFFFFF' : 'url(#vltArchBrass)'} />
      <line
        x1="12"
        y1="44"
        x2="48"
        y2="44"
        stroke={isMono ? '#FFFFFF' : 'url(#vltArchBrass)'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'symbol') {
    return <div {...props}>{renderGlyph(false)}</div>;
  }

  if (variant === 'monochrome') {
    return (
      <div className={cn('inline-flex items-center gap-3', className)} {...props}>
        {renderGlyph(true)}
        <span className={cn('font-italian-serif tracking-[0.22em] text-[#E9DFCE] uppercase', currentSize.text)}>
          VELTRON
        </span>
      </div>
    );
  }

  if (variant === 'appIcon') {
    return (
      <div
        className={cn(
          'relative rounded-xl p-2.5 bg-[#241512] border border-[#B49A72]/30 shadow-md flex items-center justify-center',
          className
        )}
        {...props}
      >
        {renderGlyph(false)}
      </div>
    );
  }

  // Default: Main Horizontal Lockup with Italian Luxury Typography
  return (
    <div className={cn('group inline-flex items-center gap-3.5 select-none', className)} {...props}>
      <div className="p-1 rounded bg-[#241512] border border-[#B49A72]/30 shadow-sm flex items-center justify-center">
        {renderGlyph(false)}
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            'font-italian-serif font-normal tracking-[0.22em] text-[#E9DFCE] uppercase leading-none group-hover:text-[#FAF7F2] transition-colors',
            currentSize.text
          )}
        >
          VELTRON
        </span>
        {showTagline && (
          <span
            className={cn(
              'font-sans uppercase tracking-[0.28em] text-[#B49A72] font-semibold mt-1',
              currentSize.tagline
            )}
          >
            Milano • Private Capital
          </span>
        )}
      </div>
    </div>
  );
}
