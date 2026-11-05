// ==============================================================================
// VALIXEN DESIGN SYSTEM: RESPONSIVE FINANCIAL GRID ARCHITECTURE
// 12-Column Quant Grid, Adaptive Breakpoints, and Split-Pane Cockpit Layouts
// ==============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

export interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  children: React.ReactNode;
  className?: string;
}

export function DashboardGrid({
  gap = 'md',
  columns = 12,
  children,
  className,
  ...props
}: DashboardGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-6 lg:gap-8',
    xl: 'gap-8 lg:gap-10',
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-12',
  };

  return (
    <div
      className={cn('grid w-full', colClasses[columns], gapClasses[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface GridColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  smSpan?: 1 | 2 | 3 | 4 | 6 | 12;
  mdSpan?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  lgSpan?: 1 | 2 | 3 | 4 | 6 | 8 | 9 | 10 | 12;
  children: React.ReactNode;
  className?: string;
}

export function GridCol({
  span = 12,
  smSpan,
  mdSpan,
  lgSpan,
  children,
  className,
  ...props
}: GridColProps) {
  const spanClasses: Record<number, string> = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
  };

  const smClasses: Record<number, string> = {
    1: 'sm:col-span-1',
    2: 'sm:col-span-2',
    3: 'sm:col-span-3',
    4: 'sm:col-span-4',
    6: 'sm:col-span-6',
    12: 'sm:col-span-12',
  };

  const mdClasses: Record<number, string> = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    6: 'md:col-span-6',
    8: 'md:col-span-8',
    12: 'md:col-span-12',
  };

  const lgClasses: Record<number, string> = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
    6: 'lg:col-span-6',
    8: 'lg:col-span-8',
    9: 'lg:col-span-9',
    10: 'lg:col-span-10',
    12: 'lg:col-span-12',
  };

  return (
    <div
      className={cn(
        spanClasses[span],
        smSpan && smClasses[smSpan],
        mdSpan && mdClasses[mdSpan],
        lgSpan && lgClasses[lgSpan],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SplitPaneProps {
  primary: React.ReactNode;
  secondary: React.ReactNode;
  ratio?: '50-50' | '60-40' | '70-30' | '65-35';
  className?: string;
}

export function SplitPane({
  primary,
  secondary,
  ratio = '70-30',
  className,
}: SplitPaneProps) {
  const ratioClasses = {
    '50-50': 'lg:grid-cols-2',
    '60-40': 'lg:grid-cols-5 [&>*:first-child]:lg:col-span-3 [&>*:last-child]:lg:col-span-2',
    '70-30': 'lg:grid-cols-12 [&>*:first-child]:lg:col-span-8 [&>*:last-child]:lg:col-span-4',
    '65-35': 'lg:grid-cols-12 [&>*:first-child]:lg:col-span-8 [&>*:last-child]:lg:col-span-4',
  };

  return (
    <div className={cn('grid grid-cols-1 gap-6 w-full', ratioClasses[ratio], className)}>
      <div>{primary}</div>
      <div>{secondary}</div>
    </div>
  );
}
