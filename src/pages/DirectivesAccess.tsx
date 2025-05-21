
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDossierStore } from "@/store/dossierStore";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { toast } from "@/hooks/use-toast";

import Header from "@/components/Header";
import DirectivesAccessForm from "@/components/access/DirectivesAccessForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DirectivesAccess = () => {
  const { user, isAuthenticated } = useAuth();
  const { setDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const { verifierCode, getDossierUtilisateurAuthentifie, loading, error } = useVerifierCodeAcces();
  const [isAccessing, setIsAccessing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Si l'utilisateur est connecté, on récupère ses directives automatiquement
  useEffect(() => {
    const accessUserDossier = async () => {
      // Ne pas récupérer automatiquement si on est déjà en train de le faire
      if (isAccessing || !isAuthenticated || !user?.id) return;
      
      try {
        setIsAccessing(true);
        setConnectionError(null);
        console.log("Récupération automatique des directives pour l'utilisateur connecté:", user?.id);
        
        const result = await getDossierUtilisateurAuthentifie(user.id, "directives_access");
        
        if (result.success && result.dossier) {
          setDossierActif(result.dossier);
          toast({
            title: "Succès",
            description: "Vos directives ont été chargées avec succès",
          });
          navigate("/affichage-dossier");
        } else {
          setConnectionError(result.error || "Erreur lors de la récupération de vos directives");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des directives:", error);
        setConnectionError("Impossible de contacter le serveur. Veuillez réessayer ultérieurement.");
      } finally {
        setIsAccessing(false);
      }
    };

    accessUserDossier();
  }, [isAuthenticated, user, setDossierActif, navigate, getDossierUtilisateurAuthentifie]);

  const handleFormSubmit = async (accessCode: string, formData: any) => {
    try {
      console.log("Vérification du code d'accès:", accessCode);
      setConnectionError(null);

      // Vérifier le code d'accès
      const result = await verifierCode(accessCode, "directives_access");
      
      if (result.success && result.dossier) {
        console.log("Code d'accès valide, dossier récupéré:", result.dossier);
        
        // Stocker le dossier actif en utilisant le store
        setDossierActif(result.dossier);
        
        // Rediriger vers la page d'affichage du dossier
        navigate("/affichage-dossier");
        
        // Notification de succès
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées",
        });
      } else {
        setConnectionError(result.error || "Accès refusé. Veuillez vérifier vos informations.");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code d'accès:", error);
      setConnectionError("Impossible de contacter le serveur. Veuillez vérifier votre connexion internet et réessayer.");
    }
  };

  // Afficher un message si on est déjà en train de récupérer les données
  if (isAccessing || loading) {
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
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center mb-6 text-directiveplus-700">
            Accès aux directives anticipées
          </h1>
          
          {connectionError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de connexion</AlertTitle>
              <AlertDescription>
                {connectionError}
              </AlertDescription>
            </Alert>
          )}
          
          <p className="mb-6 text-gray-700">
            Veuillez entrer le code d'accès fourni par le titulaire des directives anticipées ainsi 
            que les informations d'identification demandées pour y accéder.
          </p>

          <DirectivesAccessForm onSubmit={handleFormSubmit} />
          
          {isAuthenticated && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Vous êtes connecté. Si vous souhaitez consulter vos propres directives, elles seront chargées automatiquement.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DirectivesAccess;
