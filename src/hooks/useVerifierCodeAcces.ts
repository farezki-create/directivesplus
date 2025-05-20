
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VerificationResult {
  success: boolean;
  dossier?: {
    id: string;
    contenu: any;
  };
  error?: string;
}

export const useVerifierCodeAcces = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verifierCode = async (code: string): Promise<VerificationResult> => {
    setLoading(true);
    setResult(null);
    
    try {
      // Appel à la fonction Edge
      const { data, error } = await supabase.functions.invoke("verifierCodeAcces", {
        body: { code_saisi: code },
      });

      if (error) {
        console.error("Erreur lors de l'appel à la fonction Edge:", error);
        const errorResult = { 
          success: false, 
          error: "Erreur de communication avec le serveur" 
        };
        setResult(errorResult);
        return errorResult;
      }

      setResult(data);
      return data as VerificationResult;
    } catch (err) {
      console.error("Erreur lors de la vérification du code:", err);
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
