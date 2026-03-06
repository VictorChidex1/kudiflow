import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Show a sleek loading state while checking Firebase Auth status
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-kudi-bg flex flex-col items-center justify-center">
        <div className="relative flex h-16 w-16 items-center justify-center animate-pulse">
          <img
            src="/assets/logo.webp"
            alt="Loading KudiFlow..."
            className="h-full w-full object-contain drop-shadow-sm"
          />
        </div>
        <p className="mt-4 text-emerald-600 font-semibold tracking-wide animate-pulse">
          Loading your shop...
        </p>
      </div>
    );
  }

  // If not logged in, redirect to login page but save the path they were trying to visit
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children (the dashboard components)
  return <>{children}</>;
}
