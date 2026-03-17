import { useState } from "react";
import { useAdminInspector } from "../../hooks/useAdminInspector";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  PackageSearch, 
  Receipt, 
  Users, 
  Activity, 
  Loader2,
  Wallet,
  Briefcase
} from "lucide-react";
import { format } from "date-fns";

interface AdminUserInspectorProps {
  userId: string;
  userName: string;
  shopName: string;
  onClose: () => void;
}

export function AdminUserInspector({ userId, userName, shopName, onClose }: AdminUserInspectorProps) {
  const { inventory, sales, debtors, transactions, metrics, isLoading, error } = useAdminInspector(userId);
  const [activeTab, setActiveTab] = useState<"inventory" | "sales" | "debtors" | "transactions">("inventory");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-200 flex items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 p-5 sm:p-6 flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="flex items-center gap-4 relative z-10 w-full">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 shrink-0">
                <span className="text-xl font-black text-white">{userName.charAt(0)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-white truncate pr-4">{userName}</h2>
                <p className="text-sm font-medium text-emerald-400 truncate flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {shopName || "N/A"}</p>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
              <p className="text-slate-500 font-medium animate-pulse">Running God-Mode Scan...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-rose-500" />
              </div>
              <p className="text-slate-800 font-bold mb-2">Failed to load user data</p>
              <p className="text-slate-500 text-sm max-w-sm">{error}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* Metrics Ribbon */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 border-b border-slate-200 shrink-0">
                <div className="bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Stock</p>
                  <p className="text-xl font-black text-slate-800">{metrics.totalInventoryUnits} <span className="text-xs text-slate-400 font-medium line-clamp-1">units</span></p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Stock Value</p>
                  <p className="text-xl font-black text-emerald-600 truncate">₦{metrics.totalInventoryValue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Sales Volume</p>
                  <p className="text-xl font-black text-blue-600 truncate">₦{metrics.totalSalesRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Active Debts</p>
                  <p className="text-xl font-black text-rose-500 truncate">₦{metrics.totalOutstandingDebt.toLocaleString()}</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200 bg-slate-50 shrink-0 px-2 sm:px-6">
                {[
                  { id: "inventory", label: "Inventory", icon: PackageSearch, count: inventory.length },
                  { id: "sales", label: "Sales Log", icon: Receipt, count: sales.length },
                  { id: "debtors", label: "Debtors", icon: Users, count: debtors.length },
                  { id: "transactions", label: "Activity", icon: Activity, count: transactions.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "inventory" | "sales" | "debtors" | "transactions")}
                    className={`flex items-center gap-2 px-4 py-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${
                      activeTab === tab.id
                        ? "border-emerald-500 text-emerald-600 bg-emerald-50/50"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    <span className={`ml-1.5 px-2 text-[10px] rounded-full ${activeTab === tab.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Data Viewport */}
              <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6">
                
                {/* INVENTORY TAB */}
                {activeTab === "inventory" && (
                  <div className="bg-white border text-sm border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {inventory.length === 0 ? <EmptyState icon={PackageSearch} message="No items in inventory" /> : (
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
                          <tr>
                            <th className="p-4">Item Name</th>
                            <th className="p-4 rounded-r-2xl sm:rounded-none">Price</th>
                            <th className="p-4 hidden sm:table-cell">Qty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {inventory.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="p-4 text-slate-800 font-medium">{item.productName || item.name || "—"}</td>
                              <td className="p-4 text-emerald-600">₦{(item.sellingPrice || item.price || 0).toLocaleString()}</td>
                              <td className="p-4 hidden sm:table-cell text-slate-500">{item.stockLevel ?? item.quantity ?? 0} units</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* SALES TAB */}
                {activeTab === "sales" && (
                  <div className="bg-white border text-sm border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {sales.length === 0 ? <EmptyState icon={Receipt} message="No sales logged" /> : (
                      <ul className="divide-y divide-slate-100">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {sales.map((sale: any) => (
                          <li key={sale.id} className="p-4 hover:bg-slate-50">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-slate-800">{sale.customerName || "Walk-in Customer"}</span>
                              <span className="font-black text-blue-600">₦{sale.totalAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                              <span className="text-slate-500 flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5"/> {sale.paymentMethod || "mixed"}</span>
                              <span className="text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{formatDate(sale.createdAt)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* DEBTORS TAB */}
                {activeTab === "debtors" && (
                  <div className="bg-white border text-sm border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {debtors.length === 0 ? <EmptyState icon={Users} message="No active debtors" /> : (
                      <ul className="divide-y divide-slate-100">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {debtors.map((debtor: any) => (
                          <li key={debtor.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-800">{debtor.name}</p>
                              <p className="text-xs text-slate-500 mt-1">{debtor.phone}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Owes</p>
                              <p className="font-black text-rose-500">₦{debtor.balanceOwed?.toLocaleString()}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* TRANSACTIONS / ACTIVITY TAB */}
                {activeTab === "transactions" && (
                  <div className="bg-white border text-sm border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {transactions.length === 0 ? <EmptyState icon={Activity} message="No activity recorded yet" /> : (
                      <ul className="divide-y divide-slate-100">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {transactions.map((tx: any) => {
                          const isPaid = tx.paymentStatus === 'paid';
                          const isPartial = tx.paymentStatus === 'partial';
                          return (
                          <li key={tx.id} className="p-4 hover:bg-slate-50">
                            <div className="flex justify-between items-start gap-3">
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 truncate">{tx.customerName || "Walk-in Customer"}</p>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                    {tx.paymentMethod || "mixed"}
                                  </span>
                                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                    isPaid ? 'bg-emerald-100 text-emerald-700' :
                                    isPartial ? 'bg-amber-100 text-amber-700' :
                                    'bg-rose-100 text-rose-700'
                                  }`}>
                                    {tx.paymentStatus || "unpaid"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-black text-blue-600">₦{(tx.totalAmount || 0).toLocaleString()}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{formatDate(tx.createdAt)}</p>
                              </div>
                            </div>
                            {isPartial && (
                              <div className="mt-2 flex items-center justify-between text-xs bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                                <span className="text-amber-700 font-medium">Paid: ₦{(tx.amountPaid || 0).toLocaleString()}</span>
                                <span className="text-rose-600 font-bold">Pending: ₦{((tx.totalAmount || 0) - (tx.amountPaid || 0)).toLocaleString()}</span>
                              </div>
                            )}
                          </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EmptyState({ icon: Icon, message }: { icon: any, message: string }) {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
        <Icon className="w-8 h-8 text-slate-300" />
      </div>
      <p className="text-slate-500 font-medium">{message}</p>
    </div>
  );
}

// Helper safely formats a timestamp, whether it's an object or primitive
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatDate(timestamp: any) {
  if (!timestamp) return "Unknown Date";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, "MMM dd, yyyy h:mm a");
  } catch {
    return "Invalid Date";
  }
}
