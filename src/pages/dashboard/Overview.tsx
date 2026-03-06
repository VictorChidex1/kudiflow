import SEO from "../../components/SEO";
import { auth } from "../../lib/firebase";
import { useSales } from "../../hooks/useSales";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import type { Sale } from "../../types/sales";

export default function Overview() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const { sales, isLoading: isLoadingSales } = useSales();

  // Calculate Today's Sales directly from the real-time hook
  const todaysSalesTotal = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sales
      .filter((sale) => {
        // Handle various timestamp formats robustly
        let saleDate = new Date(0);
        if (
          sale.createdAt &&
          typeof (sale.createdAt as unknown as { toDate?: () => Date })
            .toDate === "function"
        ) {
          saleDate = (
            sale.createdAt as unknown as { toDate: () => Date }
          ).toDate();
        } else if (sale.createdAt && typeof sale.createdAt === "number") {
          saleDate = new Date(sale.createdAt);
        } else if (sale.createdAt instanceof Date) {
          saleDate = sale.createdAt;
        }

        return saleDate >= today && sale.paymentStatus !== "unpaid";
      })
      .reduce((sum, sale) => sum + sale.amountPaid, 0);
  }, [sales]);

  // Upcoming Phase 3: Total Debtors calculation placeholder
  const totalDebtors = useMemo(() => {
    return sales
      .filter((sale) => sale.paymentStatus !== "paid")
      .reduce((sum, sale) => sum + (sale.totalAmount - sale.amountPaid), 0);
  }, [sales]);

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
            <button
              onClick={() => navigate("/dashboard/sales")}
              className="px-5 py-2.5 bg-kudi-green hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              + Log a Sale
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-slate-500 font-medium mb-2 text-sm">
              Today's Sales
            </span>
            <span className="text-3xl font-bold text-slate-900">
              {isLoadingSales ? "..." : `₦${todaysSalesTotal.toLocaleString()}`}
            </span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-slate-500 font-medium mb-2 text-sm">
              Total Debtors (Owed)
            </span>
            <span className="text-3xl font-bold text-rose-600">
              {isLoadingSales ? "..." : `₦${totalDebtors.toLocaleString()}`}
            </span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-slate-500 font-medium mb-2 text-sm">
              Inventory Value
            </span>
            <span className="text-3xl font-bold text-slate-900">₦0.00</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-4">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
            <button
              onClick={() => navigate("/dashboard/sales")}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View Sales Ledger
            </button>
          </div>
          <div className="p-0">
            {isLoadingSales ? (
              <div className="p-8 text-center flex flex-col items-center">
                <p className="text-slate-400 text-sm mt-1 animate-pulse">
                  Syncing sales data...
                </p>
              </div>
            ) : sales.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-slate-600 font-medium">
                  No sales recorded yet.
                </p>
                <button
                  onClick={() => navigate("/dashboard/sales")}
                  className="text-kudi-green text-sm mt-2 font-semibold hover:underline"
                >
                  Record your first sale
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sales.slice(0, 5).map((sale: Sale, idx) => (
                  <div
                    key={sale.id || idx}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          sale.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : sale.paymentStatus === "partial"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {sale.paymentMethod === "cash"
                          ? "💵"
                          : sale.paymentMethod === "pos"
                          ? "💳"
                          : sale.paymentMethod === "transfer"
                          ? "🏦"
                          : "📝"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {sale.items.length}{" "}
                          {sale.items.length === 1 ? "Item" : "Items"} Sold
                          {sale.customerName && (
                            <span className="text-slate-500 font-normal ml-1">
                              to {sale.customerName}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {sale.paymentMethod} • {sale.paymentStatus}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        ₦{sale.totalAmount.toLocaleString()}
                      </p>
                      {sale.paymentStatus !== "paid" && (
                        <p className="text-xs text-rose-500 font-medium">
                          Balance: ₦
                          {(
                            sale.totalAmount - sale.amountPaid
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
