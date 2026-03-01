import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { motion } from "framer-motion";
import { Shield, Zap, WifiOff, Users, ArrowRight } from "lucide-react";
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
          <section className="w-full max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-20 pt-24 pb-16 lg:pt-32 lg:pb-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-8 mx-auto">
                <span className="text-sm font-bold text-kudi-green uppercase tracking-wider">
                  Our Mission
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                Empowering the hustle. <br />
                <span className="text-kudi-green">Built for growth.</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed">
                We are on a mission to transition millions of African market
                vendors from chaotic paper ledgers to streamlined, stress-free
                digital management.
              </p>
            </motion.div>
          </section>

          {/* The Problem / Solution Narrative */}
          <section className="w-full bg-white border-y border-slate-200/60 py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
                    The paper ledger <br />
                    is costing you money.
                  </h2>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    For decades, local vendors have relied on exercise books to
                    track their inventory and debtors. These books get lost,
                    damaged by rain, or simply ignored when the market gets
                    busy.
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    The result? Forgotten debts, unknown profit margins, and
                    inventory running out unexpectedly.{" "}
                    <strong>
                      KudiFlow was built to definitively solve this problem.
                    </strong>
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-slate-50 rounded-3xl border border-slate-200 shadow-2xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-emerald-400 to-kudi-green" />
                    <div className="w-20 h-20 bg-emerald-100/50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                      <Users className="w-10 h-10 text-kudi-green" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      By Vendors, For Vendors
                    </h3>
                    <p className="text-slate-500">
                      We spent months in markets across Nigeria sitting with
                      real shop owners, understanding their daily struggles, and
                      building exactly what they asked for.
                    </p>
                  </div>
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
