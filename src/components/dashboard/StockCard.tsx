import type { StockData } from '../../types/stock.types';
import { formatCurrency, formatPercentage, formatVolume, formatMarketCap } from '../../utils/formatters';

interface StockCardProps {
  stock: StockData;
  onClick?: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = stock.change >= 0;

  return (
    <div
      className="card cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
          <p className="text-sm text-gray-600">{stock.name}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isPositive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {formatPercentage(stock.changePercent)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold text-gray-900">
            ${formatCurrency(stock.price)}
          </span>
          <span className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{formatCurrency(Math.abs(stock.change))}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600 mb-1">Volume</p>
            <p className="text-sm font-semibold text-gray-900">{formatVolume(stock.volume)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Market Cap</p>
            <p className="text-sm font-semibold text-gray-900">{formatMarketCap(stock.marketCap)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Made with Bob