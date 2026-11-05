// ==============================================================================
// VALIXEN COMMUNITY NAVIGATION TABS
// Clean unified navigation across Community, Discussions, Questions & Profile
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, HelpCircle, User, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface CommunityNavTabsProps {
  onOpenRules?: () => void;
}

export function CommunityNavTabs({ onOpenRules }: CommunityNavTabsProps) {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Overview & Radar',
      href: '/community',
      icon: Globe,
      isActive: pathname === '/community',
    },
    {
      name: 'Discussions',
      href: '/community/discussions',
      icon: MessageSquare,
      badge: 'Peer Ideas',
      isActive: pathname === '/community/discussions',
    },
    {
      name: 'Questions & Answers',
      href: '/community/questions',
      icon: HelpCircle,
      badge: 'Solvers',
      isActive: pathname === '/community/questions',
    },
    {
      name: 'My Reputation Profile',
      href: '/community/profile',
      icon: User,
      badge: 'XP & Badges',
      isActive: pathname === '/community/profile',
    },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 sm:px-0 md:px-0 lg:px-0">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                tab.isActive
                  ? 'bg-valixen-violet/20 border border-valixen-violet/50 text-white font-bold shadow-glow-violet'
                  : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.isActive ? 'text-valixen-ice' : 'text-slate-400'}`} />
              <span>{tab.name}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    tab.isActive
                      ? 'bg-valixen-violet text-white font-bold'
                      : 'bg-white/[0.08] text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {onOpenRules && (
        <button
          onClick={onOpenRules}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono bg-valixen-gold/10 border border-valixen-gold/30 text-valixen-gold hover:bg-valixen-gold/20 transition-all self-start md:self-auto"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>COMMUNITY RULES (ZERO FRAUD)</span>
        </button>
      )}
    </div>
  );
}
