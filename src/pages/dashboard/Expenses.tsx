import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Wallet,
  TrendingDown,
  Calendar,
  Trash2,
  FileText,
  CreditCard,
  Pencil,
} from "lucide-react";
import { useExpenses } from "../../hooks/useExpenses";
import type { ExpenseCategory, NewExpense, PaymentMethod } from "../../types/expenses";

export default function Expenses() {
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Miscellaneous");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const EXPENSE_CATEGORIES: ExpenseCategory[] = [
    "Salaries",
    "Utilities",
    "Rent",
    "Logistics",
    "Damages",
    "Miscellaneous",
  ];

  // Filtering & Stats
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = exp.date.startsWith(selectedMonth);
      return matchesSearch && matchesMonth;
    });
  }, [expenses, searchTerm, selectedMonth]);

  const totalSpentThisMonth = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const topCategory = useMemo(() => {
    if (filteredExpenses.length === 0) return "None";
    const categoryTotals = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );
  }, [filteredExpenses]);

  const handleNumberInput = (value: string) => {
    const numericString = value.replace(/[^0-9]/g, "");
    setAmount(numericString ? Number(numericString).toLocaleString("en-US") : "");
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingExpenseId(null);
    setAmount("");
    setDescription("");
    setCategory("Miscellaneous");
    setDate(new Date().toISOString().split("T")[0]);
    setPaymentMethod("cash");
  };

  const handleEditClick = (exp: typeof expenses[0]) => {
    setEditingExpenseId(exp.id!);
    setAmount(exp.amount.toLocaleString("en-US"));
    setCategory(exp.category);
    setDescription(exp.description);
    setDate(exp.date);
    setPaymentMethod(exp.paymentMethod);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount.replace(/\D/g, ""));
    
    if (!numericAmount || !description.trim()) return;

    const newExpense: NewExpense = {
      amount: numericAmount,
      category,
      description: description.trim(),
      date,
      paymentMethod,
    };

    let res;
    if (editingExpenseId) {
      res = await updateExpense(editingExpenseId, newExpense);
    } else {
      res = await addExpense(newExpense);
    }

    if (res.success) {
      resetForm();
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Expenses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your outflows to calculate true net profit.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-kudi-green text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-kudi-green/90 transition-all shadow-md shadow-kudi-green/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Record Expense
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Total Spent (Selected Month)
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              ₦{totalSpentThisMonth.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Highest Outflow Category
            </p>
            <h3 className="text-2xl font-bold text-slate-900 truncate">
              {topCategory}
            </h3>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kudi-green outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kudi-green outline-none font-medium text-slate-700"
          />
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading expenses...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">
              No expenses found
            </h3>
            <p className="text-slate-500">
              You haven't recorded any expenses for this month.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(exp.date).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900 mb-0.5">
                        {exp.description}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        <span className="capitalize">{exp.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold text-rose-600">
                        - ₦{exp.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(exp)}
                          className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit expense"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this expense?")) {
                              if (exp.id) deleteExpense(exp.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="bg-rose-50 text-rose-500 p-2 rounded-xl">
                  {editingExpenseId ? <Pencil className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </span>
                {editingExpenseId ? "Edit Expense" : "Record Expense"}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Amount (₦) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={amount}
                    onChange={(e) => handleNumberInput(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-kudi-green outline-none font-bold text-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-kudi-green outline-none"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Diesel for generator"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-kudi-green outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-kudi-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-kudi-green outline-none"
                    >
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                      <option value="pos">POS</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-kudi-green text-white rounded-xl font-bold hover:bg-kudi-green/90 transition-colors shadow-md shadow-kudi-green/20"
                >
                  {editingExpenseId ? "Save Changes" : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
