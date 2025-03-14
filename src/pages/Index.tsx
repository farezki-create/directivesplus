
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { LearnMoreSection } from "@/components/home/LearnMoreSection";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showWritingSection, setShowWritingSection] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      // Check for the writing parameter in the URL and show writing section if present
      const params = new URLSearchParams(location.search);
      if (params.get('writing') === 'true') {
        if (session) {
          setShowWritingSection(true);
          // Scroll to the buttons section for better visibility
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        } else {
          // Redirect to login if not authenticated
          toast.error("Vous devez être connecté pour accéder à cette page");
          navigate("/auth");
        }
      }
    };
    
    checkAuth();
  }, [location, navigate]);

  const handleShowMoreInfo = () => {
    setShowMoreInfo(true);
  };

  const handleBackToHome = () => {
    setShowMoreInfo(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {showMoreInfo ? (
          <>
            <LearnMoreSection />
            <Button
              variant="outline"
              onClick={handleBackToHome}
              className="mt-8 mx-auto block"
            >
              Retour à l'accueil
            </Button>
          </>
        ) : (
          <>
            <WelcomeSection 
              onShowMoreInfo={handleShowMoreInfo}
              showWritingSection={showWritingSection}
              isAuthenticated={isAuthenticated}
            />
            <FeatureHighlights />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
