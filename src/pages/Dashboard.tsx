import { useState, useEffect, useMemo } from 'react';
import type { StockData, Timeframe, ChartDataPoint } from '../types/stock.types';
import { DEFAULT_STOCK_SYMBOLS } from '../types/stock.types';
import { financeService } from '../services/financeService';
import { TimeframeSelector } from '../components/dashboard/TimeframeSelector';
import { CurrentDayView } from '../components/dashboard/CurrentDayView';
import { SevenDayView } from '../components/dashboard/SevenDayView';
import { QuarterView } from '../components/dashboard/QuarterView';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { formatTime } from '../utils/formatters';

const getUserSymbolError = (symbol: string): string | null => {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    return 'Enter a ticker symbol to load a custom company graph.';
  }

  if (!/^[A-Z]{1,5}$/.test(normalizedSymbol)) {
    return 'Ticker symbols must be 1-5 letters.';
  }

  if ((DEFAULT_STOCK_SYMBOLS as readonly string[]).includes(normalizedSymbol)) {
    return `${normalizedSymbol} is already included in the dashboard.`;
  }

  return null;
};

export const Dashboard = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>('current');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customSymbolInput, setCustomSymbolInput] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [selectedChartData, setSelectedChartData] = useState<ChartDataPoint[]>([]);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const supportedUserSymbols = useMemo(() => financeService.getSupportedUserSymbols(), []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getAllStocksData();
      setStocks(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
      console.error('Error fetching stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const historicalDataPromises = DEFAULT_STOCK_SYMBOLS.map((symbol) =>
        financeService.getHistoricalData(symbol, timeframe)
      );

      const allHistoricalData = await Promise.all(historicalDataPromises);

      const chartPoints: ChartDataPoint[] = [];
      const dataLength = allHistoricalData[0]?.length || 0;

      for (let i = 0; i < dataLength; i++) {
        const point: ChartDataPoint = {
          timestamp: allHistoricalData[0][i].timestamp,
        };

        DEFAULT_STOCK_SYMBOLS.forEach((symbol, index) => {
          point[symbol] = allHistoricalData[index][i].close;
        });

        chartPoints.push(point);
      }

      setChartData(chartPoints);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  const fetchSelectedCompanyData = async (symbol: string) => {
    try {
      setCustomLoading(true);
      setCustomError(null);

      const normalizedSymbol = symbol.trim().toUpperCase();
      const [quote, historicalData] = await Promise.all([
        financeService.getStockQuote(normalizedSymbol),
        financeService.getHistoricalData(normalizedSymbol, timeframe),
      ]);

      setSelectedSymbol(normalizedSymbol);
      setSelectedStock(quote);
      setSelectedChartData(
        historicalData.map((point) => ({
          timestamp: point.timestamp,
          [normalizedSymbol]: point.close,
        }))
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to load data for the selected company.';
      setCustomError(message);
      setSelectedSymbol(null);
      setSelectedStock(null);
      setSelectedChartData([]);
    } finally {
      setCustomLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  useEffect(() => {
    if (stocks.length > 0) {
      fetchChartData();
    }
  }, [timeframe, stocks.length]);

  useEffect(() => {
    if (selectedSymbol) {
      fetchSelectedCompanyData(selectedSymbol);
    }
  }, [selectedSymbol, timeframe]);

  useEffect(() => {
    const intervals = {
      current: 30000,
      '7days': 300000,
      quarter: 3600000,
    };

    const interval = setInterval(() => {
      fetchStockData();
      fetchChartData();

      if (selectedSymbol) {
        fetchSelectedCompanyData(selectedSymbol);
      }
    }, intervals[timeframe]);

    return () => clearInterval(interval);
  }, [timeframe, selectedSymbol]);

  const handleRefresh = () => {
    fetchStockData();
    fetchChartData();

    if (selectedSymbol) {
      fetchSelectedCompanyData(selectedSymbol);
    }
  };

  const handleAddSelectedCompany = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedSymbol = customSymbolInput.trim().toUpperCase();
    const validationError = getUserSymbolError(normalizedSymbol);

    if (validationError) {
      setCustomError(validationError);
      return;
    }

    await fetchSelectedCompanyData(normalizedSymbol);
  };

  const renderView = () => {
    if (loading && stocks.length === 0) {
      return (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" message="Loading financial data..." />
        </div>
      );
    }

    switch (timeframe) {
      case 'current':
        return <CurrentDayView stocks={stocks} lastUpdated={lastUpdated} />;
      case '7days':
        return <SevenDayView stocks={stocks} chartData={chartData} />;
      case 'quarter':
        return <QuarterView stocks={stocks} chartData={chartData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                IBM and Competitors - Real-time Market Analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  Last updated: {formatTime(lastUpdated)}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading || customLoading}
                className="btn-primary flex items-center gap-2"
                aria-label="Refresh data"
              >
                <svg
                  className={`w-5 h-5 ${loading || customLoading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add a company graph</h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter a supported ticker symbol to view a separate graph while keeping the
                existing IBM and competitor dashboards visible.
              </p>
            </div>

            <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleAddSelectedCompany}>
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Ticker symbol</span>
                <input
                  type="text"
                  value={customSymbolInput}
                  onChange={(event) => {
                    setCustomSymbolInput(event.target.value.toUpperCase());
                    setCustomError(null);
                  }}
                  placeholder="e.g. AAPL"
                  maxLength={5}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  aria-label="Ticker symbol"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Quick select</span>
                <select
                  value={customSymbolInput}
                  onChange={(event) => {
                    setCustomSymbolInput(event.target.value);
                    setCustomError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Supported ticker symbols"
                >
                  <option value="">Select a symbol</option>
                  {supportedUserSymbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                disabled={customLoading}
                className="btn-primary self-start sm:self-end"
              >
                {customLoading ? 'Loading...' : 'Show graph'}
              </button>
            </form>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-600">Supported:</span>
            {supportedUserSymbols.map((symbol) => (
              <span key={symbol} className="px-2 py-1 bg-gray-100 rounded-full">
                {symbol}
              </span>
            ))}
          </div>

          {customError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="font-semibold">Company graph error</p>
              <p className="text-sm">{customError}</p>
            </div>
          )}
        </section>

        <div className="mb-8 flex justify-center">
          <TimeframeSelector selected={timeframe} onChange={setTimeframe} />
        </div>

        {selectedStock && (
          <section className="mb-8 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Selected Company Graph: {selectedStock.symbol}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedStock.name}</p>
                </div>
                <div className="text-sm text-gray-600">
                  Separate graph for the user-selected company
                </div>
              </div>
            </div>

            {customLoading ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                <LoadingSpinner size="md" message={`Loading ${selectedStock.symbol} chart...`} />
              </div>
            ) : (
              <PerformanceChart
                data={selectedChartData}
                stocks={[selectedStock.symbol]}
                timeframe={timeframe}
              />
            )}
          </section>
        )}

        {renderView()}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Finance Dashboard - Comprehensive Market Analysis
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tracking: IBM, Microsoft, Oracle, SAP, Salesforce
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Data updates automatically • {timeframe === 'current' ? '30s' : timeframe === '7days' ? '5min' : '1hr'} refresh interval
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Made with Bob