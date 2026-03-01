import {
  BookOpen,
  ShoppingBag,
  CreditCard,
  Users,
  ShieldCheck,
  WifiOff,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export type DocCategory =
  | "getting-started"
  | "daily-sales"
  | "inventory"
  | "debtors"
  | "offline"
  | "security";

interface DocsSidebarProps {
  activeCategory: DocCategory;
  onSelectCategory: (category: DocCategory) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const categories: {
  id: DocCategory;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "getting-started", label: "Getting Started", icon: BookOpen },
  { id: "daily-sales", label: "Recording Sales", icon: CreditCard },
  { id: "inventory", label: "Manage Inventory", icon: ShoppingBag },
  { id: "debtors", label: "Collect Debts", icon: Users },
  { id: "offline", label: "Offline Mode", icon: WifiOff },
  { id: "security", label: "Account Security", icon: ShieldCheck },
];

export function DocsSidebar({
  activeCategory,
  onSelectCategory,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: DocsSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
        fixed lg:sticky top-[64px] sm:top-[80px] left-0 z-40
        w-72 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] 
        bg-white border-r border-slate-200/60
        overflow-y-auto transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="p-6">
          {/* Back to Home Button (Merchants' Lifeline) */}
          <Link
            to="/"
            className="group flex items-center gap-2 mb-10 w-fit text-slate-500 hover:text-slate-900 transition-colors duration-200"
          >
            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm group-hover:border-slate-300 group-hover:-translate-x-1 group-hover:shadow-md transition-all duration-300 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Back to Home</span>
          </Link>

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Help Center Guides
          </h3>

          <nav className="space-y-1">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 relative overflow-hidden group
                    ${
                      isActive
                        ? "bg-emerald-50 text-kudi-green shadow-inner border border-emerald-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                    }
                  `}
                >
                  {/* Subtle active state left-border indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-kudi-green rounded-r-full" />
                  )}

                  <Icon
                    className={`w-5 h-5 transition-colors duration-300 z-10 ${
                      isActive
                        ? "text-kudi-green"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span className="z-10 relative">{cat.label}</span>
                </motion.button>
              );
            })}
          </nav>

          <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-2">Still stuck?</h4>
            <p className="text-sm text-slate-500 mb-4">
              Our support team is ready to help you on WhatsApp.
            </p>
            <a
              href="https://wa.me/2340000000000"
              className="block w-full text-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Chat with Support
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
