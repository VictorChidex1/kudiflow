import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { PageLoader } from "../ui/PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  // If AuthContext is still fetching from Firebase, show the standard app loader
  // This prevents the jarring "double loader" effect by unifying the visual state
  if (isAuthLoading) {
    return <PageLoader />;
  }

  // If not logged in, redirect to login page but save the path they were trying to visit
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children (the dashboard components)
  return <>{children}</>;
}

