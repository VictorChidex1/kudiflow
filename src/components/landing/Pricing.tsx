import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Check, X } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-kudi-bg relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-kudi-green/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-kudi-green font-bold tracking-widest uppercase text-sm mb-3">
            Transparent Pricing
          </h2>
          <p className="mt-2 text-4xl leading-tight font-extrabold tracking-tight text-kudi-dark sm:text-5xl">
            Simple, transparent pricing for growing businesses
          </p>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Start for free and upgrade only when your business needs more power.
            No hidden fees.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center items-center gap-4 mb-20"
        >
          <span
            className={`text-base font-medium ${
              !isYearly ? "text-kudi-dark" : "text-gray-500"
            }`}
          >
            Billed Monthly
          </span>

          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-flex h-8 w-16 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-kudi-green focus:ring-offset-2"
          >
            <span
              className={`${
                isYearly
                  ? "translate-x-9 bg-kudi-green"
                  : "translate-x-1 bg-white"
              } inline-block h-6 w-6 transform rounded-full shadow-sm transition-transform duration-300 ease-in-out`}
            />
          </button>

          <span
            className={`text-base font-medium flex items-center gap-2 ${
              isYearly ? "text-kudi-dark" : "text-gray-500"
            }`}
          >
            Billed Yearly
            <span className="inline-flex items-center rounded-full bg-kudi-green/10 px-2.5 py-0.5 text-xs font-semibold text-kudi-green">
              Save 16%
            </span>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto relative z-10"
        >
          {/* Starter (Free) Card */}
          <motion.div
            variants={cardVariants}
            className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative flex flex-col"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-kudi-dark">Starter</h3>
              <p className="mt-2 text-sm text-gray-500">
                Perfect for single-person shops transitioning from paper.
              </p>
            </div>

            <div className="mb-8 flex items-baseline text-kudi-dark">
              <span className="text-5xl font-extrabold tracking-tight">₦0</span>
              <span className="ml-1 text-xl font-medium text-gray-500">
                /mo
              </span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {[
                "Basic offline sales ledger",
                "Track up to 50 inventory items",
                "15 Auto-WhatsApp reminders per month",
                "7-day data sync history",
              ].map((feature, i) => (
                <li key={`inc-${i}`} className="flex gap-3 text-gray-600">
                  <Check className="h-5 w-5 text-kudi-green shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}

              <li className="my-6 border-t border-gray-100" />

              {[
                "Unlimited data history",
                "Unlimited inventory tracking",
                "Export reports to Excel/PDF",
                "Priority WhatsApp Support",
              ].map((feature, i) => (
                <li
                  key={`exc-${i}`}
                  className="flex gap-3 text-gray-400 opacity-60"
                >
                  <X className="h-5 w-5 text-gray-300 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-4 px-6 rounded-xl font-semibold text-kudi-dark bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 shadow-sm">
              Get Started for Free
            </button>
          </motion.div>

          {/* Pro Card (Hero) */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-3xl p-8 lg:p-10 border-2 border-kudi-green/80 shadow-[0_20px_40px_rgba(16,185,129,0.15)] relative flex flex-col md:-mt-4 md:mb-4 md:scale-105 z-10"
          >
            {/* Ambient Glow immediately behind the Pro card */}
            <div className="absolute inset-0 bg-linear-to-b from-kudi-green/5 to-transparent rounded-3xl -z-10" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="inline-flex items-center rounded-full bg-kudi-dark px-4 py-1.5 text-sm font-semibold text-white shadow-lg tracking-wide uppercase">
                Most Popular
              </span>
            </div>

            <div className="mb-8 mt-2">
              <h3 className="text-2xl font-bold text-kudi-dark">
                KudiFlow Pro
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                For growing businesses, pharmacies, and smart merchants.
              </p>
            </div>

            <div className="mb-8 flex flex-col">
              <div className="flex items-baseline text-kudi-dark">
                <span className="text-5xl font-extrabold tracking-tight">
                  {isYearly ? "₦25,000" : "₦2,500"}
                </span>
                <span className="ml-1 text-xl font-medium text-gray-500">
                  {isYearly ? "/yr" : "/mo"}
                </span>
              </div>
              {isYearly && (
                <p className="mt-1 text-sm text-kudi-green font-medium">
                  Billed annually (2 months free)
                </p>
              )}
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {[
                "Everything in Starter, plus:",
                "Unlimited offline data sync history",
                "Unlimited inventory tracking",
                "Unlimited Auto-WhatsApp reminders",
                "Export reports to Excel/PDF",
                "Priority WhatsApp Support",
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-gray-600 font-medium">
                  {i === 0 ? (
                    <div className="w-5" /> // Indent placeholder for the "Everything in Starter" line
                  ) : (
                    <Check className="h-5 w-5 text-kudi-green shrink-0" />
                  )}
                  <span className={i === 0 ? "text-kudi-dark" : ""}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-linear-to-r from-kudi-green to-emerald-500 hover:from-emerald-500 hover:to-kudi-green transition-all duration-300 shadow-md shadow-kudi-green/20 hover:shadow-lg hover:shadow-kudi-green/40 hover:-translate-y-0.5">
              Upgrade to Pro
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
