// ==============================================================================
// VALIXEN PORTFOLIO & ASSET WEALTH SERVICE
// Calculates portfolio valuations, asset distributions and unrealized gains
// ==============================================================================

import { db } from '@/lib/db';
import { NotFoundError } from '@/lib/api/errors';
import { Prisma } from '@prisma/client';

export class PortfolioService {
  /**
   * Retrieves summary metrics across user portfolios
   */
  public static async getUserPortfolios(userId: string) {
    return db.portfolio.findMany({
      where: { userId },
      include: {
        holdings: true,
        _count: {
          select: { virtualTrades: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Creates a new investment or virtual simulation portfolio
   */
  public static async createPortfolio(params: {
    userId: string;
    name: string;
    description?: string;
    isVirtual?: boolean;
    baseCurrency?: string;
  }) {
    return db.portfolio.create({
      data: {
        userId: params.userId,
        name: params.name,
        description: params.description,
        isVirtual: params.isVirtual ?? false,
        baseCurrency: params.baseCurrency || 'USD',
        totalValue: new Prisma.Decimal(0),
        realizedPnl: new Prisma.Decimal(0),
        unrealizedPnl: new Prisma.Decimal(0),
      },
    });
  }

  /**
   * Calculates real-time portfolio valuation from asset holdings
   */
  public static async getPortfolioById(portfolioId: string, userId: string) {
    const portfolio = await db.portfolio.findFirst({
      where: { id: portfolioId, userId },
      include: {
        holdings: {
          orderBy: { marketValue: 'desc' },
        },
        virtualTrades: {
          take: 10,
          orderBy: { openedAt: 'desc' },
        },
      },
    });

    if (!portfolio) {
      throw new NotFoundError('Portfolio', portfolioId);
    }

    return portfolio;
  }
}
