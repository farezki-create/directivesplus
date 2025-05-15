
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    console.log("ProtectedRoute: isAuthenticated =", isAuthenticated, "isLoading =", isLoading, "requiredRole =", requiredRole);
  }, [isAuthenticated, isLoading, requiredRole]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-directiveplus-600" />
      </div>
    );
  }

  // Prevent navigation loop by checking if we're already redirecting
  if (!isAuthenticated && !isRedirecting) {
    // Store the current path to redirect back after login
    console.log("Not authenticated, redirecting to auth from:", location.pathname);
    setIsRedirecting(true);
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Check for role-based access if requiredRole is provided
  if (requiredRole && profile) {
    const userRoles = profile.roles || [];
    const hasRequiredRole = Array.isArray(userRoles) 
      ? userRoles.includes(requiredRole)
      : userRoles === requiredRole;
    
    if (!hasRequiredRole && !isRedirecting) {
      console.log(`User does not have required role: ${requiredRole}`);
      setIsRedirecting(true);
      return <Navigate to="/dashboard" state={{ from: location.pathname }} replace />;
    }
  }

  console.log("Authenticated, rendering protected content");
  return <>{children}</>;
};

export { ProtectedRoute };
export default ProtectedRoute;
