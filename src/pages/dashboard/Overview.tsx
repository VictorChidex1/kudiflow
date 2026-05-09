import SEO from "../../components/SEO";
import { auth } from "../../lib/firebase";
import { useSales } from "../../hooks/useSales";
import { useInventory } from "../../hooks/useInventory";
import { useExpenses } from "../../hooks/useExpenses";
import { ReceiptModal } from "../../components/dashboard/ReceiptModal";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { User, Users, PackageSearch, Banknote, CreditCard, ArrowRightLeft, FileText, Clock, TrendingDown, ArrowUpRight, ShieldCheck, Wallet, TriangleAlert, CheckCircle2 } from "lucide-react";
import type { Sale } from "../../types/sales";
import { formatDistanceToNow } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg backdrop-blur-md">
        <p className="text-sm text-slate-500 font-medium mb-1">
          {payload[0].payload.date}
        </p>
        <p className="font-bold text-emerald-600 text-lg">
          ₦{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function Overview() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const { sales, isLoading: isLoadingSales } = useSales();
  const { products, isLoading: isLoadingInventory } = useInventory();
  const { expenses, isLoading: isLoadingExpenses } = useExpenses();

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const currentMonthPrefix = new Date().toISOString().slice(0, 7); // "YYYY-MM"

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

  // --- MONTHLY FINANCIAL FUNNEL CALCULATIONS ---

  const { monthlyRevenue, monthlyCOGS } = useMemo(() => {
    let revenue = 0;
    let cogs = 0;

    sales.forEach((sale) => {
      let saleDate = new Date(0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (sale.createdAt && typeof (sale.createdAt as any).toDate === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        saleDate = (sale.createdAt as any).toDate();
      } else if (sale.createdAt && typeof sale.createdAt === "number") {
        saleDate = new Date(sale.createdAt);
      } else if (sale.createdAt instanceof Date) {
        saleDate = sale.createdAt;
      }

      const saleMonth = saleDate.toISOString().slice(0, 7);
      
      if (saleMonth === currentMonthPrefix && sale.paymentStatus !== "unpaid") {
        revenue += sale.amountPaid;
        
        // Calculate Cost of Goods Sold for this sale
        sale.items.forEach(item => {
          const cost = item.isSourced && item.sourcingCost ? item.sourcingCost : item.costPrice;
          cogs += (cost * item.quantity);
        });
      }
    });

    return { monthlyRevenue: revenue, monthlyCOGS: cogs };
  }, [sales, currentMonthPrefix]);

  const monthlyGrossProfit = monthlyRevenue - monthlyCOGS;

  const monthlyExpenses = useMemo(() => {
    return expenses
      .filter((exp) => exp.date.startsWith(currentMonthPrefix))
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses, currentMonthPrefix]);

  const monthlyNetProfit = monthlyGrossProfit - monthlyExpenses;

  // --- END FINANCIAL FUNNEL ---

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

  // Calculate Low Stock Alerts
  const lowStockProducts = useMemo(() => {
    return products
      .filter((p) => p.stockLevel <= p.minStockLevel)
      .sort((a, b) => a.stockLevel - b.stockLevel);
  }, [products]);

  // Calculate 7-day rolling revenue data for the chart
  const weeklyChartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);

      const dailySales = sales.filter((sale) => {
        let saleDate = new Date(0);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (sale.createdAt && typeof (sale.createdAt as any).toDate === "function") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          saleDate = (sale.createdAt as any).toDate();
        } else if (sale.createdAt && typeof sale.createdAt === "number") {
          saleDate = new Date(sale.createdAt);
        } else if (sale.createdAt instanceof Date) {
          saleDate = sale.createdAt;
        }
        return (
          saleDate >= d && saleDate < nextDay && sale.paymentStatus !== "unpaid"
        );
      });

      const dailyTotal = dailySales.reduce(
        (sum, sale) => sum + sale.amountPaid,
        0
      );

      data.push({
        name: d.toLocaleDateString("en-US", { weekday: "short" }),
        Revenue: dailyTotal,
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    }
    return data;
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

        {/* MAIN HIGHLIGHT: The Financial Funnel (This Month) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Gross Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
            <div className="relative z-10 flex items-center justify-between mb-3">
              <span className="text-slate-500 font-medium text-sm flex items-center gap-1.5">
                <Wallet className="w-4 h-4" /> This Month's Revenue
              </span>
            </div>
            <span className="relative z-10 text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              {isLoadingSales ? "..." : `₦${monthlyRevenue.toLocaleString()}`}
            </span>
          </div>

          {/* 2. Gross Profit */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
            <div className="relative z-10 flex items-center justify-between mb-3">
              <span className="text-slate-500 font-medium text-sm flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-purple-500" /> Gross Profit
              </span>
            </div>
            <span className="relative z-10 text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              {isLoadingSales ? "..." : `₦${monthlyGrossProfit.toLocaleString()}`}
            </span>
          </div>

          {/* 3. Expenses */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group cursor-pointer" onClick={() => navigate("/dashboard/expenses")}>
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
            <div className="relative z-10 flex items-center justify-between mb-3">
              <span className="text-slate-500 font-medium text-sm flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-500" /> Total Expenses
              </span>
            </div>
            <span className="relative z-10 text-2xl lg:text-3xl font-bold text-rose-600 tracking-tight">
              {isLoadingExpenses ? "..." : `- ₦${monthlyExpenses.toLocaleString()}`}
            </span>
          </div>

          {/* 4. NET PROFIT (The Hero Card) */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl shadow-lg shadow-emerald-500/20 flex flex-col relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-out" />
            <div className="relative z-10 flex items-center justify-between mb-2">
              <span className="text-emerald-50 font-medium text-sm flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5" /> True Net Profit
              </span>
            </div>
            <span className="relative z-10 text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-1">
              {isLoadingSales || isLoadingExpenses ? "..." : `₦${monthlyNetProfit.toLocaleString()}`}
            </span>
            <p className="relative z-10 text-emerald-100/80 text-xs mt-3 font-medium">
              Gross Profit minus Expenses (This Month)
            </p>
          </div>
        </div>

        {/* Secondary Metrics Row (Operations) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-2">
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col">
            <span className="text-slate-500 font-medium mb-1 text-xs uppercase tracking-wider">
              Today's Sales
            </span>
            <span className="text-xl font-bold text-slate-800">
              {isLoadingSales ? "..." : `₦${todaysSalesTotal.toLocaleString()}`}
            </span>
          </div>
          <div className="bg-rose-50/50 backdrop-blur-sm p-4 rounded-xl border border-rose-100 shadow-sm flex flex-col cursor-pointer hover:bg-rose-50 transition-colors" onClick={() => navigate("/dashboard/debtors")}>
            <span className="text-rose-500 font-medium mb-1 text-xs uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3" /> Total Debtors
            </span>
            <span className="text-xl font-bold text-rose-700">
              {isLoadingSales ? "..." : `₦${totalDebtors.toLocaleString()}`}
            </span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col cursor-pointer hover:bg-white transition-colors" onClick={() => navigate("/dashboard/inventory")}>
            <span className="text-slate-500 font-medium mb-1 text-xs uppercase tracking-wider flex items-center gap-1">
              <PackageSearch className="w-3 h-3" /> Inventory Value
            </span>
            <span className="text-xl font-bold text-slate-800">
              {isLoadingInventory
                ? "..."
                : `₦${inventoryValue.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Advanced 7-Day Revenue Analytics Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg">7-Day Revenue Trend</h3>
          </div>
          <div className="h-[280px] w-full">
            {isLoadingSales ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            ) : weeklyChartData.every((d) => d.Revenue === 0) ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <span className="text-4xl mb-3 grayscale opacity-50 text-emerald-500">📈</span>
                <p className="font-semibold text-sm">No revenue data for the past 7 days</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                    tickFormatter={(value) =>
                      `₦${value >= 1000 ? value / 1000 + "k" : value}`
                    }
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#10b981", strokeWidth: 1, strokeDasharray: "4 4" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Revenue"
                    stroke="#10b981"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    activeDot={{
                      r: 6,
                      fill: "#10b981",
                      stroke: "#fff",
                      strokeWidth: 3,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                {sales.slice(0, 5).map((sale: Sale, idx) => {
                  let parsedDate = null;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  if (sale.createdAt && typeof (sale.createdAt as any).toDate === "function") {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    parsedDate = (sale.createdAt as any).toDate();
                  } else if (sale.createdAt && typeof sale.createdAt === "number") {
                    parsedDate = new Date(sale.createdAt);
                  } else if (sale.createdAt instanceof Date) {
                    parsedDate = sale.createdAt;
                  }

                  const timeString = parsedDate
                    ? formatDistanceToNow(parsedDate, { addSuffix: true })
                    : "Recently";

                  // Truncation logic
                  const primaryItem = sale.items[0];
                  let itemSummaryText = `${primaryItem?.quantity || 0}x ${primaryItem?.productName || "Unknown Item"}`;
                  if (sale.items.length > 1) {
                    itemSummaryText += ` & ${sale.items.length - 1} more item${
                      sale.items.length - 1 > 1 ? "s" : ""
                    }`;
                  }

                  return (
                    <div
                      key={sale.id || idx}
                      onClick={() => setSelectedSale(sale)}
                      className="p-5 flex flex-col sm:flex-row justify-between gap-4 hover:bg-slate-50/80 active:bg-slate-100 active:scale-[0.99] transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <div
                          className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-lg shadow-sm border ${
                            sale.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : sale.paymentStatus === "partial"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-rose-100 text-rose-700 border-rose-200"
                          }`}
                        >
                          {sale.paymentMethod === "cash" && <Banknote className="w-5 h-5" />}
                          {sale.paymentMethod === "pos" && <CreditCard className="w-5 h-5" />}
                          {sale.paymentMethod === "transfer" && <ArrowRightLeft className="w-5 h-5" />}
                          {sale.paymentMethod === "credit" && <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 leading-tight break-words pr-2">
                            {itemSummaryText}
                          </p>
                          {sale.customerName && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <p className="text-sm font-medium text-slate-500 truncate">
                                Sold to <span className="text-slate-700 font-semibold">{sale.customerName}</span>
                              </p>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500 tracking-wide px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 font-bold uppercase">
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
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {timeString}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right pl-15 sm:pl-0 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
                        <p
                          className={`font-extrabold text-lg tracking-tight ${
                            sale.paymentStatus === "unpaid" ? "text-rose-600" : "text-slate-900"
                          }`}
                        >
                          ₦{sale.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[500px]">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TriangleAlert className="w-5 h-5 text-amber-500" />
              Restock Alerts
            </h3>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {lowStockProducts.length} Items
            </span>
          </div>
          <div className="overflow-y-auto flex-1 p-0">
            {isLoadingInventory ? (
              <div className="p-8 text-center">
                <p className="text-slate-400 text-sm animate-pulse">Checking inventory...</p>
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h4 className="font-bold text-slate-800">Stock is Healthy</h4>
                <p className="text-sm text-slate-500 mt-1 text-center">
                  All your products are above their minimum stock level.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate("/dashboard/inventory")}>
                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-slate-900 truncate">
                        {product.productName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Min limit: {product.minStockLevel}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 bg-rose-100 text-rose-700 font-black text-sm rounded-lg border border-rose-200">
                        {product.stockLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              onClick={() => navigate("/dashboard/inventory")}
              className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm text-sm"
            >
              Manage Inventory
            </button>
          </div>
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
