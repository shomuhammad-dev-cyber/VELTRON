// ==============================================================================
// VELTRON LUXURY LANGUAGE SWITCHER DROPDOWN COMPONENT
// Elegant Black & Gold Horology Styling, 4-Language Flags & Instant Switch
// ==============================================================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n/LanguageContext';
import { SUPPORTED_LANGUAGES, Locale } from '@/lib/i18n/types';
import { soundSystem } from '@/lib/sound/MechanicalSoundSystem';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, isRtl } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES[locale] || SUPPORTED_LANGUAGES.uz;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Locale) => {
    soundSystem.playClick();
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left select-none', className)}>
      <button
        type="button"
        onClick={() => {
          soundSystem.playWinding();
          setIsOpen(!isOpen);
        }}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all duration-300',
          isOpen
            ? 'bg-valixen-gold/20 border-valixen-gold text-white shadow-[0_0_20px_rgba(212,175,55,0.3)]'
            : 'bg-[#0E1015]/80 hover:bg-[#151820] border-white/10 hover:border-valixen-gold/50 text-slate-300 hover:text-white'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Platform Language"
      >
        <Globe className="w-3.5 h-3.5 text-valixen-gold animate-[spin_30s_linear_infinite]" />
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline-block font-semibold tracking-wider uppercase text-[11px]">
          {currentLang.nativeName}
        </span>
        <span className="sm:hidden font-bold text-[11px] uppercase">{currentLang.code}</span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-valixen-gold/80 transition-transform duration-300',
            isOpen && 'rotate-180 text-valixen-gold'
          )}
        />
      </button>

      {/* Luxury Gold Glassmorphism Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute mt-2 w-48 rounded-2xl bg-[#0B0D12]/95 border border-valixen-gold/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(212,175,55,0.15)] backdrop-blur-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200',
            isRtl ? 'left-0' : 'right-0'
          )}
        >
          <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-valixen-gold/80 border-b border-white/[0.06] mb-1">
            SELECT LANGUAGE
          </div>

          <div className="space-y-1">
            {(Object.values(SUPPORTED_LANGUAGES) as typeof currentLang[]).map((lang) => {
              const isSelected = lang.code === locale;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all duration-200',
                    isSelected
                      ? 'bg-gradient-to-r from-valixen-gold/25 to-valixen-gold/10 text-white border border-valixen-gold/40 font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div className="text-left">
                      <div className="text-xs">{lang.nativeName}</div>
                      <div className="text-[9px] text-slate-500 uppercase">{lang.name}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-valixen-gold shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-white/[0.06] px-3 py-1 text-[9px] font-mono text-slate-500 text-center">
            VELTRON Horology i18n
          </div>
        </div>
      )}
    </div>
  );
}
