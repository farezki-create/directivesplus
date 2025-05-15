
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionnaireLayoutProps {
  children: ReactNode;
  title: string;
}

const QuestionnaireLayout = ({ children, title }: QuestionnaireLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're already inside a ProtectedRoute component
  // This prevents double auth checks and redirect loops
  const isWrappedInProtectedRoute = location.pathname === "/avis-general" || 
                                   location.pathname === "/maintien-vie" || 
                                   location.pathname === "/maladie-avancee" ||
                                   location.pathname === "/gouts-peurs" ||
                                   location.pathname === "/personne-confiance" ||
                                   location.pathname === "/exemples-phrases";

  // Debug the authentication state
  useEffect(() => {
    console.log("QuestionnaireLayout - route:", location.pathname);
    console.log("QuestionnaireLayout - isWrappedInProtectedRoute:", isWrappedInProtectedRoute);
    console.log("QuestionnaireLayout - isAuthenticated:", isAuthenticated, "isLoading:", isLoading);
  }, [isAuthenticated, isLoading, location.pathname, isWrappedInProtectedRoute]);
  
  // Move useEffect hook to the top level - must be called unconditionally
  useEffect(() => {
    // Only redirect if not wrapped in ProtectedRoute and authentication state is loaded and user is not authenticated
    // This prevents redirect loops with ProtectedRoute components
    if (!isWrappedInProtectedRoute && !isLoading && !isAuthenticated) {
      console.log("QuestionnaireLayout: Redirecting to auth page - user not authenticated");
      navigate("/auth", { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, isWrappedInProtectedRoute]);

  // Render a loading skeleton during the authentication check
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-10 w-2/3 mb-6" />
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-20 w-2/3" />
          </div>
        </main>
        
        <footer className="bg-white py-6 border-t">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    );
  }

  // When wrapped in ProtectedRoute, don't check authentication status again
  if (!isWrappedInProtectedRoute && !isAuthenticated) {
    console.log("QuestionnaireLayout: Not rendering content - user not authenticated");
    return null;
  }

  console.log("QuestionnaireLayout: Rendering content");
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-directiveplus-800 mb-6">
            {title}
          </h1>
          
          {children}
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default QuestionnaireLayout;
