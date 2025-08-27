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
- Export functions: `getFundamentalDataParams()`, `getNewsReliabilityParams()`, etc.

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
- **Deployment Ready**: Build compiles successfully in ~20s with only harmless ESLint warnings

### Production Deployment Status
- **Build Status**: ✅ Compiled successfully
- **Static Generation**: ✅ 14/14 pages generated  
- **TypeScript**: ✅ No compilation errors
- **Vercel Compatible**: ✅ All deployment blockers resolved
- **Route Size**: Main uncertainty analysis route (264 KB) optimized for production

This application serves as a bachelor's thesis project focused on uncertainty visualization in AI trading systems, emphasizing mathematical accuracy, user experience, and clear presentation of complex uncertainty metrics through consistent Info-Box architecture, violet-bloom design patterns, and robust calculation-based uncertainty quantification.