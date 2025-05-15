
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Move useEffect hook to the top level - must be called unconditionally
  useEffect(() => {
    // Only redirect if authentication state is loaded and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("QuestionnaireLayout: Redirecting to auth page - user not authenticated");
      navigate("/auth", { state: { from: window.location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  // Important: Only render page content if authenticated
  // This prevents flash of content before redirect
  if (!isAuthenticated) {
    console.log("QuestionnaireLayout: Not rendering content - user not authenticated");
    return null;
  }

  console.log("QuestionnaireLayout: Rendering authenticated content");
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
