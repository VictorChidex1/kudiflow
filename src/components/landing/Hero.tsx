import { Link } from "react-router-dom";
import { ArrowRight, WifiOff, ShieldCheck, Zap } from "lucide-react";
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
  return (
    <section className="relative overflow-hidden bg-white pt-12 sm:pt-16 pb-20">
      {/* Background Decorative Glow (Like Multi app's dark purple, but we use green/gold for light mode) */}
      <div className="absolute top-0 inset-x-0 w-full h-[600px] opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-200/50 rounded-full mix-blend-multiply blur-[120px] animate-blob" />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-amber-100/50 rounded-full mix-blend-multiply blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
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
            className="max-w-4xl text-[2.75rem] leading-[1.05] tracking-tight font-extrabold text-slate-900 sm:text-7xl lg:text-[5.5rem] mb-6"
          >
            The <span className="text-kudi-green">Offline-First</span>
            <br className="hidden sm:block" /> MSME Business OS.
          </motion.h1>

          {/* Refined Subtitle */}
          <motion.p
            variants={itemVariant}
            className="max-w-2xl text-lg sm:text-xl lg:text-2xl text-slate-500 mb-10 leading-relaxed font-medium"
          >
            Ditch the messy paper ledgers. Track daily sales, manage inventory,
            and seamlessly collect debts via WhatsApp—
            <strong className="text-slate-800">all without data.</strong>
          </motion.p>

          {/* Minimal, Sleek CTA Buttons */}
          <motion.div
            variants={itemVariant}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16 lg:mb-24 relative z-20"
          >
            <Link
              to="/signup"
              className="group relative inline-flex w-full sm:w-[220px] items-center justify-center gap-2 overflow-hidden rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
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
              className="inline-flex w-full sm:w-[220px] items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm border border-slate-200 transition-all duration-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Sign In to Account
            </Link>
          </motion.div>

          {/* Massive Bleeding Dashboard Reveal Image (Multi-App Style) */}
          <motion.div
            variants={imageVariant}
            className="relative mx-auto w-full max-w-[1400px] group"
          >
            <div className="relative w-full overflow-hidden rounded-[24px] sm:rounded-[36px] lg:rounded-[48px] border border-slate-200/60 shadow-2xl shadow-emerald-900/10 bg-slate-50">
              {/* Fake Window Header (like Multi but cleaner for Android/Web) */}
              <div className="absolute top-0 inset-x-0 h-10 bg-white/50 backdrop-blur-md border-b border-white/20 z-20 flex items-center px-4 md:px-6 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>

              <img
                src="/assets/hero.webp"
                alt="KudiFlow Dashboard Hero"
                className="w-full h-auto object-cover transform transition-transform duration-[2000ms] group-hover:scale-[1.02] ease-out will-change-transform"
                loading="lazy"
                decoding="async"
              />

              {/* Bottom fade-out shadow inside the hardware screen */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 mix-blend-multiply transition-opacity duration-[2000ms] group-hover:opacity-30 pointer-events-none" />
            </div>

            {/* Dramatic Under-glow behind the hardware */}
            <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-emerald-400/20 blur-[100px] -z-10" />
          </motion.div>

          {/* Feature Highlights Row (tightened top margin) */}
          <motion.div
            variants={itemVariant}
            className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full max-w-5xl mx-auto pt-10"
          >
            <div className="flex flex-col items-center gap-4 group">
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
            </div>

            <div className="flex flex-col items-center gap-4 group">
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
            </div>

            <div className="flex flex-col items-center gap-4 group">
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
