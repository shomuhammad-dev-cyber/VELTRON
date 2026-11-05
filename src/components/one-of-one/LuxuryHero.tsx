// ==============================================================================
// VELTRON BESPOKE LUXURY HERO (EXACT RECREATION OF TARGET IMAGE)
// Desktop Height: ~410px, Compact, Seamless Transition to Dashboard
// LEFT: EXCLUSIVE FINANCIAL ECOSYSTEM eyebrow, VELTRON serif title,
//       Beyond Finance. A New Era. subtitle, description, 2 CTA buttons
// CENTER/RIGHT: Apollo classical sculpture in burgundy velvet silk & gold arch
// FAR RIGHT: Floating stats panel (1M+ Active Users, $5.2B+ Volume, 99.9% Uptime)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Info } from 'lucide-react';

export function LuxuryHero() {
  return (
    <section className="relative h-[415px] max-h-[415px] overflow-hidden bg-[#090706] text-[#E9DDCA] flex items-center select-none">
      {/* 1. Full-Width Background Monumental Apollo Bust & Sweeping Burgundy Silk */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="/images/hero-apollo-burgundy-bespoke.jpg"
          alt="VELTRON Apollo Sculpture with Burgundy Velvet Drapery"
          className="w-full h-full object-cover object-[72%_center] lg:object-right"
        />

        {/* Left Side Chiaroscuro Vignette to Guarantee Pristine Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090706] via-[#090706]/85 to-transparent w-full md:w-3/5 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090706] via-transparent to-[#090706]/40 z-10" />

        {/* Ambient Warm Golden Glow */}
        <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-[#C6A477]/10 rounded-full blur-[120px] z-10 pointer-events-none" />
      </div>

      {/* 2. Main Hero Content Container */}
      <div className="relative z-20 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Editorial Text & CTA Column */}
        <div className="max-w-xl flex flex-col items-start text-left">
          {/* Eyebrow: EXCLUSIVE FINANCIAL ECOSYSTEM */}
          <p className="text-[11px] font-manrope font-semibold tracking-[0.24em] text-[#C6A477] uppercase mb-2">
            EXCLUSIVE FINANCIAL ECOSYSTEM
          </p>

          {/* Large VELTRON Serif Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-cormorant font-normal text-transparent bg-clip-text bg-gradient-to-b from-[#FAF7F1] via-[#E8DCB8] to-[#BBA076] leading-[0.92] tracking-[0.06em] mb-2 drop-shadow-md">
            VELTRON
          </h1>

          {/* Subtitle: Beyond Finance. A New Era. */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cormorant leading-tight mb-2">
            <span className="italic font-normal text-[#EADBCA]">Beyond Finance. </span>
            <span className="not-italic font-normal text-[#C6A477]">A New Era.</span>
          </h2>

          {/* Description Paragraph */}
          <p className="text-xs sm:text-[13px] text-[#B8AAA0] max-w-lg font-manrope font-light leading-relaxed mb-6">
            Experience the ultimate fusion of luxury, technology and financial freedom. Your personal gateway to global markets.
          </p>

          {/* Two CTA Buttons */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            {/* Start Trading CTA Button with Arrow inside circle */}
            <Link
              href="/trading"
              className="px-6 py-2.5 rounded-full text-xs font-manrope font-semibold tracking-wider text-[#120E0D] bg-gradient-to-r from-[#D5B98D] via-[#C6A477] to-[#B49260] hover:brightness-110 shadow-[0_4px_24px_rgba(198,164,119,0.35)] flex items-center gap-2.5 group transition-all"
            >
              <span>Start Trading</span>
              <span className="w-5 h-5 rounded-full bg-[#120E0D] text-[#C6A477] flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            {/* Explore Platform CTA Button with Play inside circle */}
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-full text-xs font-manrope font-medium tracking-wider text-white bg-[#1A1310]/70 border border-[#C6A477]/40 hover:border-[#C6A477] hover:bg-[#1A1310] flex items-center gap-2.5 transition-all"
            >
              <span>Explore Platform</span>
              <span className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center text-white/80">
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Far Right: Floating Stats Panel (1M+ Active Users, $5.2B+ Volume, 99.9% Uptime) */}
        <div className="hidden xl:flex flex-col items-end gap-6 text-right">
          <div className="bg-[#0D0907]/60 backdrop-blur-md border border-[#C6A477]/20 rounded-2xl p-5 w-44 space-y-4 shadow-xl text-center">
            <div>
              <div className="text-2xl font-cormorant font-normal text-[#FAF7F1]">1M+</div>
              <div className="text-[10px] uppercase font-manrope tracking-wider text-[#A89888] mt-0.5">
                Active Users
              </div>
            </div>

            <div className="w-8 h-[1px] bg-[#C6A477]/20 mx-auto" />

            <div>
              <div className="text-2xl font-cormorant font-normal text-[#C6A477]">$5.2B+</div>
              <div className="text-[10px] uppercase font-manrope tracking-wider text-[#A89888] mt-0.5">
                Total Volume
              </div>
            </div>

            <div className="w-8 h-[1px] bg-[#C6A477]/20 mx-auto" />

            <div>
              <div className="text-2xl font-cormorant font-normal text-[#FAF7F1]">99.9%</div>
              <div className="text-[10px] uppercase font-manrope tracking-wider text-[#A89888] mt-0.5">
                Uptime
              </div>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-manrope text-[#A89888] pr-2">
            <span>Scroll Down</span>
            <Info className="w-3.5 h-3.5 text-[#C6A477]" />
          </div>
        </div>
      </div>
    </section>
  );
}
