// ==============================================================================
// VELTRON ONE OF ONE BALANCE OVERVIEW
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { Wallet, TrendingUp, Lock, Plus, ArrowUpRight, ArrowDownRight, Download, Send } from 'lucide-react';

export function BalanceOverview() {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'UZS'>('USD');
  const [baseBalance, setBaseBalance] = useState(248650);
  const [showDepositSuccess, setShowDepositSuccess] = useState(false);

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '';
  const currencyRate = currency === 'USD' ? 1.0 : currency === 'EUR' ? 0.92 : currency === 'GBP' ? 0.79 : 12850;

  const formatMoney = (val: number) => {
    if (currency === 'UZS') {
      return `${(val * currencyRate).toLocaleString('uz-UZ', { maximumFractionDigits: 0 })} so'm`;
    }
    return `${currencySymbol}${(val * currencyRate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleDeposit = () => {
    setBaseBalance((prev) => prev + 10000);
    setShowDepositSuccess(true);
    setTimeout(() => setShowDepositSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C6A477]/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-manrope text-[#C6A477] tracking-wider uppercase mb-1">
            <span>SOVEREIGN TREASURY</span>
            <span>•</span>
            <span>MANSORY 1 OF 1 SPEC</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-cormorant font-semibold text-[#FAF7F1]">
            Executive Liquidity Console
          </h2>
        </div>

        {/* Currency Switcher & Deposit Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Currency Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#090706] border border-[#C6A477]/30 text-xs font-manrope">
            {(['USD', 'EUR', 'GBP', 'UZS'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  currency === c
                    ? 'bg-[#481B24] text-[#FAF7F1] border border-[#C6A477]/40 shadow-sm'
                    : 'text-[#E9DDCA]/60 hover:text-[#FAF7F1]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Quick Deposit Simulated Capital */}
          <button
            onClick={handleDeposit}
            className="px-4 py-2 rounded-xl text-xs font-manrope font-semibold oneofone-btn-gold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ $10,000 Qo‘shish</span>
          </button>
        </div>
      </div>

      {showDepositSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-manrope flex items-center justify-between animate-in fade-in duration-300">
          <span>Virtual $10,000 balans muvaffaqiyatli qo‘shildi!</span>
          <span className="font-mono text-[10px]">TRANSACTION: SETTLED</span>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Liquidity */}
        <div className="oneofone-panel p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-manrope text-[#C6A477] tracking-wider uppercase mb-2">
            <span>TOTAL LIQUIDITY</span>
            <span className="p-1.5 rounded-full bg-[#C6A477]/20 text-[#C6A477]">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-cormorant font-semibold text-[#FAF7F1] tabular-nums mb-3">
            {formatMoney(baseBalance)}
          </div>
          <div className="flex items-center gap-2 text-xs font-manrope">
            <span className="flex items-center text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.8%
            </span>
            <span className="text-[#E9DDCA]/60">oxirgi 30 kunlik o‘sish</span>
          </div>
        </div>

        {/* Paper Net Yield */}
        <div className="oneofone-panel-burgundy p-6 group">
          <div className="flex items-center justify-between text-xs font-manrope text-[#C6A477] tracking-wider uppercase mb-2">
            <span>PAPER TRADING YIELD</span>
            <span className="p-1.5 rounded-full bg-[#C6A477]/20 text-[#C6A477]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-cormorant font-semibold text-[#FAF7F1] tabular-nums mb-3">
            {formatMoney(32480)}
          </div>
          <div className="flex items-center gap-2 text-xs font-manrope">
            <span className="flex items-center text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +21.4%
            </span>
            <span className="text-[#E9DDCA]/60">simulyatsiya daromadi</span>
          </div>
        </div>

        {/* Cold Vault Reserve */}
        <div className="oneofone-panel p-6 group">
          <div className="flex items-center justify-between text-xs font-manrope text-[#C6A477] tracking-wider uppercase mb-2">
            <span>COLD VAULT ISOLATION</span>
            <span className="p-1.5 rounded-full bg-[#C6A477]/20 text-[#C6A477]">
              <Lock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-cormorant font-semibold text-[#FAF7F1] tabular-nums mb-3">
            {formatMoney(112000)}
          </div>
          <div className="flex items-center gap-2 text-xs font-manrope">
            <span className="text-[#C6A477] font-semibold">Zero CVV/PIN</span>
            <span className="text-[#E9DDCA]/60">to‘liq izolyatsiya</span>
          </div>
        </div>
      </div>
    </div>
  );
}
