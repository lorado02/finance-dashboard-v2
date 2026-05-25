import type { StockData } from '../../types/stock.types';
import { StockCard } from './StockCard';
import { formatTime } from '../../utils/formatters';

interface CurrentDayViewProps {
  stocks: StockData[];
  lastUpdated: Date | null;
}

export const CurrentDayView: React.FC<CurrentDayViewProps> = ({ stocks, lastUpdated }) => {
  // Calculate market summary
  const gainers = stocks.filter(s => s.change > 0).length;
  const losers = stocks.filter(s => s.change < 0).length;
  const avgChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;
  const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0);

  return (
    <div className="space-y-6">
      {/* Market Summary Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Current Day Market Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">Gainers</p>
            <p className="text-3xl font-bold">{gainers}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">Losers</p>
            <p className="text-3xl font-bold">{losers}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">Avg Change</p>
            <p className={`text-3xl font-bold ${avgChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">Last Update</p>
            <p className="text-lg font-semibold">{lastUpdated ? formatTime(lastUpdated) : '--:--'}</p>
          </div>
        </div>
      </div>

      {/* Live Stock Cards */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Stock Prices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900">
              {(totalVolume / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Most Active</p>
            <p className="text-2xl font-bold text-blue-600">
              {stocks.reduce((max, s) => s.volume > max.volume ? s : max, stocks[0]).symbol}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Top Performer</p>
            <p className="text-2xl font-bold text-green-600">
              {stocks.reduce((max, s) => s.changePercent > max.changePercent ? s : max, stocks[0]).symbol}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Made with Bob