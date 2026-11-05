import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind classes with collision resolution
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric value into international fiat currency format
 */
export function formatCurrency(
  value: number | string,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

/**
 * Formats high-precision cryptocurrency and asset quantities
 */
export function formatCryptoUnits(value: number | string, maxDecimals: number = 6): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return '0.00';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  }).format(numericValue);
}

/**
 * Formats percentage with directional indicator (+/-)
 */
export function formatPercent(value: number, includeSign: boolean = true): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Truncates an address or transaction hash safely (0x1234...abcd)
 */
export function truncateHash(hash: string, startLength: number = 6, endLength: number = 4): string {
  if (!hash || hash.length <= startLength + endLength) return hash || '';
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}
