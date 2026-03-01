import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star, Quote } from "lucide-react";

// Mock Testimonial Data focused on Nigerian MSMEs
const testimonials = [
  {
    id: 1,
    name: "Oluwakemi Adebayo",
    role: "Pharmacy Owner, Lagos",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "Before KudiFlow, my paper ledgers were a mess. Now I track every pill and payment instantly, even when MTN network is down. It's a lifesaver.",
  },
  {
    id: 2,
    name: "Chukwudi Eze",
    role: "Electronics Vendor, Alaba",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "The WhatsApp debt reminder feature alone is worth a million Naira. Customers who owed me for months finally paid up when the automated message hit their phones.",
  },
  {
    id: 3,
    name: "Aisha Mohammed",
    role: "Provisions Store, Kano",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "I love that it works 100% offline. I can record sales all day at the market without spending a Kobo on data, and it syncs perfectly when I get home.",
  },
  {
    id: 4,
    name: "Tunde Olatunji",
    role: "Boutique Owner, Abuja",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    quote:
      "Tracking inventory used to take hours every weekend. Now KudiFlow tells me exactly what I have in stock and what I need to restock before I run out.",
  },
  {
    id: 5,
    name: "Fatima Yusuf",
    role: "Wholesale Distributor, Onitsha",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    quote:
      "My staff used to make so many mathematical errors in the daily sales book. KudiFlow’s 3-second ledger is idiot-proof and my accounts always balance.",
  },
  {
    id: 6,
    name: "Emeka Okafor",
    role: "Supermarket Manager, Enugu",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    quote:
      "We upgraded to KudiFlow Pro and the Excel reporting is magical. My accountant was shocked at how clean the data exports are at the end of every month.",
  },
];

// Framer Motion Orchestration Variants
const containerVariant: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 bg-slate-50 relative overflow-hidden"
    >
      {/* Background Living Web/Glows */}
      <div className="absolute top-0 inset-x-0 w-full h-full opacity-50 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] left-[10%] w-[600px] h-[600px] bg-emerald-200/40 rounded-full mix-blend-multiply blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-amber-100/40 rounded-full mix-blend-multiply blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] bg-teal-100/40 rounded-full mix-blend-multiply blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-kudi-green/20 blur-xl rounded-full animate-pulse pointer-events-none" />
            <div className="relative inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-kudi-green/10 text-kudi-green text-sm font-semibold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kudi-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-kudi-green"></span>
              </span>
              <span>Wall of Love</span>
            </div>
          </div>
          <h2 className="mt-2 text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Don't just take our word for it.
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
            See why over 10,000 smart merchants across Nigeria trust KudiFlow to
            manage their daily business operations.
          </p>
        </motion.div>

        {/* Masonry Grid Layout */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariant}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 350, damping: 20 },
              }}
              className="break-inside-avoid bg-white/50 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-10 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:border-white transition-shadow duration-500 relative group flex flex-col"
            >
              {/* Decorative Quote Icon Background */}
              <div className="absolute top-6 right-6 text-slate-200/50 group-hover:text-emerald-100/60 transition-colors duration-500 pointer-events-none transform group-hover:scale-110 ease-out">
                <Quote size={80} strokeWidth={1} fill="currentColor" />
              </div>

              {/* Five Stars */}
              <div className="flex gap-1 text-amber-400 mb-8 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-current border-none drop-shadow-sm"
                  />
                ))}
              </div>

              {/* The Quote */}
              <blockquote className="text-slate-800 text-lg sm:text-xl font-medium leading-relaxed tracking-tight relative z-10 mb-10 flex-1">
                "{testimonial.quote}"
              </blockquote>

              {/* User Profile */}
              <div className="flex items-center gap-4 relative z-10 mt-auto pt-6 border-t border-slate-200/60">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-emerald-100 ring-offset-2 shrink-0 group-hover:ring-emerald-300 transition-all duration-300">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm font-medium text-slate-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
