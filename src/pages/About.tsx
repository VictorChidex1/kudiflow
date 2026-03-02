import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  WifiOff,
  Users,
  ArrowRight,
  Quote,
  Sun,
  Sunrise,
  Moon,
  CheckCircle2,
  Lock,
  MessageCircleHeart,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const coreValues = [
    {
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      title: "Radical Simplicity",
      description:
        "We believe business software should not require a business degree. KudiFlow is designed to be learned in 5 minutes, not 5 weeks.",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      title: "Bank-Grade Security",
      description:
        "Your business data is yours alone. We employ industry-standard encryption to ensure your sales, inventory, and customer lists remain completely private.",
    },
    {
      icon: <WifiOff className="w-6 h-6 text-emerald-500" />,
      title: "Offline-First Reliability",
      description:
        "The Nigerian market doesn't stop for bad network—neither do we. Log sales all day offline, and KudiFlow automatically syncs when your connection returns.",
    },
  ];

  return (
    <div className="min-h-screen bg-kudi-bg flex flex-col relative overflow-hidden">
      {/* Ambient Glowing Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-kudi-green/10 rounded-full mix-blend-multiply blur-[120px] animate-blob" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full mix-blend-multiply blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <LandingNavbar />

        <main className="flex-1 w-full flex flex-col items-center">
          {/* Hero Section */}
          <section className="relative w-full overflow-hidden border-b border-slate-200/60">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/about-us-hero.webp"
                alt="Market vendors using KudiFlow"
                className="w-full h-full object-cover object-center"
              />
              {/* Premium Dark Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-linear-to-t from-kudi-bg via-slate-900/40 to-slate-900/80"></div>
            </div>

            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-20 pt-24 pb-16 lg:pt-32 lg:pb-32 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-8 mx-auto shadow-lg">
                  <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider relative z-10">
                    Our Mission
                  </span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-8 leading-tight drop-shadow-xl">
                  Empowering the hustle. <br />
                  <span className="text-emerald-400 drop-shadow-2xl">
                    Built for growth.
                  </span>
                </h1>
                <p className="text-xl text-slate-200 leading-relaxed font-medium drop-shadow-md max-w-2xl mx-auto">
                  We are on a mission to transition millions of African market
                  vendors from chaotic paper ledgers to streamlined, stress-free
                  digital management.
                </p>
              </motion.div>
            </div>
          </section>

          {/* The Problem / Solution Narrative */}
          <section className="w-full bg-slate-900 border-y border-slate-800 py-24 relative overflow-hidden">
            {/* Dark Texture & Glowing Blobs */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-size-[24px_24px]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kudi-green/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 mix-blend-screen" />

            <div className="max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                    The paper ledger <br />
                    <span className="text-slate-400">
                      is costing you money.
                    </span>
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-slate-300 leading-relaxed">
                      For decades, local vendors have relied on exercise books
                      to track their inventory and debtors. These books get
                      lost, damaged by rain, or simply ignored when the market
                      gets busy.
                    </p>
                    <div className="w-12 h-1 bg-kudi-green rounded-full"></div>
                    <p className="text-lg text-slate-300 leading-relaxed font-medium">
                      The result? Forgotten debts, unknown profit margins, and
                      inventory running out unexpectedly.{" "}
                      <strong className="text-emerald-400 font-bold block mt-3 text-xl">
                        KudiFlow was built to definitively solve this problem.
                      </strong>
                    </p>
                  </div>
                </motion.div>

                <div className="relative">
                  {/* Glowing Backlight behind the card */}
                  <div className="absolute inset-0 bg-kudi-green/30 blur-[60px] rounded-full scale-75 animate-pulse" />

                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="aspect-square bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.15)] p-10 flex flex-col justify-center items-center text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-emerald-400 to-transparent opacity-50" />
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 backdrop-blur-md shadow-inner">
                      <Users className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                      By Vendors, <br /> For Vendors
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm sm:text-base font-medium">
                      We spent months in markets across Nigeria sitting with
                      real shop owners, understanding their daily struggles, and
                      building exactly what they asked for.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* A Day in the Life (The Transformation Journey) */}
          <section className="w-full bg-white py-24 border-b border-slate-200/60 overflow-hidden">
            <div className="max-w-[1000px] mx-auto px-6 sm:px-12 lg:px-20">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6 mx-auto">
                  <span className="text-sm font-bold text-kudi-green uppercase tracking-wider">
                    How it works
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
                  A Day in the Life of a KudiFlow Vendor
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  We didn't build a complex accounting tool. We built a daily
                  companion that perfectly matches the rhythm of a bustling
                  African market.
                </p>
              </div>

              <div className="relative max-w-3xl mx-auto">
                {/* Vertical Dashed Line connecting nodes */}
                <div className="absolute left-[27px] sm:left-[39px] top-6 bottom-16 w-0.5 border-l-2 border-dashed border-emerald-200" />

                <div className="space-y-16">
                  {/* Phase 1: Morning */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="relative flex gap-6 sm:gap-10"
                  >
                    {/* The Node */}
                    <div className="relative z-10 w-14 h-14 sm:w-20 sm:h-20 shrink-0 bg-white border-[3px] border-emerald-100 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                        <Sunrise className="w-6 h-6 sm:w-8 sm:h-8 text-kudi-green" />
                      </div>
                    </div>
                    {/* The Content */}
                    <div className="pt-2 sm:pt-4">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        Morning (8:00 AM)
                      </h3>
                      <h4 className="text-lg font-semibold text-kudi-green mb-3">
                        Open shop with confidence.
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                        Before the first customer arrives, you check KudiFlow on
                        your phone in exactly 2 seconds. You instantly know
                        which items need restocking today and who promised to
                        pay their debts this morning. No flipping through messy
                        pages.
                      </p>
                    </div>
                  </motion.div>

                  {/* Phase 2: Afternoon */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative flex gap-6 sm:gap-10"
                  >
                    {/* The Node */}
                    <div className="relative z-10 w-14 h-14 sm:w-20 sm:h-20 shrink-0 bg-white border-[3px] border-emerald-100 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                        <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-kudi-green" />
                      </div>
                    </div>
                    {/* The Content */}
                    <div className="pt-2 sm:pt-4">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        Afternoon (1:30 PM)
                      </h3>
                      <h4 className="text-lg font-semibold text-kudi-green mb-3">
                        The market rush.
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                        Five customers are shouting your name at once. Your MTN
                        network completely drops. It doesn't matter. You log 50
                        different sales offline at lightning speed. The moment
                        your connection returns later, KudiFlow silently syncs
                        everything to the cloud.
                      </p>
                    </div>
                  </motion.div>

                  {/* Phase 3: Evening */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative flex gap-6 sm:gap-10"
                  >
                    {/* The Node */}
                    <div className="relative z-10 w-14 h-14 sm:w-20 sm:h-20 shrink-0 bg-white border-[3px] border-emerald-100 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                        <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-kudi-green" />
                      </div>
                    </div>
                    {/* The Content */}
                    <div className="pt-2 sm:pt-4">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        Evening (6:00 PM)
                      </h3>
                      <h4 className="text-lg font-semibold text-kudi-green mb-3">
                        Zero mental math.
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                        Closing time. Instead of spending 45 minutes punching a
                        calculator and arguing over a missing ₦2,000, you tap
                        one button. KudiFlow instantly shows your total sales,
                        your exact profit for the day, and everyone who
                        collected goods on credit. You go home early.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Promise to You (The Vendor Manifesto) */}
          <section className="w-full bg-slate-900 border-y border-slate-800 py-24 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-size-[24px_24px]"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-kudi-green/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 mix-blend-screen" />

            <div className="max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/50 mb-6 mx-auto shadow-lg">
                  <span className="text-sm font-bold text-slate-300 uppercase tracking-wider relative z-10">
                    The Vendor Manifesto
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Our Promise to You
                </h2>
                <p className="text-lg text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
                  We know that trusting software with your business takes a leap
                  of faith. That is why we operate on three unbreakable rules.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.2 } },
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {[
                  {
                    icon: CheckCircle2,
                    title: "No Hidden Fees",
                    desc: "What you see on the pricing page is exactly what you pay. We will never lock your own data behind a surprise paywall or charge you random percentages of your sales.",
                  },
                  {
                    icon: Lock,
                    title: "Total Data Privacy",
                    desc: "Your suppliers, your customers, and your daily profits are highly confidential. We use bank-level encryption. We do not sell your lists to competitors or third parties. Period.",
                  },
                  {
                    icon: MessageCircleHeart,
                    title: "Always-On Human Support",
                    desc: "When you run into an issue in the middle of a busy market, you don't have time to email automated robots. You chat with a real human on our WhatsApp line, and we fix it instantly.",
                  },
                ].map((promise, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, ease: "easeOut" },
                      },
                    }}
                    className="group relative bg-slate-800/40 backdrop-blur-lg border border-white/5 rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-900/50 hover:-translate-y-2 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-hidden"
                  >
                    {/* Hover Glow Behind Card Content */}
                    <div className="absolute inset-0 bg-linear-to-b from-kudi-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md shadow-inner flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                        <promise.icon className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-emerald-300 transition-colors duration-300">
                        {promise.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-sm sm:text-base group-hover:text-slate-300 transition-colors duration-300">
                        {promise.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
          <section className="w-full max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-20 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Our Core Values
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Meet the Builder Section */}
          <section className="w-full max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-20 py-12 pb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 shadow-2xl shadow-slate-900/20 relative overflow-hidden flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between"
            >
              {/* Subtle texture for the dark card */}
              <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[24px_24px]"></div>

              {/* Left Column: Visuals (The Glowing Avatar) */}
              <div className="relative z-10 w-full lg:w-1/3 flex justify-center items-center">
                <div className="relative">
                  {/* Outer emerald glow ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 scale-105" />
                  {/* Heavy glowing backdrop */}
                  <div className="absolute inset-0 bg-kudi-green/40 blur-2xl rounded-full scale-90" />

                  <div
                    className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-slate-800 relative z-10 shadow-[0_0_60px_rgba(16,185,129,0.3)]
                   bg-slate-800"
                  >
                    <img
                      src="/assets/profile-picture.webp"
                      alt="Agbaho Chidera Victor - KudiFlow CEO"
                      className="w-full h-full object-cover"
                      // Fallback logic incase the image isn't named right or missing
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://ui-avatars.com/api/?name=Agbaho+Chidera+Victor&background=0e121b&color=10b981&size=512";
                      }}
                    />
                  </div>

                  {/* Founder Pill Badge */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-6 py-1.5 bg-slate-800 border border-slate-700 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">
                        Founder
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Content */}
              <div className="relative z-10 w-full lg:w-2/3 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Quote className="w-6 h-6 text-kudi-green fill-kudi-green/20" />
                </div>

                <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight">
                  Meet the Builder
                </h2>

                <p className="text-lg text-slate-300 leading-relaxed mb-8 font-medium">
                  "The gap between an idea and its execution is where dreams
                  often die. I built KudiFlow to close that gap for African
                  market vendors. We are forging a new kind of financial
                  partner, one that amplifies your hustle instead of
                  complicating it, turning 'chaos' into 'control' at the speed
                  of thought."
                </p>

                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Agbaho Chidera Victor
                  </h3>
                  <p className="text-sm text-slate-400">
                    CEO of CV Digitals LTD <br className="hidden sm:block" />{" "}
                    (The parent company that owns KudiFlow)
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Final CTA Strip */}
          <section className="w-full bg-slate-900 py-16 text-center">
            <div className="max-w-2xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-white mb-8">
                Ready to take control of your business?
              </h2>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-kudi-green text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-kudi-green group"
              >
                Create your free shop
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
