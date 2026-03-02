import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { motion } from "framer-motion";
import { Shield, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "March 2, 2026"; // Or use a dynamic date if preferred

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-kudi-green/30">
      <LandingNavbar />

      <main className="grow pt-20">
        {/* Premium Dark Trust Header */}
        <section className="relative bg-slate-900 border-b border-slate-800 py-20 lg:py-28 overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-kudi-green/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] mix-blend-screen pointer-events-none" />

          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-12">
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

        {/* The Reading Canvas */}
        <section className="w-full max-w-4xl mx-auto px-6 sm:px-12 py-16 lg:py-24">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-kudi-green prose-a:no-underline hover:prose-a:underline">
            <p className="lead text-xl text-slate-700 font-medium">
              At KudiFlow (a product of CV Digitals LTD), we understand that as
              a merchant, your inventory, sales records, and debtors list are
              the lifeblood of your business. This Privacy Policy explains what
              data we collect, why we collect it, and the enterprise-grade
              measures we take to secure it.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We believe in data minimization. We only collect the information
              absolutely necessary to provide you with the KudiFlow service:
            </p>
            <ul>
              <li>
                <strong>Account Information:</strong> When you create a shop, we
                collect your Full Name, Shop Name, Phone Number, and Email
                Address. This is used strictly for authentication and account
                recovery.
              </li>
              <li>
                <strong>Store Data (The Ledger):</strong> The data you input
                into the app, including product names, stock levels, cost
                prices, selling prices, and records of who owes you money.
              </li>
              <li>
                <strong>Device & Usage Information:</strong> Anonymous crash
                reports and generalized usage analytics to help us improve app
                performance. We do not track keystrokes or read contents outside
                the app.
              </li>
            </ul>

            <h2>2. How We Use Your Data</h2>
            <p>
              Your data is used entirely for the purpose of running your
              business smoothly on our platform. We use it to:
            </p>
            <ul>
              <li>
                Provide, maintain, and securely sync your KudiFlow dashboard
                across your devices.
              </li>
              <li>Enable the "offline-first" capability architecture.</li>
              <li>
                Send critical account notifications, security alerts, and
                support messages.
              </li>
            </ul>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mt-8 mb-8 flex gap-4">
              <Shield className="w-6 h-6 text-kudi-green shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-slate-900 m-0 mb-2">
                  Our Zero-Sell Guarantee
                </h4>
                <p className="m-0 text-slate-700 text-base">
                  <strong>
                    We do not, and will never, sell your store data or customer
                    lists to marketers, advertisers, or third parties.
                  </strong>{" "}
                  Your business is your business.
                </p>
              </div>
            </div>

            <h2>3. Data Security & Storage</h2>
            <p>
              We built KudiFlow utilizing Google's Firebase infrastructure. All
              your data is encrypted both in transit (while moving between your
              phone and our servers) and at rest (when saved in the database)
              using industry-standard AES-256 encryption.
            </p>
            <p>
              Furthermore, our backend is protected by Zero-Trust architecture
              rules. This means only your authenticated device can read your
              specific shop's ledger. Our support staff cannot casually browse
              through your debtors list.
            </p>

            <h2>4. Third-Party Integrations</h2>
            <p>
              To provide essential features, we integrate with highly vetted
              third-party services:
            </p>
            <ul>
              <li>
                <strong>Google Cloud/Firebase:</strong> For secure database
                hosting and authentication.
              </li>
              <li>
                <strong>Google reCAPTCHA v3:</strong> Invisible bot protection
                on our public forms. They analyze behavioral patterns to block
                spam.
              </li>
            </ul>

            <h2>5. Your Rights & Data Deletion</h2>
            <p>
              You have total control over your digital ledger. You have the
              right to:
            </p>
            <ul>
              <li>
                Export your data at any time (feature coming soon to the Pro
                Dashboard).
              </li>
              <li>
                Request a complete deletion of your account and all associated
                store data. Once requested, your data is permanently scrubbed
                from our active servers within 30 days.
              </li>
            </ul>

            <h2>6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy occasionally to reflect software
              updates or legal requirements. If we make significant changes that
              affect your rights, we will notify you directly via the app
              dashboard or email.
            </p>

            <h2>7. Contact Us</h2>
            <p>
              If you have any questions, concerns, or require assistance
              regarding your data privacy, the technical architecture of
              KudiFlow, or CV Digitals LTD compliance, please reach out to our
              team:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@kudiflow.com">support@kudiflow.com</a>
              </li>
              <li>
                <strong>In-App:</strong> Use the direct WhatsApp Support button
                provided in your dashboard.
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
