
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkBruteForceAttempt, resetBruteForceCounter } from "@/utils/securityUtils";
import { toast } from "@/components/ui/use-toast";

interface VerificationResult {
  success: boolean;
  dossier?: {
    id: string;
    userId: string;
    isFullAccess: boolean;
    profileData?: any;
    contenu?: any;
  };
  error?: string;
}

export const useVerifierCodeAcces = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verifierCode = async (code: string, identifierInfo: string = ''): Promise<VerificationResult> => {
    setLoading(true);
    setResult(null);
    
    // Identifier unique pour la détection de force brute
    const bruteForceIdentifier = `access_code_${code.substring(0, 4)}_${identifierInfo}`;
    
    // Vérifier si l'utilisateur n'est pas bloqué pour force brute
    const bruteForceCheck = checkBruteForceAttempt(bruteForceIdentifier);
    
    if (!bruteForceCheck.allowed) {
      const errorResult = { 
        success: false, 
        error: `Trop de tentatives. Veuillez réessayer dans ${Math.ceil(bruteForceCheck.blockExpiresIn! / 60)} minutes.` 
      };
      setResult(errorResult);
      setLoading(false);
      return errorResult;
    }
    
    try {
      console.log("Appel de la fonction Edge verifierCodeAcces avec le code:", code);
      
      // Appel à la fonction Edge
      const { data, error } = await supabase.functions.invoke("verifierCodeAcces", {
        body: { code_saisi: code },
      });

      console.log("Réponse de la fonction Edge:", data, error);

      if (error) {
        console.error("Erreur lors de l'appel à la fonction Edge:", error);
        
        // On affiche un toast pour l'erreur
        toast({
          title: "Erreur de serveur",
          description: "Une erreur est survenue lors de la vérification du code d'accès",
          variant: "destructive"
        });
        
        const errorResult = { 
          success: false, 
          error: "Erreur de communication avec le serveur" 
        };
        setResult(errorResult);
        return errorResult;
      }

      // Si succès, réinitialiser le compteur de tentatives
      if (data && data.success) {
        resetBruteForceCounter(bruteForceIdentifier);
        
        // Afficher un toast avec l'ID du dossier pour confirmation
        toast({
          title: "Accès autorisé",
          description: `Accès au dossier ${data.dossier.id} accordé`
        });
      }

      setResult(data);
      return data as VerificationResult;
    } catch (err) {
      console.error("Erreur lors de la vérification du code:", err);
      
      // On affiche un toast pour l'erreur
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du code d'accès",
        variant: "destructive"
      });
      
      const errorResult = { 
        success: false, 
        error: "Une erreur inattendue est survenue" 
      };
      setResult(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifierCode,
    loading,
    result
  };
};
