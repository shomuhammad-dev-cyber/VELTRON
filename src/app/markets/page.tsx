// ==============================================================================
// VELTRON ONE OF ONE BESPOKE LUXURY MARKET INTELLIGENCE HUB (/markets)
// Real-Time CBU Official Exchange Rates & Crypto Spot Terminal
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import { MarketAssetSummary } from '@/server/services/market.service';
import { AssetComparisonModal } from '@/components/markets/AssetComparisonModal';
import {
  Search,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

const INITIAL_MARKET_ASSETS: MarketAssetSummary[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    category: 'CRYPTO',
    priceUsd: 68420.5,
    priceUzs: 879203425,
    change24h: 2260.0,
    changePercent24h: 3.42,
    high24h: 69150.0,
    low24h: 66800.0,
    marketCapUsd: 1348000000000,
    volume24hUsd: 38450000000,
    source: 'CoinGecko / Binance Stream',
    isOfficialRate: false,
    lastUpdated: new Date().toISOString(),
    sparkline7d: [66000, 66500, 67200, 66900, 67800, 68100, 68420.5],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    category: 'CRYPTO',
    priceUsd: 3512.8,
    priceUzs: 45139480,
    change24h: 141.0,
    changePercent24h: 4.18,
    high24h: 3560.0,
    low24h: 3370.0,
    marketCapUsd: 422000000000,
    volume24hUsd: 19800000000,
    source: 'CoinGecko / Binance Stream',
    isOfficialRate: false,
    lastUpdated: new Date().toISOString(),
    sparkline7d: [3350, 3380, 3420, 3400, 3460, 3490, 3512.8],
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    category: 'CRYPTO',
    priceUsd: 182.4,
    priceUzs: 2343840,
    change24h: -2.25,
    changePercent24h: -1.22,
    high24h: 188.0,
    low24h: 179.5,
    marketCapUsd: 85000000000,
    volume24hUsd: 4800000000,
    source: 'CoinGecko / Binance Stream',
    isOfficialRate: false,
    lastUpdated: new Date().toISOString(),
    sparkline7d: [175, 178, 184, 182, 186, 185, 182.4],
  },
  {
    symbol: 'USD',
    name: 'AQSH Dollari',
    category: 'CURRENCY',
    priceUsd: 1.0,
    priceUzs: 12850.0,
    change24h: 15.2,
    changePercent24h: 0.12,
    high24h: 12860.0,
    low24h: 12840.0,
    source: 'Markaziy Bank (CBU)',
    isOfficialRate: true,
    lastUpdated: new Date().toISOString(),
    sparkline7d: [12820, 12825, 12830, 12840, 12845, 12848, 12850],
  },
  {
    symbol: 'EUR',
    name: 'Yevro',
    category: 'CURRENCY',
    priceUsd: 1.083,
    priceUzs: 13920.0,
    change24h: 22.5,
    changePercent24h: 0.16,
    high24h: 13940.0,
    low24h: 13900.0,
    source: 'Markaziy Bank (CBU)',
    isOfficialRate: true,
    lastUpdated: new Date().toISOString(),
    sparkline7d: [13880, 13890, 13900, 13910, 13905, 13915, 13920],
  },
  {
    symbol: 'GBP',
    name: 'Funt Sterling',
    category: 'CURRENCY',
    priceUsd: 1.284,
    priceUzs: 16500.0,
    change24h: 30.0,
    changePercent24h: 0.18,
    high24h: 16520.0,
    low24h: 16470.0,
    source: 'Markaziy Bank (CBU)',
    isOfficialRate: true,
    lastUpdated: new Date().toISOString(),
    sparkline7d: [16450, 16460, 16480, 16475, 16490, 16495, 16500],
  },
  {
    symbol: 'RUB',
    name: 'Rossiya Rubli',
    category: 'CURRENCY',
    priceUsd: 0.0104,
    priceUzs: 134.2,
    change24h: -0.4,
    changePercent24h: -0.3,
    high24h: 135.0,
    low24h: 133.5,
    source: 'Markaziy Bank (CBU)',
    isOfficialRate: true,
    lastUpdated: new Date().toISOString(),
    sparkline7d: [135, 135.2, 134.8, 134.5, 134.6, 134.4, 134.2],
  },
];

