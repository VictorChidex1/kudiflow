import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

export function TopHeader() {
  const location = useLocation();
  const user = auth.currentUser;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Generate dynamic breadcrumbs based on URL path
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const breadcrumbs = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const name = snippet.charAt(0).toUpperCase() + snippet.slice(1);
    const isLast = index === pathSnippets.length - 1;

    return { name, url, isLast };
  });

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8">
      {/* Left Axis: Breadcrumbs */}
      <nav className="flex items-center text-sm font-medium text-slate-500">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.url} className="flex items-center">
            {index > 0 && <span className="mx-2 text-slate-300">/</span>}
            {crumb.isLast ? (
              <span className="text-slate-900 font-semibold">{crumb.name}</span>
            ) : (
              <Link
                to={crumb.url}
                className="hover:text-emerald-600 transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Right Axis: Notifications & Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 pr-2 rounded-full border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              {user?.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : "V"}
            </div>
            <div className="hidden sm:flex flex-col items-start mr-1">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                {user?.displayName || "Vendor"}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.displayName || "Vendor"}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {user?.email || "No email"}
                </p>
              </div>

              <div className="p-2 space-y-1">
                <Link
                  to="/dashboard/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Link>
              </div>

              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
