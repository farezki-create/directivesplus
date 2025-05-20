
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessCode } from "@/hooks/access-codes/useAccessCode";

// Import our components
import AccessCardHeader from "@/components/access-card/AccessCardHeader";
import ProfileWarning from "@/components/access-card/ProfileWarning";
import AccessCodeCards from "@/components/access-card/AccessCodeCards";
import AccessCodeDisplays from "@/components/access-card/AccessCodeDisplays";
import AccessCardSection from "@/components/access-card/AccessCardSection";
import AccessInfoBox from "@/components/access-card/AccessInfoBox";
import PageFooter from "@/components/access-card/PageFooter";
import AppNavigation from "@/components/AppNavigation";
import LoadingState from "@/components/questionnaire/LoadingState";
import { toast } from "@/components/ui/use-toast";

const AccessCardPage = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Use the updated hook with isLoading state
  const { accessCode: directiveCode, isLoading: directiveLoading } = useAccessCode(user, "directive");
  const { accessCode: medicalCode, isLoading: medicalLoading } = useAccessCode(user, "medical");
  
  // Determine if codes are ready
  const [codesReady, setCodesReady] = useState(false);
  
  // Debug logs
  useEffect(() => {
    console.log("AccessCardPage - Auth state:", { 
      userId: user?.id, 
      hasProfile: !!profile, 
      directiveCode, 
      medicalCode 
    });
  }, [user, profile, directiveCode, medicalCode]);
  
  useEffect(() => {
    if (directiveCode || medicalCode) {
      console.log("AccessCardPage - Codes ready:", { directiveCode, medicalCode });
      setCodesReady(true);
    }
  }, [directiveCode, medicalCode]);
  
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
  const birthDate = profile?.birth_date || null;

  // Check if we're still loading codes
  const isCodesLoading = directiveLoading || medicalLoading;

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
          
          {/* Section dédiée à l'affichage des codes d'accès */}
          <div className="mb-8">
            <AccessCodeCards 
              directiveCode={directiveCode}
              medicalCode={medicalCode}
              directiveLoading={directiveLoading}
              medicalLoading={medicalLoading}
            />
            
            {/* Affichage complet des codes avec les informations du profil */}
            <AccessCodeDisplays 
              directiveCode={directiveCode}
              medicalCode={medicalCode}
              firstName={firstName}
              lastName={lastName}
              birthDate={birthDate}
            />
          </div>
          
          {/* Section pour la carte d'accès */}
          <AccessCardSection 
            firstName={firstName}
            lastName={lastName}
            birthDate={birthDate}
            directiveCode={directiveCode}
            medicalCode={medicalCode}
            isCodesLoading={isCodesLoading}
          />
          
          <AccessInfoBox />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default AccessCardPage;
