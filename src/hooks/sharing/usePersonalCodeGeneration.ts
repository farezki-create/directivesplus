
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { UnifiedCodeGenerationService } from "./services/unifiedCodeGeneration";
import type { ShareableDocument, ShareOptions } from "./types";

/**
 * Hook pour la génération de codes d'accès personnels
 */
export const usePersonalCodeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePersonalCode = async (
    document: ShareableDocument,
    options: ShareOptions = {}
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await UnifiedCodeGenerationService.generatePersonalCode(document, options);
      
      if (result.success && result.code) {
        toast({
          title: "Code généré",
          description: `Code d'accès personnel créé : ${result.code}`,
        });
        return result.code;
      } else {
        throw new Error(result.error || "Échec de la génération");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Impossible de générer le code d'accès";
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
    generatePersonalCode,
    isGenerating,
    error
  };
};
