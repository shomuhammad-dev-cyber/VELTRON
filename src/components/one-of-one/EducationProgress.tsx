// ==============================================================================
// VELTRON ONE OF ONE EDUCATION PROGRESS PANEL
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowRight, Award, CheckCircle2 } from 'lucide-react';

export function EducationProgress() {
  const modules = [
    { title: 'Sovereign Wealth Architecture', progress: 80, status: '80% Bajarildi' },
    { title: 'Quantitative Risk Management', progress: 65, status: '65% Bajarildi' },
    { title: 'Paper Market Order Execution', progress: 40, status: '40% Bajarildi' },
    { title: 'Macro Travertine Reserves', progress: 10, status: 'Boshlanmoqda' },
  ];

  return (
    <div className="oneofone-panel p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-manrope text-[#C6A477] tracking-wider uppercase font-semibold">
            <GraduationCap className="w-4 h-4 text-[#C6A477]" />
            <span>ROYAL ACADEMY CURRICULUM</span>
          </div>
          <span className="text-[10px] font-manrope px-2 py-0.5 rounded-full bg-[#481B24] border border-[#C6A477]/30 text-[#FAF7F1]">
            TIER-1 DIPLOMA
          </span>
        </div>

        <h3 className="text-xl font-cormorant font-semibold text-[#FAF7F1] mb-2">
          Pedagogik Ta’lim Modullari
        </h3>
        <p className="text-xs text-[#E9DDCA]/70 font-manrope mb-6">
          Klassik institutsional moliya va algoritmli savdo strategiyalari.
        </p>

        <div className="space-y-4">
          {modules.map((m, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#170F0D] border border-[#C6A477]/20">
              <div className="flex justify-between text-xs font-manrope mb-1.5">
                <span className="font-medium text-[#FAF7F1]">{m.title}</span>
                <span className="text-[#C6A477] font-mono text-[11px]">{m.status}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#090706]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#C6A477] to-[#DECCAE]"
                  style={{ width: `${m.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-[#C6A477]/15 mt-6">
        <Link
          href="/education"
          className="w-full py-2.5 rounded-xl text-xs font-manrope font-semibold oneofone-btn-burgundy flex items-center justify-center gap-2"
        >
          <span>Darslarni Davom Ettirish</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
