// ==============================================================================
// VALIXEN SUSPICIOUS SESSIONS & ACCESS MONITOR (/admin/security/sessions)
// Real-Time Active Session Telemetry, Velocity Anomaly Detection & Remote Revocation
// Strictly Protected: SYSTEM_ADMIN & COMPLIANCE_OFFICER Only
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  UserX,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Clock,
  Laptop,
  Smartphone,
  Terminal,
  Globe,
  Lock,
} from 'lucide-react';

interface ActiveSessionItem {
  id: string;
  userId: string;
  userEmail: string;
  userRole: string;
  ipAddress: string;
  country: string;
  deviceType: 'DESKTOP' | 'MOBILE' | 'API_TOKEN';
  browser: string;
  isSuspicious: boolean;
  suspicionReason?: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
}

export default function SecuritySessionsPage() {
  const [sessions, setSessions] = useState<ActiveSessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSessionToRevoke, setSelectedSessionToRevoke] = useState<ActiveSessionItem | null>(null);
  const [revokeReason, setRevokeReason] = useState('Suspicious impossible travel velocity anomaly identified.');
  const [isRevoking, setIsRevoking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/admin/security/sessions');
      const json = await res.json();
      if (json.data?.sessions) {
        setSessions(json.data.sessions);
      }
    } catch (err) {
      console.error('Failed to load active sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionToRevoke || isRevoking) return;
    setIsRevoking(true);

    try {
      const res = await fetch('/api/v1/admin/security/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSessionToRevoke.id,
          reason: revokeReason,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Session termination failed');

      showToast(`Session ${selectedSessionToRevoke.id} revoked. Cryptographic audit block emitted.`);
      setSelectedSessionToRevoke(null);
      fetchSessions();
    } catch (err: any) {
      alert(err.message || 'Error revoking session');
    } finally {
      setIsRevoking(false);
    }
  };

  const getDeviceIcon = (dev: string) => {
    switch (dev) {
      case 'DESKTOP':
        return <Laptop className="w-4 h-4 text-slate-400" />;
      case 'MOBILE':
        return <Smartphone className="w-4 h-4 text-slate-400" />;
      default:
        return <Terminal className="w-4 h-4 text-valixen-ice" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-valixen-violet selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/security" className="flex items-center gap-2">
              <Logo variant="main" size="md" />
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                SESSIONS MONITOR
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
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]"
              >
                Event Stream
              </Link>
              <Link
                href="/admin/security/sessions"
                className="px-3 py-1.5 rounded-lg text-white font-bold bg-valixen-violet/20 border border-valixen-violet/40"
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
            <Button onClick={fetchSessions} variant="secondary" size="sm" className="font-mono text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#0D121F] border border-valixen-ice/30 text-white text-xs font-mono flex items-center gap-3 shadow-2xl">
            <ShieldCheck className="w-4 h-4 text-valixen-telemetry-profit" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-[#0B0F18] border border-white/[0.08]">
            <span className="text-slate-400 text-[10px] uppercase">Active User Sessions</span>
            <p className="text-2xl font-bold text-white mt-1">{sessions.length} Live Sessions</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0B0F18] border border-white/[0.08]">
            <span className="text-slate-400 text-[10px] uppercase">Suspicious Velocity Flags</span>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {sessions.filter((s) => s.isSuspicious).length} Flagged
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0B0F18] border border-white/[0.08]">
            <span className="text-slate-400 text-[10px] uppercase">Session Expiry Guard</span>
            <p className="text-2xl font-bold text-valixen-telemetry-profit mt-1">8h Inactive Timeout</p>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F18] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400">
                <tr>
                  <th className="py-3 px-4">User Identity</th>
                  <th className="py-3 px-4">Device & Client</th>
                  <th className="py-3 px-4">IP Address & Origin</th>
                  <th className="py-3 px-4">Session Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {sessions.map((sess) => (
                  <tr
                    key={sess.id}
                    className={`transition-colors ${
                      sess.isSuspicious ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-white leading-tight">{sess.userEmail}</p>
                        <span className="text-[10px] text-slate-400">{sess.userRole}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(sess.deviceType)}
                        <span className="text-slate-300 truncate max-w-[180px]">{sess.browser}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <p className="text-valixen-ice">{sess.ipAddress}</p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {sess.country}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {sess.isSuspicious ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 font-bold flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" />
                            SUSPICIOUS
                          </span>
                          <p className="text-[10px] text-red-300 font-light max-w-xs">{sess.suspicionReason}</p>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          NORMAL
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(sess.lastActiveAt).toLocaleTimeString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        onClick={() => setSelectedSessionToRevoke(sess)}
                        variant={sess.isSuspicious ? 'danger' : 'secondary'}
                        size="sm"
                        className="text-[10px] px-2.5 py-1"
                      >
                        Terminate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Revocation Modal */}
      {selectedSessionToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-[#0C101A] border border-white/[0.1] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white font-display">Terminate Active Session</h3>
              <button
                onClick={() => setSelectedSessionToRevoke(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleRevokeSession} className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-slate-400 text-[10px]">AFFECTED ACCOUNT</span>
                <p className="text-white font-bold">{selectedSessionToRevoke.userEmail}</p>
                <p className="text-slate-400 text-[10px]">
                  IP: {selectedSessionToRevoke.ipAddress} • {selectedSessionToRevoke.country}
                </p>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400">Security Justification *</label>
                <textarea
                  required
                  rows={3}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-valixen-ice"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedSessionToRevoke(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isRevoking}
                  variant="danger"
                  size="sm"
                >
                  {isRevoking ? 'Revoking...' : 'Confirm Immediate Revocation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
