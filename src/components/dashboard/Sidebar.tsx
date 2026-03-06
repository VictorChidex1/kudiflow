import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PackageSearch,
  Receipt,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    {
      name: "Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      name: "Inventory",
      icon: <PackageSearch className="w-5 h-5" />,
      path: "/dashboard/inventory",
    },
    {
      name: "Sales Ledger",
      icon: <Receipt className="w-5 h-5" />,
      path: "/dashboard/sales",
    },
    {
      name: "Debtors",
      icon: <Users className="w-5 h-5" />,
      path: "/dashboard/debtors",
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-slate-900 border-r border-slate-800 sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <img
              src="/assets/logo.webp"
              alt="KudiFlow"
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            KudiFlow
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/dashboard"} // Exact match for Overview
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800/60 space-y-2">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              isActive
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`
          }
        >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
