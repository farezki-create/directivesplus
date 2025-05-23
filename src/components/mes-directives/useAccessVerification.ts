
import { useState } from "react";
import { useSearchParams } from "react-router-dom"; 
import { toast } from "@/hooks/use-toast";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { useDossierStore } from "@/store/dossierStore";

export const useAccessVerification = (onSuccess = (dossier) => {}) => {
  const [loading, setLoading] = useState(false);
  const { verifierCode } = useVerifierCodeAcces();
  const { setDossierActif } = useDossierStore();
  const [searchParams] = useSearchParams();
  const codeParam = searchParams.get("code");

  const verifyAccess = async (formValues) => {
    console.log("Verifying access with values:", formValues);
    setLoading(true);
    
    // If we have a code parameter in the URL, use it instead of the form value
    const accessCode = codeParam || formValues.accessCode;
    
    try {
      const dossier = await verifierCode(
        accessCode,
        `${formValues.firstName}_${formValues.lastName}`
      );
      
      if (dossier) {
        console.log("Access verified successfully, dossier:", dossier);
        setDossierActif(dossier);
        
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées"
        });
        
        onSuccess(dossier);
        return { success: true, dossier };
      } else {
        console.error("Failed to verify access code");
        return { 
          success: false, 
          error: "Code d'accès incorrect ou expiré" 
        };
      }
    } catch (error) {
      console.error("Error verifying access:", error);
      return { 
        success: false, 
        error: error.message || "Une erreur est survenue lors de la vérification"
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyAccess,
    loading,
    codeFromUrl: codeParam
  };
};
