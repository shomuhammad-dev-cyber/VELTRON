// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY LOGO SYSTEM
// Inspired by Rolls-Royce Cullinan Mansory 1 of 1 Bespoke Craftsmanship
// Palette: Deep Espresso (#211714), Royal Burgundy (#54252D), Champagne Gold (#C1A477), Warm Ivory (#F0E8DC)
// ==============================================================================

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BespokeLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'main' | 'symbol' | 'monochrome' | 'vertical';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export function BespokeLogo({
  variant = 'main',
  size = 'md',
  showTagline = true,
  className,
  ...props
}: BespokeLogoProps) {
  const sizeMap = {
    sm: { symbol: 'w-7 h-7', text: 'text-base', tagline: 'text-[8px]', spacing: 'tracking-[0.28em]' },
    md: { symbol: 'w-9 h-9', text: 'text-xl', tagline: 'text-[9px]', spacing: 'tracking-[0.32em]' },
    lg: { symbol: 'w-12 h-12', text: 'text-2xl', tagline: 'text-[10px]', spacing: 'tracking-[0.35em]' },
    xl: { symbol: 'w-16 h-16', text: 'text-3xl', tagline: 'text-xs', spacing: 'tracking-[0.4em]' },
  };

  const currentSize = sizeMap[size];

  // Bespoke Sovereign Emblem: Mansory / Rolls-Royce 1 of 1 Spirit Monogram
  const renderEmblem = () => (
    <svg
      className={cn(currentSize.symbol, 'transition-transform duration-500 group-hover:scale-105 shrink-0')}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bespokeChampagne" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2CEAC" />
          <stop offset="45%" stopColor="#C1A477" />
          <stop offset="100%" stopColor="#9C8058" />
        </linearGradient>
        <linearGradient id="bespokeBurgundy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B2E37" />
          <stop offset="100%" stopColor="#3D181E" />
        </linearGradient>
        <radialGradient id="bespokeShieldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C1A477" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C1A477" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle Ambient Radial Highlight */}
      <circle cx="32" cy="32" r="30" fill="url(#bespokeShieldGlow)" />

      {/* Precision Octagonal Sovereign Shield / Bezel */}
      <polygon
        points="32,4 58,14 58,50 32,60 6,50 6,14"
        fill="none"
        stroke="url(#bespokeChampagne)"
        strokeWidth="1.2"
        opacity="0.85"
      />

      {/* Twin Coachline Inset Border */}
      <polygon
        points="32,8 54,16.5 54,47.5 32,56 10,47.5 10,16.5"
        fill="url(#bespokeBurgundy)"
        fillOpacity="0.45"
        stroke="url(#bespokeChampagne)"
        strokeWidth="0.8"
        strokeDasharray="2 2"
        opacity="0.6"
      />

      {/* Sovereign Chevron Crown 'V' Monogram */}
      <path
        d="M 20 22 L 32 46 L 44 22"
        stroke="url(#bespokeChampagne)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Precision Vertical Scepter / Balance Axis */}
      <line
        x1="32"
        y1="16"
        x2="32"
        y2="36"
        stroke="#F0E8DC"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Bespoke 1 of 1 Crown Diamond Crest */}
      <circle cx="32" cy="14" r="2.2" fill="url(#bespokeChampagne)" />
      <circle cx="20" cy="22" r="1.5" fill="#FAF7F1" />
      <circle cx="44" cy="22" r="1.5" fill="#FAF7F1" />
    </svg>
  );

  if (variant === 'symbol') {
    return (
      <div className={cn('inline-flex items-center justify-center', className)} {...props}>
        {renderEmblem()}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('flex flex-col items-center text-center gap-2 group cursor-pointer', className)} {...props}>
        {renderEmblem()}
        <div>
          <span className={cn('font-bespoke-serif tracking-[0.25em] font-medium text-[#FAF7F1] block', currentSize.text)}>
            VELTRON
          </span>
          {showTagline && (
            <span className={cn('font-sans font-medium uppercase text-[#C1A477] tracking-[0.3em] block mt-0.5', currentSize.tagline)}>
              BESPOKE ROYAL LUXURY • 1 OF 1
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-3.5 group cursor-pointer select-none', className)} {...props}>
      {renderEmblem()}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={cn('font-bespoke-serif tracking-[0.22em] font-semibold text-[#FAF7F1] leading-none', currentSize.text)}>
            VELTRON
          </span>
          <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-[#54252D]/60 border border-[#C1A477]/40 text-[#C1A477] uppercase tracking-wider font-semibold">
            1 OF 1
          </span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={cn('font-sans font-medium uppercase text-[#C1A477] leading-none', currentSize.tagline, currentSize.spacing)}>
              ROYAL FINANCIAL CRAFTSMANSHIP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
