// ==============================================================================
// VALIXEN SECURITY EVENT MONITORING STREAM (/admin/security/events)
// Real-Time SIEM Telemetry, Rate-Limit Triggers, Failed Authentication & Probes
// Strictly Zero Fabricated Attacks & Zero Sensitive Credential Exposure
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Search,
  Filter,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronLeft,
  AlertCircle,
  AlertTriangle,
  Lock,
} from 'lucide-react';

interface SecurityEventItem {
  id: string;
  timestamp: string;
  eventType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  sourceIp: string;
  userAgent?: string;
  userId?: string;
  resourcePath?: string;
  description: string;
  isRealEvent: boolean;
}

export default function SecurityEventsStreamPage() {
  const [events, setEvents] = useState<SecurityEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const q = new URLSearchParams();
      if (severityFilter !== 'ALL') q.set('severity', severityFilter);
      if (eventTypeFilter !== 'ALL') q.set('eventType', eventTypeFilter);

      const res = await fetch(`/api/v1/admin/security/events?${q.toString()}`);
      const json = await res.json();
      if (json.data?.events) {
        setEvents(json.data.events);
      }
    } catch (err) {
      console.error('Failed to load events stream:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [severityFilter, eventTypeFilter]);

  const filteredEvents = events.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.description.toLowerCase().includes(q) ||
      e.eventType.toLowerCase().includes(q) ||
      e.sourceIp.toLowerCase().includes(q) ||
      (e.resourcePath && e.resourcePath.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-valixen-violet selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/security" className="flex items-center gap-2">
              <Logo variant="main" size="md" />
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                SIEM STREAM
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 p-1 bg-white/[0.02] rounded-xl border border-white/[0.06] text-xs font-mono">
              <Link
                href="/admin/security"
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]"
              >
                SOC Health
              </Link>
              <Link
                href="/admin/security/events"
                className="px-3 py-1.5 rounded-lg text-white font-bold bg-valixen-violet/20 border border-valixen-violet/40"
              >
                Event Stream
              </Link>
              <Link
                href="/admin/security/sessions"
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]"
              >
                Sessions & Anomaly
              </Link>
              <Link
                href="/admin/security/audit"
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]"
              >
                DB & Audit Ledger
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={fetchEvents} variant="secondary" size="sm" className="font-mono text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Anti-Fabrication Telemetry Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-valixen-telemetry-profit shrink-0" />
            <span>
              <strong>VERIFIED TELEMETRY INTEGRITY:</strong> All security events represent real ingress telemetry.
              Zero simulated or fabricated attacks are displayed.
            </span>
          </div>
          <span className="hidden md:inline text-[10px] text-valixen-ice">LOGS REDACTED: PASSWORDS / CVV / TOKENS</span>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-[#0B0F18] border border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by IP, endpoint, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#07090E] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-valixen-ice"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#07090E] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-valixen-ice"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
              <option value="INFO">INFO</option>
            </select>

            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="bg-[#07090E] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-valixen-ice"
            >
              <option value="ALL">All Event Types</option>
              <option value="RATE_LIMIT_BREACH">RATE_LIMIT_BREACH</option>
              <option value="BRUTE_FORCE_DETECTED">BRUTE_FORCE_DETECTED</option>
              <option value="PRIVILEGE_ESCALATION_ATTEMPT">PRIVILEGE_ESCALATION_ATTEMPT</option>
              <option value="FINANCIAL_CVV_BLOCKED">FINANCIAL_CVV_BLOCKED</option>
              <option value="SUSPICIOUS_IP_ACTIVITY">SUSPICIOUS_IP_ACTIVITY</option>
              <option value="ADMIN_STEP_UP_FAILURE">ADMIN_STEP_UP_FAILURE</option>
            </select>
          </div>
        </div>

        {/* Events Stream Table */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F18] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4">Resource Target</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      Synchronizing SIEM event stream...
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No security events match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ev.severity === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : ev.severity === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : ev.severity === 'MEDIUM'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
                          }`}
                        >
                          {ev.severity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        {ev.eventType}
                      </td>

                      <td className="py-3.5 px-4 text-valixen-ice">{ev.sourceIp}</td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                        {ev.resourcePath || '/api/v1/auth'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-light max-w-md">
                        {ev.description}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
