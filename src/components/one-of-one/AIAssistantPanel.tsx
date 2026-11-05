// ==============================================================================
// VELTRON ONE OF ONE AI ASSISTANT PANEL
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function AIAssistantPanel() {
  return (
    <div className="oneofone-panel-burgundy p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-manrope text-[#C6A477] tracking-wider uppercase font-semibold">
            <Sparkles className="w-4 h-4 text-[#C6A477]" />
            <span>COGNITIVE ORACLE AI</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#170F0D] border border-[#C6A477]/30 text-[#C6A477]">
            LATENCY: 4.2ms
          </span>
        </div>

        <h3 className="text-2xl font-cormorant font-semibold text-[#FAF7F1] mb-3">
          Kognitiv Moliya Oracli
        </h3>
        <p className="text-xs text-[#E9DDCA]/80 font-manrope leading-relaxed mb-6">
          Real-vaqt bozor oqimlari va makroiqtisodiy CBU tendensiyalarini tahlil qiluvchi neyron sun’iy intellekt maslahatchisi.
        </p>

        {/* AI Insight Box */}
        <div className="p-4 rounded-xl bg-[#090706]/80 border border-[#C6A477]/30 space-y-2 mb-6">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#C6A477]">
            <Zap className="w-3.5 h-3.5" />
            <span>SOVEREIGN STRATEGY RECOMMENDATION:</span>
          </div>
          <p className="text-xs text-[#E9DDCA]/90 font-manrope leading-relaxed">
            "BTC/USD $68,400 darajasida konsolidatsiyalashmoqda. Portfel riskini pasaytirish maqsadida 15% hajmni XAU Spot oltiniga yo‘naltirish maqbul hisoblanadi."
          </p>
        </div>
      </div>

      <Link
        href="/ai-assistant"
        className="w-full py-3 rounded-xl text-xs font-manrope font-semibold oneofone-btn-gold flex items-center justify-center gap-2"
      >
        <span>Oracle Bilan Muloqot Qilish</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
