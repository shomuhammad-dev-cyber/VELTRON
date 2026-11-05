// ==============================================================================
// VALIXEN MACROECONOMIC CALENDAR SERVICE
// Institutional Global Macro Indicators, Central Bank Policies & Telemetry
// ==============================================================================

import { db } from '@/lib/db';

export type EconomicImpact = 'HIGH' | 'MEDIUM' | 'LOW';

export interface MacroEventDTO {
  id: string;
  title: string;
  country: string;
  countryCode: string;
  date: string;
  time: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  period: string;
  actual: string | null;
  consensus: string | null;
  previous: string | null;
  unit: string | null;
  description: string;
  source: string;
  isUpcoming: boolean;
}

export const INITIAL_MACRO_EVENTS: Omit<MacroEventDTO, 'id' | 'isUpcoming'>[] = [
  {
    title: 'CBU Refinancing Key Rate Decision',
    country: 'Uzbekistan',
    countryCode: 'UZ',
    date: '2026-11-05',
    time: '11:00 UZT',
    impact: 'HIGH',
    period: 'Q4 2026',
    actual: null,
    consensus: '13.50%',
    previous: '13.50%',
    unit: '%',
    description: 'Central Bank of the Republic of Uzbekistan monetary policy committee decision balancing disinflation trajectory and FX stability.',
    source: 'Central Bank of Uzbekistan',
  },
  {
    title: 'Federal Reserve FOMC Interest Rate Decision',
    country: 'United States',
    countryCode: 'US',
    date: '2026-11-06',
    time: '14:00 EST',
    impact: 'HIGH',
    period: 'Nov 2026',
    actual: null,
    consensus: '4.25%',
    previous: '4.50%',
    unit: '%',
    description: 'Federal Open Market Committee target range for the federal funds rate and forward policy guidance.',
    source: 'Federal Reserve Board',
  },
  {
    title: 'US Non-Farm Payrolls (NFP) & Unemployment',
    country: 'United States',
    countryCode: 'US',
    date: '2026-11-07',
    time: '08:30 EST',
    impact: 'HIGH',
    period: 'October',
    actual: null,
    consensus: '175K',
    previous: '185K',
    unit: 'K',
    description: 'Comprehensive employment report detailing net employment additions across all non-agricultural commercial enterprises.',
    source: 'U.S. Bureau of Labor Statistics',
  },
  {
    title: 'European Central Bank (ECB) Main Refinancing Rate',
    country: 'Eurozone',
    countryCode: 'EU',
    date: '2026-11-10',
    time: '13:45 CET',
    impact: 'HIGH',
    period: 'November',
    actual: null,
    consensus: '3.00%',
    previous: '3.25%',
    unit: '%',
    description: 'Governing Council interest rate decision on deposit facility and main refinancing operations across the Euro currency area.',
    source: 'European Central Bank',
  },
  {
    title: 'Uzbekistan Consumer Price Index (CPI YoY)',
    country: 'Uzbekistan',
    countryCode: 'UZ',
    date: '2026-11-12',
    time: '10:00 UZT',
    impact: 'MEDIUM',
    period: 'October',
    actual: null,
    consensus: '8.9%',
    previous: '9.2%',
    unit: '%',
    description: 'Annualized headline consumer inflation rate published by the Statistics Agency under the President of the Republic of Uzbekistan.',
    source: 'Statistics Agency of Uzbekistan',
  },
  {
    title: 'Bank of England (BoE) Official Bank Rate',
    country: 'United Kingdom',
    countryCode: 'GB',
    date: '2026-11-14',
    time: '12:00 GMT',
    impact: 'HIGH',
    period: 'November',
    actual: null,
    consensus: '4.50%',
    previous: '4.75%',
    unit: '%',
    description: 'Monetary Policy Committee vote outcome on the benchmark lending rate and quantitative asset purchase targets.',
    source: 'Bank of England',
  },
  {
    title: 'US Core Consumer Price Index (CPI MoM)',
    country: 'United States',
    countryCode: 'US',
    date: '2026-11-18',
    time: '08:30 EST',
    impact: 'HIGH',
    period: 'October',
    actual: null,
    consensus: '0.2%',
    previous: '0.3%',
    unit: '%',
    description: 'Key gauge of underlying inflation excluding volatile food and energy expenditures monitored closely by algorithmic quant funds.',
    source: 'U.S. Bureau of Labor Statistics',
  },
  {
    title: 'Bank of Japan (BoJ) Policy Balance Rate',
    country: 'Japan',
    countryCode: 'JP',
    date: '2026-11-20',
    time: '03:00 GMT',
    impact: 'MEDIUM',
    period: 'Q4',
    actual: null,
    consensus: '0.50%',
    previous: '0.25%',
    unit: '%',
    description: 'Policy rate review addressing JPY carry trade unwinding pressures and corporate wage growth benchmarks.',
    source: 'Bank of Japan',
  },
];

export class EconomicCalendarService {
  /**
   * Retrieves macroeconomic calendar releases with multi-country and impact filtering
   */
  public static async getEvents(options: {
    countryCode?: string;
    impact?: string;
    search?: string;
  } = {}): Promise<MacroEventDTO[]> {
    const today = new Date().toISOString().slice(0, 10);

    let events = INITIAL_MACRO_EVENTS.map((e, idx) => ({
      ...e,
      id: `macro-ev-${idx + 1}`,
      isUpcoming: e.date >= today,
    }));

    if (options.countryCode && options.countryCode !== 'ALL') {
      events = events.filter((e) => e.countryCode === options.countryCode);
    }

    if (options.impact && options.impact !== 'ALL') {
      events = events.filter((e) => e.impact === options.impact);
    }

    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.country.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    return events;
  }
}
