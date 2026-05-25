import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from './Dashboard';
import { financeService } from '../services/financeService';

vi.mock('../components/charts/PerformanceChart', () => ({
  PerformanceChart: ({ stocks }: { stocks: string[] }) => (
    <div data-testid="performance-chart">Chart for {stocks.join(', ')}</div>
  ),
}));

describe('Dashboard', () => {
  const defaultStocks = [
    {
      symbol: 'IBM',
      name: 'IBM Corporation',
      price: 150,
      change: 2,
      changePercent: 1.35,
      volume: 5000000,
      marketCap: 138000000000,
      timestamp: Date.now(),
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 380,
      change: 3,
      changePercent: 0.79,
      volume: 4500000,
      marketCap: 2800000000000,
      timestamp: Date.now(),
    },
    {
      symbol: 'ORCL',
      name: 'Oracle Corporation',
      price: 120,
      change: -1,
      changePercent: -0.82,
      volume: 3200000,
      marketCap: 330000000000,
      timestamp: Date.now(),
    },
    {
      symbol: 'SAP',
      name: 'SAP SE',
      price: 140,
      change: 1.5,
      changePercent: 1.08,
      volume: 2100000,
      marketCap: 170000000000,
      timestamp: Date.now(),
    },
    {
      symbol: 'CRM',
      name: 'Salesforce Inc.',
      price: 220,
      change: 4,
      changePercent: 1.85,
      volume: 2800000,
      marketCap: 210000000000,
      timestamp: Date.now(),
    },
  ];

  const defaultHistoricalData = Array.from({ length: 7 }, (_, index) => ({
    timestamp: Date.now() - index * 86400000,
    open: 100 + index,
    high: 101 + index,
    low: 99 + index,
    close: 100 + index,
    volume: 1000000 + index,
  })).reverse();

  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(financeService, 'getAllStocksData').mockResolvedValue(defaultStocks);
    vi.spyOn(financeService, 'getHistoricalData').mockResolvedValue(defaultHistoricalData);
    vi.spyOn(financeService, 'getSupportedUserSymbols').mockReturnValue([
      'AAPL',
      'GOOGL',
      'AMZN',
      'TSLA',
      'NVDA',
    ]);
    vi.spyOn(financeService, 'getStockQuote').mockImplementation(async (symbol: string) => ({
      symbol,
      name: `${symbol} Inc.`,
      price: 200,
      change: 5,
      changePercent: 2.5,
      volume: 4000000,
      marketCap: 500000000000,
      timestamp: Date.now(),
    }));
  });

  it('renders the existing dashboard content', async () => {
    render(<Dashboard />);

    expect(await screen.findByText('Finance Dashboard')).toBeInTheDocument();
    expect(await screen.findByText('Live Stock Prices')).toBeInTheDocument();
    expect(screen.getAllByText('IBM').length).toBeGreaterThan(0);
  });

  it('shows a validation message when ticker input is empty', async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    await screen.findByText('Live Stock Prices');
    await user.click(screen.getByRole('button', { name: 'Show graph' }));

    expect(
      screen.getByText('Enter a ticker symbol to load a custom company graph.')
    ).toBeInTheDocument();
  });

  it('shows an error for a built-in dashboard ticker', async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    await screen.findByText('Live Stock Prices');
    await user.type(screen.getByLabelText('Ticker symbol'), 'IBM');
    await user.click(screen.getByRole('button', { name: 'Show graph' }));

    expect(screen.getByText('IBM is already included in the dashboard.')).toBeInTheDocument();
  });

  it('renders a separate graph for a valid user-selected company', async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    await screen.findByText('Live Stock Prices');
    await user.type(screen.getByLabelText('Ticker symbol'), 'AAPL');
    await user.click(screen.getByRole('button', { name: 'Show graph' }));

    await waitFor(() => {
      expect(financeService.getStockQuote).toHaveBeenCalledWith('AAPL');
    });

    expect(screen.getByText('Selected Company Graph: AAPL')).toBeInTheDocument();
    expect(screen.getByText('AAPL Inc.')).toBeInTheDocument();
    expect(screen.getByTestId('performance-chart')).toHaveTextContent('Chart for AAPL');
    expect(screen.getByText('Live Stock Prices')).toBeInTheDocument();
  });

  it('shows a service error for an unavailable ticker symbol', async () => {
    const user = userEvent.setup();

    vi.spyOn(financeService, 'getStockQuote').mockRejectedValueOnce(
      new Error('Symbol "META" is invalid or unavailable.')
    );

    render(<Dashboard />);

    await screen.findByText('Live Stock Prices');
    await user.type(screen.getByLabelText('Ticker symbol'), 'META');
    await user.click(screen.getByRole('button', { name: 'Show graph' }));

    await waitFor(() => {
      expect(
        screen.getByText('Symbol "META" is invalid or unavailable.')
      ).toBeInTheDocument();
    });
  });
});

// Made with Bob