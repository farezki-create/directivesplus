
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { toast } from "@/hooks/use-toast";
import { useAccessCard } from "@/hooks/useAccessCard";
import CarteAccesHeader from "@/components/carte-acces/CarteAccesHeader";
import ProfileIncompleteAlert from "@/components/carte-acces/ProfileIncompleteAlert";
import QRCodeStatus from "@/components/carte-acces/QRCodeStatus";
import DirectivesAccessSection from "@/components/carte-acces/DirectivesAccessSection";
import PalliativeCareSection from "@/components/carte-acces/PalliativeCareSection";
import { InstitutionCodeSection } from "@/components/directives/InstitutionCodeSection";

const CarteAcces = () => {
  const { isAuthenticated, isLoading, profile, user } = useAuth();
  const navigate = useNavigate();
  const {
    codeAcces,
    qrCodeUrl,
    isGenerating,
    isQrCodeValid,
    handlePrint,
    handleDownload
  } = useAccessCard();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive"
      });
      navigate("/auth", {
        state: { from: "/carte-acces" }
      });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";
  const birthDate = profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString('fr-FR') : "";
  const isProfileIncomplete = !firstName || !lastName || !birthDate;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CarteAccesHeader />
          
          <ProfileIncompleteAlert isProfileIncomplete={isProfileIncomplete} />
          
          <QRCodeStatus isGenerating={isGenerating} isQrCodeValid={isQrCodeValid} />

          <div className="space-y-12">
            <DirectivesAccessSection
              firstName={firstName}
              lastName={lastName}
              birthDate={birthDate}
              codeAcces={codeAcces}
              qrCodeUrl={qrCodeUrl}
              isGenerating={isGenerating}
              isQrCodeValid={isQrCodeValid}
              onPrint={handlePrint}
              onDownload={handleDownload}
            />

            <PalliativeCareSection 
              userId={user?.id}
              firstName={firstName}
              lastName={lastName}
            />
          </div>

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
