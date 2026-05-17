import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouteScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If the URL contains a hash (e.g. /#features), let useHashScroll
    // handle the scroll — do NOT reset to the top or we'll cancel it.
    if (hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

