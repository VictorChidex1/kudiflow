import SEO from "../../components/SEO";
import { useSales } from "../../hooks/useSales";
import { ReceiptModal } from "../../components/dashboard/ReceiptModal";
import { useState, useMemo } from "react";
import type { Sale } from "../../types/sales";
import {
  CalendarDays,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Download,
  Filter,
  Wallet,
  AlertCircle,
  Eye
} from "lucide-react";
import { subDays, startOfMonth, startOfDay, endOfDay, isWithinInterval } from "date-fns";

export default function Transactions() {
  const { sales, isLoading } = useSales();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "paid" | "partial" | "unpaid">("All");
  const [methodFilter, setMethodFilter] = useState<"All" | "cash" | "transfer" | "pos" | "credit">("All");
  
  type DateFilterType = "Today" | "Last 7 Days" | "This Month" | "All Time" | "Custom";
  const [dateFilter, setDateFilter] = useState<DateFilterType>("All Time");
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getSaleDate = (dateValue: unknown) => {
    let d = new Date();
    const dateVal = dateValue as { toDate?: () => Date };
    if (dateVal && typeof dateVal.toDate === "function") {
      d = dateVal.toDate();
    } else if (dateValue && typeof dateValue === "number") {
      d = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      d = dateValue;
    }
    return d;
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      // 1. Search term
      const term = searchTerm.toLowerCase();
      const inCustomer = sale.customerName?.toLowerCase().includes(term);
      const inItems = sale.items.some((item) =>
        item.productName.toLowerCase().includes(term)
      );
      if (term && !inCustomer && !inItems) return false;

      // 2. Status
      if (statusFilter !== "All" && sale.paymentStatus !== statusFilter) return false;

      // 3. Method
      if (methodFilter !== "All" && sale.paymentMethod !== methodFilter) return false;

      // 4. Date
      const saleDate = getSaleDate(sale.createdAt);
      const today = new Date();
      if (dateFilter === "Today") {
        if (!isWithinInterval(saleDate, { start: startOfDay(today), end: endOfDay(today) })) return false;
      } else if (dateFilter === "Last 7 Days") {
        if (!isWithinInterval(saleDate, { start: subDays(startOfDay(today), 7), end: endOfDay(today) })) return false;
      } else if (dateFilter === "This Month") {
        if (!isWithinInterval(saleDate, { start: startOfMonth(today), end: endOfDay(today) })) return false;
      } else if (dateFilter === "Custom" && customDateRange.start && customDateRange.end) {
        const start = startOfDay(new Date(customDateRange.start));
        const end = endOfDay(new Date(customDateRange.end));
        if (!isWithinInterval(saleDate, { start, end })) return false;
      }

      return true;
    });
  }, [sales, searchTerm, statusFilter, methodFilter, dateFilter, customDateRange]);

  const metrics = useMemo(() => {
    return filteredSales.reduce(
      (acc, sale) => {
        acc.totalTransactions++;
        acc.totalRevenue += sale.amountPaid;
        if (sale.paymentStatus !== "paid") {
          acc.outstandingBalance += (sale.totalAmount - sale.amountPaid);
        }
        return acc;
      },
      { totalTransactions: 0, totalRevenue: 0, outstandingBalance: 0 }
    );
  }, [filteredSales]);

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / itemsPerPage));
  const currentSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateValue: unknown) => {
    const d = getSaleDate(dateValue);
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
    if (items.length === 0) return "No items";
    if (items.length === 1) return `${items[0].quantity} ${items[0].productName}`;
    return `${items[0].quantity} ${items[0].productName} + ${items.length - 1} other item${items.length - 1 > 1 ? 's' : ''}`;
  };

  const exportToCSV = () => {
    if (filteredSales.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Customer Name,Customer Phone,Items Sold,Payment Method,Payment Status,Total Amount,Amount Paid,Balance\n";

    filteredSales.forEach(sale => {
      const date = formatDate(sale.createdAt).replace(/,/g, ''); 
      const customer = sale.customerName ? `"${sale.customerName}"` : "N/A";
      const phone = sale.customerPhone ? `"${sale.customerPhone}"` : "N/A";
      const itemsString = `"${sale.items.map(i => `${i.quantity}x ${i.productName}`).join("; ")}"`;
      const balance = sale.totalAmount - sale.amountPaid;
      
      const row = [
        date,
        customer,
        phone,
        itemsString,
        sale.paymentMethod,
        sale.paymentStatus,
        sale.totalAmount,
        sale.amountPaid,
        balance
      ].join(",");
      
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SEO
        title="Transactions History"
        description="View all your complete sales history and receipts."
      />

      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Transactions History
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              View and print receipts for all your past sales.
            </p>
          </div>
          <button
            onClick={exportToCSV}
            disabled={filteredSales.length === 0}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Total Transactions
              </span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900">
              {metrics.totalTransactions.toLocaleString()}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Revenue Collected
              </span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900">
              ₦{metrics.totalRevenue.toLocaleString()}
            </span>
          </div>

          <div className={`p-5 rounded-2xl border flex flex-col gap-1 transition-colors ${metrics.outstandingBalance > 0 ? "bg-rose-50 border-rose-200" : "bg-white border-slate-200 shadow-sm"}`}>
            <div className={`flex items-center gap-2 mb-2 ${metrics.outstandingBalance > 0 ? "text-rose-600" : "text-slate-500"}`}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Outstanding Balance
              </span>
            </div>
            <span className={`text-2xl font-extrabold ${metrics.outstandingBalance > 0 ? "text-rose-700" : "text-slate-900"}`}>
              ₦{metrics.outstandingBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all w-full lg:w-auto ${
                showFilters ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value as DateFilterType);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-kudi-green outline-none text-sm font-medium"
                >
                  <option value="All Time">All Time</option>
                  <option value="Today">Today</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="This Month">This Month</option>
                  <option value="Custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Payment Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-kudi-green outline-none text-sm font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Payment Method</label>
                <select
                  value={methodFilter}
                  onChange={(e) => {
                    setMethodFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-kudi-green outline-none text-sm font-medium capitalize"
                >
                  <option value="All">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="transfer">Transfer</option>
                  <option value="pos">POS</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

              {dateFilter === "Custom" && (
                <div className="sm:col-span-3 grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Start Date</label>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => {
                        setCustomDateRange(prev => ({ ...prev, start: e.target.value }));
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-kudi-green outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">End Date</label>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => {
                        setCustomDateRange(prev => ({ ...prev, end: e.target.value }));
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-kudi-green outline-none text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[50vh] relative z-0">
          {isLoading ? (
            <div className="divide-y divide-slate-100 flex flex-col h-full">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-slate-100 animate-pulse" />
                    <div className="space-y-3 flex-1 pt-1">
                      <div className="h-4 bg-slate-100 rounded w-3/4 max-w-[200px] animate-pulse" />
                      <div className="h-3 bg-slate-100 rounded w-1/2 max-w-[150px] animate-pulse" />
                      <div className="flex gap-2">
                        <div className="w-16 h-5 bg-slate-100 rounded animate-pulse" />
                        <div className="w-16 h-5 bg-slate-100 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="w-24 h-6 bg-slate-100 rounded animate-pulse shrink-0 mt-2 sm:mt-0 pl-16 sm:pl-0" />
                </div>
              ))}
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
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="divide-y divide-slate-100 flex-1">
                {currentSales.map((sale: Sale, idx) => (
                  <div
                    key={sale.id || idx}
                    onClick={() => setSelectedSale(sale)}
                    className="p-5 flex flex-col sm:flex-row justify-between gap-4 hover:bg-slate-50/80 active:bg-slate-100 active:scale-[0.99] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4 min-w-0">
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
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 group-hover:text-kudi-green transition-colors leading-tight break-words flex items-center gap-2">
                          {formatItemsSold(sale.items)}
                          <span className="hidden sm:inline-flex opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 p-1 rounded-md text-slate-500 hover:text-slate-700">
                            <Eye className="w-3 h-3" />
                          </span>
                        </h4>
                        {sale.customerName && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <p className="text-sm font-medium text-slate-500 truncate">
                              Sold to{" "}
                              <span className="text-slate-700 font-semibold">
                                {sale.customerName}
                              </span>
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2.5 shrink-0 flex-wrap">
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1.5 tracking-wide border border-slate-200/50">
                            <CalendarDays className="w-3 h-3" />
                            {formatDate(sale.createdAt)}
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-md">
                            {sale.paymentMethod}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md ${
                              sale.paymentStatus === "paid"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : sale.paymentStatus === "partial"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {sale.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right pl-16 sm:pl-0 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
                      <p className="font-extrabold text-xl text-slate-900 tracking-tight">
                        ₦{sale.totalAmount.toLocaleString()}
                      </p>
                      {sale.paymentStatus !== "paid" && (
                        <p className="text-xs text-rose-600 font-bold mt-1 bg-rose-50 px-2.5 py-1 rounded-md inline-flex items-center justify-center border border-rose-100 max-w-full truncate">
                          Bal: ₦
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
