import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-3 rounded-full bg-kudi-green text-white shadow-xl shadow-slate-900/20 hover:bg-kudi-dark focus:outline-none focus:ring-2 focus:ring-kudi-green focus:ring-offset-2 transition-colors duration-300 group"
        >
          <ChevronUp
            className="h-6 w-6 transform group-hover:-translate-y-0.5 transition-transform duration-300"
            strokeWidth={2.5}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
