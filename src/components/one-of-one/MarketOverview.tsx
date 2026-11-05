// ==============================================================================
// VELTRON ONE OF ONE MARKET OVERVIEW
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function MarketOverview() {
  const markets = [
    {
      symbol: 'BTC/USD',
      name: 'Bitcoin Sovereign Core',
      price: '$68,420.50',
      change: '+4.82%',
      positive: true,
      volume: '$28.4B',
    },
    {
      symbol: 'ETH/USD',
      name: 'Ethereum Virtual Caliber',
      price: '$3,540.25',
      change: '+3.14%',
      positive: true,
      volume: '$14.2B',
    },
    {
      symbol: 'SOL/USD',
      name: 'Solana High-Velocity',
      price: '$182.40',
      change: '-1.22%',
      positive: false,
      volume: '$4.1B',
    },
    {
      symbol: 'XAU/USD',
      name: 'Spot Gold Bullion',
      price: '$2,748.90',
      change: '+1.05%',
      positive: true,
      volume: '$8.9B',
    },
    {
      symbol: 'USD/UZS',
      name: 'Central Bank of Uzbekistan',
      price: '12,850.00 UZS',
      change: '+0.12%',
      positive: true,
      volume: 'CBU Official',
    },
    {
      symbol: 'EUR/USD',
      name: 'Euro Interbank Rate',
      price: '1.0825',
      change: '-0.24%',
      positive: false,
      volume: '$32.1B',
    },
  ];

  return (
    <div className="oneofone-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-cormorant font-semibold text-[#FAF7F1]">Bespoke Market Overview</h3>
          <p className="text-xs text-[#E9DDCA]/60 font-manrope">CBU va CoinGecko real-vaqt kotirovkalari</p>
        </div>
        <Link
          href="/markets"
          className="text-xs font-manrope text-[#C6A477] hover:text-[#FAF7F1] flex items-center gap-1 transition-colors"
        >
          <span>Barcha Bozorlar</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.map((m, idx) => (
          <Link
            key={idx}
            href="/trading"
            className="p-4 rounded-xl bg-[#170F0D] border border-[#C6A477]/20 hover:border-[#C6A477]/50 hover:bg-[#481B24]/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-[#FAF7F1]">{m.symbol}</span>
              <span
                className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${
                  m.positive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {m.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {m.change}
              </span>
            </div>
            <div className="text-lg font-cormorant font-semibold text-[#E9DDCA] tabular-nums mb-1">
              {m.price}
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#E9DDCA]/60 font-manrope">
              <span>{m.name}</span>
              <span className="font-mono">{m.volume}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
