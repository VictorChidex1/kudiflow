import { LandingNavbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Pricing } from "../components/landing/Pricing";
import { Testimonials } from "../components/landing/Testimonials";
import { ScrollToTop } from "../components/ui/ScrollToTop";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-kudi-bg flex flex-col">
      <LandingNavbar />

      <main className="flex-1 flex flex-col">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
      </main>

      <ScrollToTop />
    </div>
  );
}
