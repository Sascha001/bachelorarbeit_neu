# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.6 application for uncertainty visualization in trading/financial AI systems. The application is focused on providing insights into AI trading recommendations, uncertainty analysis, and portfolio management with a German interface.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack (faster builds)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint linting

### Working Directory
All commands should be run from the `frontend-app/` directory, not the repository root.

### Test Commands
- No test framework is currently configured in package.json
- Testing approach should be determined by examining existing code patterns

## Architecture

### Technology Stack
- **Framework**: Next.js 15.4.6 with App Router
- **UI Library**: Radix UI components with custom styling
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **TypeScript**: Full TypeScript support
- **Fonts**: Plus Jakarta Sans (primary), Lora (serif), IBM Plex Mono (monospace)

### Key Architecture Concepts

#### Layout Structure
- Uses a sidebar-based layout with `SidebarProvider` from custom UI components
- Main navigation through `AppSidebar` component located in `src/components/app-sidebar.tsx`
- Header contains breadcrumbs, stock search, and theme/notification controls
- All pages follow consistent layout pattern
- Custom VSCode-style scrollbar system implemented via inline script in layout.tsx

#### Custom Scrollbar System Requirements

##### Core System Architecture
- **Main System**: Located in `src/app/layout.tsx` inline script
- **Component Class**: Use `violet-bloom-scrollbar` for scrollable elements
- **Hook Integration**: Use `useCoolScrollbar()` hook for component refs
- **Periodic Detection**: 2000ms interval checks for new scrollable elements
- **Fade Effect**: VS Code-style fade out after 1000ms of inactivity

##### Required Scrollbar Implementations

###### 1. Sidebar Custom Scrollbar
- **Location**: `src/components/app-sidebar.tsx` 
- **Requirements**: 
  - Add custom scrollbar to main sidebar navigation container
  - Apply `violet-bloom-scrollbar` class to scrollable sidebar content
  - Ensure proper fade effects when navigating between sidebar items
  - Handle collapsible sidebar states (icon mode vs full mode)

###### 2. Stock Search Scrollbar
- **Header Location**: `src/components/stock-search.tsx` - search results dropdown
- **Uncertainty Analysis**: Search results on `/statistik/unsicherheits-analyse` page
- **Requirements**:
  - Custom scrollbar for search results dropdown (max-h-80 overflow-y-auto)
  - Proper scrollbar positioning within dropdown container
  - VS Code fade effects for search result scrolling
  - Maintain violet-bloom theming consistency

###### 3. Pop-up Scrollbar System Redesign
- **Current Issues**: 
  - Pop-up scrollbars interfere with background page scrolling
  - Event bubbling causes background scroll when pop-up reaches scroll limit
  - Inconsistent fade behavior in modal/dialog contexts
- **Requirements**:
  - Remove existing pop-up scrollbar implementations
  - Implement isolated scroll containers with event.stopPropagation()
  - Add custom scrollbars with proper VS Code fade effects
  - Prevent scroll event bubbling to background page
  - Apply to all Dialog, Tooltip, and Popover scrollable content

##### Implementation Patterns

###### Basic Component Scrollbar
```tsx
// Component with custom scrollbar
const scrollbarRef = useCoolScrollbar()

return (
  <div 
    ref={scrollbarRef}
    className="violet-bloom-scrollbar overflow-auto"
  >
    {/* Scrollable content */}
  </div>
)
```

###### Scroll Event Isolation for Pop-ups
```tsx
// Prevent background scroll in pop-ups
<div 
  className="violet-bloom-scrollbar overflow-auto"
  onWheel={(e) => e.stopPropagation()}
  onTouchMove={(e) => e.stopPropagation()}
>
  {/* Pop-up scrollable content */}
</div>
```

##### VS Code Fade Effect Specifications
- **Show Duration**: Scrollbar visible during active scrolling
- **Fade Delay**: 1000ms delay before fade out begins
- **Fade Duration**: Smooth CSS transition fade
- **Re-trigger**: Any scroll activity immediately shows scrollbar again
- **Hover Behavior**: Scrollbar remains visible during hover

#### Component Organization
- **UI Components**: Located in `src/components/ui/` - reusable Radix-based components
- **Feature Components**: Located in `src/components/` - application-specific components
- **Pages**: Using App Router structure in `src/app/`
- **Hooks**: Custom hooks in `src/hooks/`

