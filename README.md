# Finance Dashboard v2

A modern React TypeScript application for tracking real-time financial data for IBM and its major competitors (Microsoft, Oracle, SAP, and Salesforce).

## 🚀 Features

- **Real-time Stock Data**: Live quotes for 5 major tech companies
- **Multiple Timeframes**: View current day, last 7 days, or quarterly performance
- **Interactive Charts**: Beautiful line charts powered by Recharts
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Auto-refresh**: Automatic data updates based on selected timeframe
- **Performance Optimized**: Built-in caching and efficient data fetching

## 📁 Project Structure

```
finance-dashboard-v2/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   └── LoadingSpinner.tsx
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── StockCard.tsx
│   │   │   └── TimeframeSelector.tsx
│   │   └── charts/          # Chart components
│   │       └── PerformanceChart.tsx
│   ├── pages/               # Page components
│   │   └── Dashboard.tsx
│   ├── services/            # Data fetching services
│   │   └── financeService.ts
│   ├── types/               # TypeScript type definitions
│   │   └── stock.types.ts
│   ├── utils/               # Utility functions
│   │   └── formatters.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Hooks (useState, useEffect)
- **Data Fetching**: Custom service layer with caching

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage

1. **View Stock Data**: The dashboard displays real-time data for all 5 stocks
2. **Switch Timeframes**: Use the timeframe selector to view different time periods
3. **Auto-refresh**: Data automatically refreshes based on the selected timeframe:
   - Current Day: Every 30 seconds
   - Last 7 Days: Every 5 minutes
   - Last Quarter: Every hour
4. **Manual Refresh**: Click the refresh button to update data immediately

## 🏗️ Architecture

### Component Hierarchy

```
App
└── Dashboard
    ├── Header (with refresh button)
    ├── TimeframeSelector
    ├── StockCard (x5)
    └── PerformanceChart
```

### Data Flow

1. **Dashboard** fetches data from **financeService**
2. **financeService** manages caching and API calls
3. Data is passed down to child components via props
4. Auto-refresh is handled by useEffect hooks with intervals

### Service Layer

The `financeService` provides:
- `getStockQuote(symbol)`: Fetch single stock data
- `getBatchQuotes(symbols)`: Fetch multiple stocks efficiently
- `getHistoricalData(symbol, period)`: Fetch historical data
- `getAllStocksData()`: Fetch all tracked stocks
- Built-in caching with 30-second TTL

## 🎨 Styling

The application uses Tailwind CSS with custom configurations:

- **Primary Color**: Blue (customized in tailwind.config.js)
- **Responsive Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Custom Classes**: `.btn-primary`, `.btn-secondary`, `.card`

## 📊 Data Structure

### StockData Interface

```typescript
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  timestamp: number;
}
```

### Supported Stocks

- **IBM**: IBM Corporation
- **MSFT**: Microsoft Corporation
- **ORCL**: Oracle Corporation
- **SAP**: SAP SE
- **CRM**: Salesforce Inc.

## 🔄 Future Enhancements

This architecture is designed to support:

- [ ] User authentication and personalized dashboards
- [ ] Custom stock watchlists
- [ ] Portfolio tracking
- [ ] Real-time WebSocket updates
- [ ] Advanced technical indicators
- [ ] Export to CSV/PDF
- [ ] Dark mode support
- [ ] Mobile app version
- [ ] Historical data comparison tools
- [ ] News integration
- [ ] Alerts and notifications

## 🧪 Testing

The project structure supports comprehensive testing:

```bash
# Run unit tests (when configured)
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (when configured)
npm run test:e2e
```

## 📝 Code Conventions

- All files end with `// Made with Bob` comment
- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Use formatters from `utils/formatters.ts` for consistent formatting
- Import types with `type` keyword for better tree-shaking

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deployment Options

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Configure in repository settings
- **AWS S3 + CloudFront**: Upload `dist/` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Development Notes

### Mock Data

Currently, the application uses mock data generated by `financeService`. To integrate with real Yahoo Finance API:

1. Install `yahoo-finance2` package
2. Update `financeService.ts` to use real API calls
3. Add environment variables for API configuration
4. Implement proper error handling for API failures

### Performance Considerations

- Caching reduces unnecessary API calls
- Auto-refresh intervals are optimized per timeframe
- Charts use ResponsiveContainer for better performance
- Components are optimized with proper key props

### Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Color contrast meets WCAG AA standards

---

**Made with Bob** 🤖
