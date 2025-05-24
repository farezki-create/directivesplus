
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { UnifiedCodeGenerationService } from "./services/unifiedCodeGeneration";
import type { ShareableDocument } from "./types";

/**
 * Hook pour la génération de codes d'accès institution
 */
export const useInstitutionCodeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInstitutionCode = async (
    document: ShareableDocument,
    expiresInDays: number = 30
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await UnifiedCodeGenerationService.generateInstitutionCode(document, expiresInDays);
      
      if (result.success && result.code) {
        toast({
          title: "Code institution généré",
          description: `Code d'accès professionnel créé (valide ${expiresInDays} jours)`,
        });
        return result.code;
      } else {
        throw new Error(result.error || "Échec de la génération");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Impossible de générer le code d'accès professionnel";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateInstitutionCode,
    isGenerating,
    error
  };
};
