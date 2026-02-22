import { Link } from "react-router-dom";
import { ArrowRight, WifiOff, ShieldCheck, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-kudi-bg pt-16 sm:pt-24 lg:pt-32 pb-16">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kudi-green/20 rounded-full mix-blend-multiply blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-kudi-gold/20 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-kudi-green animate-pulse"></span>
            <span className="text-sm font-medium text-slate-600">
              Built for Emerging Markets
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-6 animate-fade-in-up animation-delay-150">
            The{" "}
            <span className="text-kudi-green relative whitespace-nowrap">
              Offline-First
            </span>{" "}
            <br className="hidden sm:block" />
            MSME Business OS.
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl text-lg sm:text-xl text-slate-600 mb-10 animate-fade-in-up animation-delay-300">
            Ditch the messy paper ledgers. Track daily sales, manage inventory,
            and seamlessly collect debts via WhatsApp—
            <strong className="text-slate-800 font-semibold">
              all without a reliable internet connection.
            </strong>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in-up animation-delay-500">
            <Link
              to="/signup"
              className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-kudi-green px-8 py-4 text-base font-semibold text-white shadow-lg shadow-kudi-green/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-kudi-green/40 focus:outline-none focus:ring-2 focus:ring-kudi-green focus:ring-offset-2"
            >
              <span className="relative z-10">Start Your Free Shop</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 z-0 h-full w-full bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
            </Link>

            <Link
              to="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm border border-slate-200 transition-all duration-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Feature Highlights Row */}
          <div className="mt-16 sm:mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full max-w-4xl mx-auto border-t border-slate-200/60 pt-10 animate-fade-in-up animation-delay-700">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kudi-green/10 text-kudi-green">
                <WifiOff className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                100% Offline Capable
              </h3>
              <p className="text-sm text-slate-500">
                Works flawlessly without data.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kudi-gold/10 text-kudi-gold">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                3-Second Ledger
              </h3>
              <p className="text-sm text-slate-500">Record sales instantly.</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Secure Cloud Sync
              </h3>
              <p className="text-sm text-slate-500">Backs up when connected.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
