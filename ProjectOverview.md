# Project Overview: KudiFlow - The Offline-First MSME Business OS

## 1. AI Rules of Engagement & System Directives

- **User Authority:** The human developer leads the architecture and decision-making. The AI is a strict assistant. The AI MUST NOT generate massive blocks of unsolicited code, auto-implement unapproved features, or change the architecture without explicit permission. Await the developer's prompt for each step.
- **Strict TypeScript:** This project is built 100% in TypeScript. JavaScript (`.js` or `.jsx`) files are strictly prohibited. Enforce strict type checking and define interfaces for all data structures, especially Firebase payloads.
- **Framework Rules:** Use React via Vite. **Next.js is strictly prohibited.** Do not generate Next.js routing or server components.
- **IDE Context:** The developer is using Google's Antigravity IDE. Format all code outputs cleanly for this environment.
- **Deployment Pipeline:** Vercel is used EXCLUSIVELY for preview deployments and testing the UI/Offline caching. Production hosting for BOTH the frontend and backend is handled natively on Firebase. Do not suggest Vercel serverless functions.

## 2. Project Summary

**KudiFlow** is a lightweight, offline-first Progressive Web App (PWA) designed for micro, small, and medium enterprises (MSMEs) in emerging markets. It solves the problem of paper-based record keeping by providing a blazing-fast digital ledger that works flawlessly without a reliable internet connection.

**Core MVP Features:**

1.  **3-Second Sales Ledger:** Rapid offline data entry for daily cash and transfer sales.
2.  **Polite Debt Collector:** A debtor management system that triggers automated, polite payment reminder links via WhatsApp.
3.  **Inventory Traffic Light:** Visual stock management (Green/Yellow/Red) to alert vendors when fast-moving goods are low.

## 3. Technology Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4.
- **Backend / Database:** Firebase Firestore (configured for local offline persistence).
- **Authentication:** Firebase Auth (Email/Password & Google Sign-in).
- **Cloud Logic (APIs):** Firebase Cloud Functions (Node.js/TypeScript) for handling third-party integrations (WhatsApp/Payments).
- **State Management:** Custom React hooks prioritizing local cache synchronization.

## 4. UI/UX & Branding Guidelines

All styling must adhere strictly to the KudiFlow brand identity using Tailwind v4 custom theme variables defined in `index.css`.

- **Primary Font:** Inter (`font-sans`).
- **Primary Color (Money/Success):** Kudi Green (`bg-kudi-green`, `text-kudi-green` mapped to Emerald-600).
- **Accent Color (Attention/Pending):** Kudi Gold (`bg-kudi-gold`, mapped to Amber-500).
- **Danger Color (Overdue/Out of Stock):** Rose-500.
- **Neutrals (Canvas & Text):** Kudi Bg (`bg-kudi-bg`, mapped to Slate-50) and Kudi Dark (`text-kudi-dark`, mapped to Slate-900).
- **Design Ethos:** Clean, high-contrast, thumb-friendly interfaces built for mid-range Android devices. Avoid pure white or pure black.

## 5. Architectural Breakdown

### A. The Landing Page (Public Route: `/`)

A high-converting, mobile-optimized marketing page.

- **Hero Section:** Strong value proposition focusing on offline capabilities. Call to Action (CTA) routing to `/signup`.
- **Problem/Solution Section:** Visuals contrasting messy paper ledgers with the clean digital app.
- **Auth Flow:** Login and Signup components routing authenticated users directly to `/dashboard`.

### B. The PWA App Shell (Protected Route: `/dashboard/*`)

The core application interface.

- **`TopNav`:** Displays business name, user profile, and a dynamic **Offline/Online Status Indicator**.
- **`BottomNav`:** Mobile-first navigation with icons for Home, Sales, Debtors, and Inventory.

### C. Core App Pages

