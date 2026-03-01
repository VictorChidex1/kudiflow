import { useState, useEffect } from "react";
import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { DocsSidebar, type DocCategory } from "../components/docs/DocsSidebar";
import { DocsContent } from "../components/docs/DocsContent";
import { Menu } from "lucide-react";

export default function DocsPage() {
  const [activeCategory, setActiveCategory] =
    useState<DocCategory>("getting-started");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <LandingNavbar />

      {/* Docs Mobile Header (shows only on small screens below the main navbar) */}
      <div className="lg:hidden sticky top-[64px] sm:top-[80px] z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
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
  );
}
