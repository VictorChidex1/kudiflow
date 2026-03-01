import { useState, useEffect } from "react";
import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { DocsSidebar, type DocCategory } from "../components/docs/DocsSidebar";
import { DocsContent } from "../components/docs/DocsContent";
import { Menu, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function DocsPage() {
  const [activeCategory, setActiveCategory] =
    useState<DocCategory>("getting-started");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Ambient Glowing Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-kudi-green/10 rounded-full mix-blend-multiply blur-[120px] animate-blob" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full mix-blend-multiply blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 w-full flex flex-col">
        <LandingNavbar />

        {/* Docs Mobile Header (shows only on small screens below the main navbar) */}
        <div className="lg:hidden sticky top-[64px] sm:top-[80px] z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-kudi-green"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-800 tracking-tight">
              Help Center
            </span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
        </div>

        <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto relative content-start items-start justify-start">
          <DocsSidebar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            isMobileMenuOpen={isMobileSidebarOpen}
            setIsMobileMenuOpen={setIsMobileSidebarOpen}
          />
          <DocsContent activeCategory={activeCategory} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
