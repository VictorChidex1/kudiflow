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
  },
  {
    id: "02",
    title: "Record Sales Instantly",
    description:
      "Use our 3-second quick keypad to punch in daily cash and transfer sales faster than writing them down in a physical paper ledger.",
    icon: Calculator,
    color: "emerald-500",
  },
  {
    id: "03",
    title: "Auto-WhatsApp Debtors",
    description:
      "Stop arguing with customers over owed money. Tap a button to send a polite, automated WhatsApp payment reminder when a debt is overdue.",
    icon: MessageCircle,
    color: "teal-500",
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
    <section className="py-24 bg-linear-to-b from-kudi-bg via-white to-kudi-bg relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-emerald-100/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-[500px] bg-kudi-green/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-kudi-green font-bold tracking-widest uppercase text-sm mb-3">
            Simple Onboarding
          </h2>
          <p className="mt-2 text-4xl leading-tight font-extrabold tracking-tight text-kudi-dark sm:text-5xl">
            From paper to digital
            <br />
            in 3 simple steps
          </p>
        </motion.div>

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Timeline Ambient Blobs */}
          <div className="absolute top-[20%] left-1/4 -translate-y-1/2 w-96 h-96 bg-kudi-green/10 rounded-full blur-[100px] -z-10" />
          <div className="absolute top-[60%] right-1/4 translate-y-1/2 w-80 h-80 bg-emerald-300/10 rounded-full blur-[80px] -z-10" />

          {/* Vertical Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-gray-200 -translate-x-1/2">
            <motion.div
              className="w-full bg-linear-to-b from-kudi-green to-emerald-400 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ height: "100%" }}
            />
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 !== 0; // Align right on desktop if even index
              return (
                <motion.div
                  key={step.id}
                  variants={itemVariants}
                  className={`relative flex flex-col md:flex-row items-center justify-between ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step Content Card */}
                  <div
                    className={`w-full md:w-5/12 ${
                      isEven ? "md:pl-12" : "md:pr-12"
                    }`}
                  >
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-100 ring-1 ring-white/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-kudi-green/30 hover:ring-kudi-green/20 transition-all duration-300 relative group overflow-hidden">
                      <div className="absolute -right-6 -top-6 text-[120px] font-black text-gray-50 opacity-50 group-hover:text-kudi-green/5 transition-colors duration-500 pointer-events-none select-none">
                        {step.id}
                      </div>

                      <div className="relative z-10">
                        <div
                          className={`inline-flex items-center justify-center p-4 bg-${step.color}/10 rounded-2xl text-${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <step.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-kudi-dark mb-4 group-hover:text-kudi-green transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-lg text-gray-500 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center Node (Desktop) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-white bg-kudi-green items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 transition-transform duration-300 hover:scale-110">
                    <span className="text-white font-bold text-sm tracking-tighter">
                      {step.id}
                    </span>
                  </div>

                  {/* Empty Spacer (Desktop) */}
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
