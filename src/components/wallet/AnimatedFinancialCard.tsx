// ==============================================================================
// VELTRON ANIMATED FINANCIAL CARD COMPONENT
// Holographic Titanium Glass, EMV Microchip, Contactless NFC & 3D Tilt
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Wifi, ExternalLink, Trash2 } from 'lucide-react';

export interface FinancialCardProps {
  id: string;
  accountName: string;
  accountNumber: string;
  type: string;
  balance: number;
  currency: string;
  currencyPrefix?: string;
  cardBrand?: string;
  expDate?: string;
  provider?: string;
  status: string;
  hideBalance?: boolean;
  onDisconnect?: (id: string) => void;
  className?: string;
  key?: any;
}

export function AnimatedFinancialCard({
  id,
  accountName,
  accountNumber,
  type,
  balance,
  currency = 'USD',
  currencyPrefix = '$',
  cardBrand = 'VISA',
  expDate = '12/28',
  provider = 'Veltron Vault',
  status,
  hideBalance = false,
  onDisconnect,
  className,
}: FinancialCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Card Theme Palette based on account type
  const themeStyles = {
    SMART_CHECKING: {
      gradient: 'from-[#0E121B] via-[#1A1230] to-[#0A0D14]',
      border: 'border-valixen-violet/40 hover:border-valixen-violet',
      glow: 'shadow-[0_0_40px_rgba(139,92,246,0.15)]',
      accentColor: 'text-valixen-violet',
      badgeBg: 'bg-valixen-violet/20 text-valixen-violet',
      cardLabel: 'PRIMARY SMART CHECKING',
    },
    HIGH_YIELD_VAULT: {
      gradient: 'from-[#0A101C] via-[#091D2C] to-[#07090E]',
      border: 'border-valixen-ice/40 hover:border-valixen-ice',
      glow: 'shadow-[0_0_40px_rgba(0,240,255,0.15)]',
      accentColor: 'text-valixen-ice',
      badgeBg: 'bg-valixen-ice/20 text-valixen-ice',
      cardLabel: 'HIGH-YIELD QUANTUM VAULT (5.2% APY)',
    },
    CONNECTED_CARD: {
      gradient: 'from-[#17130E] via-[#2A1E11] to-[#0D0B09]',
      border: 'border-valixen-gold/40 hover:border-valixen-gold',
      glow: 'shadow-[0_0_40px_rgba(245,158,11,0.15)]',
      accentColor: 'text-valixen-gold',
      badgeBg: 'bg-valixen-gold/20 text-valixen-gold',
      cardLabel: 'TOKENIZED STRIPE VAULT CARD',
    },
    CONNECTED_BANK: {
      gradient: 'from-[#0A1612] via-[#0D241C] to-[#070E0B]',
      border: 'border-valixen-telemetry-profit/40 hover:border-valixen-telemetry-profit',
      glow: 'shadow-[0_0_40px_rgba(0,229,153,0.15)]',
      accentColor: 'text-valixen-telemetry-profit',
      badgeBg: 'bg-valixen-telemetry-profit/20 text-valixen-telemetry-profit',
      cardLabel: 'PLAID OPEN BANKING SYNC',
    },
    CRYPTO_CUSTODY_WALLET: {
      gradient: 'from-[#120F1D] via-[#170E28] to-[#07090E]',
      border: 'border-white/20 hover:border-white/40',
      glow: 'shadow-[0_0_40px_rgba(255,255,255,0.08)]',
      accentColor: 'text-slate-300',
      badgeBg: 'bg-white/10 text-white',
      cardLabel: 'COLD CRYPTO CUSTODY',
    },
  }[type] || {
    gradient: 'from-[#0E121B] via-[#131722] to-[#07090E]',
    border: 'border-white/10 hover:border-white/30',
    glow: 'shadow-2xl',
    accentColor: 'text-valixen-ice',
    badgeBg: 'bg-white/10 text-white',
    cardLabel: 'FINANCIAL ACCOUNT',
  };

  return (
    <div
      className={`group relative aspect-[1.586/1] w-full max-w-sm rounded-3xl p-6 transition-all duration-300 transform-gpu hover:scale-[1.02] hover:-rotate-0.5 border ${themeStyles.border} ${themeStyles.glow} bg-gradient-to-br ${themeStyles.gradient} overflow-hidden select-none ${className || ''}`}
    >
      {/* 1. Subtle Holographic Prismatic Background Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[80px] bg-white/[0.04] pointer-events-none" />

      {/* 2. Top Row: Bank Badge, EMV Chip & NFC */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Metallic Gold EMV Chip */}
          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#E6C687] via-[#D4AF37] to-[#AA7C11] p-1 flex flex-col justify-between shadow-md border border-white/20">
            <div className="h-0.5 w-full bg-black/30 rounded" />
            <div className="h-0.5 w-full bg-black/30 rounded" />
            <div className="h-0.5 w-full bg-black/30 rounded" />
          </div>

          {/* Contactless NFC Icon */}
          <Wifi className="w-4 h-4 text-white/50 rotate-90" />
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${themeStyles.badgeBg}`}>
            {status}
          </span>
          {onDisconnect && (
            <button
              onClick={() => onDisconnect(id)}
              title="Disconnect account"
              className="text-slate-500 hover:text-valixen-telemetry-risk p-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Middle Row: Balance & Account Type */}
      <div className="relative z-10 my-4 space-y-1">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
          {themeStyles.cardLabel}
        </span>
        <div className="text-2xl font-display font-black text-white tracking-tight">
          {hideBalance ? '••••••••' : `${currencyPrefix}${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        </div>
      </div>

      {/* 4. Bottom Row: Masked Number, Expiry & Brand Logo */}
      <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-200">
              {accountNumber}
            </span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-valixen-telemetry-profit" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">
            {accountName}
          </p>
        </div>

        <div className="text-right">
          {expDate && (
            <span className="text-[9px] font-mono text-slate-400 block">
              EXP {expDate}
            </span>
          )}
          <span className="text-xs font-display font-black tracking-wider text-white">
            {cardBrand}
          </span>
        </div>
      </div>
    </div>
  );
}
