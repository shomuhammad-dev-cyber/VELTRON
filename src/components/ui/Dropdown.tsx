// ==============================================================================
// VALIXEN DESIGN SYSTEM: LIQUID TITANIUM DROPDOWN MENU
// Interactive contextual popover, currency selectors, and action menus
// ==============================================================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export interface DropdownItemProps {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  selected?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: (DropdownItemProps | 'separator')[];
  align?: 'left' | 'right';
  width?: string;
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  align = 'right',
  width = 'w-60',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer select-none">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute mt-2 z-50 rounded-xl bg-valixen-obsidian-surface/95 backdrop-blur-2xl border border-white/[0.12] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150 ease-cinematic',
            width,
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {/* Subtle top specular sheen */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="space-y-0.5">
            {items.map((item, index) => {
              if (item === 'separator') {
                return <div key={index} className="my-1.5 h-px bg-white/[0.08]" />;
              }

              return (
                <button
                  key={index}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all duration-150 text-left select-none',
                    item.disabled
                      ? 'opacity-40 cursor-not-allowed text-slate-500'
                      : item.destructive
                      ? 'text-valixen-telemetry-risk hover:bg-valixen-telemetry-risk/10'
                      : item.selected
                      ? 'bg-valixen-violet/20 text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.icon && <span className="text-slate-400">{item.icon}</span>}
                    <div>
                      <p className="truncate leading-tight">{item.label}</p>
                      {item.sublabel && (
                        <p className="text-[10px] text-slate-500 font-sans">{item.sublabel}</p>
                      )}
                    </div>
                  </div>

                  {item.shortcut && (
                    <span className="text-[10px] text-slate-500 font-mono tracking-wider ml-2">
                      {item.shortcut}
                    </span>
                  )}
                  {item.selected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-valixen-ice shadow-[0_0_6px_#00F0FF]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
