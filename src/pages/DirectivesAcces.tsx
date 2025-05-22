
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import DirectivesAccessForm from "@/components/access/DirectivesAccessForm";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { validatePublicAccessData } from "@/utils/api/accessCodeValidation";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";

const DirectivesAcces = () => {
  const { user, isAuthenticated } = useAuth();
  const { setDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { verifierCode } = useVerifierCodeAcces();
  
  const handlePublicAccess = async (accessCode: string, formData: any) => {
    if (!validatePublicAccessData(formData)) return;
    
    setIsLoading(true);
    try {
      console.log("Vérification de l'accès public:", formData);
      
      // Vérifier le code d'accès
      const result = await verifierCode(accessCode, 
        `directives_public_${formData.firstName}_${formData.lastName}`);
      
      if (!result) {
        toast({
          title: "Accès refusé",
          description: "Code d'accès invalide ou informations incorrectes",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Stocker le dossier dans le store
      setDossierActif(result);
      
      // Rediriger vers l'affichage du dossier
      navigate("/affichage-dossier");
      
      // Afficher une notification de succès
      toast({
        title: "Accès autorisé",
        description: "Vous avez accès aux directives anticipées",
      });
    } catch (error) {
      console.error("Erreur lors de la vérification de l'accès public:", error);
      toast({
        title: "Erreur d'accès",
        description: "Impossible de vérifier votre accès aux directives",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si l'utilisateur est authentifié, le rediriger vers les directives
  if (isAuthenticated && user) {
    navigate("/directives-docs");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">
            Accès aux directives anticipées
          </h1>
          
          <DirectivesAccessForm onSubmit={handlePublicAccess} />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Si vous avez un compte, vous pouvez également{" "}
              <a href="/auth" className="text-directiveplus-600 hover:underline">
                vous connecter
              </a>
              {" "}pour accéder à vos directives.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default DirectivesAcces;
