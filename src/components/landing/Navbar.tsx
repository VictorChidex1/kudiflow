import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function LandingNavbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close mobile menu if clicked outside of the navbar area entirely
      if (
        isMobileMenuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Future Navigation Links Array
  const navLinks = [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Testimonials", href: "#" },
  ];

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Left Side: Logo & Brand */}
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-kudi-green focus-visible:ring-offset-2 rounded-lg z-50"
          >
            <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 items-center justify-center transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
              <img
                src="/assets/logo.webp"
                alt="KudiFlow Logo"
                className="h-full w-full object-contain drop-shadow-sm"
              />
            </div>
            <span className="-ml-2 sm:-ml-3 lg:-ml-4 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 transition-colors duration-300 group-hover:text-kudi-green">
              KudiFlow
            </span>
          </Link>

          {/* Desktop Navigation Links (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Right Side: Auth Buttons (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-6">
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
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-kudi-green px-6 py-3 text-sm font-semibold text-white shadow-md shadow-kudi-green/20 transition-all duration-300 hover:translate-y-[-1px] hover:shadow-lg hover:shadow-kudi-green/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-kudi-green focus-visible:ring-offset-2 active:translate-y-[1px]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Create Free Shop
              </span>
              <div className="absolute inset-0 z-0 h-full w-full bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button (Hidden on Desktop) */}
          <div className="flex lg:hidden items-center z-50">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-kudi-green transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X
                  className="block h-7 w-7"
                  aria-hidden="true"
                  strokeWidth={2}
                />
              ) : (
                <Menu
                  className="block h-7 w-7"
                  aria-hidden="true"
                  strokeWidth={2.5}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[64px] sm:top-[80px] h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] bg-white/95 backdrop-blur-2xl transition-all duration-300 ease-in-out border-t border-slate-100 overflow-y-auto ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsMobileMenuOpen(false);
          }
        }}
      >
        <div className="flex flex-col px-4 pt-6 pb-12 space-y-8">
          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-4 px-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-bold tracking-tight text-slate-800 hover:text-kudi-green transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>

          <hr className="border-slate-200/60 mx-2" />

          {/* Mobile Auth Block Buttons */}
          <div className="flex flex-col space-y-4 px-2">
            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-kudi-green/20 text-lg font-bold text-white bg-kudi-green hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kudi-green transition-all"
            >
              Create Free Shop
            </Link>

            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex justify-center py-4 px-4 border border-slate-300 rounded-2xl shadow-sm bg-white text-lg font-bold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kudi-green transition-all"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
