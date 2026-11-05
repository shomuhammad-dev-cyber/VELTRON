// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY SETTINGS & SECURITY HUB (/settings)
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import {
  User,
  Shield,
  Bell,
  Globe,
  Lock,
  Smartphone,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'UZS'>('USD');
  const [language, setLanguage] = useState<'uz' | 'en' | 'ru'>('uz');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [telegramAlerts, setTelegramAlerts] = useState(true);
  const [marketDigest, setMarketDigest] = useState(true);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#090706] text-[#FAF7F1] flex flex-col font-sans selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Refined Luxury Navbar */}
      <LuxuryNavbar />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[#C6A477]/20 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#54252D]/40 border border-[#C6A477]/30 text-[10px] font-mono text-[#C6A477] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Xavfsizlik & Shaxsiy Sozlamalar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF7F1] tracking-wide">
            PLATFORMA SOZLAMALARI
          </h1>
          <p className="text-sm text-[#C7BAA7] mt-1.5 max-w-2xl leading-relaxed">
            Shaxsiy profil, Telegram bildirishnomalari, valyuta ko‘rinishi va yuqori darajadagi 2FA xavfsizlik boshqaruvi.
          </p>
        </div>

        {/* Success Toast */}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-[#1A110E] border border-[#3DD898]/40 text-xs font-sans text-[#FAF7F1] flex items-center gap-2.5 shadow-xl animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#3DD898] shrink-0" />
            <span>Sozlamalaringiz muvaffaqiyatli saqlandi va sinxronlashtirildi.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Nav Menu */}
          <div className="space-y-1.5">
            {[
              { id: 'profile', label: 'Shaxsiy Profil', icon: User },
              { id: 'security', label: 'Xavfsizlik & 2FA', icon: Shield },
              { id: 'notifications', label: 'Telegram & Xabarlar', icon: Bell },
              { id: 'preferences', label: 'Valyuta & Til', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono transition-all text-left ${
                    isActive
                      ? 'bg-[#1A110E] border border-[#C6A477]/40 text-[#C6A477] shadow-[0_4px_15px_rgba(198,164,119,0.15)] font-bold'
                      : 'text-[#C7BAA7] hover:text-[#FAF7F1] hover:bg-[#1A110E]/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </div>

          {/* Right Content Panel */}
          <div className="md:col-span-3 space-y-6">
            {activeSection === 'profile' && (
              <div className="p-6 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-6 shadow-xl">
                <h2 className="text-xl font-serif font-bold text-[#FAF7F1]">Investor Profili</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BAA7] block mb-1.5 uppercase">Ism</label>
                    <input
                      type="text"
                      defaultValue="Alexandr"
                      className="w-full bg-[#140D0B] border border-[#C6A477]/30 rounded-xl px-4 py-2.5 text-xs text-[#FAF7F1] focus:border-[#C6A477] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BAA7] block mb-1.5 uppercase">Familiya</label>
                    <input
                      type="text"
                      defaultValue="Sobirov"
                      className="w-full bg-[#140D0B] border border-[#C6A477]/30 rounded-xl px-4 py-2.5 text-xs text-[#FAF7F1] focus:border-[#C6A477] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BAA7] block mb-1.5 uppercase">Elektron Pochta</label>
                    <input
                      type="email"
                      defaultValue="investor@veltron.com"
                      className="w-full bg-[#140D0B] border border-[#C6A477]/30 rounded-xl px-4 py-2.5 text-xs text-[#FAF7F1] focus:border-[#C6A477] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BAA7] block mb-1.5 uppercase">Telegram Foydalanuvchi</label>
                    <input
                      type="text"
                      defaultValue="@investor_alex"
                      className="w-full bg-[#140D0B] border border-[#C6A477]/30 rounded-xl px-4 py-2.5 text-xs text-[#FAF7F1] focus:border-[#C6A477] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-[#C6A477] hover:bg-[#B38E60] text-[#120A08] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(198,164,119,0.3)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>O‘zgarishlarni Saqlash</span>
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="p-6 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-6 shadow-xl">
                <h2 className="text-xl font-serif font-bold text-[#FAF7F1]">Xavfsizlik & Ikki Bosqichli Himoya</h2>
                
                <div className="p-4 rounded-xl bg-[#241512] border border-[#C6A477]/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#3DD898]" />
                      <span className="text-xs font-serif font-bold text-[#FAF7F1]">Ikki Bosqichli Tasdiqlash (2FA)</span>
                    </div>
                    <p className="text-[11px] text-[#C7BAA7] font-sans">
                      Har bir kirishda bir martalik SMS yoki Telegram orqali maxfiy kod so‘raladi.
                    </p>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${twoFactorEnabled ? 'bg-[#C6A477]' : 'bg-[#2E1E1A]'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${twoFactorEnabled ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono text-[#C6A477] uppercase tracking-wider">Parolni Yangilash</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="password"
                      placeholder="Joriy maxfiy parol"
                      className="w-full bg-[#140D0B] border border-[#C6A477]/30 rounded-xl px-4 py-2.5 text-xs text-[#FAF7F1] focus:border-[#C6A477] outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Yangi mustahkam parol"
                      className="w-full bg-[#140D0B] border border-[#C6A477]/30 rounded-xl px-4 py-2.5 text-xs text-[#FAF7F1] focus:border-[#C6A477] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-[#C6A477] hover:bg-[#B38E60] text-[#120A08] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(198,164,119,0.3)]"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Parolni Yangilash</span>
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="p-6 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-6 shadow-xl">
                <h2 className="text-xl font-serif font-bold text-[#FAF7F1]">Telegram & Bildirishnomalar</h2>
                
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#140D0B] border border-[#C6A477]/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-serif font-bold text-[#FAF7F1] block">Telegram Bot Ogohlantirishlari</span>
                      <span className="text-[11px] text-[#C7BAA7]">Bitimlar va portfel balansi o‘zgarishida Telegram orqali xabar olish</span>
                    </div>
                    <button
                      onClick={() => setTelegramAlerts(!telegramAlerts)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${telegramAlerts ? 'bg-[#C6A477]' : 'bg-[#2E1E1A]'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${telegramAlerts ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#140D0B] border border-[#C6A477]/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-serif font-bold text-[#FAF7F1] block">Kunlik Bozor Tahlili</span>
                      <span className="text-[11px] text-[#C7BAA7]">Har tong soat 09:00 da Markaziy bank stavkalari va kripto o‘zgarishlari</span>
                    </div>
                    <button
                      onClick={() => setMarketDigest(!marketDigest)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${marketDigest ? 'bg-[#C6A477]' : 'bg-[#2E1E1A]'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${marketDigest ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'preferences' && (
              <div className="p-6 rounded-2xl bg-[#1A110E] border border-[#C6A477]/25 space-y-6 shadow-xl">
                <h2 className="text-xl font-serif font-bold text-[#FAF7F1]">Valyuta & Til Moslamalari</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono text-[#C6A477] block mb-2 uppercase">Asosiy Valyuta</label>
                    <div className="space-y-2">
                      {[
                        { code: 'USD', name: 'AQSH Dollari ($)' },
                        { code: 'EUR', name: 'Yevro (€)' },
                        { code: 'UZS', name: 'O‘zbekiston So‘mi (so‘m)' },
                      ].map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => setCurrency(curr.code as any)}
                          className={`w-full p-3 rounded-xl border text-xs font-mono text-left transition-all ${
                            currency === curr.code
                              ? 'bg-[#54252D]/40 border-[#C6A477] text-[#FAF7F1] font-bold'
                              : 'bg-[#140D0B] border-[#C6A477]/20 text-[#C7BAA7] hover:border-[#C6A477]/40'
                          }`}
                        >
                          {curr.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-[#C6A477] block mb-2 uppercase">Interfeys Tili</label>
                    <div className="space-y-2">
                      {[
                        { code: 'uz', name: 'O‘zbekcha (Lotin)' },
                        { code: 'en', name: 'English (US)' },
                        { code: 'ru', name: 'Русский' },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code as any)}
                          className={`w-full p-3 rounded-xl border text-xs font-mono text-left transition-all ${
                            language === lang.code
                              ? 'bg-[#54252D]/40 border-[#C6A477] text-[#FAF7F1] font-bold'
                              : 'bg-[#140D0B] border-[#C6A477]/20 text-[#C7BAA7] hover:border-[#C6A477]/40'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-[#C6A477] hover:bg-[#B38E60] text-[#120A08] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(198,164,119,0.3)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saqlash</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Luxury Refined Footer */}
      <LuxuryFooter />
    </div>
  );
}
