import { useState, useEffect, useRef, Suspense } from "react";
import type { ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  id?: string;
}

export function LazySection({
  children,
  fallback,
  threshold = 0.01,
  rootMargin = "100px",
  id,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Listen for the global hash-navigation event fired by useHashScroll.
  // When a user navigates to /#section from another page, we immediately
  // render ALL sections so their real heights are known before the
  // scroll position is calculated — preventing the "wrong section" bug.
  useEffect(() => {
    const handleForceReveal = () => setIsVisible(true);
    window.addEventListener("kudiflow:force-reveal", handleForceReveal);
    return () =>
      window.removeEventListener("kudiflow:force-reveal", handleForceReveal);
  }, []);

  // Normal IntersectionObserver for organic scrolling
  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    let rafId: number;
    const setup = () => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold, rootMargin }
      );

      const currentRef = sectionRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) observer.unobserve(currentRef);
        observer.disconnect();
      };
    };

    let cleanup: (() => void) | undefined;
    rafId = requestAnimationFrame(() => {
      cleanup = setup();
    });

    return () => {
      cancelAnimationFrame(rafId);
      cleanup?.();
    };
  }, [threshold, rootMargin]);

  const displayFallback = fallback || <div className="min-h-[300px] w-full" />;

  return (
    <div ref={sectionRef} id={id} className="w-full">
      {isVisible ? (
        <Suspense fallback={displayFallback}>{children}</Suspense>
      ) : (
        displayFallback
      )}
    </div>
  );
}
