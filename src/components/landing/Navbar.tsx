import { Link, useLocation } from "react-router-dom";

export function LandingNavbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Left Side: Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-kudi-green focus-visible:ring-offset-2 rounded-lg"
          >
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-sm shadow-kudi-green/20 transition-transform duration-300 group-hover:scale-105 group-active:scale-95 bg-white">
              <img
                src="/assets/logo.webp"
                alt="KudiFlow Logo"
                className="h-full w-full object-contain p-1"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 transition-colors duration-300 group-hover:text-kudi-green">
              KudiFlow
            </span>
          </Link>

          {/* Right Side: Auth Buttons */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              to="/login"
              className={`text-sm font-semibold transition-colors duration-200 px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-md
                ${
                  location.pathname === "/login"
                    ? "text-kudi-green"
                    : "text-slate-500 hover:text-slate-900"
                }
              `}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-kudi-green px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white shadow-md shadow-kudi-green/20 transition-all duration-300 hover:translate-y-[-1px] hover:shadow-lg hover:shadow-kudi-green/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-kudi-green focus-visible:ring-offset-2 active:translate-y-[1px]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Create Free Shop
              </span>
              {/* Subtle hover overlay effect */}
              <div className="absolute inset-0 z-0 h-full w-full bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
