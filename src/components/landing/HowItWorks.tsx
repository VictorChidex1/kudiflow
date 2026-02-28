import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Calculator, MessageCircle, Store } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Create Your Free Shop",
    description:
      "Sign up in seconds right from your browser. Once you're logged in, KudiFlow's offline-first engine takes over, keep recording sales even if your data subscription finishes.",
    icon: Store,
    color: "kudi-green",
    image: "/assets/step1.webp",
  },
  {
    id: "02",
    title: "Record Sales Instantly",
    description:
      "Use our 3-second quick keypad to punch in daily cash and transfer sales faster than writing them down in a physical paper ledger.",
    icon: Calculator,
    color: "emerald-500",
    image: "/assets/step2.webp",
  },
  {
    id: "03",
    title: "Auto-WhatsApp Debtors",
    description:
      "Stop arguing with customers over owed money. Tap a button to send a polite, automated WhatsApp payment reminder when a debt is overdue.",
    icon: MessageCircle,
    color: "teal-500",
    image: "/assets/step3.webp",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function HowItWorks() {
  return (
    <section className="py-24 bg-linear-to-b from-white via-kudi-bg to-kudi-bg relative overflow-hidden">
      {/* Global Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-kudi-green/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          {/* Left Side: Sticky Header */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-kudi-green/10 text-kudi-green text-sm font-semibold tracking-wide mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kudi-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-kudi-green"></span>
                  </span>
                  <span>Simple Onboarding</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-kudi-dark tracking-tight leading-[1.1] mb-6">
                  How{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-br from-kudi-green to-teal-400">
                    KudiFlow
                  </span>{" "}
                  Works
                </h2>

                <p className="text-xl text-gray-500 leading-relaxed font-medium">
                  We stripped away the complexity. Get your business digitized
                  and functioning offline in three incredibly simple steps.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Scrolling Steps */}
          <div className="lg:w-2/3">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-12 lg:space-y-24 relative pb-16"
            >
              {/* Connecting Line (Vertical) */}
              <div className="absolute left-[27px] lg:left-[39px] top-10 bottom-0 w-0.5 bg-gray-200/50 -z-10">
                <motion.div
                  className="w-full bg-linear-to-b from-kudi-green via-emerald-400 to-transparent origin-top"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{ height: "100%" }}
                />
              </div>

              {steps.map((step) => (
                <motion.div
                  key={step.id}
                  variants={itemVariants}
                  className="relative flex items-start gap-6 lg:gap-10 group"
                >
                  {/* Step Node */}
                  <div className="relative shrink-0 mt-1">
                    <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-2xl bg-white shadow-xl shadow-kudi-green/10 border border-gray-100 flex items-center justify-center relative z-10 group-hover:border-kudi-green/40 transition-colors duration-500 overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-linear-to-br from-${step.color}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />
                      <span
                        className={`text-xl lg:text-3xl font-black text-transparent bg-clip-text bg-linear-to-br from-gray-300 to-gray-400 group-hover:from-${step.color} group-hover:to-teal-500 transition-all duration-500`}
                      >
                        {step.id}
                      </span>
                    </div>
                  </div>

                  {/* Ultra-Glassmorphic Card */}
                  <div className="relative flex-1">
                    {/* Localized Ambient Light Blob for this card */}
                    <motion.div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-${step.color}/20 rounded-full blur-[80px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
                    />

                    <div className="relative flex flex-col bg-white/40 backdrop-blur-3xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] hover:-translate-y-1 hover:border-kudi-green/30 transition-all duration-500 overflow-hidden">
                      {/* Subtly textured background noise (Optional but premium) */}
                      <div
                        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        }}
                      />

                      {/* Content Section with Padding */}
                      <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start p-8 lg:p-10 pb-8">
                        <div
                          className={`shrink-0 inline-flex items-center justify-center p-5 bg-white rounded-2xl shadow-sm text-${step.color} group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-${step.color}/20 transition-all duration-500 ring-1 ring-gray-100`}
                        >
                          <step.icon
                            className="h-8 w-8 lg:h-10 lg:w-10"
                            strokeWidth={1.5}
                          />
                        </div>

                        <div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-kudi-dark mb-4 tracking-tight group-hover:text-kudi-green transition-colors duration-300">
                            {step.title}
                          </h3>
                          <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Edge-to-Edge Image Showcase */}
                      <div className="relative w-full h-64 md:h-80 overflow-hidden border-t border-white/30 bg-white/10 mt-auto">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Optional subtle gradient at bottom to blend into card corners */}
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white/20 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
