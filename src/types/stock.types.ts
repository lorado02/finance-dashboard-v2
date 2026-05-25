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

export const STOCK_NAMES: Record<string, string> = {
  IBM: 'IBM Corporation',
  MSFT: 'Microsoft Corporation',
  ORCL: 'Oracle Corporation',
  SAP: 'SAP SE',
  CRM: 'Salesforce Inc.'
};

// Made with Bob