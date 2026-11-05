// ==============================================================================
// VALIXEN ECONOMIC CALENDAR (/economic-calendar)
// Global Macro Releases, Central Bank Decisions & Algorithmic Catalyst Telemetry
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { MacroEventDTO } from '@/server/services/calendar.service';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import {
  Calendar,
  Globe,
  Clock,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Landmark,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';

export default function EconomicCalendarPage() {
  const [events, setEvents] = useState<MacroEventDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [impactFilter, setImpactFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const fetchCalendar = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const q = new URLSearchParams();
      if (countryFilter !== 'ALL') q.set('country', countryFilter);
      if (impactFilter !== 'ALL') q.set('impact', impactFilter);
      if (searchQuery.trim()) q.set('search', searchQuery.trim());

      const res = await fetch(`/api/v1/calendar?${q.toString()}`);
      if (!res.ok) throw new Error('Failed to load macroeconomic calendar data.');
      const json = await res.json();
      if (json.success && json.data?.events) {
        setEvents(json.data.events);
      } else {
        throw new Error(json.error?.message || 'Invalid server response structure.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to macroeconomic feed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [countryFilter, impactFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCalendar();
  };

  const highImpactCount = useMemo(() => events.filter((e) => e.impact === 'HIGH').length, [events]);

  const countryFlags: Record<string, string> = {
    UZ: '🇺🇿 UZB',
    US: '🇺🇸 USA',
    EU: '🇪🇺 EUR',
    GB: '🇬🇧 GBR',
    JP: '🇯🇵 JPN',
  };

  return (
    <div className="min-h-screen bg-[#090706] text-[#FAF7F1] flex flex-col font-sans selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <LuxuryNavbar />

      {/* 2. Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title and Top Indicators */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                MACRO REGIME TELEMETRY
              </Badge>
              <span className="text-xs font-mono text-slate-400">GLOBAL RATE MONITOR</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              MACROECONOMIC CALENDAR
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Real-time central bank policy decisions, consumer inflation benchmarks, and economic releases influencing cross-asset liquidity.
            </p>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={fetchCalendar}
            disabled={isLoading}
            className="flex items-center gap-2 text-xs font-mono self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            SYNC FEED
          </Button>
        </div>

        {/* Telemetry Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="HIGH IMPACT CATALYSTS"
            value={`${highImpactCount} Events`}
            change={{ value: '+2 this week', isPositive: true }}
            icon={<AlertTriangle className="w-4 h-4 text-valixen-telemetry-risk" />}
          />
          <StatCard
            title="KEY MONETARY POLICY"
            value="CBU 13.50% | FED 4.50%"
            change={{ value: 'Next Decision: Nov 5', isPositive: true }}
            icon={<Landmark className="w-4 h-4 text-valixen-ice" />}
          />
          <StatCard
            title="TRACKED JURISDICTIONS"
            value="5 Central Banks"
            change={{ value: 'UZ, US, EU, GB, JP', isPositive: true }}
            icon={<Globe className="w-4 h-4 text-valixen-violet" />}
          />
          <StatCard
            title="MARKET VOLATILITY SPREAD"
            value="VIX 14.82"
            change={{ value: '-1.2% Calm Regime', isPositive: true }}
            icon={<TrendingUp className="w-4 h-4 text-valixen-telemetry-profit" />}
          />
        </div>

        {/* Filter Controls Toolbar */}
        <GlassPanel variant="prismatic" className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> JURISDICTION:
            </span>
            {['ALL', 'UZ', 'US', 'EU', 'GB', 'JP'].map((c) => (
              <button
                key={c}
                onClick={() => setCountryFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  countryFilter === c
                    ? 'bg-valixen-violet text-white font-bold shadow-glow-violet'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {c === 'ALL' ? 'ALL NATIONS' : countryFlags[c] || c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
              className="bg-[#0E121B] border border-white/10 rounded-lg text-xs font-mono text-slate-300 px-3 py-2 outline-none focus:border-valixen-ice"
            >
              <option value="ALL">ALL IMPACT LEVELS</option>
              <option value="HIGH">HIGH IMPACT ONLY</option>
              <option value="MEDIUM">MEDIUM & HIGH</option>
              <option value="LOW">LOW IMPACT</option>
            </select>

            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search releases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0E121B] border border-white/10 rounded-lg text-xs font-mono pl-8 pr-3 py-2 text-white placeholder-slate-500 outline-none focus:border-valixen-ice"
              />
            </form>
          </div>
        </GlassPanel>

        {/* Error State */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-valixen-telemetry-risk/15 border border-valixen-telemetry-risk/40 text-xs font-mono text-white flex items-center justify-between">
            <span>{errorMessage}</span>
            <Button size="sm" variant="glass" onClick={fetchCalendar}>Retry</Button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        )}

        {/* Events Table / Card List */}
        {!isLoading && events.length === 0 && (
          <div className="text-center py-16 space-y-3 glass-panel p-8">
            <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-display font-bold text-white text-base">No Matching Macro Releases Found</h3>
            <p className="text-xs text-slate-400 font-sans">Try expanding your jurisdiction or impact filters.</p>
            <Button size="sm" variant="glass" onClick={() => { setCountryFilter('ALL'); setImpactFilter('ALL'); setSearchQuery(''); }}>
              Reset Filters
            </Button>
          </div>
        )}

        {!isLoading && events.length > 0 && (
          <div className="space-y-3">
            {events.map((event) => {
              const isExpanded = expandedEventId === event.id;
              const isHigh = event.impact === 'HIGH';

              return (
                <GlassPanel
                  key={event.id}
                  variant="prismatic"
                  className="p-4 sm:p-5 transition-all hover:border-white/20"
                >
                  <div
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                  >
                    {/* Left: Flag, Date, Title */}
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.04] border border-white/10 shrink-0 min-w-[72px] text-center">
                        <span className="text-xs font-mono font-bold text-valixen-ice">{event.date.slice(5)}</span>
                        <span className="text-[10px] font-mono text-slate-400">{event.time}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-300">
                            {countryFlags[event.countryCode] || event.country}
                          </span>
                          <Badge
                            variant={isHigh ? 'risk' : event.impact === 'MEDIUM' ? 'default' : 'cyan'}
                            dot
                            className="text-[10px] px-2 py-0.5"
                          >
                            {event.impact} IMPACT
                          </Badge>
                          <span className="text-[10px] font-mono text-slate-500">PERIOD: {event.period}</span>
                        </div>

                        <h3 className="text-base font-display font-bold text-white hover:text-valixen-ice transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans line-clamp-1">{event.source}</p>
                      </div>
                    </div>

                    {/* Right: Actual / Consensus / Previous Telemetry */}
                    <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/[0.06]">
                      <div className="grid grid-cols-3 gap-4 text-center text-xs font-mono">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Actual</div>
                          <div className="font-bold text-valixen-telemetry-profit">
                            {event.actual || 'PENDING'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Consensus</div>
                          <div className="font-bold text-slate-300">{event.consensus || '--'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Previous</div>
                          <div className="text-slate-400">{event.previous || '--'}</div>
                        </div>
                      </div>

                      <div className="text-slate-400 p-1 rounded-lg hover:bg-white/[0.05]">
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Context Drawer */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/[0.08] text-xs font-sans text-slate-300 space-y-2 bg-black/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 font-mono text-valixen-ice text-[11px] font-bold">
                        <Info className="w-3.5 h-3.5" /> INSTITUTIONAL QUANT INSIGHT
                      </div>
                      <p className="leading-relaxed">{event.description}</p>
                      <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-slate-500">
                        <span>DATA SOURCE: {event.source}</span>
                        <span>SOVEREIGN REGULATORY LEDGER SYNCHRONIZED</span>
                      </div>
                    </div>
                  )}
                </GlassPanel>
              );
            })}
          </div>
        )}
      </main>

      {/* Luxury Footer */}
      <LuxuryFooter />
    </div>
  );
}
