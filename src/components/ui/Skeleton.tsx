// ==============================================================================
// VALIXEN DESIGN SYSTEM: METALLIC SKELETON SHIMMER
// ==============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-valixen-obsidian-surface/60 border border-white/5 animate-pulse',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
}
