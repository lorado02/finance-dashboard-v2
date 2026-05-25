# Dashboard Views Documentation

This document describes the three distinct dashboard views implemented in the Finance Dashboard application.

## Overview

The application features three specialized views, each optimized for different time periods and analysis needs:

1. **Current Day View** - Real-time market summary
2. **7-Day View** - Weekly trend comparison
3. **Quarter View** - Comprehensive 90-day analysis

Users can switch between views using the timeframe selector at the top of the dashboard.

---

## 1. Current Day View

**Purpose**: Real-time monitoring of stock performance during the trading day

### Features

#### Market Summary Header (Blue Gradient)
- **Gainers**: Count of stocks with positive change
- **Losers**: Count of stocks with negative change
- **Average Change**: Mean percentage change across all stocks
- **Last Update**: Timestamp of most recent data refresh

#### Live Stock Cards
- Grid layout (1/2/3 columns responsive)
- Each card displays:
  - Stock symbol and company name
  - Current price
  - Price change ($ and %)
  - Volume
  - Market capitalization
- Color-coded indicators (green for gains, red for losses)

#### Market Activity Panel
- **Total Volume**: Combined trading volume
- **Most Active**: Stock with highest volume
- **Top Performer**: Stock with highest percentage gain

### Auto-Refresh
- Updates every **30 seconds**
- Ideal for active trading monitoring

### Use Cases
- Day trading decisions
- Quick market pulse check
- Monitoring intraday volatility
- Real-time portfolio tracking

---

## 2. Seven-Day View

**Purpose**: Weekly trend analysis and performance comparison

### Features

#### Header (Purple Gradient)
- Clear indication of 7-day analysis period
- Contextual description

#### Price Trend Comparison Chart
- **Type**: Multi-line chart
- **Data**: Daily closing prices for all 5 stocks
- **Interaction**: Hover tooltips with exact values
- **Legend**: Color-coded stock symbols
- **X-Axis**: Dates (formatted as "Mon DD")
- **Y-Axis**: Price in dollars

#### Weekly Performance Rankings
- **Type**: Horizontal bar chart
- **Metric**: Percentage change over 7 days
- **Sorting**: Ranked from best to worst performer
- **Colors**: Green for positive, red for negative
- **Interaction**: Hover for exact percentage

#### Performance Summary Cards
- Grid of 5 cards (one per stock)
- Each card shows:
  - Stock symbol and name
  - Ranking badge (#1, #2, etc.)
  - Current price
  - 7-day percentage change
- Color-coded left border for visual identification
- Gold badge for #1 performer

### Auto-Refresh
- Updates every **5 minutes**
- Balances freshness with API efficiency

### Use Cases
- Weekly portfolio review
- Identifying short-term trends
- Comparing relative performance
- Swing trading analysis

---

## 3. Quarter View

**Purpose**: Comprehensive long-term analysis and strategic insights

### Features

#### Header (Green Gradient)
- Indicates 90-day analysis period
- Professional, analytical tone

#### Quarterly Price Movement Chart
- **Type**: Area chart with gradient fills
- **Data**: 90 days of closing prices
- **Visual**: Stacked areas showing price trends
- **Interaction**: Detailed tooltips
- **Legend**: All stocks with color coding
- **X-Axis**: Months (formatted as "Mon YYYY")
- **Y-Axis**: Price in dollars

#### Performance Metrics Table
- **Columns**:
  - Stock (with color indicator dot)
  - Current Price
  - Quarterly Change (%)
  - High (90-day peak)
  - Low (90-day trough)
  - Market Cap
- **Sorting**: By quarterly performance (best to worst)
- **Styling**: Hover effects, alternating row colors
- **Responsive**: Horizontal scroll on mobile

#### Key Insights Cards
Three summary cards highlighting:

1. **Top Performer**
   - Stock with highest quarterly gain
   - Percentage increase
   - Blue gradient background

2. **Most Stable**
   - Stock with lowest volatility
   - Calculated from price variance
   - Green gradient background

3. **Largest Cap**
   - Stock with highest market capitalization
   - Formatted market cap value
   - Purple gradient background

### Auto-Refresh
- Updates every **1 hour**
- Appropriate for long-term data

### Use Cases
- Long-term investment decisions
- Quarterly portfolio rebalancing
- Fundamental analysis
- Risk assessment
- Strategic planning

---

## Technical Implementation

### Component Structure

```
Dashboard (pages/Dashboard.tsx)
├── TimeframeSelector
└── Dynamic View Rendering
    ├── CurrentDayView (components/dashboard/CurrentDayView.tsx)
    ├── SevenDayView (components/dashboard/SevenDayView.tsx)
    └── QuarterView (components/dashboard/QuarterView.tsx)
```

### Data Flow

1. **Dashboard** fetches stock data and historical data
2. Data is passed to the appropriate view component
3. Each view transforms and displays data optimally
4. Auto-refresh triggers based on selected timeframe

### Responsive Design

All views are fully responsive:
- **Mobile** (< 640px): Single column layout
- **Tablet** (640-1024px): Two column layout
- **Desktop** (> 1024px): Three column layout

Charts automatically resize using ResponsiveContainer.

### Color Scheme

- **Current Day**: Blue (#3B82F6)
- **7-Day**: Purple (#8B5CF6)
- **Quarter**: Green (#10B981)
- **Positive Changes**: Green (#10B981)
- **Negative Changes**: Red (#EF4444)

### Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios (WCAG AA compliant)
- Semantic HTML structure

---

## Switching Between Views

Users can switch views using the **TimeframeSelector** component:

1. Click on desired timeframe tab
2. Dashboard automatically:
   - Fetches appropriate historical data
   - Renders the corresponding view
   - Adjusts auto-refresh interval
   - Updates footer information

The transition is smooth with loading states to indicate data fetching.

---

## Performance Considerations

### Caching
- 30-second cache for current quotes
- Reduces redundant API calls
- Improves response time

### Data Optimization
- Historical data fetched only when needed
- Efficient data transformation
- Memoized calculations where appropriate

### Chart Performance
- Recharts library optimized for large datasets
- Responsive containers prevent layout thrashing
- Smooth animations and transitions

---

## Future Enhancements

Potential improvements for each view:

### Current Day
- [ ] Intraday price charts (5-min intervals)
- [ ] News feed integration
- [ ] Alert notifications for price thresholds
- [ ] Comparison to market indices

### 7-Day
- [ ] Volume overlay on price chart
- [ ] Technical indicators (RSI, MACD)
- [ ] Sector comparison
- [ ] Export to CSV

### Quarter
- [ ] Fundamental metrics (P/E, EPS)
- [ ] Dividend information
- [ ] Analyst ratings
- [ ] Correlation matrix
- [ ] Risk metrics (Beta, Sharpe ratio)

---

## Demo Tips

When demonstrating the dashboard:

1. **Start with Current Day** - Shows real-time capabilities
2. **Switch to 7-Day** - Demonstrates trend analysis
3. **End with Quarter** - Highlights comprehensive features
4. **Use Refresh Button** - Shows data updates
5. **Hover on Charts** - Interactive tooltips
6. **Resize Window** - Responsive design

---

**Made with Bob** 🤖