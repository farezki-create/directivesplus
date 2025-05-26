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
  const {
    isAuthenticated,
    isLoading,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const {
    codeAcces,
    qrCodeUrl,
    handlePrint,
    handleDownload
  } = useAccessCard();
  console.log("CarteAcces - Detailed render state:", {
    isAuthenticated,
    isLoading,
    profile: profile ? {
      firstName: profile.first_name,
      lastName: profile.last_name,
      birthDate: profile.birth_date
    } : null,
    codeAcces,
    qrCodeUrl,
    qrCodeUrlValid: !!qrCodeUrl && qrCodeUrl.length > 0,
    currentLocation: window.location.href,
    origin: window.location.origin,
    pathname: window.location.pathname
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

  // Afficher un message de rechargement si le QR code n'est pas encore généré
  useEffect(() => {
    if (isAuthenticated && profile && !qrCodeUrl) {
      console.log("CarteAcces - QR code not yet generated, waiting...");
      const timer = setTimeout(() => {
        if (!qrCodeUrl) {
          console.log("CarteAcces - QR code generation taking too long, showing info");
          toast({
            title: "Génération du QR Code",
            description: "Le QR code est en cours de génération. Veuillez patienter..."
          });
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, profile, qrCodeUrl]);
  if (isLoading) {
    console.log("CarteAcces - Loading state");
    return <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>;
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
    qrCodeLength: qrCodeUrl?.length || 0
  });
  return <div className="min-h-screen flex flex-col bg-gray-50">
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
              Carte d'Accès aux Directives Anticipées
            </h1>
            <p className="text-lg text-gray-600">
              Votre carte d'accès aux directives anticipées pour les professionnels de santé
            </p>
          </div>

          {/* Alerte si QR code pas encore généré */}
          {(!qrCodeUrl || qrCodeUrl.length < 10) && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">🔄 Génération du QR Code en cours</h3>
              <p className="text-sm text-blue-700">
                Le QR code de votre carte d'accès est en cours de génération. Cela peut prendre quelques secondes.
              </p>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-2">
                Actualiser la page
              </Button>
            </div>}

          <ActionButtons onPrint={handlePrint} onDownload={handleDownload} />

          {/* Carte d'accès format bancaire */}
          <div className="flex justify-center mb-8">
            <AccessCard firstName={firstName} lastName={lastName} birthDate={birthDate} codeAcces={codeAcces} qrCodeUrl={qrCodeUrl} />
          </div>

          {/* Debug info étendu - visible en development */}
          {process.env.NODE_ENV === 'development'}

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
    </div>;
};
export default CarteAcces;