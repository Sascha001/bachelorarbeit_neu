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

#### Uncertainty Visualization
The main focus is uncertainty analysis in AI trading recommendations:
- **Model Uncertainty**: ChatGPT Framework with 5 dimensions (Epistemische/Aleatorische Unsicherheit, Overfitting-Risiko, Robustheit, Erklärungs-Konsistenz)
- **Data Uncertainty**: Data quality metrics across 4 parameters (Fundamentaldaten, News-Verlässlichkeit, Zeitreihen-Integrität, Handelsvolumen)  
- **Expert Assessment**: Human expert input integration
- **Risk Management**: Volatility and risk alerts with uncertainty quantification
- **Trading Recommendations**: Buy/sell/hold signals with confidence levels and uncertainty boundaries

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
- Real-time data simulation with mock data

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

### Mock Data
- Uses mock notification data that matches validation page items
- Stock data and trading information are simulated for development
- Real-time updates are simulated through React state management
- Uncertainty parameters use realistic mathematical formulations with KaTeX rendering

### UI/UX Architecture Decisions
- **Info-Box over Dialogs**: Replaced nested Dialog systems with slide-in Info-Boxes for better event handling
- **Vertical Layout Consistency**: Both Datenunsicherheit and Modellunsicherheit follow identical vertical structures
- **Mathematical Formula Integration**: KaTeX formulas are embedded with hover tooltips for detailed explanations
- **Consistent Border Design**: All info sections use violet-bloom borders for visual hierarchy
- **Event-Driven Interactions**: Click Info-Icon → Info-Box slides in → Inner tooltips work independently

This application serves as a bachelor's thesis project focused on uncertainty visualization in AI trading systems, emphasizing user experience and clear presentation of complex uncertainty metrics through consistent Info-Box architecture and violet-bloom design patterns.