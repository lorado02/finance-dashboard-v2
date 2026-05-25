export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  timestamp: number;
}

export interface HistoricalDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Timeframe = 'current' | '7days' | 'quarter';

export interface ChartDataPoint {
  timestamp: number;
  [symbol: string]: number;
}

export const STOCK_SYMBOLS = {
  IBM: 'IBM',
  MICROSOFT: 'MSFT',
  ORACLE: 'ORCL',
  SAP: 'SAP',
  SALESFORCE: 'CRM'
} as const;

export const DEFAULT_STOCK_SYMBOLS = Object.values(STOCK_SYMBOLS);

export const STOCK_NAMES: Record<string, string> = {
  IBM: 'IBM Corporation',
  MSFT: 'Microsoft Corporation',
  ORCL: 'Oracle Corporation',
  SAP: 'SAP SE',
  CRM: 'Salesforce Inc.',
  AAPL: 'Apple Inc.',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com, Inc.',
  TSLA: 'Tesla, Inc.',
  NVDA: 'NVIDIA Corporation'
};

export const SUPPORTED_USER_SYMBOLS = [
  'AAPL',
  'GOOGL',
  'AMZN',
  'TSLA',
  'NVDA'
] as const;

export type UserSupportedSymbol = typeof SUPPORTED_USER_SYMBOLS[number];

// Made with Bob