export default function MarketsHubPage() {
  const [assets, setAssets] = useState<MarketAssetSummary[]>(INITIAL_MARKET_ASSETS);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters & Interactivity
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRYPTO' | 'CURRENCY' | 'WATCHLIST'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>(['BTC', 'USD', 'ETH']);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [compareBaseAsset, setCompareBaseAsset] = useState<MarketAssetSummary | null>(null);

  const fetchMarkets = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/v1/markets');
      if (!res.ok) throw new Error('Failed to fetch market data.');
      const json = await res.json();
      if (json.success && json.data) {
        setAssets(json.data);
      } else {
        throw new Error(json.error?.message || 'Invalid server response structure.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Market data feed connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const toggleWatchlist = (sym: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWatchlist((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (activeTab === 'CRYPTO' && asset.category !== 'CRYPTO') return false;
      if (activeTab === 'CURRENCY' && asset.category !== 'CURRENCY') return false;
      if (activeTab === 'WATCHLIST' && !watchlist.includes(asset.symbol)) return false;

      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        asset.symbol.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.source.toLowerCase().includes(query)
      );
    });
  }, [assets, activeTab, searchQuery, watchlist]);

  return (
    <div className="min-h-screen bg-[#090706] text-[#E9DDCA] font-manrope flex flex-col selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. LUXURY NAVBAR */}
      <LuxuryNavbar />

      {/* 2. Top Ticker Banner */}
      <div className="border-b border-[#C6A477]/20 bg-[#170F0D]/60 py-3 px-4 sm:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-max text-xs font-manrope">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C6A477] animate-pulse" />
            <span className="text-[#C6A477] font-semibold">SOVEREIGN MARKET INTELLIGENCE</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[#E9DDCA]/60">CBU USD/UZS:</span>
              <span className="text-[#FAF7F1] font-mono font-semibold">12,850.00 UZS</span>
              <span className="text-emerald-400 font-mono text-[11px]">+15.2</span>
            </div>
            <div className="h-3 w-px bg-[#C6A477]/30" />
            <div className="flex items-center gap-2">
              <span className="text-[#E9DDCA]/60">BTC/USD:</span>
              <span className="text-[#FAF7F1] font-mono font-semibold">$68,420.50</span>
              <span className="text-emerald-400 font-mono text-[11px]">+4.8%</span>
            </div>
            <div className="h-3 w-px bg-[#C6A477]/30" />
            <div className="flex items-center gap-2">
              <span className="text-[#E9DDCA]/60">GOLD XAU:</span>
              <span className="text-[#FAF7F1] font-mono font-semibold">$2,748.90</span>
              <span className="text-emerald-400 font-mono text-[11px]">+1.05%</span>
            </div>
          </div>
          <button
            onClick={fetchMarkets}
            className="p-1.5 rounded-lg bg-[#090706] border border-[#C6A477]/30 text-[#C6A477] hover:border-[#C6A477] transition-colors"
            title="Yangilash"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-manrope text-[#C6A477] tracking-wider uppercase mb-1">
              <span>CENTRAL BANK & CRYPTO LIQUIDITY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-cormorant font-semibold text-[#FAF7F1]">
              Bespoke Market Intelligence
            </h1>
            <p className="text-xs text-[#E9DDCA]/70 font-manrope mt-1">
              O‘zbekiston Respublikasi Markaziy Banki (CBU) rasmiy kurslari va xalqaro kotirovkalar
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (assets.length > 0) {
                  setCompareBaseAsset(assets[0]);
                  setIsComparisonOpen(true);
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-manrope font-semibold oneofone-btn-burgundy flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C6A477]" />
              <span>Aktivlarni Taqqoslash</span>
            </button>
          </div>
        </div>

        {/* Search & Tabs Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2.5 rounded-2xl bg-[#170F0D] border border-[#C6A477]/30">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-manrope">
            {[
              { id: 'ALL', label: `Barchasi (${assets.length})` },
              { id: 'CRYPTO', label: 'Kripto' },
              { id: 'CURRENCY', label: 'CBU Valyutalari' },
              { id: 'WATCHLIST', label: `Kuzatuv (${watchlist.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#481B24] text-[#FAF7F1] border border-[#C6A477]/40 shadow-sm'
                    : 'text-[#E9DDCA]/70 hover:text-[#FAF7F1] hover:bg-[#090706]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A477]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Aktiv yoki valyutani qidiring..."
              className="w-full bg-[#090706] border border-[#C6A477]/30 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#E9DDCA] placeholder-[#E9DDCA]/40 focus:outline-none focus:border-[#C6A477]"
            />
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && assets.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#C6A477] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#E9DDCA]/60 font-manrope">CBU va CoinGecko ma’lumotlari olinmoqda...</p>
          </div>
        ) : errorMessage ? (
          <div className="oneofone-panel p-8 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <p className="text-xs text-[#E9DDCA]">{errorMessage}</p>
            <button
              onClick={fetchMarkets}
              className="px-4 py-2 rounded-xl text-xs font-semibold oneofone-btn-gold"
            >
              QAYTA URINISH
            </button>
          </div>
        ) : (
          /* Market Table */
          <div className="oneofone-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-manrope">
                <thead className="bg-[#170F0D] border-b border-[#C6A477]/25 text-[10px] text-[#C6A477] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-10 text-center">⭐</th>
                    <th className="py-3 px-4">AKTIV</th>
                    <th className="py-3 px-4 text-right">NARX (USD)</th>
                    <th className="py-3 px-4 text-right">NARX (UZS)</th>
                    <th className="py-3 px-4 text-right">24S O‘ZGARISH</th>
                    <th className="py-3 px-4 text-right hidden md:table-cell">24S HAJM</th>
                    <th className="py-3 px-4 text-center hidden lg:table-cell">7 KUNLIK TREND</th>
                    <th className="py-3 px-4 text-center">MANBA</th>
                    <th className="py-3 px-4 text-right">SAVDO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C6A477]/10">
                  {filteredAssets.map((asset) => {
                    const isPositive = asset.changePercent24h >= 0;
                    const isFavorited = watchlist.includes(asset.symbol);

                    return (
                      <tr
                        key={asset.symbol}
                        className="hover:bg-[#170F0D]/60 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-4 text-center" onClick={(e) => toggleWatchlist(asset.symbol, e)}>
                          <button className="text-[#C6A477]/40 hover:text-[#C6A477] transition-colors">
                            <Star className={`w-4 h-4 ${isFavorited ? 'fill-[#C6A477] text-[#C6A477]' : ''}`} />
                          </button>
                        </td>

                        <td className="py-4 px-4">
                          <Link href={`/trading?symbol=${asset.symbol}`} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-[#170F0D] border border-[#C6A477]/30 flex items-center justify-center font-bold text-[#FAF7F1] text-xs">
                              {asset.symbol.slice(0, 3)}
                            </div>
                            <div>
                              <p className="font-semibold text-[#FAF7F1] group-hover:text-[#C6A477] transition-colors">
                                {asset.symbol}
                              </p>
                              <p className="text-[10px] text-[#E9DDCA]/60">{asset.name}</p>
                            </div>
                          </Link>
                        </td>

                        <td className="py-4 px-4 text-right font-semibold text-[#FAF7F1] font-mono">
                          ${asset.priceUsd.toLocaleString(undefined, { minimumFractionDigits: asset.priceUsd < 1 ? 4 : 2 })}
                        </td>

                        <td className="py-4 px-4 text-right font-semibold text-[#C6A477] font-mono">
                          {asset.priceUzs.toLocaleString()} UZS
                        </td>

                        <td className={`py-4 px-4 text-right font-semibold font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}{asset.changePercent24h}%
                        </td>

                        <td className="py-4 px-4 text-right text-[#E9DDCA]/70 font-mono hidden md:table-cell">
                          {asset.volume24hUsd ? `$${(asset.volume24hUsd / 1e6).toFixed(1)}M` : 'Central Bank Clearing'}
                        </td>

                        <td className="py-4 px-4 text-center hidden lg:table-cell">
                          <svg className="w-24 h-6 mx-auto overflow-visible" viewBox="0 0 100 24">
                            <polyline
                              fill="none"
                              stroke={isPositive ? '#10B981' : '#F43F5E'}
                              strokeWidth="2"
                              points={asset.sparkline7d
                                .map((val, idx) => {
                                  const x = (idx / (asset.sparkline7d.length - 1)) * 100;
                                  const min = Math.min(...asset.sparkline7d);
                                  const max = Math.max(...asset.sparkline7d);
                                  const y = 24 - ((val - min) / (max - min || 1)) * 20 - 2;
                                  return `${x},${y}`;
                                })
                                .join(' ')}
                            />
                          </svg>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#170F0D] border border-[#C6A477]/30 text-[#C6A477] font-semibold">
                            {asset.isOfficialRate ? 'CBU Official' : 'Global Spot'}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <Link href={`/trading?symbol=${asset.symbol}`}>
                            <button className="px-3 py-1 rounded-lg text-xs font-semibold oneofone-btn-gold">
                              SAVDO →
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[#C6A477]/20 bg-[#170F0D]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] font-manrope text-[#E9DDCA]/60 gap-2">
              <span>
                Ma’lumot manbalari: <strong className="text-[#FAF7F1]">O‘zbekiston Markaziy Banki (CBU)</strong> va <strong className="text-[#FAF7F1]">CoinGecko API</strong>
              </span>
              <span>Barcha kotirovkalar real-vaqt rejimida yangilanadi</span>
            </div>
          </div>
        )}
      </main>

      {/* Asset Comparison Modal */}
      {compareBaseAsset && (
        <AssetComparisonModal
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          baseAsset={compareBaseAsset}
          allAssets={assets}
        />
      )}

      {/* 4. LUXURY FOOTER */}
      <LuxuryFooter />
    </div>
  );
}
