import { useState, useEffect } from "react";
import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  User,
  Database,
  Smartphone,
  Lock,
  Trash2,
  Mail,
  RefreshCcw,
  Share2,
  FileText,
} from "lucide-react";

// Helper component for triggering animations on scroll
const ScrollReveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

// Moving sections outside to prevent recreation on every render and satisfy exhaustive-deps
const sections = [
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "how-we-use-it", title: "How We Use Your Data" },
  { id: "data-security", title: "Data Security & Storage" },
  { id: "third-party", title: "Third-Party Integrations" },
  { id: "your-rights", title: "Your Rights & Deletion" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact-us", title: "Contact Us" },
];

export default function PrivacyPolicy() {
  const lastUpdated = "March 2, 2026";
  const [activeSection, setActiveSection] = useState("");

  // Logic to highlight sidebar link based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) =>
        document.getElementById(s.id)
      );
      const currentScrollPosition = window.scrollY + 200; // Offset for header

      let currentSection = "";
      for (const section of sectionElements) {
        if (section && section.offsetTop <= currentScrollPosition) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header if any
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-kudi-green/30">
      <LandingNavbar />

      <main className="grow pt-20">
        {/* Premium Dark Trust Header */}
        <section className="relative bg-slate-900 border-b border-slate-800 py-16 lg:py-24 overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-kudi-green/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] mix-blend-screen pointer-events-none" />

          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-6"
            >
              <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20 border border-slate-700/50 backdrop-blur-md">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                  Privacy Policy
                </h1>
                <p className="text-lg text-slate-400 font-medium max-w-2xl">
                  We treat your financial data with the same security standards
                  as a bank. Here is exactly how we handle and protect your
                  information.
                </p>
                <div className="mt-6 inline-block bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-sm font-medium text-emerald-400">
                  Last Updated: {lastUpdated}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dual Column Layout (Sidebar + Content) */}
        <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Column: Sticky Table of Contents (Hidden on mobile) */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-32">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
                  Table of Contents
                </h3>
                <nav className="flex flex-col gap-3 border-l-2 border-slate-200">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => scrollToSection(section.id, e)}
                      className={`block pl-4 py-1 text-sm font-medium transition-all duration-200 border-l-2 -ml-[2px] ${
                        activeSection === section.id ||
                        (activeSection === "" && section.id === sections[0].id)
                          ? "border-kudi-green text-kudi-green translate-x-1"
                          : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                      }`}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Right Column: The Reading Canvas */}
            <div className="flex-1 min-w-0">
              <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-kudi-green prose-a:no-underline hover:prose-a:underline">
                <ScrollReveal>
                  <p className="lead text-xl text-slate-700 font-medium mt-0">
                    At KudiFlow (a product of CV Digitals LTD), we understand
                    that as a merchant, your inventory, sales records, and
                    debtors list are the lifeblood of your business. This
                    Privacy Policy explains what data we collect, why we collect
                    it, and the enterprise-grade measures we take to secure it.
                  </p>
                </ScrollReveal>

                {/* Section 1 */}
                <ScrollReveal>
                  <div
                    id="information-we-collect"
                    className="scroll-mt-24 pt-4"
                  >
                    <h2 className="flex items-center gap-3">
                      <Database className="w-7 h-7 text-emerald-500" />
                      1. Information We Collect
                    </h2>
                    <p>
                      We believe in data minimization. We only collect the
                      information absolutely necessary to provide you with the
                      KudiFlow service.
                    </p>

                    {/* Information Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10 not-prose">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                          <User className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">
                          Account Info
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Your Full Name, Shop Name, Phone Number, and Email
                          Address. Used strictly for authentication and account
                          recovery.
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                        <div className="w-12 h-12 bg-emerald-50 text-kudi-green rounded-xl flex items-center justify-center mb-4">
                          <Database className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">
                          Store Data
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          The data you input into the app: product names, stock
                          levels, cost prices, selling prices, and records of
                          who owes you.
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">
                          Device Info
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Anonymous crash reports and generalized usage
                          analytics to improve app performance. We do not track
                          keystrokes outside the app.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Section 2 */}
                <ScrollReveal>
                  <div id="how-we-use-it" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <RefreshCcw className="w-7 h-7 text-emerald-500" />
                      2. How We Use Your Data
                    </h2>
                    <p>
                      Your data is used entirely for the purpose of running your
                      business smoothly on our platform. We use it to:
                    </p>
                    <ul>
                      <li>
                        Provide, maintain, and securely sync your KudiFlow
                        dashboard across your devices.
                      </li>
                      <li>
                        Enable the "offline-first" capability architecture.
                      </li>
                      <li>
                        Send critical account notifications, security alerts,
                        and support messages.
                      </li>
                    </ul>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mt-10 mb-8 flex flex-col sm:flex-row gap-5 not-prose items-start">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-kudi-green border border-emerald-100">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-2">
                          Our Zero-Sell Guarantee
                        </h4>
                        <p className="text-slate-700 leading-relaxed">
                          <strong>
                            We do not, and will never, sell your store data or
                            customer lists to marketers, advertisers, or third
                            parties.
                          </strong>{" "}
                          Your business is your business.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Section 3 */}
                <ScrollReveal>
                  <div id="data-security" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <Lock className="w-7 h-7 text-emerald-500" />
                      3. Data Security & Storage
                    </h2>
                    <p>
                      We built KudiFlow utilizing Google's advanced Firebase
                      infrastructure. All your data is encrypted both in transit
                      (while moving between your phone and our servers) and at
                      rest (when saved in the database) using industry-standard
                      AES-256 encryption.
                    </p>
                    <p>
                      Furthermore, our backend is protected by Zero-Trust
                      architecture rules. This means only your authenticated
                      device can read your specific shop's ledger. Our support
                      staff cannot casually browse through your debtors list.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Section 4 */}
                <ScrollReveal>
                  <div id="third-party" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <Share2 className="w-7 h-7 text-emerald-500" />
                      4. Third-Party Integrations
                    </h2>
                    <p>
                      To provide essential features, we integrate with highly
                      vetted third-party services:
                    </p>
                    <ul>
                      <li>
                        <strong>Google Cloud/Firebase:</strong> For secure
                        database hosting and authentication.
                      </li>
                      <li>
                        <strong>Google reCAPTCHA v3:</strong> Invisible bot
                        protection on our public forms. They analyze behavioral
                        patterns to block spam.
                      </li>
                    </ul>
                  </div>
                </ScrollReveal>

                {/* Section 5 */}
                <ScrollReveal>
                  <div id="your-rights" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <Trash2 className="w-7 h-7 text-emerald-500" />
                      5. Your Rights & Data Deletion
                    </h2>
                    <p>
                      You have total control over your digital ledger. You have
                      the right to:
                    </p>
                    <ul>
                      <li>
                        Export your data at any time (feature coming soon to the
                        Pro Dashboard).
                      </li>
                      <li>
                        Request a complete deletion of your account and all
                        associated store data. Once requested, your data is
                        permanently scrubbed from our active servers within 30
                        days.
                      </li>
                    </ul>
                  </div>
                </ScrollReveal>

                {/* Section 6 */}
                <ScrollReveal>
                  <div id="changes" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <FileText className="w-7 h-7 text-emerald-500" />
                      6. Changes to This Policy
                    </h2>
                    <p>
                      We may update this Privacy Policy occasionally to reflect
                      software updates or legal requirements. If we make
                      significant changes that affect your rights, we will
                      notify you directly via the app dashboard or email.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Section 7 */}
                <ScrollReveal>
                  <div id="contact-us" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <Mail className="w-7 h-7 text-emerald-500" />
                      7. Contact Us
                    </h2>
                    <p>
                      If you have any questions, concerns, or require assistance
                      regarding your data privacy, the technical architecture of
                      KudiFlow, or CV Digitals LTD compliance, please reach out
                      to our team:
                    </p>
                    <ul>
                      <li>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:support@kudiflow.com">
                          support@kudiflow.com
                        </a>
                      </li>
                      <li>
                        <strong>In-App:</strong> Use the direct WhatsApp Support
                        button provided in your dashboard.
                      </li>
                    </ul>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
