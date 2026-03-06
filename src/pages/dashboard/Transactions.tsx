import SEO from "../../components/SEO";
import { useSales } from "../../hooks/useSales";
import { ReceiptModal } from "../../components/dashboard/ReceiptModal";
import { useState, useMemo } from "react";
import type { Sale } from "../../types/sales";
import { CalendarDays, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function Transactions() {
  const { sales, isLoading } = useSales();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      // Search by customer name, or items sold
      const term = searchTerm.toLowerCase();
      const inCustomer = sale.customerName?.toLowerCase().includes(term);
      const inItems = sale.items.some((item) =>
        item.productName.toLowerCase().includes(term)
      );
      return inCustomer || inItems;
    });
  }, [sales, searchTerm]);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSales.length / itemsPerPage)
  );
  const currentSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format date correctly
  const formatDate = (dateValue: unknown) => {
    let d = new Date();
    const dateVal = dateValue as { toDate?: () => Date };
    if (dateVal && typeof dateVal.toDate === "function") {
      d = dateVal.toDate();
    } else if (dateValue && typeof dateValue === "number") {
      d = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      d = dateValue;
    }

    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  };

  const formatItemsSold = (items: Sale["items"]) => {
    return items
      .map((item) => `${item.quantity} ${item.productName}`)
      .join(", ");
  };

  return (
    <>
      <SEO
        title="Transactions History"
        description="View all your complete sales history and receipts."
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Transactions History
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              View and print receipts for all your past sales.
            </p>
          </div>
        </div>

        {/* Filters / Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name or item..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kudi-green/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[50vh]">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
              Loading transaction history...
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <CalendarDays className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-700 text-lg mb-1">
                No transactions found
              </h3>
              <p className="text-slate-500 text-sm">
                You haven't made any sales that match this search yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="divide-y divide-slate-100 flex-1">
                {currentSales.map((sale: Sale, idx) => (
                  <div
                    key={sale.id || idx}
                    onClick={() => setSelectedSale(sale)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-lg shadow-sm border ${
                          sale.paymentStatus === "paid"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                            : sale.paymentStatus === "partial"
                            ? "bg-amber-50 border-amber-100 text-amber-600"
                            : "bg-rose-50 border-rose-100 text-rose-600"
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
                        <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {formatItemsSold(sale.items)}{" "}
                          <span className="text-slate-500 font-normal">
                            Sold
                          </span>
                          {sale.customerName && (
                            <span className="text-slate-500 font-normal ml-1">
                              to {sale.customerName}
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 shrink-0 flex-wrap">
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {formatDate(sale.createdAt)}
                          </span>
                          <span className="text-xs text-slate-500 capitalize px-2 py-0.5 border border-slate-200 rounded-md">
                            {sale.paymentMethod}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                              sale.paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : sale.paymentStatus === "partial"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {sale.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right pl-16 sm:pl-0 shrink-0">
                      <p className="font-extrabold text-lg text-slate-900">
                        ₦{sale.totalAmount.toLocaleString()}
                      </p>
                      {sale.paymentStatus !== "paid" && (
                        <p className="text-xs text-rose-500 font-semibold mt-0.5 bg-rose-50 px-2 py-0.5 rounded-md inline-block">
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between mt-auto">
                  <span className="text-sm text-slate-500 font-medium">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredSales.length)}{" "}
                    of {filteredSales.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-white border border-slate-200 rounded-lg hover:border-kudi-green hover:text-kudi-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 bg-white border border-slate-200 rounded-lg hover:border-kudi-green hover:text-kudi-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
