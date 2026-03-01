import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden px-8 py-20 sm:px-16 sm:py-24 lg:p-24 text-center shadow-2xl"
        >
          {/* Deep Glowing "Aurora" Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Base gradient dark wash */}
            <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-900 to-kudi-dark opacity-90" />

            {/* Huge floating animated blobs */}
            <div className="absolute -top-[30%] -left-[10%] w-[700px] h-[700px] bg-kudi-green/20 rounded-full mix-blend-screen blur-[120px] animate-blob" />
            <div className="absolute -bottom-[30%] -right-[10%] w-[700px] h-[700px] bg-emerald-500/20 rounded-full mix-blend-screen blur-[120px] animate-blob animation-delay-2000" />
            <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-teal-400/10 rounded-full mix-blend-screen blur-[100px] animate-blob animation-delay-4000" />

            {/* Subtle grid overlay for texture */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30" />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Trust / Promo Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-sm font-medium backdrop-blur-md mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>Join 5,000+ Smart Market Vendors today</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]"
            >
              Ready to completely transform your business operations?
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl"
            >
              Stop losing money to unrecorded debts and missing inventory. Take
              full control of your growth with KudiFlow's offline-first ledger
              system.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <a
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 bg-kudi-green hover:bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <span>Create Free Shop</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/2340000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold text-lg backdrop-blur-md transition-all duration-300"
              >
                Talk to Sales
              </a>
            </motion.div>

            {/* Micro Trust Policy */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-sm text-slate-400 mt-8"
            >
              No credit card required &bull; 2-month Free Pro Trial &bull;
              Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
