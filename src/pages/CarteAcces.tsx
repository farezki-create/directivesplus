
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAccessCard } from "@/hooks/useAccessCard";
import AccessCard from "@/components/carte-acces/AccessCard";
import ActionButtons from "@/components/carte-acces/ActionButtons";
import InstructionsCard from "@/components/carte-acces/InstructionsCard";
import { InstitutionCodeSection } from "@/components/directives/InstitutionCodeSection";

const CarteAcces = () => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const { codeAcces, qrCodeUrl, handlePrint, handleDownload } = useAccessCard();

  console.log("CarteAcces - Render state:", {
    isAuthenticated,
    isLoading,
    profile: profile ? 'present' : 'missing',
    codeAcces,
    qrCodeUrl,
    qrCodeUrlValid: !!qrCodeUrl && qrCodeUrl.length > 0
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("CarteAcces - User not authenticated, redirecting");
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive"
      });
      navigate("/auth", { state: { from: "/carte-acces" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    console.log("CarteAcces - Loading state");
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("CarteAcces - Not authenticated, returning null");
    return null;
  }

  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";
  const birthDate = profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString('fr-FR') : "";

  console.log("CarteAcces - Profile data:", {
    firstName,
    lastName,
    birthDate,
    profileComplete: !!(firstName && lastName && birthDate)
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/rediger")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-4">
              Carte d'Accès aux Directives Anticipées
            </h1>
            <p className="text-lg text-gray-600">
              Votre carte d'accès aux directives anticipées pour les professionnels de santé
            </p>
          </div>

          <ActionButtons onPrint={handlePrint} onDownload={handleDownload} />

          {/* Carte d'accès format bancaire */}
          <div className="flex justify-center mb-8">
            <AccessCard
              firstName={firstName}
              lastName={lastName}
              birthDate={birthDate}
              codeAcces={codeAcces}
              qrCodeUrl={qrCodeUrl}
            />
          </div>

          {/* Debug info - à supprimer en production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Debug Info:</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>Code d'accès: {codeAcces || 'Non généré'}</div>
                <div>QR Code URL: {qrCodeUrl || 'Non généré'}</div>
                <div>URL valide: {qrCodeUrl && qrCodeUrl.length > 0 ? 'Oui' : 'Non'}</div>
                <div>Profil complet: {firstName && lastName && birthDate ? 'Oui' : 'Non'}</div>
              </div>
            </div>
          )}

          <InstructionsCard codeAcces={codeAcces} />

          {/* Section Accès Institution */}
          <div className="mt-8">
            <InstitutionCodeSection />
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t print:hidden">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default CarteAcces;
