import { motion, AnimatePresence } from "framer-motion";
import type { DocCategory } from "./DocsSidebar";
import { Lightbulb } from "lucide-react";

interface DocsContentProps {
  activeCategory: DocCategory;
}

export function DocsContent({ activeCategory }: DocsContentProps) {
  // Simulated highly readable generic content tailored to market vendors
  const renderContent = () => {
    switch (activeCategory) {
      case "getting-started":
        return (
          <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-kudi-green prose-li:text-slate-600">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Getting Started with KudiFlow
            </h1>
            <p className="text-xl text-slate-500 mb-10">
              Welcome! Let’s get your shop completely set up in less than 5
              minutes.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Step 1: Create your free shop
            </h2>
            <p>
              When you first open KudiFlow, tap the{" "}
              <strong>"Create Free Shop"</strong> button. We only need your Shop
              Name, Phone Number, and a secure Password. We don't need any
              complicated documents to get started.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Step 2: Add your first products
            </h2>
            <p>
              To start recording sales, the app needs to know what you sell. Tap
              the <strong>"Inventory"</strong> tab at the bottom of your screen,
              then tap the big Green <strong>"+"</strong> button.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Enter the product name (e.g., "Peak Milk 500g").</li>
              <li>Enter how much you bought it for (Cost Price).</li>
              <li>
                Enter how much you sell it for (Selling Price). KudiFlow will
                automatically calculate your pure profit!
              </li>
            </ul>

            <div className="my-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-kudi-green">
                  <Lightbulb size={24} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 m-0 mb-1">
                  Pro Tip
                </h4>
                <p className="m-0 text-slate-700">
                  Don't worry about adding all your products at once! Add the
                  ones you sell the most first. You can always add the rest
                  later while you are in the market.
                </p>
              </div>
            </div>
          </div>
        );

      case "daily-sales":
        return (
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Recording Daily Sales
            </h1>
            <p className="text-xl text-slate-500 mb-10">
              Throw away your paper ledger. Record every transaction in 3
              seconds.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              How to record a Cash Sale
            </h2>
            <p>
              Tap the <strong>"New Sale"</strong> button right on your
              dashboard. Select the items the customer bought, collect the
              money, and tap Save. That's it. Your total sales for the day will
              automatically update.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              How to record a Transfer
            </h2>
            <p>
              If the customer is paying by bank transfer, select "Bank Transfer"
              as the payment method before saving. This helps you track exactly
              how much cash you should have in hand versus money in the bank.
            </p>
          </div>
        );

      case "debtors":
        return (
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Collecting Debts Effortlessly
            </h1>
            <p className="text-xl text-slate-500 mb-10">
              Never fight with customers over forgotten debts again.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Recording a "Credit" Sale
            </h2>
            <p>
              When a customer buys on credit, record a normal sale but change
              the Payment Method to <strong>"Credit/Debt"</strong>.
            </p>
            <p>
              The app will ask for the Customer's Name and Phone Number. This
              securely saves their debt to your Debtors List.
            </p>

            <div className="my-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-kudi-green">
                  <Lightbulb size={24} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 m-0 mb-1">
                  The Magic Button
                </h4>
                <p className="m-0 text-slate-700">
                  Open your Debtors list, click on a customer who owes you, and
                  tap <strong>"Send WhatsApp Reminder"</strong>. KudiFlow will
                  open WhatsApp and automatically type a polite, professional
                  reminder message for you to send!
                </p>
              </div>
            </div>
          </div>
        );

      case "offline":
        return (
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              How Offline Mode Works
            </h1>
            <p className="text-xl text-slate-500 mb-10">
              The network is bad? KudiFlow doesn't care.
            </p>

            <p>
              You can use the KudiFlow app all day in the market without turning
              on your mobile data. You can log sales, view inventory, and add
              new products.
            </p>
            <p className="font-bold text-slate-800 mt-6">
              When you get home and connect to Wi-Fi or turn on your data, the
              app will automatically "sync" and back up all your sales safely to
              the cloud.
            </p>
          </div>
        );

      case "inventory":
        return (
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Managing Your Inventory
            </h1>
            <p className="text-xl text-slate-500 mb-10">
              Keep track of what's in stock and get alerted before you run out.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Adding and Editing Items
            </h2>
            <p>
              Navigate to the <strong>"Inventory"</strong> tab. Here you can see
              a complete list of all your products. Tap any product to update
              its price or adjust the stock quantity.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Traffic-Light Alerts
            </h2>
            <p>
              KudiFlow uses a simple color-coded system to tell you how your
              stock is doing:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong className="text-kudi-green">Green:</strong> You have
                plenty of stock.
              </li>
              <li>
                <strong className="text-amber-500">Yellow:</strong> Stock is
                getting low, plan to restock soon.
              </li>
              <li>
                <strong className="text-red-500">Red:</strong> Out of stock or
                critically low!
              </li>
            </ul>

            <div className="my-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-kudi-green">
                  <Lightbulb size={24} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 m-0 mb-1">
                  Automatic Deductions
                </h4>
                <p className="m-0 text-slate-700">
                  You don't need to update your inventory manually when you sell
                  something. Every time you record a sale, KudiFlow
                  automatically reduces the stock count for those items!
                </p>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Account Security & Privacy
            </h1>
            <p className="text-xl text-slate-500 mb-10">
              Your business data is yours. We keep it safe and private.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Who can see my sales?
            </h2>
            <p>
              <strong>Only you.</strong> KudiFlow uses bank-grade encryption to
              protect your records. Our team cannot see your sales, your
              customers, or your profits.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              What happens if my phone gets lost or stolen?
            </h2>
            <p>
              Don't panic! Because KudiFlow automatically syncs your data to the
              cloud whenever you are connected to the internet, your records are
              perfectly safe.
            </p>
            <p>
              Simply get a new phone, download KudiFlow, log in with your Phone
              Number and Password, and all your inventory, sales, and debtors
              will reappear instantly.
            </p>

            <div className="my-10 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Lightbulb size={24} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 m-0 mb-1">
                  Never Share Your Password
                </h4>
                <p className="m-0 text-slate-700">
                  If you have shop assistants, we will soon release a "Staff
                  Mode" that allows them to record sales without seeing your
                  total profits. Until then, keep your password secret.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Section Coming Soon
            </h1>
            <p className="text-xl text-slate-500 mb-10">
              We are currently writing the guide for this section.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 w-full bg-white min-h-screen py-10 px-6 sm:px-12 lg:px-20 lg:py-16">
      <div className="max-w-3xl border border-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
