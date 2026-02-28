# KudiFlow - The Offline-First Shop Manager

**KudiFlow** is a lightweight, offline-first Progressive Web App (PWA) designed for micro, small, and medium enterprises (MSMEs) in emerging markets. It solves the problem of paper-based record keeping by providing a blazing-fast digital ledger that works flawlessly without a reliable internet connection.

## 🚀 Core Features

1. **3-Second Sales Ledger:** Rapid offline data entry for daily cash and transfer sales.
2. **Polite Debt Collector:** A debtor management system that triggers automated, polite payment reminder links via WhatsApp.
3. **Inventory Traffic Light:** Visual stock management (Green/Yellow/Red) to alert vendors when fast-moving goods are low.

## 🛠 Technology Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend / Database:** Firebase Firestore (configured for local offline persistence)
- **Authentication:** Firebase Auth (Email/Password & Google Sign-in)
- **Cloud Logic (APIs):** Firebase Cloud Functions (Node.js/TypeScript)
- **Hosting:** Firebase Hosting
- **Icons:** Lucide React

## 📂 Project Structure

```text
src/
├── assets/         # Static assets (images, custom SVGs)
├── components/     # React components
│   ├── ui/         # Reusable basic components (Buttons, Inputs, etc.)
│   ├── layout/     # App Shell components (Navbar, Sidebar, etc.)
│   ├── landing/    # Landing page sections (Hero, Features, HowItWorks)
│   └── ...         # Feature-specific components (Sales, Debtors, Inventory)
├── hooks/          # Custom React hooks (Auth, Offline Sync)
├── pages/          # Main route views (LandingPage, Auth, Dashboard, etc.)
├── services/       # Backend and third-party connections (Firebase)
├── types/          # Strict TypeScript interfaces
└── utils/          # Helper utilities (currency formatting, dates)
```

## ⚙️ Development Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- Firebase CLI (`npm install -g firebase-tools`)

### 1. Clone the repository

```bash
git clone https://github.com/VictorChidex1/kudiflow.git
cd kudiflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env` file in the root directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📦 Build & Deployment

To build the project for production:

```bash
npm run build
```

To deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```

## 🎨 UI/UX Branding

- **Primary Font:** Inter
- **Primary Color:** Kudi Green (Emerald-600)
- **Accent Color:** Kudi Gold (Amber-500)
- **Design Ethos:** Clean, high-contrast, thumb-friendly interfaces built for mid-range mobile devices with ultra-glassmorphic aesthetic elements on larger screens.
