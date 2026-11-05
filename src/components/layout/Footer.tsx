// ==============================================================================
// VELTRON ITALIAN ELEGANCE FOOTER
// Milanese Editorial Architecture & Contemporary Classic Luxury
// Palette: Espresso Brown (#241512), Deep Burgundy (#501E27), Warm Ivory (#E9DFCE), Antique Gold (#B49A72)
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="border-t border-[#B49A72]/20 bg-[#1A0F0D] pt-16 pb-12 px-4 md:px-8 text-[#E9DFCE]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-[#E9DFCE]/75 max-w-sm leading-relaxed font-sans">
              VELTRON — The Architecture of Sovereign Wealth. Milan editorial design, Calacatta marble, and disciplined institutional fintech. Dispassionate AI wealth intelligence with zero speculative noise.
            </p>
            <div className="text-[11px] font-sans tracking-widest text-[#B49A72] uppercase">
              MILANO • TIER-1 INSTITUTIONAL ARCHITECTURE
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-sans">
            <div className="space-y-3">
              <span className="text-[#B49A72] text-[11px] uppercase tracking-widest font-semibold block">
                Sovereign Pillars
              </span>
              <ul className="space-y-2 text-[#E9DFCE]/70">
                <li><Link href="/dashboard" className="hover:text-[#FAF7F2] transition-colors">Executive Ledger</Link></li>
                <li><Link href="/wallet" className="hover:text-[#FAF7F2] transition-colors">Travertine Vaults</Link></li>
                <li><Link href="/trading" className="hover:text-[#FAF7F2] transition-colors">Paper Trading</Link></li>
                <li><Link href="/ai-assistant" className="hover:text-[#FAF7F2] transition-colors">Cognitive Oracle</Link></li>
                <li><Link href="/education" className="hover:text-[#FAF7F2] transition-colors">Accademia Di Finanza</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[#B49A72] text-[11px] uppercase tracking-widest font-semibold block">
                Market Telemetry
              </span>
              <ul className="space-y-2 text-[#E9DFCE]/70">
                <li><Link href="/markets" className="hover:text-[#FAF7F2] transition-colors">Milano Bourse Explorer</Link></li>
                <li><Link href="/transactions" className="hover:text-[#FAF7F2] transition-colors">Audited Ledger</Link></li>
                <li><Link href="/ranking" className="hover:text-[#FAF7F2] transition-colors">Merit Ranking</Link></li>
                <li><Link href="/settings" className="hover:text-[#FAF7F2] transition-colors">Security & Access</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[#B49A72] text-[11px] uppercase tracking-widest font-semibold block">
                Governance
              </span>
              <ul className="space-y-2 text-[#E9DFCE]/70">
                <li><Link href="/admin" className="hover:text-[#FAF7F2] transition-colors">Enterprise Portal</Link></li>
                <li><Link href="/privacy" className="hover:text-[#FAF7F2] transition-colors">Discretion Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#FAF7F2] transition-colors">Terms of Custody</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#B49A72]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-[#B49A72] gap-4">
          <div>
            &copy; {new Date().getFullYear()} VELTRON PRIVATE CAPITAL MILANO. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 text-[#E9DFCE]/60">
            <span>DISCREET CRYPTOGRAPHIC ENCRYPTION</span>
            <span>•</span>
            <span className="text-[#B49A72]">SYSTEM SOLVENCY: OPTIMAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
