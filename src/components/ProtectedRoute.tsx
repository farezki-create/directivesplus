
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Add console logs to help debug the authentication flow
        console.log("Checking authentication status...");
        const { data: { session } } = await supabase.auth.getSession();
        const authenticated = !!session;
        console.log("Authentication result:", authenticated);
        
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
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
