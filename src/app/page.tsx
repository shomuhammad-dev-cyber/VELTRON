// ==============================================================================
// VELTRON HOMEPAGE: STRICT RECREATION OF TARGET IMAGE 2
// Full-width cinematic hero with monumental marble sculpture & flowing burgundy silk
// Wide luxury dashboard placed directly below the hero (Left - Center - Right)
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React from 'react';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryHero } from '@/components/one-of-one/LuxuryHero';
import { WideDashboardSection } from '@/components/one-of-one/WideDashboardSection';
import { FinancialCard } from '@/components/one-of-one/FinancialCard';
import { LuxuryPillars } from '@/components/one-of-one/LuxuryPillars';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090706] text-[#E9DDCA] font-manrope selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. LUXURY REFINED NAVBAR */}
      <LuxuryNavbar />

      {/* 2. FULL-WIDTH CINEMATIC HERO (MONUMENTAL MARBLE SCULPTURE & LARGE VELTRON TYPOGRAPHY) */}
      <LuxuryHero />

      {/* 3. WIDE DASHBOARD PANEL DIRECTLY BELOW HERO (LEFT - CENTER - RIGHT LAYOUT) */}
      <WideDashboardSection />

      {/* 4. FOUR BESPOKE MATERIAL FINANCIAL CARDS (BURGUNDY, WALNUT, CHAMPAGNE, IVORY) */}
      <FinancialCard />

      {/* 5. FOUR PILLARS OF SOVEREIGN CAPITAL ARCHITECTURE */}
      <LuxuryPillars />

      {/* 6. LUXURY FOOTER */}
      <LuxuryFooter />
    </div>
  );
}
