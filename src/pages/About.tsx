import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { motion } from "framer-motion";
import { Shield, Zap, WifiOff, Users, ArrowRight, Quote } from "lucide-react";
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

          {/* Core Values */}
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

                  <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-slate-800 relative z-10 shadow-[0_0_60px_rgba(16,185,129,0.3)] bg-slate-800">
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
