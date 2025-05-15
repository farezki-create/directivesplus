
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import AuthCard from "@/components/auth/AuthCard";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const redirectAttempted = useRef(false);
  
  // Get the redirect path from location state or default to /rediger
  const from = location.state?.from || "/rediger";

  // Redirect if already authenticated - only once to avoid loops
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectAttempted.current) {
      console.log("Auth page: Already authenticated, redirecting to:", from);
      redirectAttempted.current = true;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const handleLoginSuccess = () => {
    redirectAttempted.current = true;
    navigate(from, { replace: true });
  };

  const handleSignupSuccess = () => {
    setTimeout(() => {
      redirectAttempted.current = true;
      navigate(from, { replace: true });
    }, 1500);
  };

  // Show loading only during initial auth check
  if (isLoading && !redirectAttempted.current) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Don't render auth page if redirecting after authentication
  if (isAuthenticated && redirectAttempted.current) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="grid h-screen place-items-center">
        <AuthCard 
          redirectPath={from} 
          onLoginSuccess={handleLoginSuccess}
          onSignupSuccess={handleSignupSuccess}
        />
      </div>
    </>
  );
};

export default Auth;
