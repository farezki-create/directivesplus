
import { useState, useEffect } from "react";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { validateAccessCode, validateDossierResponse } from "@/utils/api/accessCodeValidation";
import { useDirectivesStore } from "@/store/directivesStore";
import { toast } from "@/hooks/use-toast";
import { useUrlAccessParams } from "./useUrlAccessParams";
import { useInstitutionCodeAccess } from "./useInstitutionCodeAccess";

export const usePublicDirectivesAccess = (isAuthenticated: boolean) => {
  const [publicAccessVerified, setPublicAccessVerified] = useState(false);
  const [publicAccessLoading, setPublicAccessLoading] = useState(false);
  const { documents, setDocuments } = useDirectivesStore();
  const { verifierCode } = useVerifierCodeAcces();
  
  const urlParams = useUrlAccessParams();
  
  const institutionAccess = useInstitutionCodeAccess(
    urlParams.code,
    urlParams.nom,
    urlParams.prenom,
    urlParams.naissance,
    null,
    urlParams.hasAllParams
  );

  useEffect(() => {
    if (!isAuthenticated && documents.length > 0 && !publicAccessVerified) {
      setPublicAccessVerified(true);
    }
  }, [documents, isAuthenticated, publicAccessVerified]);

  useEffect(() => {
    if (institutionAccess.accessGranted && !publicAccessVerified) {
      setPublicAccessVerified(true);
    }
  }, [institutionAccess.accessGranted, publicAccessVerified]);

  const handlePublicAccess = async (formData: any) => {
    if (!validateAccessCode(formData.accessCode)) return;
    
    setPublicAccessLoading(true);
    try {
      const result = await verifierCode(formData.accessCode,
        `directives_public_${formData.firstName}_${formData.lastName}`);
      
      if (!validateDossierResponse({ success: !!result, dossier: result, error: !result ? "Code invalide" : null })) {
        setPublicAccessLoading(false);
        return;
      }
      
      if (result?.contenu?.documents) {
        setDocuments(result.contenu.documents);
      }
      setPublicAccessVerified(true);
      
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

  const isAccessVerified = publicAccessVerified || institutionAccess.accessGranted;
  const isLoading = publicAccessLoading || institutionAccess.loading;

  return {
    publicAccessVerified: isAccessVerified,
    publicAccessLoading: isLoading,
    dossierActif: { contenu: { documents } },
    handlePublicAccess,
    urlParams,
    institutionAccess
  };
};
