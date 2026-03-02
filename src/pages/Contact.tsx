import { useState } from "react";
import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  MessageCircle,
  Mail,
  MapPin,
  Send,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

// The dynamic FAQ accordion component
const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-700/50 rounded-2xl bg-slate-800/30 overflow-hidden backdrop-blur-sm transition-all hover:bg-slate-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-hidden"
      >
        <h4 className="text-lg font-bold text-slate-100">{question}</h4>
        <div
          className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 transition-transform duration-300 border border-slate-700 ${
            isOpen ? "rotate-180 bg-emerald-500/20 border-emerald-500/30" : ""
          }`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-colors ${
              isOpen ? "text-emerald-400" : "text-slate-400"
            }`}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 text-slate-400 leading-relaxed font-medium">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// FAQ Data Source
const faqs = [
  {
    question: "Is my store data completely secure?",
    answer:
      "Yes. We use enterprise-grade encryption for all your data. Your customer lists and sales numbers are completely hidden from everyone, including us.",
  },
  {
    question: "Can I use KudiFlow without internet?",
    answer:
      "Absolutely. Record sales, add inventory, and manage debts perfectly completely offline. The app silently syncs to the cloud the moment your connection returns.",
  },
  {
    question: "How much does KudiFlow cost?",
    answer:
      "We have a forever-free plan meant for small shops. For larger stores needing advanced team management, our Pro plan is very affordable with no hidden fees.",
  },
  {
    question: "Can you help me set up my shop?",
    answer:
      "Yes! Send us a WhatsApp message using the button above. Real humans on our team are happy to guide you through your first inventory upload.",
  },
];

export default function Contact() {
  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

  if (!recaptchaKey) {
    console.warn(
      "Missing VITE_RECAPTCHA_SITE_KEY. Contact form reCAPTCHA is disabled."
    );
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey || "dummy_key_to_prevent_crash_when_missing"}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "body",
      }}
    >
      <ContactPageContent />
    </GoogleReCaptchaProvider>
  );
}

function ContactPageContent() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    storeName: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      console.warn("Execute recaptcha not yet available");
    }

    setIsSubmitting(true);

    try {
      let recaptchaToken = "token_unavailable";
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("contact_form_submit");
      }

      await addDoc(collection(db, "contact_messages"), {
        ...formData,
        recaptchaToken,
        createdAt: serverTimestamp(),
        status: "new",
      });

      setIsSuccess(true);
      setFormData({ fullName: "", contact: "", storeName: "", message: "" });

      // Keep success toast visible for 4 seconds
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Something went wrong. Please try again or use WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <LandingNavbar />

      <main className="flex-1 w-full flex flex-col items-center">
        {/* The Trust Header */}
        <section className="w-full relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 mb-16 lg:mb-24 border-b border-slate-200/60 text-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/contact-hero.webp"
              alt="KudiFlow Customer Success Team"
              className="w-full h-full object-cover object-center"
            />
            {/* Premium Corporate Glass Overlay for Readability */}
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] transition-opacity duration-700"></div>
            {/* Smooth transition gradient down to the white section below */}
            <div className="absolute inset-0 bg-linear-to-b from-slate-900/20 via-slate-900/60 to-slate-50"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl mx-auto px-6 sm:px-12 lg:px-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-8 mx-auto shadow-lg">
              <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider relative z-10">
                Support & Sales
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-xl">
              Let's talk about <br />
              <span className="text-emerald-400 drop-shadow-2xl">
                growing your business.
              </span>
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed font-medium drop-shadow-md">
              Whether you have a question about pricing, need a demo, or just
              want to say hello, our team in Lagos is ready to help.
            </p>
          </motion.div>
        </section>

        {/* The Core Split: Lines vs Form */}
        <section className="w-full max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-20 mb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left Column: Direct Human Lines (Takes up 2/5) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 flex flex-col justify-center space-y-10"
            >
              <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-kudi-green rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-kudi-green/30">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    WhatsApp Us
                  </h3>
                  <p className="text-slate-600 mb-6 font-medium">
                    Fastest response. Chat with our support team instantly.
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto"
                  >
                    <span>Start Chat</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="space-y-8 pl-4 border-l-2 border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Email Support
                    </h4>
                    <a
                      href="mailto:support@kudiflow.com"
                      className="text-slate-500 font-medium hover:text-kudi-green transition-colors inline-block"
                    >
                      support@kudiflow.com
                    </a>
                    <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1 w-max rounded-md bg-emerald-50 border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase">
                        Avg response: 2 hours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Headquarters
                    </h4>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      Lekki Phase 1,
                      <br />
                      Lagos, Nigeria.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: The Form Card (Takes up 3/5) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-4xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 sm:p-12 relative overflow-hidden">
                {/* Decorative blob corner */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Send us a message
                </h3>
                <p className="text-slate-500 mb-8 font-medium">
                  We'll get back to you as soon as possible.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 relative z-10"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-bold text-slate-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        maxLength={100}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-kudi-green block px-4 py-3.5 transition-shadow"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="contact"
                        className="block text-sm font-bold text-slate-700"
                      >
                        WhatsApp or Email
                      </label>
                      <input
                        type="text"
                        id="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        required
                        maxLength={100}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-kudi-green block px-4 py-3.5 transition-shadow"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="storeName"
                      className="block text-sm font-bold text-slate-700"
                    >
                      Store / Business Name{" "}
                      <span className="text-slate-400 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      maxLength={100}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-kudi-green block px-4 py-3.5 transition-shadow"
                      placeholder="e.g. Iya Basira Provisions"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="message"
                        className="block text-sm font-bold text-slate-700"
                      >
                        How can we help?
                      </label>
                      <span
                        className={`text-xs font-bold ${
                          formData.message.length > 650
                            ? "text-rose-500"
                            : "text-slate-400"
                        }`}
                      >
                        {formData.message.length} / 700
                      </span>
                    </div>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      maxLength={500}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-kudi-green block px-4 py-3.5 transition-shadow resize-none"
                      placeholder="Tell us what you need..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className={`w-full text-white font-bold rounded-xl text-lg px-6 py-4 flex items-center justify-center gap-2 transition-all duration-300 ${
                      isSuccess
                        ? "bg-slate-900 hover:bg-slate-800"
                        : "bg-kudi-green hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                    } ${isSubmitting ? "opacity-80 cursor-wait" : ""}`}
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="w-6 h-6" />
                        <span>Message Sent!</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-5 h-5 -mt-0.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Deflector Section (Premium Dark Mode) */}
        <section className="w-full relative mt-16 lg:mt-24 pt-24 pb-32">
          {/* Dark Glass Background Matching About Page */}
          <div className="absolute inset-x-0 bottom-0 h-full bg-slate-900 z-0 overflow-hidden">
            {/* Subtle ambient glows */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-kudi-green/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

            {/* Diagonal accent slash */}
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          </div>

          <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 sm:px-12 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-900/20 border border-slate-700/50 backdrop-blur-md">
                <HelpCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Before you ask...
              </h3>
              <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
                Quick answers to the most common questions from our vendors.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Framer Motion Success Toast Popup */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-slate-900/20 border border-white/10"
          >
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-base">
                Message Sent Successfully!
              </h4>
              <p className="text-slate-400 text-sm">
                Our team will get back to you shortly.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
