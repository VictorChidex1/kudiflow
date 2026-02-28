import {
  WifiOff,
  Zap,
  Users,
  ShieldCheck,
  BarChart3,
  CloudSync,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

const features = [
  {
    title: "Always Works Offline",
    description:
      "No internet? No problem. Record sales and manage inventory instantly without waiting for a connection.",
    icon: WifiOff,
  },
  {
    title: "3-Second Ledger",
    description:
      "Lightning-fast data entry designed for busy vendors. Log a sale in exactly 3 seconds.",
    icon: Zap,
  },
  {
    title: "Polite Debt Collection",
    description:
      "Send automated, professional WhatsApp reminders to debtors with one tap.",
    icon: Users,
  },
  {
    title: "Smart Inventory Alerts",
    description:
      "Visual traffic-light system warns you instantly when fast-moving goods are running low.",
    icon: BarChart3,
  },
  {
    title: "Auto-Sync to Cloud",
    description:
      "The moment you connect to the internet, all your offline data safely backs up to the cloud.",
    icon: CloudSync,
  },
  {
    title: "Bank-Grade Security",
    description:
      "Your business data is yours. Secured with enterprise-grade encryption.",
    icon: ShieldCheck,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "tween", ease: "easeOut", duration: 0.5 },
  },
};

export function Features() {
  return (
    <section className="py-24 bg-linear-to-b from-kudi-bg to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative text-center max-w-3xl mx-auto mb-16"
        >
          {/* Ambient Glowing Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-kudi-green/20 rounded-full blur-[80px] -z-10" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-emerald-400/20 rounded-full blur-[60px] -z-10" />

          <h2 className="text-kudi-green font-bold tracking-widest uppercase text-sm mb-3">
            Built for MSMEs
          </h2>
          <p className="mt-2 text-4xl leading-tight font-extrabold tracking-tight text-kudi-dark sm:text-5xl">
            Everything you need,
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-kudi-green to-emerald-400">
              even when offline.
            </span>
          </p>
          <p className="mt-6 max-w-2xl text-xl text-gray-500 mx-auto leading-relaxed">
            KudiFlow replaces your messy paper ledger with a digital system
            built specifically for fast-paced businesses in emerging markets.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-kudi-green to-emerald-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500" />
                <div className="relative h-full bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-kudi-green/30 transition-all duration-300 flex flex-col items-start overflow-hidden">
                  <div className="inline-flex items-center justify-center p-3.5 bg-kudi-bg rounded-xl text-kudi-green mb-6 group-hover:bg-kudi-green group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 shadow-sm">
                    <feature.icon className="h-7 w-7" aria-hidden="true" />
                  </div>

                  <h3 className="text-xl font-bold text-kudi-dark tracking-tight mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-base text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-kudi-green hover:bg-emerald-700 shadow-lg hover:shadow-kudi-green/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            Start your free shop
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
