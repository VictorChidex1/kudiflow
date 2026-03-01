import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Do I need an active internet connection to use KudiFlow?",
    answer:
      "No! KudiFlow is designed with an offline-first architecture. You can log sales, add inventory, and manage debtors all day without spending a Kobo on data. Once your phone detects a stable internet connection (even a weak 3G signal), it automatically syncs your data to the cloud securely.",
  },
  {
    id: 2,
    question: "How do the automated WhatsApp reminders work?",
    answer:
      "When a customer buys on credit, you log their debt in KudiFlow. The app will automatically generate and send a polite, professional WhatsApp message to their phone reminding them of their balance on the dates you set. No more awkward phone calls asking for your money.",
  },
  {
    id: 3,
    question: "Is my business data safe if I lose my phone?",
    answer:
      "Absolutely. Your data isn't just stored on your phone; it's heavily encrypted and backed up to secure cloud servers instantly whenever you are online. If your phone is lost or stolen, simply log into KudiFlow on a new device, and all your ledgers, inventory, and histories will be restored immediately.",
  },
  {
    id: 4,
    question: "Can my sales girl use the app without seeing my total profit?",
    answer:
      "Yes. KudiFlow Pro includes Multi-User Role Management. You can create a 'Cashier' login for your staff that only allows them to record sales and scan barcodes, completely hiding your sensitive analytics, total revenue, and overall profit margins from them.",
  },
  {
    id: 5,
    question: "I have thousands of items. How long will it take to add them?",
    answer:
      "Minutes, not days. Unlike manual entry, KudiFlow allows you to bulk-upload your existing inventory spreadsheet (Excel or CSV) directly into the app. We also have a built-in barcode scanner that uses your phone's camera to instantly recognize thousands of standard Nigerian FMCG products.",
  },
  {
    id: 6,
    question: "What happens after my 2-month free Pro trial?",
    answer:
      "You will automatically be downgraded to our Free Starter plan, which still includes the basic ledger and 50 inventory items forever. We never automatically charge your card. If you love the Pro features (like unlimited WhatsApp automation and staff accounts), you can actively choose to upgrade for just ₦2,500/month.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Context & Sticky Header */}
          <div className="lg:col-span-5 mb-12 lg:mb-0">
            <div className="lg:sticky lg:top-32">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-kudi-green/10 text-kudi-green text-sm font-semibold tracking-wide mb-6">
                <MessageCircle className="w-4 h-4" />
                <span>Support & FAQs</span>
              </div>
              <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
                Got questions? <br className="hidden lg:block" />
                We've got answers.
              </h2>
              <p className="text-lg text-slate-500 mb-8">
                Everything you need to know about the product and billing. If
                you can't find your answer here, our team is always just a
                message away.
              </p>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-kudi-green/10 rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle
                    className="w-6 h-6 text-kudi-green"
                    fill="currentColor"
                    fillOpacity={0.2}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    Still have questions?
                  </h4>
                  <p className="text-sm text-slate-500 mb-3 hover:text-slate-600 transition-colors">
                    Can't find the answer you're looking for? Please chat to our
                    friendly team.
                  </p>
                  <a
                    href="https://wa.me/2340000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-bold text-kudi-green hover:text-emerald-700 transition-colors"
                  >
                    Chat with us on WhatsApp &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Accordion */}
          <div className="lg:col-span-7">
            <div className="divide-y divide-slate-200/60 max-w-3xl border-y border-transparent">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div key={faq.id} className="py-6">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="flex w-full items-start justify-between text-left focus:outline-none group"
                      aria-expanded={isOpen}
                    >
                      <h3
                        className={`text-lg sm:text-xl font-bold pr-8 transition-colors duration-300 ${
                          isOpen
                            ? "text-kudi-green"
                            : "text-slate-900 group-hover:text-kudi-green/80"
                        }`}
                      >
                        {faq.question}
                      </h3>
                      <span className="ml-6 flex h-7 items-center shrink-0">
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                            isOpen
                              ? "border-kudi-green bg-kudi-green text-white shadow-sm shadow-kudi-green/20"
                              : "border-slate-200 text-slate-400 group-hover:border-kudi-green/50 group-hover:text-kudi-green"
                          }`}
                        >
                          {isOpen ? (
                            <Minus className="h-4 w-4" strokeWidth={3} />
                          ) : (
                            <Plus className="h-4 w-4" strokeWidth={3} />
                          )}
                        </motion.div>
                      </span>
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
                          <p className="pb-2 pt-4 text-base leading-relaxed text-slate-500 pr-12">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
