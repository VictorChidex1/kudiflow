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
              Step 2: Understand Your Dashboard
            </h2>
            <p>
              Your <strong>Overview Dashboard</strong> is the brain of your business. It tracks everything in real-time.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Total Value of Goods:</strong> KudiFlow automatically multiplies your inventory stock by your cost price, telling you exactly how much money is sitting in your shop.</li>
              <li><strong>Expected Revenue:</strong> This is what you will make if you sell everything in your shop right now.</li>
              <li><strong>Low Stock Warnings:</strong> A dynamic counter tells you exactly how many items need to be restocked.</li>
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
              Throw away your paper ledger. Record every transaction in 3 seconds using the highly optimized Sales Ledger.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              The Point of Sale (POS) Grid
            </h2>
            <p>
              Tap the <strong>"Sales Ledger"</strong> tab. The page is designed for absolute speed. We only load 12 products at a time (Pagination) so the app never freezes, even if you have 10,000 items.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Adding to Cart:</strong> Simply tap any product card to add it to the cart. You can use the <strong>+</strong> and <strong>-</strong> buttons in the cart to instantly adjust quantities. The cart dynamically calculates your subtotal in real-time.</li>
              <li><strong>Barcode Scanning:</strong> Have a barcode scanner? Click the search bar and scan! If KudiFlow finds an exact SKU match, it will automatically drop the item into the cart and instantly clear the search bar, ready for the next scan.</li>
              <li><strong>Stock Protection:</strong> KudiFlow physically prevents cashiers from adding more items to the cart than what is actually available in your inventory. No more "accidental overselling."</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Discounts
            </h2>
            <p>
              Want to give a loyal customer a break? You can apply a flat Cash Discount directly at the bottom of the cart before you hit checkout. KudiFlow will subtract this from the total amount and log it in the receipt.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              The Smart Checkout Modal
            </h2>
            <p>
              When you hit checkout, KudiFlow presents a smart payment window. Select "Cash", "POS", or "Transfer" to instantly log the cash flow.
            </p>
            <p>
              <strong>Safe Currency Formatting:</strong> Don't worry about typing commas. Just type your numbers (e.g. 50000) and KudiFlow will automatically format it beautifully (50,000) while keeping the math safe in the background!
            </p>

            <h3 className="text-xl font-bold mt-6 mb-2">Partial Payments</h3>
            <p>
              If a customer's total bill is ₦50,000, but they only have ₦30,000 in cash right now, simply type 30,000 into the "Amount Paid" box. KudiFlow is smart enough to automatically realize this is a <strong>"Partial"</strong> payment. It will force you to enter the Customer's Name, securely save the ₦30,000 cash, and automatically push the remaining ₦20,000 straight into your Debtors list!
            </p>

            <div className="my-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-kudi-green">
                  <Lightbulb size={24} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 m-0 mb-1">
                  Credit Sales & Collateral
                </h4>
                <p className="m-0 text-slate-700">
                  If you manually select the <strong>"Credit"</strong> payment method during checkout, KudiFlow unlocks new fields: <strong>Due Date</strong>, <strong>Credit Limit</strong>, and <strong>Guarantor Notes</strong>. You can use the notes section to log any collateral (like a broken phone) the customer dropped.
                </p>
              </div>
            </div>
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
              Architectural Enhancements (The Database)
            </h2>
            <p>
              To make debt collection truly intelligent, we upgraded the underlying database architecture to store three critical new pieces of data for every credit profile:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Due Date:</strong> When is the customer expected to pay? This is critical for generating automated WhatsApp reminders.</li>
              <li><strong>Credit Limit:</strong> A safety net. If a customer owes more than this limit, the system warns the cashier before allowing another credit sale, preventing bad debt.</li>
              <li><strong>Notes / Guarantor:</strong> MSMEs often take collateral (like a broken phone) or need a guarantor's name for large debts. This field stores those vital details securely.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              UI Enhancements: The Debtors Roster
            </h2>
            <p>
              The Debtors page has been rebuilt for maximum visibility. The left panel roster now only loads 10 debtors at a time to keep things snappy. You can quickly sort your list by Highest Debt, Oldest First, or Due Soonest.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-2">Debt Aging Badges</h3>
            <p>We visually tag debtors directly on the roster list based on their due dates so you know exactly who to call first:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong className="text-rose-500">🔴 Overdue:</strong> (Red Badge) They have passed their agreed due date.</li>
              <li><strong className="text-amber-500">🟡 Due Soon:</strong> (Yellow Badge) Their deadline is approaching within the next 3 days.</li>
              <li><strong className="text-emerald-500">🟢 Safe:</strong> (Green Badge) No deadline yet, or the deadline is far away.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Logging Repayments & Notes
            </h2>
            <p>
              <strong>Notes Section:</strong> Click any profile to view their details. We added a sleek, editable text area in the profile header. You can use this to quickly jot down collateral details or promises made by the debtor without leaving the page.
            </p>
            <p>
              <strong>Quick Settle Button:</strong> When a customer is ready to pay back their debt, tap "Log Repayment". We added a prominent "Settle Full Amount" button inside the modal. Cashiers no longer have to manually type the exact remaining balance—one tap fills it instantly. The profile features a <strong>visual progress bar</strong> that shows exactly what percentage of the debt has been recovered!
            </p>

            <div className="my-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-kudi-green">
                  <Lightbulb size={24} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 m-0 mb-1">
                  The Magic WhatsApp Button
                </h4>
                <p className="m-0 text-slate-700">
                  Click on any customer who owes you and tap <strong>"Send WhatsApp Reminder"</strong>. KudiFlow will automatically open WhatsApp with a polite, professional, pre-typed reminder message for you to send!
                </p>
              </div>
            </div>
          </div>
        );

      case "transactions":
        return (
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Transactions & Reporting
            </h1>
            <p className="text-xl text-slate-500 mb-10">
              Enterprise-grade financial reporting and exports.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              "God-Mode" Filtering & Search
            </h2>
            <p>
              The Transactions page isn't just a list; it's an analytics engine. You can search by <strong>Customer Name</strong> or <strong>Receipt ID</strong> using the search bar. Want to go deeper? Click the <strong>Filters</strong> button to slice your data exactly how you need it:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Custom Date Ranges:</strong> Choose from presets like "This Month" or "Last 7 Days". If you need specific dates, select "Custom" to open the calendar drop-down and pick a precise start and end date (e.g., May 1st to May 5th).</li>
              <li><strong>Status & Method:</strong> Filter down to specifically "Unpaid" sales, or sales made via "Transfer".</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Dynamic KPIs
            </h2>
            <p>
              At the top of the page, the three main cards (Total Transactions, Revenue Collected, Outstanding Balance) recalculate instantly based on your exact filters.
            </p>
            <p>
              <strong>How Outstanding Balance Works:</strong> This KPI specifically looks at partial or unpaid transactions <em>within your current filter</em>. If you set the date to "Last 7 Days", it tells you exactly how much debt was generated just in that week.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Pagination & Smart Truncation
            </h2>
            <p>
              <strong>Pagination for Scale:</strong> Your shop might process thousands of transactions a month. To prevent your phone from crashing, the Transactions ledger uses pagination to load exactly 15 receipts per page.
            </p>
            <p>
              <strong>Smart Truncation:</strong> If a customer buys 15 items, the UI won't clutter your screen. It cleanly displays <code>"1x Laptop + 14 other items"</code> so you can scan the list rapidly.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-2">Digital Receipts & Reprinting</h3>
            <p>
              Need to see those "14 other items" or reprint a lost receipt? Simply tap any row in the ledger. It will instantly pop open the <strong>Full Digital Receipt</strong>, which includes your Shop's Name at the top and a full itemized breakdown. You can take a screenshot or hit the Print button!
            </p>

            <div className="my-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-kudi-green">
                  <Lightbulb size={24} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 m-0 mb-1">
                  Pristine CSV Exports
                </h4>
                <p className="m-0 text-slate-700">
                  Hit the <strong>Export CSV</strong> button to instantly download a spreadsheet of your active filters. Perfect for handing over to your accountant or generating a call-list of debtors for your staff!
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
              The Inventory Dashboard
            </h2>
            <p>
              At the top of the Inventory page, you'll see three vital signs for your business:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Total Products:</strong> The number of unique items you sell.</li>
              <li><strong className="text-amber-500">Low Stock Alerts:</strong> A dynamic counter that tells you exactly how many items need to be restocked.</li>
              <li><strong>Total Value:</strong> The app multiplies your remaining stock by your cost price, telling you the exact cash value of the goods sitting in your shop.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Adding and Managing Products
            </h2>
            <p>
              When you add or edit a product, you are required to input the <strong>Cost Price</strong> and the <strong>Selling Price</strong>. KudiFlow uses these two numbers to automatically calculate your pure profit on every single sale. You can also add an optional <strong>SKU/Barcode</strong> for lightning-fast checkouts.
            </p>
            <p className="mt-4">
              <strong>Pagination for Speed:</strong> Even if you have 10,000 items in your shop, the inventory page will never freeze. It intelligently loads exactly 12 products at a time, keeping your phone fast and responsive.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Searching & Filtering
            </h2>
            <p>
              Stop scrolling endlessly to find an item. Use the <strong>Search Bar</strong> to instantly find products by their name or scan their barcode. You can also tap the <strong>Category Pills</strong> (like "Electronics" or "Groceries") to instantly filter your list down to a specific department.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">
              Traffic-Light Stock Alerts
            </h2>
            <p>
              KudiFlow uses a simple color-coded system on every product card to tell you how your stock is doing:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong className="text-kudi-green">Green:</strong> You have plenty of stock.
              </li>
              <li>
                <strong className="text-amber-500">Yellow:</strong> Stock is getting low, plan to restock soon.
              </li>
              <li>
                <strong className="text-rose-500">Red:</strong> Out of stock or critically low!
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
                  something. Every time you record a sale in the Sales Ledger, KudiFlow
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
