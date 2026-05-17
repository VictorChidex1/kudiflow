import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NAV_HEIGHT = 80; // px — matches the sticky navbar height

/**
 * useHashScroll
 *
 * Handles smooth scrolling to anchor links (e.g., /#pricing).
 * Now that the Landing Page is statically rendered (no Lazy loading),
 * the DOM elements are immediately available.
 */
export function useHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const targetId = hash.replace("#", "");
    
    // We poll briefly because even with static imports, React might take a tick
    // to attach the elements to the DOM when navigating from another route.
    let attempts = 0;
    const maxAttempts = 20;

    const tryScroll = () => {
      const element = document.getElementById(targetId);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        requestAnimationFrame(tryScroll);
      }
    };

    // Start looking for the element on the next frame
    requestAnimationFrame(tryScroll);

  }, [pathname, hash]);
}
