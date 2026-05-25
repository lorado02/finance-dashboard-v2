# Validation & Testing Guide

This document provides comprehensive instructions for validating the Finance Dashboard application locally.

## 📋 Table of Contents

1. [Quick Validation](#quick-validation)
2. [Individual Checks](#individual-checks)
3. [Test Coverage](#test-coverage)
4. [Success Criteria](#success-criteria)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Validation

Run all checks in sequence:

```bash
cd finance-dashboard-v2
npm run validate
```

This command runs:
1. **Linting** - Code quality checks
2. **Tests** - Unit and component tests
3. **Build** - Production build verification

**Expected Output:**
```
✓ Linting passed (with warnings acceptable)
✓ All tests passed (40/40)
✓ Build successful
```

---

## 🔍 Individual Checks

### 1. Install Dependencies

```bash
npm install
```

**Success:** No errors, all packages installed

### 2. Type Checking

```bash
npx tsc --noEmit
```

**Success:** No TypeScript errors

### 3. Linting

```bash
npm run lint
```

**Success:** 
- No errors (warnings are acceptable)
- Common warnings:
  - `@typescript-eslint/no-explicit-any` - Type safety warnings
  - `react-hooks/exhaustive-deps` - Dependency array warnings

### 4. Run Tests

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Success Criteria:**
- ✅ All 40 tests passing
- ✅ 2 test files executed
- ✅ No test failures

**Test Breakdown:**
- `formatters.test.ts`: 27 tests (data transformation logic)
- `StockCard.test.tsx`: 13 tests (UI rendering)

### 5. Build Application

```bash
npm run build
```

**Success:**
- ✅ TypeScript compilation successful
- ✅ Vite build completes
- ✅ Output in `dist/` directory
- ✅ Bundle size ~590KB (acceptable)

### 6. Preview Production Build

```bash
npm run preview
```

**Success:**
- ✅ Server starts on http://localhost:4173
- ✅ Application loads without errors
- ✅ All 3 views render correctly

### 7. Development Server

```bash
npm run dev
```

**Success:**
- ✅ Server starts on http://localhost:5173
- ✅ Hot module replacement works
- ✅ No console errors

---

## 📊 Test Coverage

### Current Coverage

Run coverage report:

```bash
npm run test:coverage
```

**Expected Coverage:**
- **Formatters**: ~100% (all utility functions tested)
- **StockCard**: ~90% (comprehensive component testing)
- **Overall**: Baseline established for future expansion

### Coverage Report Location

After running coverage:
- **Terminal**: Summary in console
- **HTML Report**: `coverage/index.html`
- **JSON Report**: `coverage/coverage-final.json`

View HTML report:
```bash
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

---

## ✅ Success Criteria

### Application Functionality

1. **Dashboard Loads**
   - ✅ No console errors
   - ✅ All 5 stock cards display
   - ✅ Data loads within 2 seconds

2. **Timeframe Switching**
   - ✅ Current Day view shows market summary
   - ✅ 7-Day view shows trend charts
   - ✅ Quarter view shows comprehensive analysis
   - ✅ Smooth transitions between views

3. **Data Display**
   - ✅ Stock prices formatted correctly ($XXX.XX)
   - ✅ Percentages show with +/- signs
   - ✅ Volume formatted (M/B suffixes)
   - ✅ Market cap formatted (B/T suffixes)

4. **Interactive Features**
   - ✅ Refresh button works
   - ✅ Chart tooltips appear on hover
   - ✅ Stock cards are clickable
   - ✅ Auto-refresh intervals work

5. **Responsive Design**
   - ✅ Mobile view (< 640px): Single column
   - ✅ Tablet view (640-1024px): Two columns
   - ✅ Desktop view (> 1024px): Three columns
   - ✅ Charts resize properly

### Code Quality

1. **TypeScript**
   - ✅ No compilation errors
   - ✅ All types properly defined
   - ✅ No implicit `any` types (warnings acceptable)

2. **Tests**
   - ✅ All tests passing
   - ✅ No flaky tests
   - ✅ Fast execution (< 2 seconds)

3. **Build**
   - ✅ Production build succeeds
   - ✅ No build warnings (size warnings acceptable)
   - ✅ Assets properly optimized

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Tests Failing

**Issue:** Tests fail with "toBeInTheDocument is not defined"

**Solution:**
```bash
# Ensure test setup is correct
cat src/test/setup.ts
# Should import @testing-library/jest-dom/matchers
```

#### 2. Build Fails

**Issue:** Tailwind CSS errors

**Solution:**
```bash
# Check PostCSS config
cat postcss.config.js
# Should use @tailwindcss/postcss

# Reinstall if needed
npm install -D @tailwindcss/postcss
```

#### 3. Type Errors

**Issue:** TypeScript errors in test files

**Solution:**
```bash
# Check vitest types are declared
cat src/test/vitest.d.ts
# Should extend Assertion interface
```

#### 4. Lint Errors

**Issue:** Too many lint errors

**Solution:**
```bash
# Use the provided .eslintrc.cjs
# Warnings are acceptable, only errors block validation
npm run lint -- --max-warnings=50
```

#### 5. Port Already in Use

**Issue:** Dev server won't start

**Solution:**
```bash
# Use different port
npm run dev -- --port 3000

# Or kill existing process
lsof -ti:5173 | xargs kill
```

---

## 📝 Validation Checklist

Use this checklist before committing or deploying:

### Pre-Commit Checklist

- [ ] `npm install` - Dependencies installed
- [ ] `npm run test:run` - All tests pass
- [ ] `npm run lint` - No critical errors
- [ ] `npm run build` - Build succeeds
- [ ] Manual testing of all 3 views
- [ ] Check console for errors
- [ ] Verify responsive design

### Pre-Deployment Checklist

- [ ] All pre-commit checks pass
- [ ] `npm run preview` - Production build works
- [ ] Test on multiple browsers
- [ ] Test on mobile device
- [ ] Verify environment variables
- [ ] Check bundle size (< 1MB acceptable)
- [ ] Performance audit (Lighthouse)

---

## 🎯 Performance Benchmarks

### Expected Performance

- **Initial Load**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **Bundle Size**: ~590KB (gzipped ~175KB)
- **Test Execution**: < 2 seconds
- **Build Time**: < 5 seconds

### Lighthouse Scores (Target)

- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 90

Run Lighthouse:
```bash
npm run build
npm run preview
# Open Chrome DevTools > Lighthouse > Run audit
```

---

## 🔄 Continuous Integration

### GitHub Actions Example

```yaml
name: Validate
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run validate
```

---

## 📈 Test Metrics

### Current Test Suite

| Category | Tests | Status |
|----------|-------|--------|
| Formatters | 27 | ✅ Passing |
| StockCard | 13 | ✅ Passing |
| **Total** | **40** | **✅ All Passing** |

### Test Execution Time

- **Formatters**: ~20ms
- **StockCard**: ~90ms
- **Total**: ~110ms (excluding setup)

---

## 🎓 Best Practices

### Before Making Changes

1. Run tests: `npm test`
2. Ensure all pass before modifying code

### After Making Changes

1. Run tests: `npm run test:run`
2. Run lint: `npm run lint`
3. Run build: `npm run build`
4. Manual testing in browser

### Adding New Features

1. Write tests first (TDD)
2. Implement feature
3. Ensure tests pass
4. Update documentation

---

## 📞 Support

If validation fails:

1. Check this troubleshooting guide
2. Review error messages carefully
3. Ensure all dependencies are installed
4. Try `rm -rf node_modules && npm install`
5. Check Node.js version (18+ required)

---

**Made with Bob** 🤖