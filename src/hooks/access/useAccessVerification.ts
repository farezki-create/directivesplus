
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; 
import { toast } from "@/hooks/use-toast";
import { useVerifierCodeAcces } from "@/hooks/access/useVerifierCodeAcces";
import { useDossierStore } from "@/store/dossierStore";
import { AccessFormValues } from "@/components/mes-directives/AccessForm"; 

export const useAccessVerification = (onSuccess = (dossier) => {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { verifierCode } = useVerifierCodeAcces();
  const { setDossierActif } = useDossierStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const codeParam = searchParams.get("code");

  const verifyAccess = async (formValues: AccessFormValues) => {
    console.log("Verifying access with values:", formValues);
    setLoading(true);
    setError(null);
    
    // If we have a code parameter in the URL, use it instead of the form value
    const accessCode = codeParam || formValues.accessCode;
    // Format identifier as firstName_lastName for the RPC function
    const fullName = `${formValues.firstName}_${formValues.lastName}`;
    
    try {
      // Call the verifierCode function with the access code and identifier
      const dossier = await verifierCode(
        accessCode,
        fullName
      );
      
      if (dossier) {
        console.log("Access verified successfully, dossier:", dossier);
        setDossierActif(dossier);
        
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées"
        });
        
        // Navigate to dashboard after successful verification
        navigate("/dashboard");
        
        onSuccess(dossier);
        return { success: true, dossier };
      } else {
        console.error("Failed to verify access code");
        setError("Code d'accès incorrect ou expiré");
        return { 
          success: false, 
          error: "Code d'accès incorrect ou expiré" 
        };
      }
    } catch (error) {
      console.error("Error verifying access:", error);
      const errorMessage = error.message || "Une erreur est survenue lors de la vérification";
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyAccess,
    loading,
    error,
    codeFromUrl: codeParam
  };
};
