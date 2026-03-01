import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-kudi-bg flex flex-col relative overflow-hidden">
      {/* Ambient Glowing Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-kudi-green/10 rounded-full mix-blend-multiply blur-[120px] animate-blob" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full mix-blend-multiply blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <LandingNavbar />

        <main className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative p-10 sm:p-16 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-center"
            >
              {/* Decorative Header Blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-kudi-green/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 shadow-sm">
                  <Clock className="w-10 h-10 text-emerald-500 animate-pulse" />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-kudi-green uppercase tracking-wide">
                    IN DEVELOPMENT
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                  This resource is <br className="hidden sm:block" />
                  <span className="text-kudi-green">coming soon.</span>
                </h1>

                <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
                  Our team is currently busy filming awesome Video Tutorials,
                  interviewing successful Merchants, and writing helpful Blog
                  posts for you.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  <Link
                    to="/"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-kudi-green text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    Go back Home
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="https://wa.me/2340000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-100 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
