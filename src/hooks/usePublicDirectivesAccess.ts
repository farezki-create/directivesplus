
import { useState, useEffect } from "react";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { validateAccessCode, validateDossierResponse } from "@/utils/api/accessCodeValidation";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";
import { useUrlAccessParams } from "./useUrlAccessParams";
import { useInstitutionCodeAccess } from "./useInstitutionCodeAccess";

export const usePublicDirectivesAccess = (isAuthenticated: boolean) => {
  const [publicAccessVerified, setPublicAccessVerified] = useState(false);
  const [publicAccessLoading, setPublicAccessLoading] = useState(false);
  const { dossierActif, setDossierActif } = useDossierStore();
  const { verifierCode } = useVerifierCodeAcces();
  
  // Récupération des paramètres URL
  const urlParams = useUrlAccessParams();
  
  // Gestion de l'accès par code d'institution
  const institutionAccess = useInstitutionCodeAccess(
    urlParams.code,
    urlParams.nom,
    urlParams.prenom,
    urlParams.naissance,
    urlParams.hasAllParams
  );

  // Vérifier si nous avons déjà un accès public vérifié via le store
  useEffect(() => {
    if (!isAuthenticated && dossierActif && !publicAccessVerified) {
      console.log("Accès public déjà vérifié via le store dossier");
      setPublicAccessVerified(true);
    }
  }, [dossierActif, isAuthenticated, publicAccessVerified]);

  // Marquer comme vérifié si l'accès institution est accordé
  useEffect(() => {
    if (institutionAccess.accessGranted && !publicAccessVerified) {
      console.log("Accès institution accordé, marquage comme vérifié");
      setPublicAccessVerified(true);
    }
  }, [institutionAccess.accessGranted, publicAccessVerified]);

  const handlePublicAccess = async (formData: any) => {
    if (!validateAccessCode(formData.accessCode)) return;
    
    setPublicAccessLoading(true);
    try {
      console.log("Vérification de l'accès public:", formData);
      
      // Vérifier le code d'accès
      const result = await verifierCode(formData.accessCode, 
        `directives_public_${formData.firstName}_${formData.lastName}`);
      
      if (!validateDossierResponse({ success: !!result, dossier: result, error: !result ? "Code invalide" : null })) {
        setPublicAccessLoading(false);
        return;
      }
      
      // Stocker le dossier dans le store
      setDossierActif(result);
      setPublicAccessVerified(true);
      
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
      setPublicAccessLoading(false);
    }
  };

  // État combiné incluant l'accès par institution
  const isAccessVerified = publicAccessVerified || institutionAccess.accessGranted;
  const isLoading = publicAccessLoading || institutionAccess.loading;

  return {
    publicAccessVerified: isAccessVerified,
    publicAccessLoading: isLoading,
    dossierActif,
    handlePublicAccess,
    urlParams,
    institutionAccess
  };
};
