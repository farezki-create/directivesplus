
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
  
  useEffect(() => {
    console.log("ProtectedRoute: isAuthenticated =", isAuthenticated, "isLoading =", isLoading);
  }, [isAuthenticated, isLoading]);

  // Use the auth context to check authentication state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-directiveplus-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the current path to redirect back after login
    console.log("Not authenticated, redirecting to auth from:", location.pathname);
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  console.log("Authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
