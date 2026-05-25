import { useState, useEffect } from 'react';
import type { StockData, Timeframe, ChartDataPoint } from '../types/stock.types';
import { STOCK_SYMBOLS } from '../types/stock.types';
import { financeService } from '../services/financeService';
import { TimeframeSelector } from '../components/dashboard/TimeframeSelector';
import { CurrentDayView } from '../components/dashboard/CurrentDayView';
import { SevenDayView } from '../components/dashboard/SevenDayView';
import { QuarterView } from '../components/dashboard/QuarterView';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatTime } from '../utils/formatters';

export const Dashboard = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>('current');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const symbols = Object.values(STOCK_SYMBOLS);
      const historicalDataPromises = symbols.map(symbol =>
        financeService.getHistoricalData(symbol, timeframe)
      );
      
      const allHistoricalData = await Promise.all(historicalDataPromises);
      
      // Transform data for chart
      const chartPoints: ChartDataPoint[] = [];
      const dataLength = allHistoricalData[0]?.length || 0;
      
      for (let i = 0; i < dataLength; i++) {
        const point: ChartDataPoint = {
          timestamp: allHistoricalData[0][i].timestamp
        };
        
        symbols.forEach((symbol, index) => {
          point[symbol] = allHistoricalData[index][i].close;
        });
        
        chartPoints.push(point);
      }
      
      setChartData(chartPoints);
    } catch (err) {
      console.error('Error fetching chart data:', err);
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

  // Auto-refresh based on timeframe
  useEffect(() => {
    const intervals = {
      current: 30000, // 30 seconds
      '7days': 300000, // 5 minutes
      quarter: 3600000 // 1 hour
    };

    const interval = setInterval(() => {
      fetchStockData();
      fetchChartData();
    }, intervals[timeframe]);

    return () => clearInterval(interval);
  }, [timeframe]);

  const handleRefresh = () => {
    fetchStockData();
    fetchChartData();
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
      {/* Header */}
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
                disabled={loading}
                className="btn-primary flex items-center gap-2"
                aria-label="Refresh data"
              >
                <svg
                  className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Timeframe Selector */}
        <div className="mb-8 flex justify-center">
          <TimeframeSelector selected={timeframe} onChange={setTimeframe} />
        </div>

        {/* Dynamic View Based on Timeframe */}
        {renderView()}
      </main>

      {/* Footer */}
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