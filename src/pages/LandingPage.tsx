import { LandingNavbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import SEO from "../components/SEO";
import { JsonLd } from "../components/seo/JsonLd";

// Static imports for all sections to prevent CLS and fix hash navigation
import { Features } from "../components/landing/Features";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Pricing } from "../components/landing/Pricing";
import { Testimonials } from "../components/landing/Testimonials";
import { FAQ } from "../components/landing/FAQ";
import { CTA } from "../components/landing/CTA";
import { Footer } from "../components/landing/Footer";

export default function LandingPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "KudiFlow",
    "operatingSystem": "Web, Android, iOS",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "NGN"
    },
    "description": "The offline-first shop manager for MSMEs. Track sales, inventory, and debtors seamlessly without internet."
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "KudiFlow",
    "image": "https://kudiflow.vercel.app/assets/logo.webp",
    "description": "Empowering emerging market vendors with offline-first point of sale technology.",
    "url": "https://kudiflow.vercel.app"
  };

  return (
    <div className="min-h-screen bg-kudi-bg flex flex-col">
      <SEO title="Home" />
      <JsonLd data={softwareSchema} />
      <JsonLd data={localBusinessSchema} />
      <LandingNavbar />

      <main className="flex-1 flex flex-col">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}

