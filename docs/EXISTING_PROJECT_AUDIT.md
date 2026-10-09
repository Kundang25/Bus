# Existing Project Audit: ShaktiYatra Aadhaar VC Ticketing System

**Date:** October 9, 2026  
**Target Branch:** `feature/nielsen-stride-redesign`  
**Purpose:** Technical audit of existing codebase prior to redesigning into STRIDE — The Conductor's Digital Companion (Nielsen Product Design Assignment).

---

## 1. Executive Summary

The existing repository (`ShaktiYatra-AadhaarVC-Ticketing-System`) is an Aadhaar Verifiable Credential (VC) prototype built to simulate free bus travel scheme verification for female passengers (Shakthi Scheme simulation). 

While the existing system demonstrates React + Vite + TypeScript + Tailwind on the frontend and FastAPI on the backend, it addresses passenger identity authentication rather than Nielsen's rapid bus ticketing challenge. 

This audit analyzes the existing codebase, identifies reusable components and dependencies, highlights missing Nielsen requirements, and outlines the redesign architecture for project **STRIDE**.

---

## 2. Existing Architecture & Tech Stack

### Frontend Structure (`/frontend`)
- **Framework:** React 18.3.1 + TypeScript 5.8.3 + Vite 7.3.1
- **Styling:** Tailwind CSS 3.4.17 + `tailwindcss-animate` + Radix UI primitives (`@radix-ui/*`) / `shadcn/ui`
- **Routing:** `react-router-dom` 6.30.1
- **State & Async:** `@tanstack/react-query` 5.83.0, custom React Context (`AuthContext`)
- **Icons & UI:** `lucide-react` 0.462.0, `sonner`, `recharts`, `qrcode.react`
- **Testing:** `vitest` 3.2.4 + `@testing-library/react`

### Backend Structure (`/backend`)
- **Framework:** Python FastAPI (Uvicorn server on port 8000)
- **Modules:**
  - `backend/api/aadhaar.py`: Verify Aadhaar VC (SD-JWT) & claim extraction
  - `backend/api/ticket.py`: Issue cryptographically signed event tickets
  - `backend/api/gate.py`: Verify ticket QR code at entry gate
- **Integrations:** Cosmitude Bridge REST integration for audit logging

---

## 3. Working Features (Verified)

1. **Authentication:** Conductor & Admin login simulation (`AuthContext`).
2. **Shift / Bus Selection:** Conductor state, bus number, and route selection from mock data.
3. **Trip QR Generation:** Generates a unique trip ID and QR code for passengers to scan.
4. **Passenger Verification Simulation:** Simulates passenger scan events and verifies eligibility (female passenger policy check).
5. **Scan Counters & History:** Shows live verified vs non-verified counters and recent scan audit log modal.
6. **Admin Dashboard:** Overview of state-wide scan metrics and passenger verification reports.

---

## 4. Gaps Relative to Nielsen Assignment Requirements

| Nielsen Requirement | Existing Implementation Status | Gap Analysis & Proposed Fix for STRIDE |
| :--- | :--- | :--- |
| **One-handed Mobile-First UI** | Desktop-oriented dashboard layout, split multi-step card layout. | Redesign completely for mobile viewports (360px - 430px) with thumb-zone ergonomics. |
| **< 4-Second Ticketing Flow** | Requires selecting state, bus, route ID, generating QR, waiting for passenger scan. | Build a 2-tap fast ticketing interface: Destination → Issue Ticket (with preselected defaults). |
| **3-Passenger Default Quick Ticket** | No multi-passenger ticketing or quick preset support. | Add 1, 2, 3, 4, custom passenger presets with 3 as primary default. |
| **High Sunlight Visibility / Glare** | Default light/slate UI, small font controls. | Implement High-Glare / Sunlight High-Contrast mode with bold typography and large touch targets. |
| **Destination Selection** | Static dropdowns across states. | Route-aware stop progression, search filter, recent/frequent stops, and directional safety checks. |
| **Cash & Change Calculation** | None. | Add fast cash preset buttons (e.g. ₹50, ₹100, ₹200, ₹500) and change auto-calculator. |
| **Usability Timing Lab (`/usability-lab`)** | None. | Build interactive Usability Lab timing engine measuring tap times, mis-taps, median duration, and CSV export. |
| **Reachability Analysis & Overlay** | None. | Build an interactive thumb reachability overlay (Green/Yellow/Red zones) with left/right hand toggle. |
| **Nielsen Case Study (`/case-study`)** | None. | Create a comprehensive, embedded interactive case study page outlining research, methodology, and design choices. |
| **Offline-First & Resilience** | Relies on active runtime state. | Implement IndexedDB / localStorage client resilience, pending sync queue, and printer offline simulation. |

