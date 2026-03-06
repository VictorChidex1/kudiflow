import SEO from "../../components/SEO";
import { auth } from "../../lib/firebase";
import { useSales } from "../../hooks/useSales";
import { useInventory } from "../../hooks/useInventory";
import { ReceiptModal } from "../../components/dashboard/ReceiptModal";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { User } from "lucide-react";
import type { Sale } from "../../types/sales";

export default function Overview() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const { sales, isLoading: isLoadingSales } = useSales();
  const { products, isLoading: isLoadingInventory } = useInventory();

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

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

  // Calculate Inventory Value
  const inventoryValue = useMemo(() => {
    return products.reduce(
      (sum, item) => sum + item.costPrice * item.stockLevel,
      0
    );
  }, [products]);

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
            <span className="text-3xl font-bold text-slate-900">
              {isLoadingInventory
                ? "..."
                : `₦${inventoryValue.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-4">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
            <button
              onClick={() => navigate("/dashboard/transactions")}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View All Transactions
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
                    onClick={() => setSelectedSale(sale)}
                    className="p-5 flex flex-col sm:flex-row justify-between gap-4 hover:bg-slate-50/80 active:bg-slate-100 active:scale-[0.99] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div
                        className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-lg shadow-sm border ${
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
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 leading-tight break-words pr-2">
                          {sale.items
                            .map(
                              (item) => `${item.quantity} ${item.productName}`
                            )
                            .join(", ")}{" "}
                          <span className="text-slate-500 font-normal">
                            Sold
                          </span>
                        </p>
                        {sale.customerName && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <p className="text-sm font-medium text-slate-500 truncate">
                              Sold to{" "}
                              <span className="text-slate-700 font-semibold">
                                {sale.customerName}
                              </span>
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-2 capitalize tracking-wide">
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 font-bold uppercase">
                            {sale.paymentMethod}
                          </span>
                          <span
                            className={`font-black uppercase tracking-widest text-[9px] px-2 py-0.5 rounded border ${
                              sale.paymentStatus === "paid"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : sale.paymentStatus === "partial"
                                ? "bg-amber-50 border-amber-200 text-amber-700"
                                : "bg-rose-50 border-rose-200 text-rose-700"
                            }`}
                          >
                            {sale.paymentStatus}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right pl-15 sm:pl-0 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
                      <p className="font-extrabold text-lg text-slate-900 tracking-tight">
                        ₦{sale.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedSale && (
        <ReceiptModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </>
  );
}
