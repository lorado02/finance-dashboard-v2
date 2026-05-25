import type { Timeframe } from '../../types/stock.types';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selected,
  onChange
}) => {
  const timeframes: Array<{ value: Timeframe; label: string }> = [
    { value: 'current', label: 'Current Day' },
    { value: '7days', label: 'Last 7 Days' },
    { value: 'quarter', label: 'Last Quarter' }
  ];

  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg" role="tablist">
      {timeframes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-6 py-2 rounded-md transition-colors font-medium ${
            selected === value
              ? 'bg-white shadow-sm text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          role="tab"
          aria-selected={selected === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

// Made with Bob