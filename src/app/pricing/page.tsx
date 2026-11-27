// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY PRICING & MEMBERSHIP SCREEN (/pricing)
// Tiers: Tekin (Free), Apex Pro, Ultra Growth, Max Sovereign VIP (100% Unlocked)
// Mobile Responsive, Native Telegram Mini App & Web Supported
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import { SUBSCRIPTION_TIERS, TierKey } from '@/lib/subscription/tiers';
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  CreditCard,
  Send,
  Coins,
  CheckCircle2,
  ArrowRight,
  Lock,
  Layers,
} from 'lucide-react';

function Crown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [currentTier, setCurrentTier] = useState<TierKey>('FREE');
  const [selectedTierForModal, setSelectedTierForModal] = useState<TierKey | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CLICK' | 'PAYME' | 'STARS' | 'CRYPTO' | 'CARD'>('CLICK');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'UZS'>('USD');

  // Load current user tier
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/v1/auth/me');
        const json = await res.json();
        if (json?.authenticated && json?.user?.tier) {
          setCurrentTier(json.user.tier as TierKey);
        }
      } catch {}
    }
    loadUser();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenPurchase = (tierKey: TierKey) => {
    if (tierKey === currentTier && tierKey === 'FREE') {
      showToast('Siz hozirda bepul ta’rifdasiz.');
      return;
    }
    setSelectedTierForModal(tierKey);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedTierForModal) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/v1/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTierForModal,
          billingCycle,
          paymentMethod,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'To‘lovni amalga oshirishda xatolik');
      }

      setCurrentTier(selectedTierForModal);
      showToast(json.message || 'Tarif muvaffaqiyatli faollashtirildi!');
      setSelectedTierForModal(null);
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    } finally {
      setIsProcessing(false);
    }
  };

  const tiersList: TierKey[] = ['FREE', 'PRO', 'ULTRA', 'MAX'];

  return (
    <div className="min-h-screen bg-[#090706] text-[#E9DDCA] font-manrope selection:bg-[#C6A477]/30 selection:text-white flex flex-col">
      {/* 1. Global Refined Luxury Navbar */}
      <LuxuryNavbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200 max-w-md w-full px-4">
          <div className="bg-[#1C1210] text-[#FAF7F1] px-5 py-3.5 rounded-2xl text-xs font-sans shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex items-center gap-3 border border-[#C6A477]/50">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#C6A477]" />
            <span className="flex-1 font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 2. Hero Header */}
      <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#54252D]/35 border border-[#C6A477]/40 text-xs font-mono text-[#EADBCA]">
          <Crown className="w-3.5 h-3.5 text-[#C6A477]" />
          <span>SOVEREIGN CAPITAL MEMBERSHIP TIERS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-cormorant font-normal text-transparent bg-clip-text bg-gradient-to-b from-[#FAF7F1] via-[#E8DCB8] to-[#BBA076] tracking-wide">
          Imkoniyatlaringizni 100% Ochish
        </h1>

        <p className="text-xs sm:text-sm text-[#A89888] max-w-2xl mx-auto font-light leading-relaxed">
          Boshlang‘ich bepul rejimdan to‘liq avtonom suveren institutsional darajagacha. Har bir versiya bilan yangi kvant
          funksiyalar va imtiyozlar faollashadi.
        </p>

        {/* Currency & Billing Cycle Toggles */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center p-1 bg-[#140D0B] border border-[#C6A477]/25 rounded-full text-xs">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                billingCycle === 'MONTHLY'
                  ? 'bg-gradient-to-r from-[#C6A477] to-[#A88656] text-[#120A08] font-bold shadow'
                  : 'text-[#A89888] hover:text-white'
              }`}
            >
              Oylik To‘lov
            </button>
            <button
              onClick={() => setBillingCycle('ANNUAL')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                billingCycle === 'ANNUAL'
                  ? 'bg-gradient-to-r from-[#C6A477] to-[#A88656] text-[#120A08] font-bold shadow'
                  : 'text-[#A89888] hover:text-white'
              }`}
            >
              <span>Yillik</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-[#54252D] text-[#FAF7F1] border border-[#C6A477]/30">
                -25% CHEGIRMA
              </span>
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="inline-flex items-center p-1 bg-[#140D0B] border border-[#C6A477]/25 rounded-full text-xs">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-full font-mono transition-all ${
                currency === 'USD' ? 'bg-[#54252D] text-[#C6A477] font-bold' : 'text-[#A89888]'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('UZS')}
              className={`px-3 py-1.5 rounded-full font-mono transition-all ${
                currency === 'UZS' ? 'bg-[#54252D] text-[#C6A477] font-bold' : 'text-[#A89888]'
              }`}
            >
              UZS (so‘m)
            </button>
          </div>
        </div>
      </section>

      {/* 3. Pricing Cards Grid */}
      <section className="max-w-[1580px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiersList.map((tierKey) => {
            const tier = SUBSCRIPTION_TIERS[tierKey];
            const isCurrent = currentTier === tierKey;
            const isMax = tierKey === 'MAX';
            const isPro = tierKey === 'PRO';

            // Price calculation with annual discount
            const price =
              currency === 'USD'
                ? billingCycle === 'ANNUAL'
                  ? Math.round(tier.monthlyPriceUSD * 0.75)
                  : tier.monthlyPriceUSD
                : billingCycle === 'ANNUAL'
                ? Math.round(tier.monthlyPriceUZS * 0.75)
                : tier.monthlyPriceUZS;

            const formattedPrice =
              currency === 'USD'
                ? `$${price}`
                : `${price.toLocaleString('uz-UZ')} so‘m`;

            return (
              <div
                key={tierKey}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  isMax
                    ? 'bg-gradient-to-b from-[#251512] via-[#170E0C] to-[#0E0705] border-2 border-[#C6A477] shadow-[0_15px_50px_rgba(198,164,119,0.22)]'
                    : isPro
                    ? 'bg-[#140D0B] border border-[#C6A477]/50 shadow-[0_10px_35px_rgba(0,0,0,0.6)]'
                    : 'bg-[#100A09] border border-[#C6A477]/20 hover:border-[#C6A477]/40'
                }`}
              >
                {/* Popular or Max Badge */}
                {isMax && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#C6A477] via-[#DFCA9F] to-[#C6A477] text-[#120A08] text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(198,164,119,0.5)]">
                    ★ 100% BARCHA IMKONIYATLAR OCHIQ ★
                  </div>
                )}
                {isPro && !isMax && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#54252D] text-[#C6A477] border border-[#C6A477]/40 text-[10px] font-bold tracking-widest uppercase">
                    ENG MASHHUR
                  </div>
                )}

                <div>
                  {/* Tier Title & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-cormorant font-bold text-white tracking-wide">
                      {tier.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-[#C6A477]">
                      {tier.badge}
                    </span>
                  </div>

                  {/* Price display */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF7F1]">
                        {tier.monthlyPriceUSD === 0 ? 'Bepul' : formattedPrice}
                      </span>
                      {tier.monthlyPriceUSD > 0 && (
                        <span className="text-xs text-[#8E8278]">/ oy</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8E8278] mt-1">{tier.tagline}</p>
                  </div>

                  {/* Unlocked Progress Bar */}
                  <div className="mb-6 p-3 rounded-xl bg-black/40 border border-[#C6A477]/15 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#A89888]">Ochilgan Funksiyalar:</span>
                      <span className="font-bold text-[#C6A477]">{tier.unlockedPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#54252D] via-[#C6A477] to-[#FAF7F1] rounded-full transition-all duration-500"
                        style={{ width: `${tier.unlockedPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-[#7A6E64] pt-1">
                      <span>Demo Kapital:</span>
                      <span className="font-bold text-white">${tier.paperBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 text-xs text-[#C9BEB2] mb-6">
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        {f.included ? (
                          <div className="w-4 h-4 rounded-full bg-[#C6A477]/20 border border-[#C6A477]/50 flex items-center justify-center shrink-0 mt-0.5 text-[#C6A477]">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#63574E]">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <span className={f.included ? 'text-[#EADBCA]' : 'text-[#63574E] line-through'}>
                          {f.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-2xl bg-white/10 border border-[#C6A477]/30 text-xs font-semibold text-[#C6A477] flex items-center justify-center gap-2 cursor-default"
                    >
                      <Check className="w-4 h-4" />
                      <span>Hozirgi Tarifingiz</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenPurchase(tierKey)}
                      className={`w-full py-3 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] ${
                        isMax
                          ? 'bg-gradient-to-r from-[#D6BB92] via-[#C6A477] to-[#B8986B] text-[#120A08] hover:brightness-110 shadow-[0_4px_20px_rgba(198,164,119,0.35)]'
                          : isPro
                          ? 'bg-gradient-to-r from-[#54252D] to-[#7B2433] text-white hover:brightness-110 border border-[#C6A477]/40'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      <span>{tierKey === 'FREE' ? 'Bepulga O‘tish' : 'Tarifni Sotib Olish'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Payment Modal */}
      {selectedTierForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-3xl bg-[#170E0C] border border-[#C6A477]/40 p-6 space-y-5 shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedTierForModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-[#C6A477]/20 pb-4">
              <span className="text-[10px] font-mono text-[#C6A477] uppercase tracking-widest font-semibold">
                XAVFSIZ TO‘LOV MARKAZI
              </span>
              <h3 className="text-2xl font-cormorant font-bold text-white mt-1">
                {SUBSCRIPTION_TIERS[selectedTierForModal].name} Tarifini Faollashtirish
              </h3>
              <p className="text-xs text-[#8E8278] mt-1">
                Muddat: {billingCycle === 'ANNUAL' ? '1 Yil' : '1 Oy'} | Imkoniyatlar: {SUBSCRIPTION_TIERS[selectedTierForModal].unlockedPercentage}% ochiq
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs text-[#C6A477] font-medium block">To‘lov Tizimini Tanlang:</label>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CLICK')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    paymentMethod === 'CLICK'
                      ? 'bg-[#54252D]/60 border-[#C6A477] text-white shadow-md'
                      : 'bg-[#100A09] border-white/10 text-stone-300 hover:border-white/30'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C6A477]" />
                  <div>
                    <p className="font-bold">Click.uz</p>
                    <p className="text-[9px] text-stone-400">Uzcard / Humo</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('PAYME')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    paymentMethod === 'PAYME'
                      ? 'bg-[#54252D]/60 border-[#C6A477] text-white shadow-md'
                      : 'bg-[#100A09] border-white/10 text-stone-300 hover:border-white/30'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#2AABEE]" />
                  <div>
                    <p className="font-bold">Payme</p>
                    <p className="text-[9px] text-stone-400">Bir zumda to‘lov</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('STARS')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    paymentMethod === 'STARS'
                      ? 'bg-[#54252D]/60 border-[#C6A477] text-white shadow-md'
                      : 'bg-[#100A09] border-white/10 text-stone-300 hover:border-white/30'
                  }`}
                >
                  <Send className="w-4 h-4 text-[#FFD700]" />
                  <div>
                    <p className="font-bold">Telegram Stars</p>
                    <p className="text-[9px] text-stone-400">Telegram ichida</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CRYPTO')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    paymentMethod === 'CRYPTO'
                      ? 'bg-[#54252D]/60 border-[#C6A477] text-white shadow-md'
                      : 'bg-[#100A09] border-white/10 text-stone-300 hover:border-white/30'
                  }`}
                >
                  <Coins className="w-4 h-4 text-[#26A17B]" />
                  <div>
                    <p className="font-bold">USDT / Crypto</p>
                    <p className="text-[9px] text-stone-400">TRC-20 / TON</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Total Price Summary */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-[#C6A477]/20 flex items-center justify-between text-xs font-mono">
              <span className="text-[#A89888]">Jami To‘lov:</span>
              <span className="text-base font-bold text-[#FAF7F1]">
                {currency === 'USD'
                  ? `$${
                      billingCycle === 'ANNUAL'
                        ? Math.round(SUBSCRIPTION_TIERS[selectedTierForModal].monthlyPriceUSD * 12 * 0.75)
                        : SUBSCRIPTION_TIERS[selectedTierForModal].monthlyPriceUSD
                    }`
                  : `${(
                      billingCycle === 'ANNUAL'
                        ? Math.round(SUBSCRIPTION_TIERS[selectedTierForModal].monthlyPriceUZS * 12 * 0.75)
                        : SUBSCRIPTION_TIERS[selectedTierForModal].monthlyPriceUZS
                    ).toLocaleString('uz-UZ')} so‘m`}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTierForModal(null)}
                className="w-1/3 py-2.5 rounded-xl border border-white/15 text-xs text-stone-300 hover:bg-white/5 transition-colors"
              >
                Bekor Qilish
              </button>

              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D6BB92] via-[#C6A477] to-[#B8986B] text-[#120A08] text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Faollashtirilmoqda...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>To‘lovni Tasdiqlash</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Luxury Footer */}
      <LuxuryFooter />
    </div>
  );
}
