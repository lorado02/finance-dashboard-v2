import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { StockData, ChartDataPoint } from '../../types/stock.types';
import { formatChartDate, formatCurrency, formatPercentage } from '../../utils/formatters';

interface SevenDayViewProps {
  stocks: StockData[];
  chartData: ChartDataPoint[];
}

export const SevenDayView: React.FC<SevenDayViewProps> = ({ stocks, chartData }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Calculate 7-day performance
  const getWeekPerformance = (symbol: string) => {
    if (chartData.length < 2) return 0;
    const firstPrice = chartData[0][symbol] as number;
    const lastPrice = chartData[chartData.length - 1][symbol] as number;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };

  const weekPerformance = stocks.map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    performance: getWeekPerformance(stock.symbol),
    currentPrice: stock.price
  })).sort((a, b) => b.performance - a.performance);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {formatChartDate(label, '7days')}
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
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Last 7 Days Trend Analysis</h2>
        <p className="text-sm opacity-90">Compare stock performance over the past week</p>
      </div>

      {/* Performance Comparison Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Trend Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => formatChartDate(value, '7days')}
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
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
            {stocks.map((stock, index) => (
              <Line
                key={stock.symbol}
                type="monotone"
                dataKey={stock.symbol}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                name={stock.symbol}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Performance Rankings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance Rankings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weekPerformance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tickFormatter={(value) => `${value.toFixed(1)}%`} />
            <YAxis dataKey="symbol" type="category" width={60} />
            <Tooltip
              formatter={(value) => `${Number(value).toFixed(2)}%`}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="performance" fill="#3B82F6" radius={[0, 8, 8, 0]}>
              {weekPerformance.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  fill={entry.performance >= 0 ? '#10B981' : '#EF4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weekPerformance.map((item, index) => (
            <div
              key={item.symbol}
              className="bg-white rounded-lg shadow-md p-4 border-l-4"
              style={{ borderLeftColor: colors[index % colors.length] }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{item.symbol}</h4>
                  <p className="text-xs text-gray-600">{item.name}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  #{index + 1}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Current Price</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${formatCurrency(item.currentPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">7-Day Change</span>
                  <span className={`text-lg font-bold ${
                    item.performance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(item.performance)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Made with Bob