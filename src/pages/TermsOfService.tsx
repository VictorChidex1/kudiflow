import { useState, useEffect } from "react";
import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { motion } from "framer-motion";
import {
  Scale,
  Key,
  UserCheck,
  Smartphone,
  ShieldAlert,
  CreditCard,
  Database,
  Ban,
  Mail,
  FileBadge,
} from "lucide-react";
import SEO from "../components/SEO";

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
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "account", title: "2. Account Responsibilities" },
  { id: "acceptable-use", title: "3. Acceptable Use" },
  { id: "subscription", title: "4. Subscriptions & Billing" },
  { id: "data-ownership", title: "5. Data Ownership" },
  { id: "liability", title: "6. Limitation of Liability" },
  { id: "termination", title: "7. Account Termination" },
  { id: "contact", title: "8. Contact Us" },
];

export default function TermsOfService() {
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
      <SEO
        title="Terms of Service"
        description="The ground rules for using KudiFlow. Transparent, fair, and designed to protect both your business and ours."
      />
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
                <Scale className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                  Terms of Service
                </h1>
                <p className="text-lg text-slate-400 font-medium max-w-2xl">
                  The ground rules for using KudiFlow. Transparent, fair, and
                  designed to protect both your business and ours.
                </p>
                <div className="mt-6 inline-block bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-sm font-medium text-emerald-400">
                  Effective Date: {lastUpdated}
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
                    Welcome to KudiFlow! These Terms of Service ("Terms")
                    constitute a legally binding agreement between you (the
                    merchant, business owner, or user) and CV Digitals LTD
                    ("we," "us," or "our") governing your use of the KudiFlow
                    application, website, and related services.
                  </p>
                </ScrollReveal>

                {/* Section 1 */}
                <ScrollReveal>
                  <div id="acceptance" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <FileBadge className="w-7 h-7 text-emerald-500" />
                      1. Acceptance of Terms
                    </h2>
                    <p>
                      By creating an account, downloading our mobile app, or
                      accessing the KudiFlow web platform, you agree to be bound
                      by these Terms and our Privacy Policy. If you do not
                      agree, you may not use our services.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Section 2 */}
                <ScrollReveal>
                  <div id="account" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <UserCheck className="w-7 h-7 text-emerald-500" />
                      2. Account Responsibilities
                    </h2>
                    <p>
                      You are solely responsible for maintaining the
                      confidentiality of your ledger and account credentials.
                      Because KudiFlow handles sensitive financial data (your
                      debtors list, revenue splits), we ask that you strictly
                      observe the following:
                    </p>

                    {/* Information Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10 not-prose">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                          <Key className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">
                          Password Security
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Use a strong, unique password. If your account is
                          compromised due to password sharing, KudiFlow cannot
                          be held liable for deleted ledgers.
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                          <UserCheck className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">
                          Accurate Info
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          You must provide a valid email and phone number. We
                          rely on this to recover your offline ledgers if you
                          lose your device.
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-4">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">
                          Device Locking
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          You are responsible for securing the physical device
                          running KudiFlow to prevent unauthorized access to
                          your offline data.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Section 3 */}
                <ScrollReveal>
                  <div id="acceptable-use" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <ShieldAlert className="w-7 h-7 text-emerald-500" />
                      3. Acceptable Use
                    </h2>
                    <p>
                      KudiFlow is designed to empower legitimate business
                      owners. You agree <strong>NOT</strong> to use the platform
                      to:
                    </p>
                    <ul>
                      <li>
                        Track or manage inventory related to illegal goods,
                        weapons, or illicit substances.
                      </li>
                      <li>Engage in fraudulent operations or scams.</li>
                      <li>
                        Attempt to hack, reverse-engineer, or maliciously
                        overload our servers or syncing infrastructure.
                      </li>
                    </ul>
                  </div>
                </ScrollReveal>

                {/* Section 4 */}
                <ScrollReveal>
                  <div id="subscription" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <CreditCard className="w-7 h-7 text-emerald-500" />
                      4. Subscriptions & Billing
                    </h2>
                    <p>
                      KudiFlow currently offers a "Forever Free" tier. In the
                      future, we may introduce advanced "Pro" features (like AI
                      insights, advanced reporting, or automated debtor SMS
                      reminders) which will be subject to paid subscriptions. If
                      you choose to upgrade, you agree to provide valid payment
                      information and accept recurring billing terms.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Section 5 */}
                <ScrollReveal>
                  <div id="data-ownership" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <Database className="w-7 h-7 text-emerald-500" />
                      5. Data Ownership & License
                    </h2>
                    <p>
                      <strong>You own your data.</strong> We do not claim
                      ownership over any inventory records, pricing, or customer
                      data you enter into KudiFlow.
                    </p>
                    <p>
                      However, to make the app function (especially the
                      offline-syncing feature), you grant KudiFlow a worldwide,
                      royalty-free license to host, store, and temporarily
                      process your encrypted data strictly for the purpose of
                      operating the service.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Section 6 */}
                <ScrollReveal>
                  <div id="liability" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <Scale className="w-7 h-7 text-emerald-500" />
                      6. Limitation of Liability
                    </h2>
                    <p>
                      While we utilize enterprise grade Firebase infrastructure
                      to ensure 99.9% uptime and zero data loss, KudiFlow is
                      provided "as is."
                      <strong>
                        {" "}
                        To the maximum extent permitted by law, CV Digitals LTD
                        shall not be liable for any indirect, incidental, or
                        consequential damages, including loss of profits, lost
                        inventory data, or business interruption
                      </strong>{" "}
                      arising from your use or inability to use the service
                      (e.g., if a merchant accidentally deletes their own ledger
                      and hasn't synced it).
                    </p>
                  </div>
                </ScrollReveal>

                {/* Section 7 */}
                <ScrollReveal>
                  <div id="termination" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <Ban className="w-7 h-7 text-emerald-500" />
                      7. Account Termination
                    </h2>
                    <p>
                      We reserve the right to suspend or terminate your account
                      immediately, without prior notice, if we determine you
                      have violated these Terms (especially the Acceptable Use
                      policy regarding illegal activities). You may also
                      terminate this agreement at any time by requesting an
                      account deletion via support.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Section 8 */}
                <ScrollReveal>
                  <div id="contact" className="scroll-mt-24 pt-4">
                    <h2 className="flex items-center gap-3">
                      <Mail className="w-7 h-7 text-emerald-500" />
                      8. Contact Details
                    </h2>
                    <p>
                      If you have questions about these Terms, the billing
                      process, or your legal rights, please contact CV Digitals
                      LTD directly:
                    </p>
                    <ul>
                      <li>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:support@kudiflow.com">
                          support@kudiflow.com
                        </a>
                      </li>
                      <li>
                        <strong>Business Address:</strong> CV Digitals LTD
                        (Nigeria).
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
