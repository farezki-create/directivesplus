
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Import our components
import AccessCardHeader from "@/components/access-card/AccessCardHeader";
import ProfileWarning from "@/components/access-card/ProfileWarning";
import InstitutionAccessSection from "@/components/access-card/InstitutionAccessSection";
import AccessInfoBox from "@/components/access-card/AccessInfoBox";
import PageFooter from "@/components/access-card/PageFooter";
import AppNavigation from "@/components/AppNavigation";
import LoadingState from "@/components/questionnaire/LoadingState";
import { toast } from "@/components/ui/use-toast";

const AccessCardPage = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Debug logs
  useEffect(() => {
    console.log("AccessCardPage - Auth state:", { 
      userId: user?.id, 
      hasProfile: !!profile
    });
  }, [user, profile]);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive"
      });
      navigate("/auth", { state: { from: "/carte-acces" } });
    } else if (isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show global loading state when initial auth is loading
  if (isLoading || loading) {
    return <LoadingState loading={true} message="Chargement en cours..." />;
  }

  // Set default values for profile data if it's missing
  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <AccessCardHeader />
          
          <ProfileWarning 
            profile={profile} 
            firstName={firstName} 
            lastName={lastName} 
          />
          
          {/* Section unique pour l'accès professionnel */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-directiveplus-800 mb-4">
              Code d'accès professionnel
            </h2>
            <InstitutionAccessSection userId={user?.id} />
          </div>
          
          <AccessInfoBox />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default AccessCardPage;
