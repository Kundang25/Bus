# TECHNICAL ARCHITECTURE — STRIDE

## Stack & Technologies
- **Frontend Framework:** React 18.3.1 + TypeScript 5.8.3
- **Build Tooling:** Vite 7.3.1
- **Styling:** Tailwind CSS 3.4.17 + Radix UI Primitives (`@radix-ui/*`)
- **State Management:** React Context (`StrideContext`) + Persistent `localStorage` / `IndexedDB`
- **Testing:** Vitest 3.2.4 + `@testing-library/react`

## Domain Module Structure
```text
frontend/src/
├── domain/
│   ├── types.ts           # Pure TypeScript models
│   ├── routesData.ts      # BMTC & BEST route & stage matrices
│   ├── fareCalculator.ts  # Pure fare calculation engine
│   ├── ticketingEngine.ts # Idempotency, local persistence, voiding
│   └── usabilityTimer.ts  # High precision performance.now() timer
```

## Key Engineering Rules
1. **Idempotency:** Every ticket issue request generates a unique idempotency key. Rapid double-taps return the existing ticket rather than creating duplicates.
2. **Pure Domain Logic:** All business math (stage fares, passenger count multiplication, cash change) is written as side-effect-free pure functions and unit-tested via Vitest.
3. **Resilient Local Persistence:** Tickets are written synchronously to persistent client storage before UI confirmation is displayed.
