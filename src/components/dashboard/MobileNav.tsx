import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PackageSearch,
  Receipt,
  Users,
  Settings,
} from "lucide-react";

export function MobileNav() {
  const navItems = [
    {
      name: "Overview",
      icon: <LayoutDashboard className="w-5 h-5 mb-1" />,
      path: "/dashboard",
    },
    {
      name: "Inventory",
      icon: <PackageSearch className="w-5 h-5 mb-1" />,
      path: "/dashboard/inventory",
    },
    {
      name: "Sales",
      icon: <Receipt className="w-5 h-5 mb-1" />,
      path: "/dashboard/sales",
    },
    {
      name: "Debtors",
      icon: <Users className="w-5 h-5 mb-1" />,
      path: "/dashboard/debtors",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5 mb-1" />,
      path: "/dashboard/settings",
    },
  ];

  return (
    <nav className="fixed lg:hidden bottom-0 left-0 right-0 h-[68px] bg-white border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50 px-2 sm:px-6 safe-area-bottom pb-env">
      <div className="h-full max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/dashboard"} // exact match for home
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full px-1 py-1 transition-all duration-300 relative ${
                isActive
                  ? "text-emerald-600 font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`transition-transform duration-300 ${
                    isActive ? "-translate-y-1 scale-110 drop-shadow-sm" : ""
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[10px] sm:text-xs text-center transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-80"
                  }`}
                >
                  {item.name}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
