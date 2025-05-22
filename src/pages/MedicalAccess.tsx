
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDossierStore } from "@/store/dossierStore";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { toast } from "@/components/ui/use-toast";
import { getAuthUserDossier } from "@/api/accessCodeVerification";

import Header from "@/components/Header";
import MedicalAccessForm from "@/components/access/medical/MedicalAccessForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const MedicalAccess = () => {
  const { user, isAuthenticated } = useAuth();
  const { setDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const { verifierCode, getDossierUtilisateurAuthentifie, loading } = useVerifierCodeAcces();
  const [isAccessing, setIsAccessing] = useState(false);

  // Si l'utilisateur est connecté, on récupère ses données médicales automatiquement
  useEffect(() => {
    const accessUserDossier = async () => {
      // Ne pas récupérer automatiquement si on est déjà en train de le faire
      if (isAccessing || !isAuthenticated || !user?.id) return;
      
      try {
        setIsAccessing(true);
        console.log("Récupération automatique des données médicales pour l'utilisateur connecté:", user?.id);
        
        // Option 1: Utiliser la fonction existante
        const dossier = await getDossierUtilisateurAuthentifie(user.id, "medical_access");
        
        // Option 2: Utiliser la nouvelle fonction optimisée pour les utilisateurs authentifiés
        if (!dossier) {
          const authResult = await getAuthUserDossier(user.id, "medical");
          if (authResult.success) {
            setDossierActif(authResult.dossier);
            toast({
              title: "Succès",
              description: "Vos données médicales ont été chargées avec succès",
            });
            navigate("/affichage-dossier");
            return;
          }
        } else {
          setDossierActif(dossier);
          toast({
            title: "Succès",
            description: "Vos données médicales ont été chargées avec succès",
          });
          navigate("/affichage-dossier");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données médicales:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement de vos données médicales",
          variant: "destructive"
        });
      } finally {
        setIsAccessing(false);
      }
    };

    accessUserDossier();
  }, [isAuthenticated, user, setDossierActif, navigate, getDossierUtilisateurAuthentifie]);

  const handleFormSubmit = async (accessCode: string, formData: any) => {
    try {
      console.log("Vérification du code d'accès médical:", accessCode);

      // Vérifier le code d'accès
      const dossier = await verifierCode(accessCode, "medical_access");
      
      if (dossier) {
        console.log("Code d'accès médical valide, dossier récupéré:", dossier);
        
        // Stocker le dossier actif en utilisant le store
        setDossierActif(dossier);
        
        // Rediriger vers la page d'affichage du dossier
        navigate("/affichage-dossier");
        
        // Notification de succès
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux données médicales",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code d'accès médical:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du code d'accès médical",
        variant: "destructive"
      });
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
              Chargement de vos données médicales...
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
            Accès aux données médicales
          </h1>
          
          {isAuthenticated && (
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <InfoIcon className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Vous êtes connecté en tant que {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}. 
                Vos données médicales seront chargées automatiquement.
              </AlertDescription>
            </Alert>
          )}
          
          <p className="mb-6 text-gray-700">
            Veuillez entrer le code d'accès médical fourni par le patient ainsi 
            que les informations d'identification demandées pour accéder aux données médicales.
          </p>

          <MedicalAccessForm onSubmit={handleFormSubmit} />
        </div>
      </main>
    </div>
  );
};

export default MedicalAccess;
