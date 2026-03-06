import SEO from "../../components/SEO";
import { auth } from "../../lib/firebase";

export default function Overview() {
  const user = auth.currentUser;

  return (
    <>
      <SEO
        title="Dashboard Overview"
        description="Your KudiFlow shop at a glance. Track sales, inventory, and debtors."
      />

      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.displayName || "Vendor"} 👋
            </h1>
            <p className="text-emerald-600 font-medium mt-1">
              Here is what's happening in your shop today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-kudi-green hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap">
              + Log a Sale
            </button>
          </div>
        </div>

        {/* Phase 1 Metrics Placholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-slate-500 font-medium mb-2 text-sm">
              Today's Sales
            </span>
            <span className="text-3xl font-bold text-slate-900">₦0.00</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-slate-500 font-medium mb-2 text-sm">
              Total Debtors
            </span>
            <span className="text-3xl font-bold text-rose-600">₦0.00</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-slate-500 font-medium mb-2 text-sm">
              Inventory Value
            </span>
            <span className="text-3xl font-bold text-slate-900">₦0.00</span>
          </div>
        </div>

        {/* Phase 1 Recent Activity Placeholder */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-4">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              View All
            </button>
          </div>
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-slate-600 font-medium">
              No sales recorded today yet.
            </p>
            <p className="text-slate-400 text-sm mt-1">Syncing to cloud...</p>
          </div>
        </div>
      </div>
    </>
  );
}
