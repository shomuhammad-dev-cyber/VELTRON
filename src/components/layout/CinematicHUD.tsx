// ==============================================================================
// VELTRON CINEMATIC HUD & SCROLL TELEMETRY CONTROLLER
// Luxury Horology Aesthetic — Precision Caliber Telemetry & Mechanical Acoustics
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { SoundController } from '@/components/ui/SoundController';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { mechanicalAudio } from '@/lib/sound/MechanicalSoundSystem';

export interface CinematicHUDProps {
  scrollProgress: number; // 0.0 to 1.0
  activeSceneIndex: number; // 0 to 6
  onJumpToScene: (index: number) => void;
  className?: string;
}

const SCENE_NAMES = [
  { index: 0, tag: '01', title: 'QUANTUM CORE', targetId: 'scene-hero' },
  { index: 1, tag: '02', title: 'AI ORACLE', targetId: 'scene-ai' },
  { index: 2, tag: '03', title: 'GLOBAL MARKETS', targetId: 'scene-markets' },
  { index: 3, tag: '04', title: 'SMART FINANCE', targetId: 'scene-finance' },
  { index: 4, tag: '05', title: 'QUANT ANALYTICS', targetId: 'scene-analytics' },
  { index: 5, tag: '06', title: 'ECOSYSTEM', targetId: 'scene-ecosystem' },
  { index: 6, tag: '07', title: 'VELTRON CORE', targetId: 'scene-final' },
];

export function CinematicHUD({
  scrollProgress = 0,
  activeSceneIndex = 0,
  onJumpToScene,
  className,
}: CinematicHUDProps) {
  const { t, isRtl } = useLanguage();

  // Calculate dynamic 3D telemetry coordinates
  const p = Math.max(0, Math.min(1, scrollProgress));
  const coordX = (Math.sin(p * Math.PI * 3) * 2.4).toFixed(2);
  const coordY = (Math.cos(p * Math.PI * 2) * 1.8).toFixed(2);
  const coordZ = (9.0 - p * 5.0 + (p > 0.85 ? (p - 0.85) * 45 : 0)).toFixed(2);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={cn('fixed inset-0 pointer-events-none z-40', className)}>
      {/* ------------------------------------------------------------------------
         1. TOP CINEMATIC HEADER BAR
         ------------------------------------------------------------------------ */}
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" onClick={() => mechanicalAudio.playClick()}>
            <Logo variant="main" size="md" />
          </Link>

          {/* Film Mode Watermark Badge with Crocodile Texture & Gold Aura */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full croc-badge border border-amber-400/50 text-[11px] font-mono text-gold-solid electric-border">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#D4AF37] animate-pulse" />
            <span>VELTRON QUANTUM INTELLIGENCE • INSTITUTIONAL CORE</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Scene Jump Button */}
          <a
            href="#scene-hero"
            onClick={() => mechanicalAudio.playClick()}
            className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs font-mono text-gold-solid hover:text-white croc-badge border border-amber-400/40 transition-colors"
          >
            SCENE {SCENE_NAMES[activeSceneIndex]?.tag} / 07
          </a>

          {/* Language Switcher & Sound System Controller */}
          <LanguageSwitcher />
          <SoundController />

          {/* Primary Action Button */}
          <Link
            href="/dashboard"
            onClick={() => mechanicalAudio.playClick()}
            className="px-4 py-2 rounded-xl text-xs font-mono font-extrabold text-black bg-gradient-to-r from-[#FFF0C2] via-[#E5BE53] to-[#B8860B] shadow-[0_0_20px_rgba(212,175,55,0.45)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] border border-amber-300/80 hover:brightness-110 transition-all duration-200 electric-border"
          >
            {t('nav.dashboard')} →
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------------------
         2. RIGHT VERTICAL SCENE SCRUBBER (7 SCENES)
         ------------------------------------------------------------------------ */}
      <nav
        aria-label="Scene Scrubber"
        className="hidden lg:flex flex-col items-end gap-3 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto select-none"
      >
        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase rotate-90 origin-right translate-x-3 mb-6">
          CALIBER TIMELINE
        </span>

        {SCENE_NAMES.map((scene) => {
          const isActive = activeSceneIndex === scene.index;
          return (
            <button
              key={scene.index}
              onClick={() => {
                mechanicalAudio.playClick();
                onJumpToScene(scene.index);
              }}
              className="group flex items-center gap-3 text-right focus:outline-none"
            >
              <span
                className={cn(
                  'text-[10px] font-mono tracking-wider transition-all duration-300 opacity-0 group-hover:opacity-100',
                  isActive ? 'opacity-100 text-valixen-gold font-bold' : 'text-slate-400'
                )}
              >
                {scene.tag} {scene.title}
              </span>

              <div
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300 relative',
                  isActive
                    ? 'w-3 h-3 bg-valixen-gold shadow-[0_0_12px_#D4AF37]'
                    : 'bg-white/20 group-hover:bg-white/60'
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-valixen-gold opacity-75" />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* ------------------------------------------------------------------------
         3. BOTTOM CINEMATIC TELEMETRY HUD BAR
         ------------------------------------------------------------------------ */}
      <footer className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 py-2.5 border-t border-amber-400/30 bg-[#020A07]/90 backdrop-blur-md flex items-center justify-between text-xs font-mono text-amber-200/80 pointer-events-auto">
        {/* Coordinates */}
        <div className="flex items-center gap-3">
          <span className="text-gold-solid font-bold">VELTRON HOROLOGY 3D</span>
          <span className="hidden sm:inline text-amber-400/40">|</span>
          <span className="hidden sm:inline text-amber-200/80">
            ESCAPEMENT [X: <strong className="text-gold-solid">{coordX}</strong>, Y: <strong className="text-gold-solid">{coordY}</strong>, Z: <strong className="text-gold-solid">{coordZ}</strong>]
          </span>
        </div>

        {/* Scroll Progress Bar & Percentage */}
        <div className="flex items-center gap-3">
          <div className="w-24 sm:w-36 h-1 rounded-full bg-black/40 border border-amber-400/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-150"
              style={{ width: `${Math.round(p * 100)}%` }}
            />
          </div>
          <span className="tabular-nums text-gold-solid font-bold text-[11px]">
            {Math.round(p * 100)}%
          </span>
        </div>

        {/* Network & Engine Telemetry */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-semibold hidden md:inline">CALIBER ACTIVE</span>
          </div>
          <span className="text-[10px] text-amber-400/70 hidden lg:inline">1 HZ ESCAPEMENT</span>
        </div>
      </footer>
    </div>
  );
}
