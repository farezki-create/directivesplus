
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";
import { getAuthUserDossier } from "@/api/dossier/userDossierAccess";

import Header from "@/components/Header";
import DirectivesAccessForm from "@/components/access/DirectivesAccessForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import Footer from "@/components/Footer";

const DirectivesAcces = () => {
  const { user, isAuthenticated } = useAuth();
  const { setDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Auto-load directives for authenticated users
  useEffect(() => {
    const loadUserDirectives = async () => {
      if (!isAuthenticated || !user?.id || isLoading) return;
      
      try {
        setIsLoading(true);
        console.log("Loading directives for authenticated user:", user.id);
        
        // Get user dossier
        const result = await getAuthUserDossier(user.id, "directive");
        
        if (result.success && result.dossier) {
          setDossierActif(result.dossier);
          toast({
            title: "Accès autorisé",
            description: "Vos directives ont été chargées avec succès",
          });
          navigate("/dashboard", { replace: true });
        } else {
          console.error("Failed to load user directives:", result.error);
          toast({
            title: "Information",
            description: "Vous êtes connecté mais n'avez pas encore de directives anticipées"
          });
        }
      } catch (error) {
        console.error("Error loading directives for authenticated user:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos directives"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserDirectives();
  }, [isAuthenticated, user, navigate, setDossierActif]);
  
  const handleAccessDirectives = async (accessCode: string, formData: any) => {
    try {
      setIsLoading(true);
      console.log("Vérification du code d'accès aux directives:", accessCode);
      
      // Call the API
      const apiUrl = "https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces";
      const bruteForceIdentifier = `directives_access_${formData.firstName}_${formData.lastName}_${formData.birthDate}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessCode: accessCode,
          patientName: `${formData.firstName} ${formData.lastName}`,
          patientBirthDate: formData.birthDate,
          bruteForceIdentifier: bruteForceIdentifier
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log("Code d'accès aux directives valide, dossier récupéré:", result);
        
        // Store in dossier store
        setDossierActif(result.dossier);
        
        // Navigate to dashboard instead of affichage-dossier
        navigate("/dashboard", { replace: true });
        
        // Success toast
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées",
        });
      } else {
        console.error("Code d'accès invalide:", result.error);
        toast({
          title: "Accès refusé",
          description: result.error || "Code d'accès invalide ou données incorrectes",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code d'accès aux directives:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du code d'accès",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-center mb-6 text-directiveplus-700">
              Chargement de vos directives...
            </h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {isAuthenticated && (
          <Alert className="max-w-md mx-auto mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Vous êtes connecté en tant que {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}.
              Vos directives anticipées seront chargées automatiquement si elles existent.
            </AlertDescription>
          </Alert>
        )}
        
        <DirectivesAccessForm onSubmit={handleAccessDirectives} />
      </main>
      <Footer />
    </div>
  );
};

export default DirectivesAcces;
