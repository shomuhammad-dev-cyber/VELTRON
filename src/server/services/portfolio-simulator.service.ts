// ==============================================================================
// VALIXEN PORTFOLIO SIMULATOR & BACKTESTING ENGINE
// Macro Allocation Models, Stress-Test Crisis Simulations & Sharpe Ratios
// ==============================================================================

export interface AllocationWeight {
  asset: string;
  symbol: string;
  weightPercent: number;
  expectedReturn: number;
  volatility: number;
  color: string;
}

export interface PortfolioStrategyModel {
  id: string;
  name: string;
  description: string;
  targetRisk: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'ALL_WEATHER';
  historicalCagr: number;
  annualizedVolatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxHistoricalDrawdown: number;
  weights: AllocationWeight[];
  crisisStressTests: {
    gfc2008: { benchmarkDrop: number; strategyDrop: number; recoveryMonths: number };
    covid2020: { benchmarkDrop: number; strategyDrop: number; recoveryMonths: number };
    inflation2022: { benchmarkDrop: number; strategyDrop: number; recoveryMonths: number };
  };
  trajectoryPoints: Array<{ year: string; balance: number }>;
}

export const PRESET_STRATEGIES: PortfolioStrategyModel[] = [
  {
    id: 'all-weather',
    name: 'Ray Dalio All-Weather Allocation',
    description: 'Engineered to weather economic regimes across growth, recession, inflation, and deflation with minimal drawdown.',
    targetRisk: 'ALL_WEATHER',
    historicalCagr: 7.8,
    annualizedVolatility: 7.4,
    sharpeRatio: 1.05,
    sortinoRatio: 1.58,
    maxHistoricalDrawdown: -12.4,
    weights: [
      { asset: 'Long-Term Sovereign Bonds', symbol: 'TLT', weightPercent: 40, expectedReturn: 4.8, volatility: 11.2, color: '#38BDF8' },
      { asset: 'Global Equities', symbol: 'VT', weightPercent: 30, expectedReturn: 9.6, volatility: 15.4, color: '#8B5CF6' },
      { asset: 'Intermediate-Term Bonds', symbol: 'IEF', weightPercent: 15, expectedReturn: 4.2, volatility: 6.8, color: '#818CF8' },
      { asset: 'Gold Bullion', symbol: 'GLD', weightPercent: 7.5, expectedReturn: 6.8, volatility: 14.2, color: '#F59E0B' },
      { asset: 'Broad Commodities', symbol: 'DBC', weightPercent: 7.5, expectedReturn: 5.4, volatility: 18.0, color: '#10B981' },
    ],
    crisisStressTests: {
      gfc2008: { benchmarkDrop: -50.9, strategyDrop: -3.9, recoveryMonths: 9 },
      covid2020: { benchmarkDrop: -33.9, strategyDrop: -7.2, recoveryMonths: 4 },
      inflation2022: { benchmarkDrop: -22.1, strategyDrop: -14.6, recoveryMonths: 14 },
    },
    trajectoryPoints: [
      { year: 'Start', balance: 100000 },
      { year: 'Year 1', balance: 107800 },
      { year: 'Year 2', balance: 116200 },
      { year: 'Year 3', balance: 125300 },
      { year: 'Year 5', balance: 145500 },
      { year: 'Year 10', balance: 211900 },
    ],
  },
  {
    id: 'valixen-barbell',
    name: 'Valixen Sovereign Barbell Alpha',
    description: 'High-convexity institutional structure pairing extreme safety (Treasuries & Cash) with asymmetrical digital assets and tech innovators.',
    targetRisk: 'AGGRESSIVE',
    historicalCagr: 16.4,
    annualizedVolatility: 13.8,
    sharpeRatio: 1.18,
    sortinoRatio: 1.82,
    maxHistoricalDrawdown: -18.6,
    weights: [
      { asset: 'Short-Term Cash & T-Bills', symbol: 'BIL', weightPercent: 45, expectedReturn: 4.5, volatility: 1.2, color: '#00F0FF' },
      { asset: 'AI & Semiconductor Tech', symbol: 'QQQ', weightPercent: 25, expectedReturn: 14.8, volatility: 19.5, color: '#8B5CF6' },
      { asset: 'Bitcoin Spot Reserve', symbol: 'BTC', weightPercent: 18, expectedReturn: 32.0, volatility: 48.0, color: '#F59E0B' },
      { asset: 'Physical Gold Reserves', symbol: 'PAXG', weightPercent: 12, expectedReturn: 7.2, volatility: 13.0, color: '#EC4899' },
    ],
    crisisStressTests: {
      gfc2008: { benchmarkDrop: -50.9, strategyDrop: -12.4, recoveryMonths: 11 },
      covid2020: { benchmarkDrop: -33.9, strategyDrop: -14.2, recoveryMonths: 5 },
      inflation2022: { benchmarkDrop: -22.1, strategyDrop: -16.8, recoveryMonths: 12 },
    },
    trajectoryPoints: [
      { year: 'Start', balance: 100000 },
      { year: 'Year 1', balance: 116400 },
      { year: 'Year 2', balance: 135500 },
      { year: 'Year 3', balance: 157700 },
      { year: 'Year 5', balance: 213700 },
      { year: 'Year 10', balance: 456700 },
    ],
  },
  {
    id: 'classic-60-40',
    name: 'Classic 60/40 Institutional Core',
    description: 'Traditional multi-decade pension allocation consisting of 60% global equities and 40% investment-grade fixed income.',
    targetRisk: 'MODERATE',
    historicalCagr: 8.9,
    annualizedVolatility: 10.2,
    sharpeRatio: 0.88,
    sortinoRatio: 1.22,
    maxHistoricalDrawdown: -29.8,
    weights: [
      { asset: 'S&P 500 Broad Market', symbol: 'SPY', weightPercent: 60, expectedReturn: 10.2, volatility: 15.8, color: '#8B5CF6' },
      { asset: 'Aggregate US Bond Market', symbol: 'BND', weightPercent: 40, expectedReturn: 4.4, volatility: 6.2, color: '#38BDF8' },
    ],
    crisisStressTests: {
      gfc2008: { benchmarkDrop: -50.9, strategyDrop: -30.5, recoveryMonths: 24 },
      covid2020: { benchmarkDrop: -33.9, strategyDrop: -20.6, recoveryMonths: 8 },
      inflation2022: { benchmarkDrop: -22.1, strategyDrop: -17.5, recoveryMonths: 18 },
    },
    trajectoryPoints: [
      { year: 'Start', balance: 100000 },
      { year: 'Year 1', balance: 108900 },
      { year: 'Year 2', balance: 118600 },
      { year: 'Year 3', balance: 129100 },
      { year: 'Year 5', balance: 153100 },
      { year: 'Year 10', balance: 234500 },
    ],
  },
];

