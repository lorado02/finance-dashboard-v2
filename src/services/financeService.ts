import type { StockData, HistoricalDataPoint } from '../types/stock.types';
import { DEFAULT_STOCK_SYMBOLS, STOCK_NAMES, SUPPORTED_USER_SYMBOLS } from '../types/stock.types';

// Mock data generator for demonstration
// In production, this would call Yahoo Finance API
class FinanceService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds

  async getStockQuote(symbol: string): Promise<StockData> {
    const normalizedSymbol = symbol.trim().toUpperCase();

    this.validateSymbol(normalizedSymbol);

    // Simulate API delay
    await this.delay(300);

    // Check cache
    const cached = this.getFromCache<StockData>(`quote-${normalizedSymbol}`);
    if (cached) return cached;

    // Generate mock data
    const basePrice = this.getBasePrice(normalizedSymbol);
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;

    const data: StockData = {
      symbol: normalizedSymbol,
      name: STOCK_NAMES[normalizedSymbol] || normalizedSymbol,
      price: basePrice + change,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: (basePrice + change) * Math.floor(Math.random() * 1000000000) + 100000000000,
      timestamp: Date.now(),
    };

    this.setCache(`quote-${normalizedSymbol}`, data);
    return data;
  }

  async getBatchQuotes(symbols: string[]): Promise<StockData[]> {
    const promises = symbols.map(symbol => this.getStockQuote(symbol));
    return Promise.all(promises);
  }

  async getHistoricalData(
    symbol: string,
    period: 'current' | '7days' | 'quarter'
  ): Promise<HistoricalDataPoint[]> {
    const normalizedSymbol = symbol.trim().toUpperCase();

    this.validateSymbol(normalizedSymbol);

    await this.delay(500);

    const cached = this.getFromCache<HistoricalDataPoint[]>(`historical-${normalizedSymbol}-${period}`);
    if (cached) return cached;

    const dataPoints = this.getDataPointCount(period);
    const basePrice = this.getBasePrice(normalizedSymbol);
    const data: HistoricalDataPoint[] = [];

    const now = Date.now();
    const interval = this.getTimeInterval(period);

    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = now - (i * interval);
      const variance = (Math.random() - 0.5) * 20;
      const open = basePrice + variance;
      const close = open + (Math.random() - 0.5) * 5;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;

      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 5000000) + 1000000,
      });
    }

    this.setCache(`historical-${normalizedSymbol}-${period}`, data);
    return data;
  }

  async getAllStocksData(): Promise<StockData[]> {
    return this.getBatchQuotes(DEFAULT_STOCK_SYMBOLS);
  }

  getSupportedUserSymbols(): string[] {
    return [...SUPPORTED_USER_SYMBOLS];
  }

  private validateSymbol(symbol: string): void {
    const supportedSymbols = new Set<string>([...DEFAULT_STOCK_SYMBOLS, ...SUPPORTED_USER_SYMBOLS]);

    if (!supportedSymbols.has(symbol)) {
      throw new Error(`Symbol "${symbol}" is invalid or unavailable.`);
    }
  }

  private getBasePrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      IBM: 150,
      MSFT: 380,
      ORCL: 120,
      SAP: 140,
      CRM: 220,
      AAPL: 195,
      GOOGL: 175,
      AMZN: 185,
      TSLA: 175,
      NVDA: 950,
    };
    return basePrices[symbol] || 100;
  }

  private getDataPointCount(period: string): number {
    switch (period) {
      case 'current':
        return 24; // 24 hours
      case '7days':
        return 7; // 7 days
      case 'quarter':
        return 90; // ~3 months
      default:
        return 24;
    }
  }

  private getTimeInterval(period: string): number {
    switch (period) {
      case 'current':
        return 60 * 60 * 1000; // 1 hour
      case '7days':
        return 24 * 60 * 60 * 1000; // 1 day
      case 'quarter':
        return 24 * 60 * 60 * 1000; // 1 day
      default:
        return 60 * 60 * 1000;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const financeService = new FinanceService();

// Made with Bob