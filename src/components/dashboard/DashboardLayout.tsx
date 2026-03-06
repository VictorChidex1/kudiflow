import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { TopHeader } from "./TopHeader";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans selection:bg-emerald-200">
      {/* 1. Desktop Sidebar (Hidden on mobile) */}
      <Sidebar />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        {/* 2.5 Top Header */}
        <TopHeader />

        {/* Scrollable interior */}
        <div className="flex-1 overflow-y-auto w-full pb-20 lg:pb-0 scroll-smooth">
          <AnimatePresence mode="wait">
            {/* 3. The actual page content injected here based on Route */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 lg:py-10"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 4. Mobile Bottom Nav (Hidden on desktop) */}
      <MobileNav />
    </div>
  );
}
