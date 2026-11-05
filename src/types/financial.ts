// ==============================================================================
// VALIXEN FINANCIAL DOMAIN TYPES
// ==============================================================================

export type AssetClassType = 'FIAT' | 'CRYPTO' | 'EQUITY' | 'COMMODITY' | 'FX_PAIR' | 'INDEX';

export interface MarketAsset {
  symbol: string;
  name: string;
  assetClass: AssetClassType;
  currentPrice: number;
  change24hPercentage: number;
  high24h: number;
  low24h: number;
  volume24hUsd: number;
  sparklineData: number[];
}

export interface UserPortfolioSummary {
  portfolioId: string;
  name: string;
  isVirtual: boolean;
  baseCurrency: string;
  totalValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  holdingsCount: number;
}

export interface TradeOrderRequest {
  portfolioId: string;
  symbol: string;
  assetClass: AssetClassType;
  tradeType: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP_MARKET';
  quantity: number;
  targetPrice?: number;
  stopLossPrice?: number;
  takeProfitPrice?: number;
  notes?: string;
}
