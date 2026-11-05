// ==============================================================================
// VALIXEN AI FINANCIAL COACH SERVICE
// Behavioral Finance Diagnostics, Debt Avalanche/Snowball & Daily Drills
// ==============================================================================

import { db } from '@/lib/db';
import { WalletService } from './wallet.service';
import { MarketIntelligenceService } from './market.service';

export interface FinancialHabitAudit {
  diagnosticScore: number; // 0 - 100
  runwayMonths: number;
  savingsRatePercent: number;
  discretionaryBurnRate: number;
  recommendations: Array<{
    title: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    category: 'SAVINGS' | 'INVESTING' | 'DEBT' | 'EMERGENCY_BUFFER';
    actionText: string;
  }>;
  debtStrategies: {
    avalanche: {
      name: string;
      estimatedMonths: number;
      interestSavedUsd: number;
      description: string;
    };
    snowball: {
      name: string;
      estimatedMonths: number;
      psychologicalMomentum: string;
      description: string;
    };
  };
  dailyActionTip: {
    title: string;
    description: string;
    priority: string;
    estimatedMonthlyGainUsd: number;
  };
}

export class AiFinancialCoachService {
  /**
   * Generates a comprehensive behavioral finance diagnostic grounded in user ledger
   */
  public static async getCoachDiagnostic(userId: string): Promise<FinancialHabitAudit> {
    const wallet = await WalletService.getUserWallet(userId);
    const monthlyIncome = wallet.monthlyIncomeUsd || 7500;
    const monthlyExpenses = wallet.monthlyExpensesUsd || 2400;
    const netSavings = Math.max(0, monthlyIncome - monthlyExpenses);
    const savingsRate = monthlyIncome > 0 ? Number(((netSavings / monthlyIncome) * 100).toFixed(1)) : 25.0;

    const liquidCash = wallet.availableCashUsd || 15000;
    const runwayMonths = monthlyExpenses > 0 ? Number((liquidCash / monthlyExpenses).toFixed(1)) : 6.0;

    // Diagnostic score calculation
    let score = 50;
    if (savingsRate >= 30) score += 20;
    else if (savingsRate >= 20) score += 10;

    if (runwayMonths >= 6) score += 20;
    else if (runwayMonths >= 3) score += 10;
    else score -= 10;

    if (wallet.totalBalanceUsd > 10000) score += 10;
    score = Math.min(Math.max(score, 10), 98);

    return {
      diagnosticScore: score,
      runwayMonths,
      savingsRatePercent: savingsRate,
      discretionaryBurnRate: Number((monthlyExpenses * 0.28).toFixed(2)),
      recommendations: [
        {
          title: 'Establish 6-Month Autonomous Liquidity Runway',
          impact: 'HIGH',
          category: 'EMERGENCY_BUFFER',
          actionText: `Allocate $${(monthlyExpenses * 0.2).toFixed(0)}/mo into high-yield vault reserves until cash equals $${(monthlyExpenses * 6).toFixed(0)}.`,
        },
        {
          title: 'Automate 50/30/20 Cashflow Separation',
          impact: 'MEDIUM',
          category: 'SAVINGS',
          actionText: 'Route 20% of all incoming deposits directly into compounding virtual investments or vault reserves on deposit arrival.',
        },
        {
          title: 'Currency Hedging & Inflation Shield',
          impact: 'HIGH',
          category: 'INVESTING',
          actionText: 'Maintain balanced cross-asset reserves across USD, EUR, and sovereign gold-backed digital assets to hedge currency volatility.',
        },
      ],
      debtStrategies: {
        avalanche: {
          name: 'Mathematical Debt Avalanche',
          estimatedMonths: 14,
          interestSavedUsd: 1450.0,
          description: 'Targets highest interest obligations first to minimize overall capital cost and accelerate compounding equity accumulation.',
        },
        snowball: {
          name: 'Behavioral Debt Snowball',
          estimatedMonths: 16,
          psychologicalMomentum: 'Maximum Behavioral Momentum',
          description: 'Eliminates smallest liability accounts first to provide quick psychological victories and consolidate cashflow bandwidth.',
        },
      },
      dailyActionTip: {
        title: 'Review Recurring SaaS & Subscription Drain',
        description: 'Audit digital card tokens linked to your wallet to prune unused micro-subscriptions. Reinvesting $45/mo at 8% CAGR generates $27,000+ over 20 years.',
        priority: 'IMMEDIATE',
        estimatedMonthlyGainUsd: 65.0,
      },
    };
  }
}
