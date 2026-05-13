import { useState, useEffect, useRef, Suspense } from "react";
import type { ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export function LazySection({
  children,
  fallback,
  threshold = 0.01,
  rootMargin = "200px",
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

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
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const displayFallback = fallback || <div className="min-h-[300px] w-full" />;

  return (
    <div ref={sectionRef} className="w-full">
      {isVisible ? (
        <Suspense fallback={displayFallback}>
          {children}
        </Suspense>
      ) : (
        displayFallback
      )}
    </div>
  );
}
