import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  ArrowRight,
  WifiOff,
  ShieldCheck,
  Zap,
  Star,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

// Framer Motion Orchestration Variants
const containerVariant: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const imageVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.4 },
  },
};

export function Hero() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white pt-6 sm:pt-10 pb-20">
      {/* Subtle glowing orbs for the white background */}
      <div className="absolute top-0 inset-x-0 w-full h-[600px] opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-200/50 rounded-full mix-blend-multiply blur-[120px] animate-blob" />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-amber-100/50 rounded-full mix-blend-multiply blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 mt-2 lg:mt-4">
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          {/* Left Side: Typography and CTA */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Trust Badge Pushed Up Tight */}
            <motion.div
              variants={itemVariant}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 shadow-sm mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-kudi-green animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Built for Emerging Markets
              </span>
            </motion.div>

            {/* Massive Multi-App Style Headline */}
            <motion.h1
              variants={itemVariant}
              className="max-w-4xl text-[2.75rem] leading-[1.05] tracking-tight font-extrabold text-slate-900 sm:text-6xl lg:text-[4.5rem] mb-6"
            >
              The{" "}
              <span className="text-kudi-green relative whitespace-nowrap">
                Offline-First
              </span>
              <br className="hidden lg:block" /> App for Smart Vendors.
            </motion.h1>

            {/* Refined Subtitle */}
            <motion.p
              variants={itemVariant}
              className="max-w-xl text-lg sm:text-xl text-slate-500 mb-8 leading-relaxed font-medium mx-auto lg:mx-0"
            >
              Ditch messy ledgers. Track daily sales, manage inventory, and
              seamlessly collect debts—
              <strong className="text-slate-800">all without data.</strong>
            </motion.p>

            {/* Trust Core: Avatar Social Proof Cluster */}
            <motion.div
              variants={itemVariant}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-5 mb-10 w-full relative z-20"
            >
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden shadow-sm shadow-slate-900/10">
                  <img
                    src="https://randomuser.me/api/portraits/men/70.jpg"
                    alt="Nigerian MSME Owner"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden shadow-sm shadow-slate-900/10">
                  <img
                    src="https://randomuser.me/api/portraits/women/16.jpg"
                    alt="Nigerian MSME Owner"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden shadow-sm shadow-slate-900/10">
                  <img
                    src="https://randomuser.me/api/portraits/men/53.jpg"
                    alt="Nigerian MSME Owner"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden shadow-sm shadow-slate-900/10">
                  <img
                    src="https://randomuser.me/api/portraits/women/54.jpg"
                    alt="Nigerian MSME Owner"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-[3px] border-white bg-emerald-100 flex items-center justify-center text-xs font-extrabold text-emerald-700 shadow-sm shadow-emerald-900/10">
                  10k+
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start text-sm">
                <div className="flex gap-1 text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current border-none"
                    />
                  ))}
                </div>
                <span className="font-semibold text-slate-600">
                  Join our community{" "}
                  <span className="text-kudi-green hidden sm:inline">
                    of smart Vendors
                  </span>
                </span>
              </div>
            </motion.div>

            {/* Minimal, Sleek CTA Buttons */}
            <motion.div
              variants={itemVariant}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto mb-8 relative z-20"
            >
              {isAuthLoading ? (
                <div className="h-14 w-full sm:w-[220px] rounded-full bg-slate-100 animate-pulse border border-slate-200" />
              ) : user ? (
                <Link
                  to="/dashboard"
                  className="group relative inline-flex h-14 w-full sm:w-[250px] items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 px-8 text-base font-semibold text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  Go to Dashboard
                  <ArrowRight
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="group relative inline-flex h-14 w-full sm:w-[220px] items-center justify-center gap-2 overflow-hidden rounded-full bg-emerald-600 px-8 text-base font-semibold text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                  >
                    <span className="relative z-10 transition-colors group-hover:text-emerald-300">
                      Start Your Free Shop
                    </span>
                    <ArrowRight
                      className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-300"
                      strokeWidth={2.5}
                    />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex h-14 w-full sm:w-[220px] items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-slate-700 shadow-sm border border-slate-200 transition-all duration-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                  >
                    Sign In to Account
                  </Link>
                </>
              )}
            </motion.div>

            {/* Platform Availability Badges */}
            <motion.div
              variants={itemVariant}
              className="flex items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-slate-400 relative z-20"
            >
              <span className="flex items-center gap-2 transition-colors hover:text-slate-600 cursor-default px-4 py-2 bg-white/80 rounded-full border border-slate-200 shadow-sm">
                <Globe className="w-4 h-4 text-emerald-500" />
                Works smoothly on any smartphone or computer
              </span>
            </motion.div>
          </div>

          {/* Right Side: Epic Masked Image Reveal */}
          <div className="lg:col-span-6 w-full mt-10 lg:mt-0">
            <motion.div
              variants={imageVariant}
              className="relative w-full h-[400px] sm:h-[550px] lg:h-[700px] group"
            >
              {/* 
                This CSS Mask dissolves the Left and Bottom edges of the image on Desktop, 
                and just the Bottom/Top edges on Mobile, ensuring it melts into the white completely. 
              */}
              <div className="relative w-full h-full overflow-hidden rounded-4xl lg:rounded-[3rem] shadow-2xl shadow-emerald-900/10 border-4 border-white/50">
                <img
                  src="/assets/main-hero-image.webp"
                  alt="KudiFlow Marketplace Dashboard"
                  className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-2000 group-hover:scale-[1.03] ease-out will-change-transform"
                  loading="eager"
                />
              </div>

              {/* Dramatic Under-glow behind the image */}
              <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-emerald-400/20 blur-[80px] -z-10" />
            </motion.div>
          </div>
        </motion.div>

        {/* Feature Highlights Row (Shifted out of the grid to span full width below) */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="show"
          className="mt-16 sm:mt-24 lg:mt-32 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full max-w-5xl mx-auto border-t border-slate-100 pt-16 relative z-20"
        >
          <motion.div
            variants={itemVariant}
            className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 transition-transform duration-300 group-hover:scale-110">
              <WifiOff className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                100% Offline Capable
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Works flawlessly without data.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariant}
            className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 transition-transform duration-300 group-hover:scale-110">
              <Zap className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                3-Second Ledger
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Record sales instantly.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariant}
            className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 border border-slate-200 transition-transform duration-300 group-hover:scale-110">
              <ShieldCheck className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Secure Cloud Sync
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Backs up when connected.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Infinite Marquee Strip (Outside the container to snap to edges of viewport) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="w-full mt-20 sm:mt-24 lg:mt-32 border-y border-slate-200/60 bg-slate-50/50 relative overflow-hidden flex items-center py-4"
      >
        {/* Overlay gradients to blur the edges of the marquee */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* The infinite scrolling track */}
        <div className="flex w-max animate-marquee text-sm sm:text-base font-semibold text-slate-600">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="mx-6 shrink-0">🚀 Trusted by 10,000+ MSMEs</span>
              <span className="mx-6 shrink-0 text-slate-300">•</span>
              <span className="mx-6 shrink-0">⚡ Zero Wait Time</span>
              <span className="mx-6 shrink-0 text-slate-300">•</span>
              <span className="mx-6 shrink-0">🔒 Bank-Grade Encryption</span>
              <span className="mx-6 shrink-0 text-slate-300">•</span>
              <span className="mx-6 shrink-0">📈 100% Data Ownership</span>
              <span className="mx-6 shrink-0 text-slate-300">•</span>
              <span className="mx-6 shrink-0">🌍 Works in Remote Areas</span>
              <span className="mx-6 shrink-0 text-slate-300">•</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
