
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
import { PalliativeCareAccessCard } from "@/components/carte-acces/PalliativeCareAccessCard";

const CarteAcces = () => {
  const {
    isAuthenticated,
    isLoading,
    profile,
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    codeAcces,
    qrCodeUrl,
    isGenerating,
    isQrCodeValid,
    handlePrint,
    handleDownload
  } = useAccessCard();

  console.log("CarteAcces - Enhanced render state:", {
    isAuthenticated,
    isLoading,
    profile: profile ? {
      firstName: profile.first_name,
      lastName: profile.last_name,
      birthDate: profile.birth_date
    } : null,
    codeAcces,
    qrCodeUrl: qrCodeUrl?.substring(0, 50) + (qrCodeUrl?.length > 50 ? '...' : ''),
    isGenerating,
    isQrCodeValid,
    currentLocation: window.location.href
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("CarteAcces - User not authenticated, redirecting");
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive"
      });
      navigate("/auth", {
        state: {
          from: "/carte-acces"
        }
      });
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

  console.log("CarteAcces - Final profile data:", {
    firstName,
    lastName,
    birthDate,
    profileComplete: !!(firstName && lastName && birthDate),
    qrCodeFinal: qrCodeUrl,
    qrCodeLength: qrCodeUrl?.length || 0,
    isGenerating,
    isQrCodeValid
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate("/rediger")} className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Retour
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-4">
              Cartes d'Accès
            </h1>
            <p className="text-lg text-gray-600">
              Vos cartes d'accès pour les professionnels de santé
            </p>
          </div>

          {/* Status de génération */}
          {isGenerating && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">🔄 Génération du QR Code en cours</h3>
              <p className="text-sm text-blue-700">
                Nous préparons votre carte d'accès avec le QR code pointant vers vos directives. 
                Cela peut prendre quelques secondes...
              </p>
            </div>
          )}

          {/* Grid des cartes */}
          <div className="space-y-12">
            {/* Carte d'accès aux directives anticipées */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-directiveplus-800 mb-2">
                  Carte d'Accès aux Directives Anticipées
                </h2>
                <p className="text-gray-600">
                  Pour l'accès aux directives anticipées en situation d'urgence
                </p>
              </div>

              <ActionButtons onPrint={handlePrint} onDownload={handleDownload} />

              {/* Carte d'accès format bancaire */}
              <div className="flex justify-center">
                <AccessCard 
                  firstName={firstName} 
                  lastName={lastName} 
                  birthDate={birthDate} 
                  codeAcces={codeAcces} 
                  qrCodeUrl={qrCodeUrl}
                  isGenerating={isGenerating}
                  isQrCodeValid={isQrCodeValid}
                />
              </div>

              <InstructionsCard codeAcces={codeAcces} />
            </div>

            {/* Nouvelle carte d'accès suivi palliatif */}
            <div className="space-y-6 border-t pt-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-pink-800 mb-2">
                  Carte d'Accès Suivi Palliatif
                </h2>
                <p className="text-gray-600">
                  Pour le partage sécurisé du suivi des symptômes avec les professionnels
                </p>
              </div>

              <PalliativeCareAccessCard 
                patientId={user?.id}
                patientName={firstName && lastName ? `${firstName} ${lastName}` : undefined}
              />
            </div>
          </div>

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