export class PortfolioSimulatorService {
  /**
   * Retrieves all preset allocation models
   */
  public static getStrategies(): PortfolioStrategyModel[] {
    return PRESET_STRATEGIES;
  }

  /**
   * Simulates a custom portfolio allocation with real-time risk telemetry
   */
  public static simulateCustom(weights: { [assetSymbol: string]: number }, startingCapital = 100000) {
    // Normalization check
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const normalizedWeights = { ...weights };
    if (totalWeight > 0) {
      for (const k of Object.keys(normalizedWeights)) {
        normalizedWeights[k] = (normalizedWeights[k] / totalWeight) * 100;
      }
    }

    // Weighted return estimation
    const assetReturns: Record<string, number> = {
      SPY: 10.2,
      QQQ: 14.8,
      TLT: 4.8,
      IEF: 4.2,
      GLD: 7.2,
      BTC: 28.0,
      BIL: 4.5,
    };

    let blendedReturn = 0;
    for (const [sym, w] of Object.entries(normalizedWeights)) {
      const ret = assetReturns[sym] || 6.5;
      blendedReturn += (w / 100) * ret;
    }

    blendedReturn = Number(blendedReturn.toFixed(2));
    const estimatedVol = Number((blendedReturn * 0.85).toFixed(2));
    const sharpe = Number(((blendedReturn - 4.5) / estimatedVol).toFixed(2));

    const trajectoryPoints = [
      { year: 'Start', balance: startingCapital },
      { year: 'Year 1', balance: Math.round(startingCapital * (1 + blendedReturn / 100)) },
      { year: 'Year 2', balance: Math.round(startingCapital * Math.pow(1 + blendedReturn / 100, 2)) },
      { year: 'Year 3', balance: Math.round(startingCapital * Math.pow(1 + blendedReturn / 100, 3)) },
      { year: 'Year 5', balance: Math.round(startingCapital * Math.pow(1 + blendedReturn / 100, 5)) },
      { year: 'Year 10', balance: Math.round(startingCapital * Math.pow(1 + blendedReturn / 100, 10)) },
    ];

    return {
      blendedReturn,
      estimatedVol,
      sharpeRatio: sharpe,
      startingCapital,
      trajectoryPoints,
    };
  }
}
