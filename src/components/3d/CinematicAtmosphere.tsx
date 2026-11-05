// ==============================================================================
// VELTRON LUXURY CROCODILE LEATHER & HIGH-VOLTAGE ELECTRIC AURA SYSTEM
// Deep Emerald Reptile Skin, Electric Green Arcs, Champagne Gold Lightning & Filmic Vignette
// ==============================================================================

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CinematicAtmosphereProps {
  scrollProgress: number; // 0.0 to 1.0
  className?: string;
}

export function CinematicAtmosphere({ scrollProgress = 0, className }: CinematicAtmosphereProps) {
  const p = Math.max(0, Math.min(1, scrollProgress));

  // Dynamic coordinates calculated from scroll progression
  const arcX = 20 + Math.sin(p * Math.PI * 2) * 25; // 20% to 45%
  const arcY = 15 + p * 35; // 15% to 50%

  const goldOrbX = 75 - Math.cos(p * Math.PI * 2) * 20;
  const goldOrbY = 25 + Math.sin(p * Math.PI * 3) * 25;

  const electricIntensity = 0.45 + Math.sin(p * Math.PI * 3) * 0.3;

  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none', className)}
      aria-hidden="true"
    >
      {/* 1. Deep Forest Emerald Onyx Base (#020A07) */}
      <div className="absolute inset-0 bg-[#020A07]" />

      {/* 2. AUTHENTIC HIGH-RESOLUTION CROCODILE LEATHER TEXTURE LAYER */}
      <div
        className="absolute inset-0 opacity-45 transition-transform duration-1000 ease-out will-change-transform"
        style={{
          backgroundImage: "url('/images/croc-leather-green.png')",
          backgroundSize: '850px auto',
          backgroundRepeat: 'repeat',
          filter: 'contrast(1.25) brightness(0.65) saturate(1.15)',
          transform: `scale(${1.02 + p * 0.05}) translateY(${-(p * 80) % 850}px)`,
        }}
      />

      {/* 3. Deep Radial Gradient Center Lighting (Warm Gold Vignette) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 85% 60% at 50% 25%, rgba(212, 175, 55, 0.06) 0%, rgba(4, 24, 16, 0.65) 50%, rgba(2, 10, 7, 0.96) 90%, #020A07 100%)
          `,
        }}
      />

      {/* 4. Warm Amber Gold Ambient Nebula (No Harsh Green) */}
      <div
        className="absolute rounded-full blur-[140px] transition-transform duration-700 ease-out will-change-transform"
        style={{
          width: '60vw',
          height: '60vh',
          left: `${arcX - 30}%`,
          top: `${arcY - 30}%`,
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(180, 130, 10, 0.05) 50%, transparent 75%)',
        }}
      />

      {/* 5. Pure Champagne Gold Radiance Halo (Tillarang Kvant Yog'dusi) */}
      <div
        className="absolute rounded-full blur-[160px] transition-transform duration-1000 ease-out will-change-transform"
        style={{
          width: '55vw',
          height: '55vh',
          left: `${goldOrbX - 27.5}%`,
          top: `${goldOrbY - 27.5}%`,
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.18) 0%, rgba(212, 175, 55, 0.08) 45%, transparent 75%)',
        }}
      />

      {/* 6. Pure Golden Filament Ray (Yumshoq Oltin Nurlar) */}
      <div
        className="absolute top-[38%] left-0 right-0 h-[1.5px] transition-all duration-300 ease-out"
        style={{
          opacity: 0.35 + electricIntensity * 0.35,
          background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.2) 20%, rgba(255, 225, 120, 0.85) 50%, rgba(212, 175, 55, 0.3) 80%, transparent 100%)',
          filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6)) blur(0.5px)',
          transform: `translateY(${(p - 0.5) * 140}px)`,
        }}
      />

      {/* Secondary Lower Golden Ray Wave */}
      <div
        className="absolute bottom-[28%] left-0 right-0 h-[1px] transition-all duration-500 ease-out"
        style={{
          opacity: 0.25 + Math.cos(p * Math.PI * 4) * 0.15,
          background: 'linear-gradient(90deg, transparent 5%, rgba(212, 175, 55, 0.4) 35%, rgba(255, 215, 0, 0.6) 65%, transparent 95%)',
          filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.6)) blur(0.5px)',
          transform: `translateY(${-(p - 0.5) * 80}px)`,
        }}
      />

      {/* 7. Floating Pure Gold Light Zarrachalari */}
      <div className="absolute inset-0 opacity-50">
        {[
          { x: '10%', y: '16%', s: 2.5, c: '#FFD700' },
          { x: '22%', y: '38%', s: 2, c: '#F5D77F' },
          { x: '35%', y: '14%', s: 2.5, c: '#E5C158' },
          { x: '50%', y: '32%', s: 2.5, c: '#FFE082' },
          { x: '68%', y: '18%', s: 2, c: '#FFD700' },
          { x: '85%', y: '34%', s: 2.5, c: '#F5D77F' },
          { x: '15%', y: '74%', s: 2.5, c: '#FFD700' },
          { x: '30%', y: '82%', s: 2, c: '#FFE082' },
          { x: '62%', y: '75%', s: 2.5, c: '#F5D77F' },
          { x: '88%', y: '65%', s: 2, c: '#E5C158' },
          { x: '45%', y: '60%', s: 3, c: '#FFD700' },
        ].map((pt, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: pt.x,
              top: pt.y,
              width: `${pt.s}px`,
              height: `${pt.s}px`,
              backgroundColor: pt.c,
              boxShadow: `0 0 8px ${pt.c}, 0 0 16px ${pt.c}`,
              animationDelay: `${(i * 0.4) % 3}s`,
              animationDuration: `${2.5 + (i % 3)}s`,
              transform: `translateY(${-(p * 90 * (0.6 + (i % 4) * 0.2))}px)`,
            }}
          />
        ))}
      </div>

      {/* 8. Top Golden Edge Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 20%, rgba(255, 215, 0, 0.9) 50%, rgba(212, 175, 55, 0.3) 80%, transparent 100%)',
          boxShadow: '0 0 10px rgba(212, 175, 55, 0.6)',
        }}
      />

      {/* 9. Dark Filmic Perimeter Vignette (Ensures ultra-sharp readability for Gold text) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(2, 10, 7, 0.65) 70%, #010604 100%)',
        }}
      />
    </div>
  );
}
