import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { StockData, ChartDataPoint } from '../../types/stock.types';
import { formatChartDate, formatCurrency, formatPercentage, formatMarketCap } from '../../utils/formatters';

interface QuarterViewProps {
  stocks: StockData[];
  chartData: ChartDataPoint[];
}

export const QuarterView: React.FC<QuarterViewProps> = ({ stocks, chartData }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Calculate quarterly performance
  const getQuarterPerformance = (symbol: string) => {
    if (chartData.length < 2) return { change: 0, high: 0, low: 0, volatility: 0 };
    
    const prices = chartData.map(d => d[symbol] as number);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    // Simple volatility measure (standard deviation approximation)
    const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance);
    
    return { change, high, low, volatility };
  };

  const quarterStats = stocks.map(stock => {
    const perf = getQuarterPerformance(stock.symbol);
    return {
      symbol: stock.symbol,
      name: stock.name,
      currentPrice: stock.price,
      marketCap: stock.marketCap,
      ...perf
    };
  }).sort((a, b) => b.change - a.change);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {formatChartDate(label, 'quarter')}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Last Quarter Comprehensive Overview</h2>
        <p className="text-sm opacity-90">90-day performance analysis and market comparison</p>
      </div>

      {/* Quarterly Trend Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Price Movement</h3>
        <ResponsiveContainer width="100%" height={450}>
          <AreaChart data={chartData}>
            <defs>
              {stocks.map((stock, index) => (
                <linearGradient key={stock.symbol} id={`color${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => formatChartDate(value, 'quarter')}
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              domain={['auto', 'auto']}
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {stocks.map((stock, index) => (
              <Area
                key={stock.symbol}
                type="monotone"
                dataKey={stock.symbol}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                fill={`url(#color${stock.symbol})`}
                name={stock.symbol}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Performance Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Performance Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Q Change
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  High
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Low
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Cap
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quarterStats.map((stat, index) => (
                <tr key={stat.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{stat.symbol}</div>
                        <div className="text-xs text-gray-500">{stat.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                    ${formatCurrency(stat.currentPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-bold ${
                      stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(stat.change)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    ${formatCurrency(stat.high)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    ${formatCurrency(stat.low)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatMarketCap(stat.marketCap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Performer</h4>
          <p className="text-3xl font-bold text-blue-600">{quarterStats[0].symbol}</p>
          <p className="text-sm text-gray-600 mt-1">
            {formatPercentage(quarterStats[0].change)} gain
          </p>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Most Stable</h4>
          <p className="text-3xl font-bold text-green-600">
            {quarterStats.reduce((min, s) => s.volatility < min.volatility ? s : min, quarterStats[0]).symbol}
          </p>
          <p className="text-sm text-gray-600 mt-1">Lowest volatility</p>
        </div>
        
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Largest Cap</h4>
          <p className="text-3xl font-bold text-purple-600">
            {quarterStats.reduce((max, s) => s.marketCap > max.marketCap ? s : max, quarterStats[0]).symbol}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {formatMarketCap(quarterStats.reduce((max, s) => s.marketCap > max.marketCap ? s : max, quarterStats[0]).marketCap)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Made with Bob