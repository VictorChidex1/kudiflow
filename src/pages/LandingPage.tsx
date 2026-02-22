import { LandingNavbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-kudi-bg flex flex-col">
      <LandingNavbar />

      <main className="flex-1 flex flex-col">
        <Hero />
      </main>
    </div>
  );
}
