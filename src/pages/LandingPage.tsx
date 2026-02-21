import { LandingNavbar } from "../components/landing/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-kudi-bg flex flex-col">
      <LandingNavbar />

      {/* Main Content Area (Hero, Features, etc. will go here) */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-kudi-dark mb-4 drop-shadow-sm">
          Welcome to <span className="text-kudi-green">KudiFlow</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mt-4">
          The Offline-First MSME Business OS. Stop using paper ledgers and start
          tracking your sales, inventory, and debtors faster than ever.
        </p>
      </main>
    </div>
  );
}
