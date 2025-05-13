import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

// Common loading component to ensure consistency
const LoadingIndicator = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
    <div className="text-center">
      <div className="mb-4 size-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
    </div>
  </div>
);

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingIndicator />;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingIndicator />;
  }
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If not authenticated, render the public route
  return <Outlet />;
}; 