#### Key Routes Structure
- `/` - Home dashboard with portfolio overview
- `/dashboard` - Main dashboard view
- `/depot` - Portfolio/depot overview and performance
- `/statistik` - Trading statistics
- `/statistik/unsicherheits-analyse` - Uncertainty analysis (core feature)
- `/statistik/validierung` - Validation statistics
- `/ueberpruefung` - Model/data/human verification

#### Theme System
- Uses custom "violet-bloom" theme with CSS variables
- Theme toggle functionality available
- Consistent card styling with gradient backgrounds
- Dark/light mode support

#### State Management
- React hooks for local state
- Custom notification system via `useNotifications` hook in `src/hooks/use-notifications.ts`
- Stock selection state management
- Notification state includes trade validation counts with unread tracking

### Core Features

#### Uncertainty Visualization Framework
The main focus is uncertainty analysis in AI trading recommendations using a comprehensive mathematical framework:

##### Model Uncertainty (ChatGPT Framework)
- **Epistemische Unsicherheit**: Measures model confidence through prediction standard deviation vs mean prediction (E = 1 - σ_ŷ/(μ_ŷ + ε))
- **Aleatorische Unsicherheit**: Quantifies irreducible market volatility (A = 1 - σ²_pred/σ²_max)  
- **Overfitting-Risiko**: Evaluates generalization capability by comparing train/test losses (C = 1 - |L_train - L_test|/(L_train + ε))
- **Robustheit/Stabilität**: Tests model stability under input perturbations (R = 1 - Δŷ/ŷ)
- **Erklärungs-Konsistenz**: Measures explanation consistency across training runs (X = (ρ + 1)/2)

##### Data Uncertainty (4 Quality Dimensions)
- **Fundamentaldaten**: Completeness, timeliness, consistency, accuracy, and stability of financial data
- **News-Verlässlichkeit**: Source reliability, reputation accuracy, cross-source consensus, and bias detection
- **Zeitreihen-Integrität**: Data completeness, outlier freedom, revision stability, and temporal continuity
- **Handelsvolumen**: Market concentration, anomalous spikes detection, and time stability analysis

##### Mathematical Implementation
- **Pure Calculation Architecture**: No dummy result values - all metrics computed from input parameters
- **Dynamic Score Calculation**: Real-time computation using mathematical functions
- **TypeScript Interface Safety**: Strict typing for all parameter structures
- **KaTeX Formula Rendering**: Visual mathematical formulas with LaTeX notation
- **Parameter Validation**: Robust error handling and boundary checks

##### Uncertainty Aggregation
- **Total Uncertainty**: Combined score from data + model + human uncertainty dimensions
- **Weighted Scoring**: Configurable weights for different uncertainty types
- **Confidence Intervals**: Statistical bounds on recommendation confidence
- **Risk-Adjusted Recommendations**: BUY/HOLD/SELL signals with uncertainty quantification

#### Dashboard Components
- Portfolio value and performance metrics
- Active positions tracking
- AI confidence scores
- Uncertainty scoring system
- Real-time activity feeds
- Risk management alerts

## Development Guidelines

### Component Patterns
- Use `"use client"` directive for interactive components
- Follow Radix UI patterns for accessibility
- Implement responsive design with Tailwind CSS
- Use TypeScript interfaces for props and data structures

### Styling Conventions
- Primary class: `violet-bloom-card` for consistent card styling
- Use semantic color classes (text-foreground, text-muted-foreground, etc.)
- Gradient backgrounds with `from-card via-card to-primary/5`
- Border styling with `border-primary/20`
- Custom scrollbar styling with `violet-bloom-scrollbar` class for components
- Tailwind CSS v4 with custom CSS variables defined in globals.css

### Data Handling
- Stock symbols use uppercase format (AAPL, TSLA, NVDA)
- German language interface for all user-facing text
- Percentage and currency formatting for financial data with `.toFixed(2)` for currency amounts
- **Mathematical Parameter Structure**: Pure input parameters without dummy result values
- **Dynamic Calculations**: All uncertainty scores computed from mathematical functions
- **Interface Definitions**: Strict TypeScript interfaces for all parameter types:
  - `ModelUncertaintyParams`: ChatGPT Framework parameters
  - `FundamentalDataParams`: Financial data quality parameters  
  - `NewsReliabilityParams`: News source quality parameters
  - `TimeSeriesIntegrityParams`: Time series data quality parameters
  - `TradingVolumeParams`: Market volume analysis parameters
- Real-time data simulation with mathematically consistent mock data

