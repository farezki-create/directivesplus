
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useAuthRedirection = (accessToken?: string) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectInProgress, setRedirectInProgress] = useState(false);

  // Redirection si déjà authentifié
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectInProgress && !accessToken) {
      const from = location.state?.from || "/rediger";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state, redirectInProgress, accessToken]);

  return {
    redirectInProgress,
    setRedirectInProgress,
    redirectPath: location.state?.from || "/rediger"
  };
};
