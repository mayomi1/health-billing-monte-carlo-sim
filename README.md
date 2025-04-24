# Healthcare Billing Dashboard

A comprehensive healthcare billing dashboard with Monte Carlo simulation for revenue forecasting.

## Architecture Overview

### Component Structure

```
app/
├── layout.tsx
└── page.tsx   # Main dashboard page with tab navigation

components/
├── claims/
│   └── ClaimsTable.tsx    # Filterable claims table
├── dashboard/
│   ├── DashboardSummary.tsx     # Summary statistics
│   └── StatusDistributionChart.tsx   # Claims distribution chart
└── forecasting/
    └── MonteCarloSimulation.tsx  # Revenue forecasting tool

lib/
├── actions.ts         # Server actions for data fetching
├── formatters.ts      # Utility functions for formatting
├── simulations.ts     # Monte Carlo simulation logic
└── utils.ts          # General utility functions
```

### State Management

The application uses a combination of server-side and client-side state management:

1. **Server State**
    - Server Actions (`actions.ts`) handle data fetching
    - Mock data simulates backend API responses
    - TypeScript interfaces ensure type safety

2. **Client State**
    - React's useState for component-level state
    - useEffect for side effects and data fetching
    - Custom hooks (e.g., useDebounce) for optimized performance

### Key Components

1. **DashboardSummary**
    - Displays total billing amount and claims overview
    - Uses server-fetched data for statistics
    - Implements responsive grid layout

2. **ClaimsTable**
    - Features:
        - Client-side search across all fields
        - Column sorting (asc/desc)
        - Status filtering
        - Responsive design
    - Uses local state for filters and sorting

3. **MonteCarloSimulation**
    - Interactive revenue forecasting
    - Features:
        - Real-time probability adjustments
        - 2000 simulation iterations
        - Responsive charts
    - Performance optimizations:
        - Debounced inputs
        - Async calculations
        - Optimized re-renders

## State Management Decisions

1. **Server vs Client State**
    - Server state for data fetching
    - Client state for UI interactions
    - Clear separation of concerns

2. **Performance Optimizations**
    - Debounced inputs for simulation parameters
    - Memoized calculations for filtered data
    - Async operations for heavy computations

3. **Type Safety**
    - TypeScript interfaces for all data structures
    - Strict type checking throughout the application
    - Proper error handling

## Technology Stack

- **Next.js 15+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Recharts** for data visualization

## Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Implementation Details

### Monte Carlo Simulation

The Monte Carlo simulation runs multiple iterations (2000 by default) to generate possible revenue outcomes based on:
- Current claims data
- User-adjusted payment probabilities for each claim status (Pending, Approved, Denied)

The simulation calculates:
- Expected revenue (mean outcome)
- Revenue range (min/max)
- 95% confidence interval
- Probability distribution of outcomes

For performance, the simulation:
- Uses debounced inputs to prevent excessive recalculations
- Runs in a separate execution context using setTimeout
- Updates the UI incrementally to avoid blocking the main thread

### Data Flow

1. Initial data is fetched using server actions
2. Data is passed down through components via props
3. User interactions trigger local state updates
4. Complex calculations are performed asynchronously
5. UI updates reflect the latest state changes

### Styling Approach

- Consistent use of Tailwind CSS classes
- Responsive design patterns
- Custom color variables for charts
- Reusable component classes

### Future Improvements

1. Real-time data updates
2. More advanced filtering options
3. Export functionality for reports
4. Additional visualization options
5. Performance optimizations for larger datasets
