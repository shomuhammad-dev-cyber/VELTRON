// ==============================================================================
// VALIXEN ASSET COMPARISON MODAL COMPONENT
// Side-by-Side Dual-Asset Metrics & Valuation Delta Comparison
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MarketAssetSummary } from '@/server/services/market.service';

export interface AssetComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseAsset: MarketAssetSummary;
  allAssets: MarketAssetSummary[];
}

export function AssetComparisonModal({
  isOpen,
  onClose,
  baseAsset,
  allAssets,
}: AssetComparisonModalProps) {
  const [selectedSymbol, setSelectedSymbol] = useState(
    allAssets.find((a) => a.symbol !== baseAsset.symbol)?.symbol || 'ETH'
  );

  const compareAsset = allAssets.find((a) => a.symbol === selectedSymbol) || allAssets[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CROSS-ASSET INTELLIGENCE COMPARISON"
      size="lg"
    >
      <div className="space-y-6">
        {/* Asset Selection Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">BASE ASSET:</span>
            <span className="text-sm font-display font-bold text-valixen-ice">
              {baseAsset.symbol} ({baseAsset.name})
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-slate-400">COMPARE TO:</span>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-[#0E121B] border border-white/20 text-white font-mono text-xs rounded-lg px-3 py-1.5 focus:outline-none"
            >
              {allAssets
                .filter((a) => a.symbol !== baseAsset.symbol)
                .map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} - {a.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.04] text-[10px] text-slate-400 uppercase">
              <tr>
                <th className="py-2.5 px-4">METRIC</th>
                <th className="py-2.5 px-4 text-valixen-ice">{baseAsset.symbol}</th>
                <th className="py-2.5 px-4 text-valixen-violet">{compareAsset.symbol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              <tr>
                <td className="py-3 px-4 text-slate-400">Asset Class</td>
                <td className="py-3 px-4 font-bold">{baseAsset.category}</td>
                <td className="py-3 px-4 font-bold">{compareAsset.category}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400">Price (USD)</td>
                <td className="py-3 px-4 font-bold">${baseAsset.priceUsd.toLocaleString()}</td>
                <td className="py-3 px-4 font-bold">${compareAsset.priceUsd.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400">Price (UZS)</td>
                <td className="py-3 px-4 font-bold">{baseAsset.priceUzs.toLocaleString()} UZS</td>
                <td className="py-3 px-4 font-bold">{compareAsset.priceUzs.toLocaleString()} UZS</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400">24h Change</td>
                <td className={`py-3 px-4 font-bold ${baseAsset.changePercent24h >= 0 ? 'text-valixen-telemetry-profit' : 'text-valixen-telemetry-risk'}`}>
                  {baseAsset.changePercent24h >= 0 ? '+' : ''}{baseAsset.changePercent24h}%
                </td>
                <td className={`py-3 px-4 font-bold ${compareAsset.changePercent24h >= 0 ? 'text-valixen-telemetry-profit' : 'text-valixen-telemetry-risk'}`}>
                  {compareAsset.changePercent24h >= 0 ? '+' : ''}{compareAsset.changePercent24h}%
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400">Market Cap</td>
                <td className="py-3 px-4">
                  {baseAsset.marketCapUsd ? `$${(baseAsset.marketCapUsd / 1e9).toFixed(1)}B` : 'Sovereign M0/M2'}
                </td>
                <td className="py-3 px-4">
                  {compareAsset.marketCapUsd ? `$${(compareAsset.marketCapUsd / 1e9).toFixed(1)}B` : 'Sovereign M0/M2'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400">Regulatory Model</td>
                <td className="py-3 px-4">
                  <Badge variant={baseAsset.isOfficialRate ? 'cyan' : 'default'} className="text-[9px]">
                    {baseAsset.isOfficialRate ? 'CBU Official Rate' : 'Free Market Spot'}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={compareAsset.isOfficialRate ? 'cyan' : 'default'} className="text-[9px]">
                    {compareAsset.isOfficialRate ? 'CBU Official Rate' : 'Free Market Spot'}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 text-right">
          <Button onClick={onClose} variant="secondary" size="sm" className="font-mono text-xs">
            CLOSE COMPARISON
          </Button>
        </div>
      </div>
    </Modal>
  );
}
