import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Timeframe, ChartDataPoint } from '../../types/stock.types';
import { formatChartDate } from '../../utils/formatters';

interface PerformanceChartProps {
  data: ChartDataPoint[];
  stocks: string[];
  timeframe: Timeframe;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{
    color?: string;
    dataKey?: string | number | ((obj: unknown) => unknown);
    name?: string | number;
    value?: number | string | readonly (number | string)[];
  }>;
  label?: number | string;
  timeframe: Timeframe;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const ChartTooltipContent: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  timeframe,
}) => {
  if (!active || !payload?.length || typeof label !== 'number') {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="text-sm font-semibold text-gray-900 mb-2">
        {formatChartDate(label, timeframe)}
      </p>
      {payload.map((entry, index) => (
        <p key={`${String(entry.dataKey)}-${index}`} className="text-sm" style={{ color: entry.color }}>
          {String(entry.name)}: ${Number(Array.isArray(entry.value) ? entry.value[0] : (entry.value ?? 0)).toFixed(2)}
        </p>
      ))}
    </div>
  );
};

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  stocks,
  timeframe,
}) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => formatChartDate(Number(value), timeframe)}
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            domain={['auto', 'auto']}
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={(props) => <ChartTooltipContent {...props} timeframe={timeframe} />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          {stocks.map((stock, index) => (
            <Line
              key={stock}
              type="monotone"
              dataKey={stock}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name={stock}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Made with Bob