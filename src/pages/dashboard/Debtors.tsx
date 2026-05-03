import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  CreditCard,
  Clock,
  Phone,
  HandCoins,
  CheckCircle2,
} from "lucide-react";
import { useDebtors, useRepaymentHistory } from "../../hooks/useDebtors";
import type { Debtor } from "../../types/debtors";
import { format, isBefore, addDays, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../../lib/firebase";
import { Timestamp } from "firebase/firestore";
import { WhatsAppReminderButton } from "../../components/debtors/WhatsAppReminderButton";

export default function Debtors() {
  const { debtors, isLoading, addDebtor, logRepayment } = useDebtors();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"highest" | "oldest" | "dueSoon">("highest");
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);

  const { repayments, isLoadingHistory } = useRepaymentHistory(selectedDebtor?.id);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [newDebtorPayload, setNewDebtorPayload] = useState({
    name: "",
    phone: "",
    initialBalance: "",
    dueDate: "",
    creditLimit: "",
    notes: "",
  });
  const [repaymentPayload, setRepaymentPayload] = useState({
    amount: "",
    method: "cash" as "cash" | "transfer" | "pos",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrencyInput = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return Number(numericValue).toLocaleString("en-US");
  };

  // Analytics Math
  const totalOutstanding = debtors.reduce((sum, d) => sum + d.balanceOwed, 0);
  const activeDebtorsCount = debtors.filter((d) => d.balanceOwed > 0).length;

  // Progress Math
  const totalPaid = repayments.reduce((sum, r) => sum + r.amountCleared, 0);
  const totalEverOwed = (selectedDebtor?.balanceOwed || 0) + totalPaid;
  const progressPercent = totalEverOwed > 0 ? Math.round((totalPaid / totalEverOwed) * 100) : 0;

  const filteredDebtors = useMemo(() => {
    let filtered = debtors.filter(
      (d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.phone.includes(searchQuery)
    );

    if (sortBy === "highest") {
      filtered = filtered.sort((a, b) => b.balanceOwed - a.balanceOwed);
    } else if (sortBy === "oldest") {
      filtered = filtered.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dateA = a.createdAt && (a.createdAt as any).toDate ? (a.createdAt as any).toDate().getTime() : 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dateB = b.createdAt && (b.createdAt as any).toDate ? (b.createdAt as any).toDate().getTime() : 0;
        return dateA - dateB;
      });
    } else if (sortBy === "dueSoon") {
      filtered = filtered.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dateA = a.dueDate && (a.dueDate as any).toDate ? (a.dueDate as any).toDate().getTime() : Infinity;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dateB = b.dueDate && (b.dueDate as any).toDate ? (b.dueDate as any).toDate().getTime() : Infinity;
        return dateA - dateB;
      });
    }
    return filtered;
  }, [debtors, searchQuery, sortBy]);

  const handleAddDebtorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebtorPayload.name || !newDebtorPayload.initialBalance) return;

    setIsSubmitting(true);
    
    let dueTimestamp = undefined;
    if (newDebtorPayload.dueDate) {
      dueTimestamp = Timestamp.fromDate(new Date(newDebtorPayload.dueDate));
    }

    const success = await addDebtor({
      name: newDebtorPayload.name,
      phone: newDebtorPayload.phone,
      balanceOwed: Number(newDebtorPayload.initialBalance.replace(/\D/g, "")),
      dueDate: dueTimestamp,
      creditLimit: newDebtorPayload.creditLimit ? Number(newDebtorPayload.creditLimit.replace(/\D/g, "")) : undefined,
      notes: newDebtorPayload.notes || undefined,
    });

    if (success.success) {
      setIsAddModalOpen(false);
      setNewDebtorPayload({ name: "", phone: "", initialBalance: "", dueDate: "", creditLimit: "", notes: "" });
    }
    setIsSubmitting(false);
  };

  const handleRepaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebtor || !repaymentPayload.amount) return;

    setIsSubmitting(true);
    const amountNum = Number(repaymentPayload.amount.replace(/\D/g, ""));

    // Prevent overpaying
    const finalAmount =
      amountNum > selectedDebtor.balanceOwed
        ? selectedDebtor.balanceOwed
        : amountNum;

    const success = await logRepayment(
      selectedDebtor.id!,
      finalAmount,
      repaymentPayload.method
    );

    if (success.success) {
      setIsRepayModalOpen(false);
      setRepaymentPayload({ amount: "", method: "cash" });
      // Update local selected profile optimistically for instant UI feel
      setSelectedDebtor((prev) =>
        prev ? { ...prev, balanceOwed: prev.balanceOwed - finalAmount } : null
      );
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-8rem)] pb-10 lg:pb-0">
      {/* LEFT PANEL: Debtors Roster */}
      <div className="w-full lg:w-[450px] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden shrink-0 h-[450px] lg:h-auto">
        {/* Header & Stats */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Debtors
            </h1>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              title="Add New Customer Profile"
              className="bg-emerald-100 text-emerald-700 p-2 rounded-xl hover:bg-emerald-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Total Outstanding
              </p>
              <p className="text-xl font-black text-rose-500">
                ₦{totalOutstanding.toLocaleString()}
              </p>
            </div>
            <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Active Accounts
              </p>
              <p className="text-xl font-black text-slate-800">
                {activeDebtorsCount}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="p-4 border-b border-slate-100 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm text-slate-700 placeholder-slate-400"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-32 py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-xs text-slate-600 appearance-none text-center cursor-pointer"
          >
            <option value="highest">Highest Debt</option>
            <option value="oldest">Oldest First</option>
            <option value="dueSoon">Due Soonest</option>
          </select>
        </div>

        {/* Roster List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Loading ledger...</p>
            </div>
          ) : filteredDebtors.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700 text-lg">
                Clean Ledger!
              </p>
              <p className="text-sm">
                Nobody currently owes you money, or no matches found.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredDebtors.map((debtor) => (
                <button
                  key={debtor.id}
                  onClick={() => setSelectedDebtor(debtor)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border border-transparent ${
                    selectedDebtor?.id === debtor.id
                      ? "bg-emerald-50 border-emerald-100 shadow-sm"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-bold text-base ${
                            selectedDebtor?.id === debtor.id
                              ? "text-emerald-900"
                              : "text-slate-800"
                          }`}
                        >
                          {debtor.name}
                        </h3>
                        {/* Debt Aging Badge Logic */}
                        {debtor.dueDate && (debtor.dueDate as any).toDate && debtor.balanceOwed > 0 && (() => {
                          const dueD = (debtor.dueDate as any).toDate();
                          const today = startOfDay(new Date());
                          if (isBefore(dueD, today)) {
                            return <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_0_2px_rgba(244,63,94,0.2)]" title="Overdue" />;
                          } else if (isBefore(dueD, addDays(today, 3))) {
                            return <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_0_2px_rgba(251,191,36,0.2)]" title="Due Soon" />;
                          }
                          return <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(52,211,153,0.2)]" title="Safe" />;
                        })()}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" />{" "}
                        {debtor.phone || "No phone"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-black tracking-tight ${
                          debtor.balanceOwed > 0
                            ? "text-rose-500"
                            : "text-emerald-500"
                        }`}
                      >
                        ₦{debtor.balanceOwed.toLocaleString()}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">
                        Owed
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Analytics & Actions */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative min-h-[500px] lg:min-h-0">
        {!selectedDebtor ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
              <CreditCard className="w-10 h-10 text-emerald-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
              Select a Customer Profile
            </h2>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed mb-6">
              Choose a debtor from the list to view their deep repayment
              history, update their outstanding balance, or clear their debt
              completely.
            </p>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-medium text-sm">or</span>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-50 transition-colors border border-emerald-200 shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Debtor Manually
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Profile Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-900 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5 sm:gap-6">
                <div className="flex items-start gap-4 sm:gap-5 min-w-0 flex-1">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shrink-0 mt-1">
                    <span className="text-2xl font-black text-white">
                      {selectedDebtor.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate flex items-center gap-2">
                      {selectedDebtor.name}
                      {selectedDebtor.dueDate && (selectedDebtor.dueDate as any).toDate && (
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${(() => {
                          const dueD = (selectedDebtor.dueDate as any).toDate();
                          const today = startOfDay(new Date());
                          if (isBefore(dueD, today)) return "bg-rose-500/20 text-rose-300 border-rose-500/30";
                          if (isBefore(dueD, addDays(today, 3))) return "bg-amber-400/20 text-amber-300 border-amber-400/30";
                          return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
                        })()}`}>
                          Due: {format((selectedDebtor.dueDate as any).toDate(), "MMM d, yyyy")}
                        </span>
                      )}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-1.5">
                      <a
                        href={`tel:${selectedDebtor.phone}`}
                        className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 min-w-0"
                      >
                        <Phone className="w-4 h-4 shrink-0" /> <span className="truncate">{selectedDebtor.phone}</span>
                      </a>
                      {selectedDebtor.creditLimit && (
                        <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                          Limit: ₦{selectedDebtor.creditLimit.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {selectedDebtor.notes && (
                      <div className="mt-3 bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                        <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Notes / Guarantor</p>
                        <p className="text-sm text-slate-300 italic">{selectedDebtor.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-4 sm:p-5 w-full sm:w-auto text-left sm:text-right flex flex-col justify-center shadow-inner min-w-0 shrink-0">
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 sm:mb-1.5">
                    Total Balance Owed
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-rose-400 tracking-tight break-all sm:break-normal truncate">
                    ₦{selectedDebtor.balanceOwed.toLocaleString()}
                  </p>
                  
                  {/* Progress Bar */}
                  {totalEverOwed > 0 && (
                    <div className="mt-4 w-full">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold uppercase text-emerald-400">Recovered</span>
                        <span className="text-xs font-black text-white">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-3 sm:gap-0">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 px-2 text-sm sm:text-base">
                <Clock className="w-4 h-4 text-emerald-500" /> Payment History
              </h3>
              {selectedDebtor.balanceOwed > 0 && (
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <WhatsAppReminderButton
                    debtorName={selectedDebtor.name}
                    debtorPhone={selectedDebtor.phone}
                    balanceOwed={selectedDebtor.balanceOwed}
                    shopName={auth.currentUser?.displayName || undefined}
                  />
                  <button
                    onClick={() => setIsRepayModalOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500 text-white px-5 py-2.5 w-full sm:w-auto rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                  >
                    <HandCoins className="w-4 h-4" /> Log Repayment
                  </button>
                </div>
              )}
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {isLoadingHistory ? (
                <div className="text-center p-12 flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-slate-400">Loading history...</p>
                </div>
              ) : repayments.length === 0 ? (
                <div className="text-center p-12 mt-4">
                  <p className="text-slate-400 text-sm font-medium">
                    No payments logged yet. Select 'Log Repayment' to start recording transactions.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[19px] before:w-0.5 before:bg-slate-200">
                  {repayments.map((repayment) => (
                    <div key={repayment.id} className="relative pl-12 pb-2">
                      <div className="absolute left-0 top-1.5 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm z-10">
                        {repayment.paymentMethod === "cash" && <HandCoins className="w-4 h-4 text-emerald-500" />}
                        {repayment.paymentMethod === "transfer" && <CreditCard className="w-4 h-4 text-emerald-500" />}
                        {repayment.paymentMethod === "pos" && <CreditCard className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-emerald-100">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-black text-slate-800 text-lg tracking-tight">
                            ₦{repayment.amountCleared.toLocaleString()}
                          </p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                            {repayment.paymentMethod}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(repayment.createdAt as any)?.toDate ? format((repayment.createdAt as any).toDate(), "MMM d, yyyy 'at' h:mm a") : "Just now"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ADD DEBTOR MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">
                  Add Customer Profile
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Create a new ledger for someone who owes you money.
                </p>
              </div>

              <form onSubmit={handleAddDebtorSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDebtorPayload.name}
                    onChange={(e) =>
                      setNewDebtorPayload((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900"
                    placeholder="e.g. Ebuka Logistics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newDebtorPayload.phone}
                    onChange={(e) =>
                      setNewDebtorPayload((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900"
                    placeholder="e.g. 08012345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Initial Debt Balance (₦) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newDebtorPayload.initialBalance}
                    onChange={(e) =>
                      setNewDebtorPayload((prev) => ({
                        ...prev,
                        initialBalance: formatCurrencyInput(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-bold text-rose-500 text-lg placeholder-slate-300"
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newDebtorPayload.dueDate}
                      onChange={(e) =>
                        setNewDebtorPayload((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Credit Limit (₦)
                    </label>
                    <input
                      type="tel"
                      value={newDebtorPayload.creditLimit}
                      onChange={(e) =>
                        setNewDebtorPayload((prev) => ({
                          ...prev,
                          creditLimit: formatCurrencyInput(e.target.value),
                        }))
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900 placeholder-slate-300"
                      placeholder="e.g. 50,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Notes / Guarantor Details
                  </label>
                  <textarea
                    value={newDebtorPayload.notes}
                    onChange={(e) =>
                      setNewDebtorPayload((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900 resize-none"
                    placeholder="e.g. Brought broken phone as collateral"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating..." : "Save Customer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REPAYMENT MODAL */}
      <AnimatePresence>
        {isRepayModalOpen && selectedDebtor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRepayModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">
                  Log Repayment
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Record a payment from{" "}
                  <span className="font-bold text-emerald-600">
                    {selectedDebtor.name}
                  </span>
                </p>
              </div>

              <form onSubmit={handleRepaymentSubmit} className="p-6 space-y-5">
                <div>
                  <label className="flex text-sm font-bold text-slate-700 mb-1.5 justify-between">
                    <span>Amount Repaid (₦) *</span>
                    <button
                      type="button"
                      onClick={() =>
                        setRepaymentPayload((p) => ({
                          ...p,
                          amount: selectedDebtor.balanceOwed.toLocaleString("en-US"),
                        }))
                      }
                      className="text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      Clear All
                    </button>
                  </label>
                  <input
                    type="tel"
                    required
                    value={repaymentPayload.amount}
                    onChange={(e) =>
                      setRepaymentPayload((prev) => ({
                        ...prev,
                        amount: formatCurrencyInput(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-emerald-600 text-lg placeholder-slate-300"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["cash", "transfer", "pos"] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          setRepaymentPayload((prev) => ({ ...prev, method }))
                        }
                        className={`py-3 rounded-xl border font-bold text-sm capitalize transition-all ${
                          repaymentPayload.method === method
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRepayModalOpen(false)}
                    className="flex-1 py-3.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Payment"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