---

## 5. Reusable Components & Modules

The following elements will be reused and extended:
- `@/components/ui/*`: Radix UI base components (Button, Dialog, Select, Badge, Card, Input, Tabs, Toast).
- `AuthContext`: Extended to manage active shift state, conductor profile, and persistent shift metrics.
- Icons from `lucide-react`: Clear icon representations for actions, stops, cash, printing, battery, network status.
- Vitest testing setup for unit and domain business logic tests.

---

## 6. Proposed Redesign Architecture for STRIDE

```text
frontend/src/
├── app/                  # Application router & layout providers
├── components/
│   ├── stride/           # STRIDE Conductor-Specific UI Components
│   │   ├── QuickTicketing.tsx    # 2-tap fast ticket pad
│   │   ├── DestinationSelector.tsx # Stop picker with reachability
│   │   ├── HandednessToggle.tsx   # Left/Right hand UI adjustment
│   │   ├── SunlightToggle.tsx     # High contrast sunlight mode
│   │   ├── ThumbOverlay.tsx       # Ergonomic zone visualization
│   │   ├── ChangeCalculator.tsx   # Fast cash change tool
│   │   ├── TicketReceiptModal.tsx # Digital print receipt preview
│   │   └── OfflineSyncBanner.tsx  # Network resilience status
│   └── ui/               # Base UI primitives
├── pages/
│   ├── StrideConductorApp.tsx # Main Mobile Conductor Ticketing App
│   ├── ShiftSetup.tsx         # Shift initialization & route selection
│   ├── TicketHistory.tsx      # Issued/Voided audit log
│   ├── ShiftDashboard.tsx     # Summary metrics & CSV export
│   ├── UsabilityLab.tsx       # 4-Second timing test suite
│   ├── StrideCaseStudy.tsx    # Nielsen assignment case study
│   ├── PresentationDeck.tsx   # 10-slide presentation deck
│   └── Settings.tsx           # Accessibility, handedness, theme
├── domain/               # Core business logic (Pure TypeScript, 100% unit tested)
│   ├── fareCalculator.ts # Fare rules & passenger math
│   ├── ticketingEngine.ts# Ticket generation, idempotency, voiding
│   ├── shiftManager.ts   # Shift state & metrics tracking
│   └── usabilityTimer.ts # High precision timing collector
└── state/                # State management hooks and persistent stores
```

---

## 7. Risks & Mitigation Strategies

1. **Risk:** Overwriting existing working Aadhaar verification demo.  
   *Mitigation:* Retain existing `/conductor` and `/verify` routes while mounting STRIDE as the primary root application (`/`) and primary conductor experience (`/stride`), allowing both to coexist smoothly.

2. **Risk:** Desktop viewport distortion for mobile-first app.  
   *Mitigation:* Wrap the app in a realistic Mobile Device Frame container when viewed on desktop browsers, with an option to toggle full-screen view.

3. **Risk:** Performance degradation during rapid tapping.  
   *Mitigation:* Enforce idempotency keys, disable buttons during processing, and decouple state updates from heavy DOM re-renders.

---

## 8. Git Branching Strategy

- **Working Branch:** `feature/nielsen-stride-redesign`
- **Base Branch:** `main`
- **Validation Criteria Before Merge:** Clean build (`npm run build`), unit test pass (`npm run test`), and manual verification of all Nielsen criteria.
