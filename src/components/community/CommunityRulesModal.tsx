// ==============================================================================
// VALIXEN COMMUNITY RULES & COMPLIANCE MODAL / CARD
// Enforces zero fraud, no profit guarantees, anti-spam, and privacy protection
// ==============================================================================

'use client';

import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ShieldAlert, AlertTriangle, Lock, UserX, Clock, CheckCircle } from 'lucide-react';

interface CommunityRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommunityRulesModal({ isOpen, onClose }: CommunityRulesModalProps) {
  const rules = [
    {
      title: '1. No Investment Profit Guarantees',
      badge: 'STRICT BAN',
      icon: ShieldAlert,
      color: 'text-valixen-telemetry-loss',
      desc: 'Promising guaranteed returns, "risk-free" yield, 100% gains or "double your money" will result in immediate post removal and account review. All financial assets carry capital risk.',
    },
    {
      title: '2. No Misleading Financial Claims',
      badge: 'PROHIBITED',
      icon: AlertTriangle,
      color: 'text-valixen-gold',
      desc: 'Claims of "get rich quick", secret money glitches, or unverified speculative signals without methodology are strictly forbidden in this educational community.',
    },
    {
      title: '3. Anti-Spam & Cooldown Protection',
      badge: 'RATE LIMITED',
      icon: Clock,
      color: 'text-valixen-cyan',
      desc: 'A strict 15-second rate limiting cooldown applies between posts. Automated bots, promotional affiliate links, and duplicate spam will be automatically blacklisted.',
    },
    {
      title: '4. No Sharing Private Credentials',
      badge: 'CRITICAL SECURITY',
      icon: Lock,
      color: 'text-red-400',
      desc: 'Never post passwords, API secret keys, card numbers, CVVs, or seed phrases. Any attempt to expose private account credentials triggers automatic system redaction.',
    },
    {
      title: '5. Zero Impersonation Policy',
      badge: 'LEGAL WARNING',
      icon: UserX,
      color: 'text-purple-400',
      desc: 'Pretending to be official Veltron staff, certified portfolio managers, or support representatives is grounds for a permanent platform exclusion.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="VELTRON COMMUNITY CODE OF CONDUCT & INTEGRITY"
      size="lg"
    >
      <div className="space-y-4 pt-2 sm:px-0 md:px-0 lg:px-0">
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Veltron is an institutional-grade, merit-based financial intelligence and peer education network. To safeguard all allocators and learners, every dispatch and question is subject to real-time rule scanning.
        </p>

        <div className="space-y-3">
          {rules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] hover:border-white/[0.15] transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${rule.color}`} />
                    <span className="text-sm font-display font-bold text-white">{rule.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 border border-white/[0.06]">
                    {rule.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-normal pl-6">{rule.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="pt-3 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose} className="font-mono text-xs">
            <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> UNDERSTOOD & ACCEPTED
          </Button>
        </div>
      </div>
    </Modal>
  );
}
