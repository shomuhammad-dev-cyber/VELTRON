// ==============================================================================
// VALIXEN API INPUT VALIDATION SCHEMAS (ZOD)
// ==============================================================================

import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const CreateTradeOrderSchema = z.object({
  portfolioId: z.string().uuid({ message: 'Valid portfolio UUID is required.' }),
  symbol: z.string().min(1).max(20).toUpperCase(),
  assetClass: z.enum(['FIAT', 'CRYPTO', 'EQUITY', 'COMMODITY', 'FX_PAIR', 'INDEX']),
  tradeType: z.enum(['BUY', 'SELL']),
  orderType: z.enum(['MARKET', 'LIMIT', 'STOP_MARKET', 'STOP_LIMIT']).default('MARKET'),
  quantity: z.number().positive({ message: 'Quantity must be strictly positive.' }),
  targetPrice: z.number().positive().optional(),
  stopLossPrice: z.number().positive().optional(),
  takeProfitPrice: z.number().positive().optional(),
  notes: z.string().max(250).optional(),
});

export const CreateFinancialAccountSchema = z.object({
  accountName: z.string().min(3).max(50),
  type: z.enum(['SMART_CHECKING', 'HIGH_YIELD_VAULT', 'CRYPTO_CUSTODY_WALLET', 'MARGIN_TRADING', 'VIRTUAL_SIMULATION']),
  currency: z.string().length(3).toUpperCase().default('USD'),
});

export const CreateWatchlistSchema = z.object({
  name: z.string().min(2).max(50),
  symbols: z.array(z.string().toUpperCase()).default([]),
});

export const TransferFundsSchema = z.object({
  sourceAccountId: z.string().uuid(),
  destinationAccountId: z.string().uuid(),
  amount: z.number().positive({ message: 'Transfer amount must be greater than zero.' }),
  currency: z.string().length(3).toUpperCase(),
  description: z.string().max(100).optional(),
});
