// ==============================================================================
// VELTRON SUBSCRIPTION FEATURE GATE COMPONENT
// Protects premium features according to tier (FREE, PRO, ULTRA, MAX)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { TierKey, isFeatureAllowed, SUBSCRIPTION_TIERS } from '@/lib/subscription/tiers';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';

interface SubscriptionGateProps {
  userTier?: string;
  requiredTier: TierKey;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function SubscriptionGate({
  userTier = 'FREE',
  requiredTier,
  children,
  fallbackTitle,
  fallbackDescription,
}: SubscriptionGateProps) {
  const isAllowed = isFeatureAllowed(userTier, requiredTier);

  if (isAllowed) {
    return <>{children}</>;
  }

  const reqTier = SUBSCRIPTION_TIERS[requiredTier];

  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#C6A477]/30 bg-gradient-to-br from-[#1C110F] via-[#140D0B] to-[#0A0605] p-6 sm:p-8 text-center space-y-4 shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-[#54252D]/50 border border-[#C6A477]/40 flex items-center justify-center text-[#C6A477] mx-auto shadow-[0_0_20px_rgba(198,164,119,0.2)]">
        <Lock className="w-6 h-6" />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C6A477] font-bold">
          {reqTier.name} TIER TALAB QILINADI
        </span>
        <h3 className="text-xl sm:text-2xl font-cormorant font-bold text-white">
          {fallbackTitle || 'Ushbu Kvant Funksiya Qulflangan'}
        </h3>
        <p className="text-xs text-[#A89888] font-light leading-relaxed">
          {fallbackDescription ||
            `Bu imkoniyatdan to‘liq foydalanish uchun ${reqTier.name} yoki undan yuqori tarifga o‘ting. Saytning 100% funksiyalari MAX suveren tarifida ochiladi.`}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        <Link
          href="/pricing"
          className="px-6 py-2.5 rounded-full text-xs font-bold text-[#120A08] bg-gradient-to-r from-[#D6BB92] via-[#C6A477] to-[#B8986B] hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#120A08]" />
          <span>Tarifni Yangilash ({reqTier.name})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
