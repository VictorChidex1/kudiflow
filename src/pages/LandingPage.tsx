import { Suspense, lazy } from "react";
import { LandingNavbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import SEO from "../components/SEO";
import { JsonLd } from "../components/seo/JsonLd";

// Lazy load below-the-fold sections
const Features = lazy(() => import("../components/landing/Features").then(m => ({ default: m.Features })));
const HowItWorks = lazy(() => import("../components/landing/HowItWorks").then(m => ({ default: m.HowItWorks })));
const Pricing = lazy(() => import("../components/landing/Pricing").then(m => ({ default: m.Pricing })));
const Testimonials = lazy(() => import("../components/landing/Testimonials").then(m => ({ default: m.Testimonials })));
const FAQ = lazy(() => import("../components/landing/FAQ").then(m => ({ default: m.FAQ })));
const CTA = lazy(() => import("../components/landing/CTA").then(m => ({ default: m.CTA })));
const Footer = lazy(() => import("../components/landing/Footer").then(m => ({ default: m.Footer })));

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
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <Features />
          <HowItWorks />
          <Pricing />
          <Testimonials />
          <FAQ />
          <CTA />
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}
