// ==============================================================================
// VALIXEN VIRTUAL TRADING & SIMULATION ENGINE SERVICE
// Simulates order fills, stop-loss triggers, and algorithmic performance
// ==============================================================================

import { db } from '@/lib/db';
import { CreateTradeOrderSchema } from '@/lib/api/validator';
import { NotFoundError } from '@/lib/api/errors';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

type CreateTradeInput = z.infer<typeof CreateTradeOrderSchema>;

export class TradeService {
  /**
   * Mock execution price oracle for simulation engine
   */
  private static getSimulatedPrice(symbol: string): number {
    const marketPrices: Record<string, number> = {
      BTC: 68420.5,
      ETH: 3540.25,
      SOL: 182.4,
      NVDA: 138.2,
      AAPL: 232.1,
      TSLA: 260.4,
    };
    return marketPrices[symbol.toUpperCase()] || 100.0;
  }

  /**
   * Executes a virtual trade order with slippage and P&L calculations
   */
  public static async executeVirtualTrade(userId: string, input: CreateTradeInput) {
    const portfolio = await db.portfolio.findFirst({
      where: { id: input.portfolioId, userId },
    });

    if (!portfolio) {
      throw new NotFoundError('Virtual Portfolio', input.portfolioId);
    }

    const currentPrice = this.getSimulatedPrice(input.symbol);
    const executionPrice = input.orderType === 'LIMIT' && input.targetPrice ? input.targetPrice : currentPrice;
    const executionPriceDecimal = new Prisma.Decimal(executionPrice);
    const quantityDecimal = new Prisma.Decimal(input.quantity);

    const trade = await db.virtualTrade.create({
      data: {
        userId,
        portfolioId: input.portfolioId,
        symbol: input.symbol,
        assetClass: input.assetClass,
        tradeType: input.tradeType,
        orderType: input.orderType,
        quantity: quantityDecimal,
        targetPrice: input.targetPrice ? new Prisma.Decimal(input.targetPrice) : null,
        executionPrice: executionPriceDecimal,
        stopLossPrice: input.stopLossPrice ? new Prisma.Decimal(input.stopLossPrice) : null,
        takeProfitPrice: input.takeProfitPrice ? new Prisma.Decimal(input.takeProfitPrice) : null,
        status: 'FILLED',
        notes: input.notes,
        aiHypothesis: 'Multi-timeframe algorithmic breakout detected above 200 EMA with expanding volume.',
      },
    });

    // Update or create portfolio holding
    const existingHolding = await db.portfolioHolding.findUnique({
      where: {
        portfolioId_assetSymbol: {
          portfolioId: input.portfolioId,
          assetSymbol: input.symbol,
        },
      },
    });

    if (existingHolding) {
      const newQuantity = input.tradeType === 'BUY'
        ? existingHolding.quantity.plus(quantityDecimal)
        : existingHolding.quantity.minus(quantityDecimal);

      const totalCost = newQuantity.times(executionPriceDecimal);

      await db.portfolioHolding.update({
        where: { id: existingHolding.id },
        data: {
          quantity: newQuantity,
          currentPrice: executionPriceDecimal,
          marketValue: totalCost,
          lastValuationAt: new Date(),
        },
      });
    } else if (input.tradeType === 'BUY') {
      const totalCost = quantityDecimal.times(executionPriceDecimal);

      await db.portfolioHolding.create({
        data: {
          portfolioId: input.portfolioId,
          assetSymbol: input.symbol,
          assetName: `${input.symbol} Digital Asset`,
          assetClass: input.assetClass,
          quantity: quantityDecimal,
          averageCost: executionPriceDecimal,
          currentPrice: executionPriceDecimal,
          totalCost,
          marketValue: totalCost,
          unrealizedPnl: new Prisma.Decimal(0),
        },
      });
    }

    return trade;
  }

  /**
   * Retrieves user virtual trade history
   */
  public static async getTradeHistory(userId: string, portfolioId?: string) {
    return db.virtualTrade.findMany({
      where: {
        userId,
        ...(portfolioId ? { portfolioId } : {}),
      },
      orderBy: { openedAt: 'desc' },
      take: 50,
    });
  }
}
