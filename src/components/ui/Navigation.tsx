// ==============================================================================
// VELTRON DESIGN SYSTEM: NAVIGATION FRAMEWORK
// Universal Navbar, Dashboard Sidebar, Sliding Glass Tabs, and Breadcrumbs
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { ChevronRight, Sparkles, Activity } from 'lucide-react';

/* ------------------------------------------------------------------------------
   1. TOP NAVIGATION BAR (NAVBAR)
   ------------------------------------------------------------------------------ */

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface NavbarProps {
  items?: NavItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

export function Navbar({
  items = [
    { label: 'TERMINAL', href: '#terminal' },
    { label: 'QUANT AI', href: '#ai', badge: 'v2.4' },
    { label: 'MARKETS', href: '#markets' },
    { label: 'PORTFOLIO', href: '#portfolio' },
    { label: 'SECURITY', href: '#security' },
  ],
  activeHref = '#terminal',
  onNavigate,
  rightSlot,
  className,
}: NavbarProps) {
  const [current, setCurrent] = useState(activeHref);

  const handleClick = (href: string) => {
    setCurrent(href);
    onNavigate?.(href);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-white/[0.08] bg-valixen-obsidian/80 backdrop-blur-2xl transition-all duration-300',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Brand Identity */}
        <div className="flex items-center gap-8">
          <Logo variant="main" size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] rounded-full border border-white/[0.06]">
            {items.map((item) => {
              const isActive = current === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => handleClick(item.href)}
                  className={cn(
                    'relative px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-200 flex items-center gap-1.5',
                    isActive
                      ? 'text-white bg-white/10 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  )}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-valixen-ice shadow-[0_0_8px_#00F0FF]" />
                  )}
                  {item.label}
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-valixen-violet/20 text-valixen-violet-light border border-valixen-violet/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Telemetry Status & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-valixen-obsidian-surface border border-white/[0.06] text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-valixen-telemetry-profit opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-valixen-telemetry-profit" />
            </span>
            <span className="text-slate-400">ENGINE:</span>
            <span className="text-valixen-telemetry-profit font-semibold">OPTIMAL (14ms)</span>
          </div>

          {rightSlot || (
            <button className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-valixen-violet to-purple-600 shadow-glow-violet hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] border border-white/20 transition-all duration-200">
              CONNECT WALLET
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------------------
   2. SLIDING GLASS TABS
   ------------------------------------------------------------------------------ */

export interface TabOption {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ options, activeId, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 rounded-xl bg-valixen-obsidian-surface/90 border border-white/[0.08] backdrop-blur-xl',
        className
      )}
    >
      {options.map((opt) => {
        const isActive = opt.id === activeId;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              'relative px-4 py-2 rounded-lg text-xs font-mono tracking-wide transition-all duration-200 flex items-center gap-2 select-none',
              isActive
                ? 'text-white bg-gradient-to-r from-valixen-violet/25 to-purple-600/25 border border-valixen-violet/40 shadow-glow-violet font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            )}
          >
            {opt.icon && <span className="opacity-80">{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-mono',
                  isActive
                    ? 'bg-valixen-violet/40 text-white'
                    : 'bg-white/5 text-slate-400'
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------------------
   3. FINANCIAL DASHBOARD SIDEBAR NAVIGATION
   ------------------------------------------------------------------------------ */

export interface SidebarLink {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  category?: string;
}

export interface SidebarProps {
  links: SidebarLink[];
  activeId: string;
  onSelect: (id: string) => void;
  isCollapsed?: boolean;
  className?: string;
}

export function Sidebar({
  links,
  activeId,
  onSelect,
  isCollapsed = false,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'h-full border-r border-white/[0.08] bg-valixen-obsidian-surface/80 backdrop-blur-2xl flex flex-col justify-between transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <Logo variant="symbol" size="sm" />
          {!isCollapsed && (
            <span className="font-display font-bold text-white tracking-wider text-base">
              VELTRON
            </span>
          )}
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = link.id === activeId;
            return (
              <button
                key={link.id}
                onClick={() => onSelect(link.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-200',
                  isActive
                    ? 'text-white bg-gradient-to-r from-valixen-violet/20 to-purple-600/10 border border-valixen-violet/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                )}
              >
                <span className={cn('text-lg', isActive ? 'text-valixen-ice' : 'text-slate-400')}>
                  {link.icon}
                </span>
                {!isCollapsed && <span className="flex-1 text-left font-medium">{link.label}</span>}
                {!isCollapsed && link.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-valixen-ice/15 text-valixen-ice border border-valixen-ice/30">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t border-white/[0.06]">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-valixen-violet to-valixen-ice flex items-center justify-center font-bold text-black text-xs">
                VX
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">QUANT PROTOCOL</p>
                <p className="text-[10px] font-mono text-valixen-telemetry-profit">TIER-3 ACTIVE</p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-valixen-ice" />
          </div>
        </div>
      )}
    </aside>
  );
}

/* ------------------------------------------------------------------------------
   4. BREADCRUMBS
   ------------------------------------------------------------------------------ */

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav className={cn('flex items-center gap-2 text-xs font-mono text-slate-400', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <a href={item.href} className="hover:text-valixen-ice transition-colors">
                {item.label}
              </a>
            ) : (
              <span className={isLast ? 'text-white font-semibold' : 'text-slate-400'}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
