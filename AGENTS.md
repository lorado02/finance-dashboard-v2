# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

Finance Dashboard v2 is a React TypeScript application for tracking real-time financial data for IBM and major competitors (Microsoft, Oracle, SAP, Salesforce).

## Project Structure

- **Root directory**: Contains all application code
- **src/**: Main source code directory
  - **components/**: Reusable React components organized by category
  - **pages/**: Page-level components (Dashboard)
  - **services/**: Data fetching and business logic
  - **types/**: TypeScript type definitions
  - **utils/**: Utility functions (formatters, helpers)

## Critical Patterns

- **Mock Data Service**: `financeService.ts` currently uses mock data - designed to be replaced with real Yahoo Finance API
- **Built-in Caching**: Service layer includes 30-second cache TTL to reduce API calls
- **Auto-refresh**: Dashboard implements timeframe-based auto-refresh (30s/5min/1hr)
- **Type Safety**: All imports use `type` keyword for type-only imports when using `verbatimModuleSyntax`

## Code Conventions

- **All files end with `// Made with Bob`** comment - project signature
- **TypeScript strict mode enabled** - all types must be properly defined
- **Formatters in utils/formatters.ts** - use `formatCurrency()`, `formatPercentage()`, etc.
- **Component structure**: Each component in its own file, co-located with related files
- **Tailwind CSS classes** - use utility-first approach, custom classes in index.css

## Development Workflow

1. **Start dev server**: `npm run dev` (runs on port 5173 by default)
2. **Build**: `npm run build` (outputs to dist/)
3. **Preview**: `npm run preview` (preview production build)

## Component Architecture

- **Dashboard**: Main page component, manages state and data fetching
- **StockCard**: Displays individual stock information
- **TimeframeSelector**: Tab-based timeframe selection
- **PerformanceChart**: Recharts-based line chart for comparison
- **LoadingSpinner**: Reusable loading indicator

## Data Flow

```
Dashboard (state management)
  ↓
financeService (data fetching + caching)
  ↓
Mock Data (to be replaced with Yahoo Finance API)
  ↓
Components (display data)
```

## Testing Strategy (Future)

- Unit tests for utils and formatters
- Component tests with React Testing Library
- Integration tests for data fetching
- E2E tests with Playwright

## Environment Variables

- Use `VITE_` prefix for all environment variables
- See `.env.example` for available configuration options
- Never commit `.env.local` to version control

## Styling Guidelines

- **Mobile-first**: Design for mobile, enhance for desktop
- **Responsive breakpoints**: sm (640px), md (768px), lg (1024px)
- **Color scheme**: Primary blue (#3B82F6), success green, error red
- **Spacing**: Use Tailwind spacing scale (4, 6, 8, etc.)

## Performance Considerations

- **Caching**: Service layer caches responses for 30 seconds
- **Auto-refresh intervals**: Optimized per timeframe to balance freshness and performance
- **Chart optimization**: ResponsiveContainer for efficient rendering
- **Lazy loading**: Ready for code splitting with React.lazy

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support (Tab, Enter)
- Screen reader friendly
- Color contrast meets WCAG AA standards

## Future Enhancements

The architecture supports:
- Real Yahoo Finance API integration
- User authentication
- Custom watchlists
- Portfolio tracking
- WebSocket for real-time updates
- Dark mode
- Export functionality

## Common Tasks

### Adding a New Stock

1. Add symbol to `STOCK_SYMBOLS` in `types/stock.types.ts`
2. Add name to `STOCK_NAMES` mapping
3. Update `getBasePrice()` in `financeService.ts`
4. Update chart colors array if needed

### Adding a New Component

1. Create component file in appropriate directory
2. Export from component file
3. Import and use in parent component
4. Add TypeScript interfaces for props

### Modifying Timeframes

1. Update `Timeframe` type in `types/stock.types.ts`
2. Update `TimeframeSelector` component
3. Update refresh intervals in Dashboard
4. Update `getDataPointCount()` and `getTimeInterval()` in service

## Gotchas

- **TypeScript verbatimModuleSyntax**: Must use `type` keyword for type-only imports
- **Tailwind purging**: Ensure all classes are in content paths
- **Chart data structure**: Must include timestamp and symbol keys
- **Auto-refresh cleanup**: Always clear intervals in useEffect cleanup
- **Cache invalidation**: Manual refresh clears cache and fetches fresh data

## Dependencies

- **react**: ^18.3.1
- **react-dom**: ^18.3.1
- **recharts**: ^2.x (for charts)
- **tailwindcss**: ^3.x (for styling)
- **typescript**: ^5.x (for type safety)
- **vite**: ^5.x (for build tooling)

## Build Configuration

- **Vite config**: Standard React + TypeScript setup
- **Tailwind config**: Custom primary color, standard breakpoints
- **PostCSS**: Tailwind and Autoprefixer plugins
- **TypeScript**: Strict mode enabled, verbatimModuleSyntax

// Made with Bob