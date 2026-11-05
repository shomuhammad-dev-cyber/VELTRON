// ==============================================================================
// VELTRON ONE OF ONE LUXURY FOOTER
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { VeltronLogo } from './VeltronLogo';

export function LuxuryFooter() {
  return (
    <footer className="bg-[#090706] border-t border-[#C6A477]/25 py-16 text-[#E9DDCA]/80 font-manrope">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-[#C6A477]/20">
          <VeltronLogo size="md" />

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-[#E9DDCA]/80">
            <Link href="/dashboard" className="hover:text-[#FAF7F1] transition-colors">
              Executive Cockpit
            </Link>
            <Link href="/trading" className="hover:text-[#FAF7F1] transition-colors">
              Paper Terminal
            </Link>
            <Link href="/wallet" className="hover:text-[#FAF7F1] transition-colors">
              Cold Vaults
            </Link>
            <Link href="/education" className="hover:text-[#FAF7F1] transition-colors">
              Royal Academy
            </Link>
            <Link href="/ai-assistant" className="hover:text-[#FAF7F1] transition-colors">
              Cognitive Oracle
            </Link>
            <Link href="/analytics" className="hover:text-[#FAF7F1] transition-colors">
              Capital Analytics
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#E9DDCA]/50">
          <p>© 2026 VELTRON ONE OF ONE BESPOKE LUXURY. Barcha huquqlar himoyalangan.</p>
          <p className="text-[#C6A477]/80">Rolls-Royce Cullinan Mansory 1 of 1 Bespoke Craftsmanship Inspiration</p>
        </div>
      </div>
    </footer>
  );
}