### Navigation and Routing
- Breadcrumb navigation on all pages
- Sidebar navigation with collapsible icon mode
- Stock search functionality integrated in header
- Notification system with unread counts

### Pop-up and Dialog Design Patterns
- **Violet-Bloom Consistency**: All pop-up components use `bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg`
- **Info-Box System**: Use Info-Box pattern instead of nested Dialog structures for better event handling
- **Vertical Layout Structure**: Follow consistent vertical flow: Intro → Parameters → Score → Formula
- **Parameter Lists**: Use numbered parameter displays (1. 2. 3.) with badges for values
- **Info-Box Borders**: All explanation sections require visible borders for better readability
- **No Redundant Badges**: Avoid duplicate percentage displays when already shown in content

### Standardized Tooltip Structure (4-Block Format)
All Data Uncertainty parameter tooltips follow this exact structure for consistency:
```tsx
<TooltipContent className="max-w-lg">
  <div className="space-y-3 p-2">
    <div className="font-semibold text-sm text-white">Parameter Name (Category)</div>
    
    <div className="space-y-2">
      <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
      <div className="formula-container bg-muted/30 p-2 rounded">
        <BlockMath math="General Formula" />
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
      <div className="formula-container bg-muted/30 p-2 rounded">
        <BlockMath math="Current calculation with values" />
      </div>
    </div>
    
    <div className="text-xs text-gray-200">
      Brief explanation of what the parameter measures
    </div>
  </div>
</TooltipContent>
```
- **Block 1**: Parameter title with category identifier
- **Block 2**: General formula with KaTeX rendering
- **Block 3**: Current calculation with actual stock values
- **Block 4**: Brief explanatory text
- **Consistency**: All 16 Data Uncertainty parameters use this identical structure

### Info-Box Architecture
- **Unified System**: Both Datenunsicherheit and Modellunsicherheit use identical Info-Box patterns
- **Event Handler**: Use `handleInfoClick` for consistent behavior across all uncertainty components
- **Content Structure**: Intro text + Parameter breakdown + Formula section with hover tooltips
- **Avoid Dialog Nesting**: Never nest Dialog components within Tooltip structures
- **Universal Components**: Use standard HTML elements (h3, p, div) instead of Dialog-specific components

### Event Handling Best Practices
- **No Nested Dialogs**: Avoid `Tooltip → Dialog → Tooltip` structures that cause event conflicts
- **Info-Box Pattern**: Use slide-in Info-Box system for detailed parameter explanations
- **Tooltip Independence**: Inner tooltips (generelle Formel) must work independently of outer click events
- **Event Isolation**: Use Info-Box system to prevent event bubbling issues
- **Immediate Response**: Remove `delayDuration` properties for immediate hover response

