
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Log authentication state for debugging
  useEffect(() => {
    if (!isLoading) {
      console.log(
        isAuthenticated 
          ? "Protected route: User authenticated, rendering content" 
          : "Protected route: User not authenticated, will redirect"
      );
    }
  }, [isAuthenticated, isLoading]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-directiveplus-600" />
      </div>
    );
  }

  // If not authenticated, redirect to auth page with current location
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/auth" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // User is authenticated, render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
