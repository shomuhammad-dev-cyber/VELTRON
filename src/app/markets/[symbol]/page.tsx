// ==============================================================================
// VALIXEN ASSET MARKET INTELLIGENCE DETAIL (/markets/[symbol])
// Deep Candlestick Terminal, CBU Official Rate Bulletin & Price Alerts
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DetailedAssetIntelligence, MarketAssetSummary } from '@/server/services/market.service';
import { InteractiveMarketChart } from '@/components/markets/InteractiveMarketChart';
import { PriceAlertModal } from '@/components/markets/PriceAlertModal';
import { AssetComparisonModal } from '@/components/markets/AssetComparisonModal';
import {
  ArrowLeft,
  Star,
  Bell,
  SlidersHorizontal,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Globe,
  ExternalLink,
  Activity,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Clock,
} from 'lucide-react';

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = (params?.symbol as string || 'BTC').toUpperCase();

  const [asset, setAsset] = useState<DetailedAssetIntelligence | null>(null);
  const [allAssets, setAllAssets] = useState<MarketAssetSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chart & Interactive Controls
  const [timeframe, setTimeframe] = useState<'24H' | '7D' | '30D' | '90D' | '1Y'>('30D');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Conversion Calculator State
  const [calcAmount, setCalcAmount] = useState('1');

  const fetchAssetData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [resDetail, resAll] = await Promise.all([
        fetch(`/api/v1/markets/${symbol}`),
        fetch('/api/v1/markets'),
      ]);

      if (!resDetail.ok) throw new Error(`Asset '${symbol}' could not be resolved.`);

      const jsonDetail = await resDetail.json();
      const jsonAll = await resAll.json();

      if (jsonDetail.success && jsonDetail.data) {
        setAsset(jsonDetail.data);
      }
      if (jsonAll.success && jsonAll.data) {
        setAllAssets(jsonAll.data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to market telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetData();
  }, [symbol]);

  // Handle Price Alert Creation
  const handleAlertCreated = (alertData: any) => {
    setToastMessage(`Price alert registered: Trigger when ${alertData.symbol} ${alertData.direction} $${alertData.targetPrice}.`);
  };

  if (isLoading && !asset) {
    return (
      <div className="min-h-screen bg-[#07090E] p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-2 border-valixen-ice border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-300">Streaming {symbol} market candles & orderbook...</p>
        </div>
      </div>
    );
  }

  if (errorMessage || !asset) {
    return (
      <div className="min-h-screen bg-[#07090E] p-8 flex items-center justify-center">
        <GlassPanel variant="elevated" className="max-w-md w-full p-8 text-center space-y-6">
          <AlertCircle className="w-12 h-12 text-valixen-telemetry-risk mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-display font-bold text-white">ASSET NOT FOUND</h2>
            <p className="text-xs font-mono text-slate-400">{errorMessage || 'Requested asset symbol is not tracked.'}</p>
          </div>
          <Link href="/markets">
            <Button variant="primary" size="md" className="w-full font-mono">
              ← RETURN TO MARKETS HUB
            </Button>
          </Link>
        </GlassPanel>
      </div>
    );
  }

  const isPositive = asset.changePercent24h >= 0;
  const numAmount = parseFloat(calcAmount) || 0;
  const convertedUsd = numAmount * asset.priceUsd;
  const convertedUzs = numAmount * asset.priceUzs;

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col">
      {/* 1. Header Toolbar */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/markets"
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ALL MARKETS</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <Logo variant="main" size="sm" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={() => setIsWatchlisted(!isWatchlisted)}
            variant="ghost"
            size="sm"
            className="text-xs font-mono"
          >
            <Star className={`w-4 h-4 mr-1.5 ${isWatchlisted ? 'fill-valixen-gold text-valixen-gold' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isWatchlisted ? 'WATCHLISTED' : 'WATCHLIST'}</span>
          </Button>

          <Button
            onClick={() => setIsAlertModalOpen(true)}
            variant="secondary"
            size="sm"
            className="text-xs font-mono flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-valixen-ice" />
            <span className="hidden sm:inline">SET ALERT</span>
          </Button>

          <Button
            onClick={() => setIsComparisonOpen(true)}
            variant="secondary"
            size="sm"
            className="text-xs font-mono flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">COMPARE</span>
          </Button>
        </div>
      </header>

      {/* Toast Banner */}
      {toastMessage && (
        <div className="mx-4 sm:mx-8 mt-4 p-3.5 rounded-xl bg-valixen-telemetry-profit/15 border border-valixen-telemetry-profit/40 text-xs font-mono text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-valixen-telemetry-profit shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 2. Main Detail Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Asset Title & Primary Valuation Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-valixen-violet/30 to-valixen-ice/30 border border-white/20 flex items-center justify-center font-display font-extrabold text-white text-lg">
                {asset.symbol.slice(0, 3)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    {asset.name}
                  </h1>
                  <span className="text-lg font-mono text-slate-400 font-bold">({asset.symbol})</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant={asset.isOfficialRate ? 'cyan' : 'default'} className="text-[10px]">
                    {asset.isOfficialRate ? 'CBU OFFICIAL EXCHANGE RATE' : 'FREE MARKET SPOT'}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    Source: <strong className="text-slate-300">{asset.source}</strong>
                  </span>
                  <span className="text-xs font-mono text-slate-500">• {asset.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Large Price Display */}
          <div className="text-left lg:text-right space-y-1">
            <div className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              ${asset.priceUsd.toLocaleString(undefined, { minimumFractionDigits: asset.priceUsd < 1 ? 4 : 2 })}
            </div>
            <div className="flex items-center lg:justify-end gap-3 text-sm font-mono">
              <span className="text-valixen-ice font-bold">{asset.priceUzs.toLocaleString()} UZS</span>
              <span className={`font-bold flex items-center ${isPositive ? 'text-valixen-telemetry-profit' : 'text-valixen-telemetry-risk'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4 mr-1 inline" /> : <TrendingDown className="w-4 h-4 mr-1 inline" />}
                {isPositive ? '+' : ''}{asset.changePercent24h}% (24h)
              </span>
            </div>
          </div>
        </div>

        {/* 3. Interactive Candlestick / Line Chart */}
        <GlassPanel variant="elevated" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-valixen-ice" />
              INTERACTIVE ORDERBOOK & HISTORICAL CANDLE TELEMETRY
            </h2>
            <Badge variant="cyan" dot className="text-[10px]">
              DETERMINISTIC PRECISION
            </Badge>
          </div>

          <InteractiveMarketChart
            candles={asset.candles}
            symbol={asset.symbol}
            currencyPrefix="$"
            activeTimeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
        </GlassPanel>

        {/* 4. Statistics Grid: 24h, 52w, All-Time High / Low */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">24H HIGH</span>
            <p className="text-sm font-mono font-bold text-valixen-telemetry-profit">${asset.high24h.toLocaleString()}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">24H LOW</span>
            <p className="text-sm font-mono font-bold text-valixen-telemetry-risk">${asset.low24h.toLocaleString()}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">ALL-TIME HIGH (ATH)</span>
            <p className="text-sm font-mono font-bold text-white">${asset.allTimeHighUsd.toLocaleString()}</p>
            <span className="text-[9px] font-mono text-slate-500 block">{new Date(asset.allTimeHighDate).toLocaleDateString()}</span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">ALL-TIME LOW (ATL)</span>
            <p className="text-sm font-mono font-bold text-white">${asset.allTimeLowUsd.toLocaleString()}</p>
            <span className="text-[9px] font-mono text-slate-500 block">{new Date(asset.allTimeLowDate).toLocaleDateString()}</span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">52-WEEK HIGH</span>
            <p className="text-sm font-mono font-bold text-slate-200">${asset.high52wUsd.toLocaleString()}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">52-WEEK LOW</span>
            <p className="text-sm font-mono font-bold text-slate-200">${asset.low52wUsd.toLocaleString()}</p>
          </div>
        </div>

        {/* 5. Currency Conversion Calculator & Official CBU Bulletin Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instant Calculator */}
          <GlassPanel variant="default" className="p-6 space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
              INSTANT CURRENCY CONVERTER
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Real-time multi-currency parity calculation based on live pricing
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  AMOUNT OF {asset.symbol}
                </label>
                <Input
                  type="number"
                  step="any"
                  value={calcAmount}
                  onChange={(e: any) => setCalcAmount(e.target.value)}
                  placeholder="1.0"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">VALUE IN US DOLLARS:</span>
                  <span className="text-white font-bold">${convertedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono border-t border-white/5 pt-2">
                  <span className="text-slate-400">VALUE IN UZBEKISTAN SOM:</span>
                  <span className="text-valixen-ice font-bold">{convertedUzs.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} UZS</span>
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Official Bulletin / Regulatory Notice */}
          <GlassPanel variant="default" className="p-6 space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-valixen-ice" />
              REGULATORY & METHODOLOGY INTELLIGENCE
            </h3>

            {asset.isOfficialRate ? (
              <div className="space-y-3 text-xs font-mono leading-relaxed">
                <div className="p-3 rounded-xl bg-valixen-ice/10 border border-valixen-ice/30 text-white">
                  <strong>Central Bank of Uzbekistan Official Fixing:</strong> This exchange rate is established daily by the Central Bank of Uzbekistan (Markaziy Bank) for accounting, taxation, and statutory customs settlements across the Republic of Uzbekistan.
                </div>
                <ul className="space-y-1.5 text-slate-400">
                  <li>• Official CBU Code: <strong className="text-white">{asset.officialRateInfo?.cbuCode || asset.symbol}</strong></li>
                  <li>• Daily Delta: <strong className="text-white">{asset.officialRateInfo?.diff || '0 UZS'}</strong></li>
                  <li>• Effective Date: <strong className="text-white">{asset.officialRateInfo?.effectiveDate || asset.lastUpdated}</strong></li>
                </ul>
              </div>
            ) : (
              <div className="space-y-3 text-xs font-mono leading-relaxed">
                <div className="p-3 rounded-xl bg-valixen-violet/10 border border-valixen-violet/30 text-white">
                  <strong>Global Free Market Spot Valuation:</strong> This asset is traded continuously 24/7/365 across global decentralized networks and institutional spot orderbooks.
                </div>
                <ul className="space-y-1.5 text-slate-400">
                  <li>• Market Capitalization: <strong className="text-white">{asset.marketCapUsd ? `$${(asset.marketCapUsd / 1e9).toFixed(2)} Billion` : 'N/A'}</strong></li>
                  <li>• 24h Trading Volume: <strong className="text-white">{asset.volume24hUsd ? `$${(asset.volume24hUsd / 1e6).toFixed(2)} Million` : 'N/A'}</strong></li>
                  <li>• Circulating Supply: <strong className="text-white">{asset.circulatingSupply || 'N/A'}</strong></li>
                </ul>
              </div>
            )}

            <p className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
              {asset.description}
            </p>
          </GlassPanel>
        </div>
      </main>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        symbol={asset.symbol}
        currentPrice={asset.priceUsd}
        onAlertCreated={handleAlertCreated}
      />

      {/* Comparison Modal */}
      {allAssets.length > 0 && (
        <AssetComparisonModal
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          baseAsset={asset}
          allAssets={allAssets}
        />
      )}
    </div>
  );
}
