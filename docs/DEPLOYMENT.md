# DEPLOYMENT GUIDE — Vercel Frontend-Only Hosting

## Vercel Deployment Instructions

STRIDE is engineered as a **100% Client-Side Single Page Application (SPA)** that runs entirely in the browser without requiring a live backend server for evaluation.

### Step 1: Connect Repository to Vercel
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** ➔ **Project**.
3. Import your GitHub repository: `amulyaa-mohan/ShaktiYatra-AadhaarVC-Ticketing-System`.

### Step 2: Configure Build Settings
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 3: Environment Variables (Optional)
- `VITE_BACKEND_URL`: Leave blank for 100% local browser demo mode. (Optional: point to custom FastAPI server if deployed).

### Step 4: Verify Deployment
Once deployed, verify the following routes:
- `/` — Main Mobile Conductor Ticketing App
- `/usability-lab` — Usability & Timing Benchmark Lab
- `/case-study` — Nielsen Case Study
- `/presentation` — Presentation Deck
- `/aadhaar-portal` — Aadhaar Verification System

All ticket transactions, fare math, history records, and shift statistics run in browser local storage and survive refresh and tab navigation.
