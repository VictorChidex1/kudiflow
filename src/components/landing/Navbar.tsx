import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LandingNavbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scroll Spy Logic
      const sections = ["features", "pricing", "testimonials"];
      const scrollPosition = window.scrollY + 100; // offset

      let currentActiveHash = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentActiveHash = `#${section}`;
            break;
          }
        }
      }
      setActiveHash(currentActiveHash);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // If the href is a hash link (like /#features)
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");

      // If we are already on the landing page, just scroll smoothly
      if (location.pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(targetId);

        if (element) {
          const navHeight = 80;
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - navHeight,
            behavior: "smooth",
          });
        }
      }
      // If we are NOT on the landing page, the normal <Link to="/#href"> behavior
      // will transition us to the landing page and the browser will jump to the hash.
    }

    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Docs", href: "/docs" },
  ];

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
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
            {navLinks.map((link) => {
              // Active check: if it's a hash link, check activeHash. If it's a route link, check location.pathname.
              let isActive = false;
              if (link.href.startsWith("/#")) {
                const hashOnly = link.href.replace("/", "");
                isActive = activeHash === hashOnly;
              } else {
                isActive = location.pathname === link.href;
              }
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleNavigation(e, link.href)}
                  className={`text-sm font-semibold transition-colors relative py-1 ${
                    isActive
                      ? "text-kudi-green"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-kudi-green rounded-full"
                    />
                  )}
                </Link>
              );
            })}
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            className="lg:hidden fixed inset-x-0 top-[64px] sm:top-[80px] h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] bg-white/95 backdrop-blur-2xl border-t border-slate-100 overflow-y-auto z-40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsMobileMenuOpen(false);
              }
            }}
          >
            <div className="flex flex-col px-4 pt-6 pb-12 space-y-8">
              {/* Mobile Nav Links */}
              <div className="flex flex-col space-y-4 px-2">
                {navLinks.map((link, i) => {
                  let isActive = false;
                  if (link.href.startsWith("/#")) {
                    const hashOnly = link.href.replace("/", "");
                    isActive = activeHash === hashOnly;
                  } else {
                    isActive = location.pathname === link.href;
                  }
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
                    >
                      <Link
                        to={link.href}
                        className={`text-2xl font-bold tracking-tight transition-colors duration-200 flex items-center gap-3 ${
                          isActive
                            ? "text-kudi-green"
                            : "text-slate-800 hover:text-kudi-green"
                        }`}
                        onClick={(e) => handleNavigation(e, link.href)}
                      >
                        {link.name}
                        {isActive && (
                          <div className="h-2 w-2 rounded-full bg-kudi-green shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.hr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="border-slate-200/60 mx-2"
              />

              {/* Mobile Auth Block Buttons */}
              <div className="flex flex-col space-y-4 px-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-kudi-green/20 text-lg font-bold text-white bg-kudi-green hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kudi-green transition-all transform active:scale-[0.98]"
                  >
                    Create Free Shop
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex justify-center py-4 px-4 border border-slate-300 rounded-2xl shadow-sm bg-white text-lg font-bold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kudi-green transition-all transform active:scale-[0.98]"
                  >
                    Sign In to Account
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