### KaTeX Formula Rendering Guidelines
- **Font Sizing**: Use smaller font sizes to prevent overflow: `.formula-container { font-size: 0.8rem !important; }`
- **Container Sizing**: Use `overflow-x-auto` and proper padding for formula containers
- **Box Dimensions**: Ensure formulas stay within violet-bloom bordered containers
- **Responsive Design**: Use horizontal scroll for long formulas rather than line breaking
- **Rendering Issues Fix**: When KaTeX formulas display as raw text instead of rendered math, apply the proven fix: temporarily remove the entire tooltip component, then re-add it with fresh formulas. This triggers proper KaTeX initialization.
- **Escape Characters**: Use single backslashes (`\`) in BlockMath math prop, not double backslashes (`\\`) which can cause rendering issues

## Important Development Notes

### Dependencies
The project uses specific versions:
- Next.js 15.4.6 with Turbopack for fast development builds
- React 19.1.0 
- Tailwind CSS v4 with PostCSS
- Extensive Radix UI component library for accessible UI primitives
- KaTeX for mathematical formula rendering
- Lucide React for icons

### Mathematical Framework & Data Architecture
- **No Dummy Result Values**: All uncertainty scores computed from mathematical functions, not hardcoded
- **ChatGPT Framework Implementation**: 5-dimension model uncertainty with validated formulas
- **Parameter-Based Calculations**: Input parameters only, results derived through calculation functions
- **TypeScript Safety**: Comprehensive interface definitions prevent property access errors
- **Build Stability**: Eliminated `.value` property dependencies that caused compilation errors

#### Stock-Specific Uncertainty Parameter System (2025-09-01 Update)
The application now features a comprehensive stock-specific uncertainty parameter system with individualized data for all 15 supported stocks:

##### Supported Stocks & Uncertainty Categories
**15 Stocks with Full Parameter Support:**
- **US Tech Giants**: AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA
- **Financial Services**: JPM, V, MA
- **Healthcare & Consumer**: JNJ, UNH, PG, KO
- **Retail**: HD

**Uncertainty Level Distribution:**
- **High Uncertainty (55-80%)**: AAPL, TSLA, META, NVDA (4 stocks)
- **Medium Uncertainty (40-50%)**: MSFT, GOOGL, AMZN, HD, JPM (5 stocks)
- **Low Uncertainty (15-35%)**: JNJ, PG, KO, UNH, V, MA (6 stocks)

##### Parameter Categories (All Stock-Specific)
**1. Model Uncertainty Parameters (`getModelUncertaintyParams(stock)`):**
- **Epistemische Unsicherheit**: predictionStdDev, meanPrediction, epsilon
- **Aleatorische Unsicherheit**: meanPredictionVariance, maxExpectedVariance, confidenceInterval95
- **Overfitting Risk**: trainLoss, testLoss, epsilon
- **Robustheit**: meanPerturbationChange, baselinePrediction
- **Explanation Consistency**: featureImportanceCorrelation

**2. Data Uncertainty Parameters (All functions accept stock parameter):**
- `getFundamentalDataParams(stock)`: completeness, timeliness, consistency, accuracy, stability
- `getNewsReliabilityParams(stock)`: sourceReliability, reputationAccuracy, crossSourceConsensus, biasCheck
- `getTimeSeriesIntegrityParams(stock)`: completeness, outlierFreedom, revisionStability, continuity
- `getTradingVolumeParams(stock)`: concentration, anomalousSpikes, timeStability

##### Diversified Uncertainty Breakdown Patterns
**Data Uncertainty Dominant (50-60% of total):**
- **TSLA**: Volatile news coverage + erratic time series + poor fundamentals
- **NVDA**: Hyped media coverage + momentum-driven patterns + inconsistent data

**Model Uncertainty Dominant (45-55% of total):**
- **META**: Complex AI predictions + regulatory challenges + moderate data quality
- **AMZN**: Multi-business complexity + mixed trading patterns + average data

**Human Uncertainty Dominant (40-50% of total):**
- **MSFT**: Stable tech with trader behavior influence + good data quality
- **GOOGL**: Predictable patterns but human psychology important + reliable sources

**Balanced Distribution (30-35% each dimension):**
- **Blue-chip stocks** (JNJ, PG, KO, UNH, V, MA): Consistent across all dimensions

##### Recommendation Logic (2-Step Process)
**Step 1: Market-Based Analysis**
```typescript
const stockAnalysis: Record<string, string> = {
  // Growth stocks with strong fundamentals
  AAPL: "BUY", MSFT: "BUY", GOOGL: "BUY", V: "BUY", MA: "BUY",
  // Stable value stocks  
  JNJ: "BUY", PG: "BUY", KO: "BUY", UNH: "BUY",
  // Mixed signals / mature markets
  HD: "HOLD", JPM: "HOLD",
  // High volatility / risk concerns
  TSLA: "SELL", META: "HOLD", NVDA: "SELL", AMZN: "HOLD"
};
```

**Step 2: Uncertainty Filter**
- **Threshold**: >50% total uncertainty → automatic "HOLD"
- **Rationale**: Too uncertain to recommend active trading
- **Application**: Applied uniformly across uncertainty-overview.tsx and purchase-recommendation.tsx

##### Implementation Files
- **Core Functions**: `src/components/technical-analysis-tab.tsx` (lines 845-1852)
- **Uncertainty Overview**: `src/components/uncertainty-overview.tsx` (lines 19-22, 115-154)
- **Purchase Logic**: `src/components/purchase-recommendation.tsx` (lines 69-72, 124-147)
- **Simplified Analysis**: `src/components/simplified-analysis-tab.tsx` (lines 44-47)
- Uses mock notification data that matches validation page items
- Stock data and trading information are simulated for development  
- Real-time updates are simulated through React state management
- Uncertainty parameters use realistic mathematical formulations with KaTeX rendering

### Key Calculation Functions
Located in `src/components/technical-analysis-tab.tsx`:
- `calculateAllModelUncertainty()`: Computes all 5 ChatGPT Framework dimensions
- `calculateAllFundamentalData()`: Processes fundamental data quality metrics
- `calculateAllNewsReliability()`: Evaluates news source reliability
- `calculateAllTimeSeries()`: Analyzes time series data integrity  
- `calculateAllTradingVolume()`: Assesses trading volume patterns
- **Stock-specific parameter functions** (Updated 2025-09-01):
  - `getModelUncertaintyParams(stock)`: Individual model parameters for each of 15 stocks
  - `getFundamentalDataParams(stock)`: Stock-specific fundamental data quality
  - `getNewsReliabilityParams(stock)`: Stock-specific news reliability metrics
  - `getTimeSeriesIntegrityParams(stock)`: Stock-specific time series patterns
  - `getTradingVolumeParams(stock)`: Stock-specific trading volume characteristics

### UI/UX Architecture Decisions
- **Info-Box over Dialogs**: Replaced nested Dialog systems with slide-in Info-Boxes for better event handling
- **Vertical Layout Consistency**: Both Datenunsicherheit and Modellunsicherheit follow identical vertical structures
- **Mathematical Formula Integration**: KaTeX formulas are embedded with hover tooltips for detailed explanations
- **Consistent Border Design**: All info sections use violet-bloom borders for visual hierarchy
- **Event-Driven Interactions**: Click Info-Icon → Info-Box slides in → Inner tooltips work independently
- **Build-Safe Components**: Removed problematic FormulaTooltip component to ensure deployment stability

### Development History & Stability
- **Mathematical Framework Overhaul (2025-08-27)**: Complete replacement of dummy values with calculation-based architecture
- **Build Stability Improvements**: Resolved all TypeScript property errors for successful Vercel deployment
- **Interface Standardization**: Added comprehensive TypeScript interfaces for all parameter types
- **Code Organization**: Cleaned up 278+ lines of obsolete code, added 110 lines of structured functions
- **Tooltip Standardization (2025-08-30)**: Unified all 16 Data Uncertainty parameter tooltips to identical 4-block structure for consistent user experience
- **KaTeX Rendering Fixes (2025-08-30)**: Resolved formula rendering issues in Gesamtberechnung tooltips using remove/re-add methodology
- **Stock-Specific Parameter System (2025-09-01)**: Major enhancement with individual uncertainty parameters for all 15 stocks:
  - Added 764+ lines of stock-specific parameter data across 4 data uncertainty categories
  - Implemented diversified uncertainty breakdown patterns (data/model/human dominance)
  - Created 2-step recommendation logic with uncertainty filter (>50% → HOLD)
  - Established mathematical consistency across all components (uncertainty-overview, purchase-recommendation, simplified-analysis)
  - Resolved all recommendation inconsistencies (e.g., SAP HOLD vs BUY conflict)
- **Deployment Ready**: Build compiles successfully with comprehensive parameter validation

### Production Deployment Status
- **Build Status**: ✅ Compiled successfully
- **Static Generation**: ✅ 14/14 pages generated  
- **TypeScript**: ✅ No compilation errors
- **Vercel Compatible**: ✅ All deployment blockers resolved
- **Route Size**: Main uncertainty analysis route (264 KB) optimized for production

## Common Issues & Solutions

### KaTeX Formula Rendering Problems
**Problem**: KaTeX formulas display as raw LaTeX text instead of rendered mathematical notation  
**Symptoms**: Info icons show `\frac{A}{B}` instead of proper fraction bars  
**Solution**: Apply the proven remove/re-add fix:
1. Remove the entire Tooltip component containing the problematic formula
2. Re-add the Tooltip with the same formula content  
3. Use single backslashes (`\`) not double backslashes (`\\`) in math prop
**Why it works**: Forces fresh KaTeX initialization and proper component mounting

### Tooltip Structure Inconsistencies  
**Problem**: Parameter tooltips have different layouts and information organization  
**Symptoms**: Some use complex info-panel format, others use simple structure  
**Solution**: Standardize all tooltips to the 4-block structure:
- Block 1: `Parameter Name (Category)`
- Block 2: `Generelle Formel:` with KaTeX formula
- Block 3: `Aktuelle Berechnung für {stock}:` with current values
- Block 4: Brief explanatory text
**Example files affected**: All 16 Data Uncertainty parameters in `technical-analysis-tab.tsx`

This application serves as a bachelor's thesis project focused on uncertainty visualization in AI trading systems, emphasizing mathematical accuracy, user experience, and clear presentation of complex uncertainty metrics through consistent Info-Box architecture, violet-bloom design patterns, and robust calculation-based uncertainty quantification.