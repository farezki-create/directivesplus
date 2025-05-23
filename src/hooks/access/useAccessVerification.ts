
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyAccessCode } from "@/api/access/verification/accessCodeVerification";
import { toast } from "@/hooks/use-toast";

interface AccessFormValues {
  firstName: string;
  lastName: string;
  birthdate: string;
  accessCode: string;
}

interface VerificationResult {
  success: boolean;
  dossier?: any;
  error?: string;
}

export const useAccessVerification = (onSuccess?: (dossier: any) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get("code");
  
  // Clear error when code changes
  useEffect(() => {
    if (codeFromUrl) {
      setError(null);
    }
  }, [codeFromUrl]);

  /**
   * Verifies the provided access information
   */
  const verifyAccess = async (values: AccessFormValues): Promise<VerificationResult> => {
    console.log("Verifying access with values:", values);
    setLoading(true);
    setError(null);
    
    try {
      // Construct the full name for the API
      const fullName = `${values.firstName} ${values.lastName}`;
      
      // Call the API function to verify the access code
      const result = await verifyAccessCode(
        values.accessCode,
        fullName,
        values.birthdate,
        "directive"
      );
      
      if (!result.success) {
        const errorMessage = result.error || "Les informations fournies sont incorrectes ou le code d'accès est expiré";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }
      
      // If successful, invoke the callback and show a success message
      if (result.dossier) {
        toast({
          title: "Accès autorisé",
          description: "Vos directives ont été chargées avec succès"
        });
        
        return {
          success: true,
          dossier: result.dossier
        };
      } else {
        setError("Une erreur est survenue lors de la récupération des données");
        return {
          success: false,
          error: "Une erreur est survenue lors de la récupération des données"
        };
      }
    } catch (err) {
      console.error("Error verifying access:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de la vérification";
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
    codeFromUrl
  };
};
