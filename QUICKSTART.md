# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Running

```bash
# Navigate to project directory
cd finance-dashboard-v2

# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### What You'll See

The dashboard displays:
- **5 Stock Cards**: IBM, Microsoft, Oracle, SAP, and Salesforce
- **Real-time Data**: Price, change, volume, and market cap
- **Timeframe Selector**: Switch between Current Day, Last 7 Days, and Last Quarter
- **Performance Chart**: Interactive line chart comparing all stocks
- **Auto-refresh**: Data updates automatically based on selected timeframe

### Project Structure Overview

```
src/
├── components/
│   ├── common/          # LoadingSpinner
│   ├── dashboard/       # StockCard, TimeframeSelector
│   └── charts/          # PerformanceChart
├── pages/               # Dashboard (main page)
├── services/            # financeService (data layer)
├── types/               # TypeScript definitions
└── utils/               # Formatting utilities
```

### Key Features

1. **Mock Data**: Currently uses generated mock data
2. **Caching**: 30-second cache to reduce API calls
3. **Auto-refresh**: 
   - Current Day: 30 seconds
   - Last 7 Days: 5 minutes
   - Last Quarter: 1 hour
4. **Responsive**: Works on mobile, tablet, and desktop
5. **Accessible**: ARIA labels, keyboard navigation

### Making Changes

#### Add a New Stock
1. Edit `src/types/stock.types.ts`
2. Add symbol to `STOCK_SYMBOLS`
3. Add name to `STOCK_NAMES`
4. Update `getBasePrice()` in `financeService.ts`

#### Modify Styling
- Global styles: `src/index.css`
- Tailwind config: `tailwind.config.js`
- Component styles: Use Tailwind utility classes

#### Change Refresh Intervals
Edit the intervals object in `src/pages/Dashboard.tsx`:
```typescript
const intervals = {
  current: 30000,    // milliseconds
  '7days': 300000,
  quarter: 3600000
};
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Output will be in dist/ directory
```

### Next Steps

1. **Integrate Real API**: Replace mock data in `financeService.ts` with Yahoo Finance API
2. **Add Tests**: Set up Vitest and create test files
3. **Add Features**: User authentication, watchlists, portfolio tracking
4. **Deploy**: Use Vercel, Netlify, or your preferred hosting

### Troubleshooting

**Build fails?**
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Port already in use?**
- Change port in `vite.config.ts` or use: `npm run dev -- --port 3000`

**Styles not working?**
- Ensure Tailwind CSS is properly configured
- Check that `@import "tailwindcss"` is in `src/index.css`

### Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Made with Bob** 🤖