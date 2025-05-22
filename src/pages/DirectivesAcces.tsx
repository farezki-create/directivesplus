
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDossierStore } from "@/store/dossierStore";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { toast } from "@/hooks/use-toast";
import { getAuthUserDossier } from "@/api/accessCodeVerification";

import Header from "@/components/Header";
import DirectivesAccessForm from "@/components/access/DirectivesAccessForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const DirectivesAcces = () => {
  const { user, isAuthenticated } = useAuth();
  const { setDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifierCode } = useVerifierCodeAcces();
  
  // Auto-load directives for authenticated users
  useEffect(() => {
    const loadUserDirectives = async () => {
      if (!isAuthenticated || !user?.id || isLoading) return;
      
      try {
        setIsLoading(true);
        console.log("Loading directives for authenticated user:", user.id);
        
        // Get user dossier
        const authResult = await getAuthUserDossier(user.id, "directive");
        
        if (authResult.success) {
          setDossierActif(authResult.dossier);
          toast({
            title: "Accès autorisé",
            description: "Vos directives ont été chargées avec succès",
          });
          navigate("/dashboard", { replace: true });
        } else {
          console.error("Failed to load user directives:", authResult.error);
        }
      } catch (error) {
        console.error("Error loading directives for authenticated user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserDirectives();
  }, [isAuthenticated, user, navigate, setDossierActif]);
  
  const handleAccessDirectives = async (accessCode: string, formData: any) => {
    try {
      setIsSubmitting(true);
      console.log("Vérification du code d'accès aux directives:", accessCode);
      
      if (!accessCode || accessCode.trim() === '') {
        toast({
          title: "Erreur",
          description: "Le code d'accès est requis",
          variant: "destructive"
        });
        throw new Error("Code d'accès manquant");
      }
      
      // Use the verifierCode function from the hook
      const bruteForceIdentifier = `directives_public_${formData.firstName}_${formData.lastName}`;
      const dossier = await verifierCode(accessCode, bruteForceIdentifier);
      
      if (dossier) {
        console.log("Code d'accès aux directives valide, dossier récupéré:", dossier);
        
        // Store in dossier store
        setDossierActif(dossier);
        
        // Navigate to dashboard instead of affichage-dossier
        navigate("/dashboard", { replace: true });
        
        // Success toast
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées",
        });
      } else {
        console.error("Code d'accès invalide");
        toast({
          title: "Accès refusé",
          description: "Code d'accès invalide ou données incorrectes",
          variant: "destructive"
        });
        throw new Error("Code d'accès invalide");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code d'accès aux directives:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du code d'accès",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-center mb-6 text-directiveplus-700">
              Chargement de vos directives...
            </h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {isAuthenticated && (
          <Alert className="max-w-md mx-auto mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Vous êtes connecté en tant que {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}.
              Vos directives anticipées seront chargées automatiquement.
            </AlertDescription>
          </Alert>
        )}
        
        <DirectivesAccessForm onSubmit={handleAccessDirectives} />
      </main>
    </div>
  );
};

export default DirectivesAcces;