1.  **`/dashboard` (Home):** High-level metrics. Total sales today, low stock alerts, and due debts.
2.  **`/sales`:** Features a large, thumb-friendly `QuickKeypad` component for entering amounts, and a `CartDrawer` to select items and payment method.
3.  **`/debtors`:** Renders the `DebtorList`. Includes the `WhatsAppReminderButton` which triggers a Firebase Cloud Function.
4.  **`/inventory`:** Searchable list of items utilizing the `StockItem` component with visual stock thresholds.

## 6. Database Schema (Firestore Root-to-Subcollection)

All data is scoped to the authenticated user's ID to ensure strict security and fast local caching.

- `businesses/{businessId}` (Root profile)
  - `.../sales/{saleId}`
  - `.../debtors/{debtorId}`
  - `.../inventory/{itemId}`

## 7. Execution Roadmap (Step-by-Step)

_AI Assistant: Await the developer's command to begin each step. Do not proceed to the next step without approval._

- **Step 1:** Scaffold the Vite/React/TS environment and install Tailwind CSS. _(In Progress)_
- **Step 2:** Configure Firebase Auth and initialize Firestore with offline persistence enabled.
- **Step 3:** Build the App Shell layout (`TopNav`, `BottomNav`) and set up React Router.
- **Step 4:** Implement the Landing Page and Authentication flow.
- **Step 5:** Write the TypeScript interfaces for the Firestore schema.
- **Step 6:** Build the `useOfflineSync` hook to manage local reads/writes and background syncing.
- **Step 7:** Develop the Sales, Debtors, and Inventory UI components.
- **Step 8:** Set up the Firebase Local Emulator Suite to securely write the Cloud Functions for the WhatsApp/Payment APIs.
- **Step 9:** Deploy to Vercel for rigorous mobile and airplane-mode testing.
- **Step 10:** Final production deployment to Firebase Hosting.

Here is the master folder tree for KudiFlow:
src/
├── assets/ # Static assets (logo PNGs, custom SVGs)
├── components/ # All React components, strictly categorized
│ ├── ui/ # Reusable dumb components (Buttons, Inputs, Modals, Spinners)
│ ├── layout/ # App Shell (TopNav.tsx, BottomNav.tsx, AppLayout.tsx)
│ ├── landing/ # Landing page sections (Hero.tsx, Features.tsx, LandingNavbar.tsx)
│ ├── sales/ # Sales-specific (QuickKeypad.tsx, CartDrawer.tsx)
│ ├── debtors/ # Debtor-specific (DebtorList.tsx, WhatsAppReminderButton.tsx)
│ └── inventory/ # Inventory-specific (StockItem.tsx, LowStockAlert.tsx)
├── hooks/ # Custom React hooks containing our business logic
│ ├── useAuth.ts # Firebase Auth state listener
│ ├── useOfflineSync.ts # The offline-first magic logic
│ └── useDebtors.ts # Logic for fetching/updating debts
├── pages/ # The main route views
│ ├── LandingPage.tsx # The public-facing site
│ ├── Login.tsx # Auth screen
│ ├── Signup.tsx # Auth screen
│ ├── Dashboard.tsx # Protected home (metrics)
│ ├── SalesView.tsx # Protected route for the ledger
│ ├── DebtorsView.tsx # Protected route for the debt collector
│ └── InventoryView.tsx # Protected route for stock management
├── services/ # Backend and third-party connections
│ ├── firebase.ts # Firebase initialization and exports (Auth, Firestore)
│ └── api.ts # Axios/Fetch calls to our Cloud Functions
├── types/ # Strict TypeScript interfaces
│ └── index.ts # The DB schema we defined (BusinessProfile, Sale, Debtor, etc.)
├── utils/ # Helper functions
│ ├── currency.ts # Formats numbers to Naira (e.g., ₦15,000)
│ └── dates.ts # Formats Firebase Timestamps to readable dates
├── App.tsx # Main wrapper (handles React Router and global Auth state)
├── main.tsx # React DOM entry point
└── index.css # Tailwind v4 theme configuration
