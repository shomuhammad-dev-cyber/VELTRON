// ==============================================================================
// VALIXEN FINANCIAL TRADING TERMINAL CHART COMPONENT
// Dual-Mode Interactive Line & Candlestick Chart with Volume Histogram & HUD
// ==============================================================================

'use client';

import React, { useState, useMemo } from 'react';
import { CandleDataPoint } from '@/server/services/market.service';

export interface InteractiveMarketChartProps {
  candles: Record<'24H' | '7D' | '30D' | '90D' | '1Y', CandleDataPoint[]>;
  symbol: string;
  currencyPrefix?: string;
  activeTimeframe: '24H' | '7D' | '30D' | '90D' | '1Y';
  onTimeframeChange: (tf: '24H' | '7D' | '30D' | '90D' | '1Y') => void;
  className?: string;
}

export function InteractiveMarketChart({
  candles,
  symbol,
  currencyPrefix = '$',
  activeTimeframe,
  onTimeframeChange,
  className,
}: InteractiveMarketChartProps) {
  const [chartType, setChartType] = useState<'line' | 'candle'>('candle');
  const [hoveredPoint, setHoveredPoint] = useState<CandleDataPoint | null>(null);

  const activeCandles = candles[activeTimeframe] || [];

  // Calculate scales and ranges
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (activeCandles.length === 0) {
      return { minPrice: 0, maxPrice: 100, maxVolume: 1000 };
    }
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    for (const c of activeCandles) {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    }

    const padding = (max - min) * 0.08 || min * 0.05;
    return {
      minPrice: Math.max(0, min - padding),
      maxPrice: max + padding,
      maxVolume: maxVol || 1,
    };
  }, [activeCandles]);

  // Chart dimensions in SVG coordinates
  const svgWidth = 800;
  const svgHeight = 360;
  const volumeHeight = 70;
  const priceChartHeight = svgHeight - volumeHeight - 30;

  // Coordinate mappers
  const getY = (val: number) => {
    if (maxPrice === minPrice) return priceChartHeight / 2;
    return priceChartHeight - ((val - minPrice) / (maxPrice - minPrice)) * priceChartHeight;
  };

  const getVolY = (vol: number) => {
    return svgHeight - (vol / maxVolume) * volumeHeight;
  };

  // Generate SVG Path for Line Chart
  const linePath = useMemo(() => {
    if (activeCandles.length === 0) return '';
    const step = svgWidth / (activeCandles.length - 1 || 1);

    return activeCandles.reduce((acc, point, index) => {
      const x = index * step;
      const y = getY(point.close);
      return index === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [activeCandles, minPrice, maxPrice]);

  // Generate Area Fill Path
  const areaPath = useMemo(() => {
    if (!linePath) return '';
    const lastX = svgWidth;
    return `${linePath} L ${lastX},${priceChartHeight} L 0,${priceChartHeight} Z`;
  }, [linePath, priceChartHeight]);

  // Current display point (either hovered or the latest candle)
  const displayPoint = hoveredPoint || activeCandles[activeCandles.length - 1] || null;

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* 1. Header Toolbar with Chart Type Switcher & Timeframes */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        {/* Real-time Hover HUD Stats */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          {displayPoint ? (
            <>
              <div>
                <span className="text-slate-500 mr-1">DATE:</span>
                <span className="text-white font-bold">{displayPoint.date}</span>
              </div>
              <div>
                <span className="text-slate-500 mr-1">O:</span>
                <span className="text-white font-bold">{currencyPrefix}{displayPoint.open.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 mr-1">H:</span>
                <span className="text-valixen-telemetry-profit font-bold">{currencyPrefix}{displayPoint.high.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 mr-1">L:</span>
                <span className="text-valixen-telemetry-risk font-bold">{currencyPrefix}{displayPoint.low.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 mr-1">C:</span>
                <span className={`font-bold ${displayPoint.close >= displayPoint.open ? 'text-valixen-telemetry-profit' : 'text-valixen-telemetry-risk'}`}>
                  {currencyPrefix}{displayPoint.close.toLocaleString()}
                </span>
              </div>
              <div className="hidden sm:inline">
                <span className="text-slate-500 mr-1">VOL:</span>
                <span className="text-slate-300 font-bold">{displayPoint.volume.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <span className="text-slate-500">Awaiting market candle telemetry...</span>
          )}
        </div>

        {/* Chart View Modes & Timeframe Filters */}
        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                chartType === 'line'
                  ? 'bg-valixen-ice/20 text-valixen-ice font-bold border border-valixen-ice/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              LINE
            </button>
            <button
              onClick={() => setChartType('candle')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                chartType === 'candle'
                  ? 'bg-valixen-violet text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CANDLES
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs font-mono">
            {(['24H', '7D', '30D', '90D', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeTimeframe === tf
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main SVG Chart Container */}
      <div className="relative w-full overflow-hidden bg-[#07090E]/80 rounded-2xl border border-white/[0.08] p-4 select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-80 sm:h-96 overflow-visible"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            {/* Area gradient for line chart */}
            <linearGradient id="marketAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#07090E" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={priceChartHeight * 0.25} x2={svgWidth} y2={priceChartHeight * 0.25} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="0" y1={priceChartHeight * 0.5} x2={svgWidth} y2={priceChartHeight * 0.5} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="0" y1={priceChartHeight * 0.75} x2={svgWidth} y2={priceChartHeight * 0.75} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="0" y1={priceChartHeight} x2={svgWidth} y2={priceChartHeight} stroke="rgba(255,255,255,0.08)" />

          {/* VOLUME DIVIDER */}
          <text x="4" y={priceChartHeight + 16} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">
            VOLUME TELEMETRY
          </text>

          {/* RENDERING: LINE CHART MODE */}
          {chartType === 'line' && (
            <>
              <path d={areaPath} fill="url(#marketAreaGradient)" />
              <path d={linePath} fill="none" stroke="#00F0FF" strokeWidth="2.5" filter="url(#neonGlow)" />
            </>
          )}

          {/* RENDERING: CANDLESTICK & VOLUME MODE */}
          {activeCandles.map((candle, idx) => {
            const candleWidth = Math.max(3, (svgWidth / activeCandles.length) * 0.68);
            const xCenter = (idx + 0.5) * (svgWidth / activeCandles.length);
            const xLeft = xCenter - candleWidth / 2;

            const isBullish = candle.close >= candle.open;
            const candleColor = isBullish ? '#00E599' : '#FF3B30';

            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);
            const yHigh = getY(candle.high);
            const yLow = getY(candle.low);

            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

            // Volume bar coordinates
            const volY = getVolY(candle.volume);
            const volHeight = Math.max(1, svgHeight - volY);

            const isHovered = hoveredPoint?.timestamp === candle.timestamp;

            return (
              <g
                key={candle.timestamp}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredPoint(candle)}
              >
                {/* Transparent hit area for easy hovering */}
                <rect
                  x={xCenter - (svgWidth / activeCandles.length) / 2}
                  y={0}
                  width={svgWidth / activeCandles.length}
                  height={svgHeight}
                  fill="transparent"
                />

                {/* Vertical Crosshair Line when hovered */}
                {isHovered && (
                  <line
                    x1={xCenter}
                    y1={0}
                    x2={xCenter}
                    y2={svgHeight}
                    stroke="rgba(0, 240, 255, 0.4)"
                    strokeDasharray="3 3"
                  />
                )}

                {/* VOLUME BAR */}
                <rect
                  x={xLeft}
                  y={volY}
                  width={candleWidth}
                  height={volHeight}
                  fill={candleColor}
                  opacity={isHovered ? 0.9 : 0.45}
                />

                {/* CANDLESTICK */}
                {chartType === 'candle' && (
                  <>
                    {/* Wick Line (High to Low) */}
                    <line
                      x1={xCenter}
                      y1={yHigh}
                      x2={xCenter}
                      y2={yLow}
                      stroke={candleColor}
                      strokeWidth="1.5"
                    />

                    {/* Candle Body */}
                    <rect
                      x={xLeft}
                      y={bodyTop}
                      width={candleWidth}
                      height={bodyHeight}
                      fill={candleColor}
                      rx="1"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Bottom Time Labels */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-white/5">
          <span>{activeCandles[0]?.date || 'Start'}</span>
          <span>{activeCandles[Math.floor(activeCandles.length / 2)]?.date || 'Mid'}</span>
          <span>{activeCandles[activeCandles.length - 1]?.date || 'Latest'}</span>
        </div>
      </div>
    </div>
  );
}
