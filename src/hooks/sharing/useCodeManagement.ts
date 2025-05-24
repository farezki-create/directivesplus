
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { UnifiedCodeGenerationService } from "./services/unifiedCodeGeneration";

/**
 * Hook pour la gestion des codes d'accès (prolongation, régénération)
 */
export const useCodeManagement = () => {
  const [isExtending, setIsExtending] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extendCode = async (
    accessCode: string,
    additionalDays: number = 365
  ): Promise<boolean> => {
    setIsExtending(true);
    setError(null);

    try {
      const result = await UnifiedCodeGenerationService.extendCode(accessCode, additionalDays);
      
      if (result.success) {
        toast({
          title: "Code prolongé",
          description: `Code d'accès prolongé de ${additionalDays} jours`,
        });
        return true;
      } else {
        throw new Error(result.error || "Échec de la prolongation");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Impossible de prolonger le code d'accès";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsExtending(false);
    }
  };

  const regenerateCode = async (
    currentCode: string,
    expiresInDays: number = 365
  ): Promise<string | null> => {
    setIsRegenerating(true);
    setError(null);

    try {
      const result = await UnifiedCodeGenerationService.regenerateCode(currentCode, expiresInDays);
      
      if (result.success && result.code) {
        toast({
          title: "Code régénéré",
          description: `Nouveau code d'accès : ${result.code}`,
        });
        return result.code;
      } else {
        throw new Error(result.error || "Échec de la régénération");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Impossible de régénérer le code d'accès";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsRegenerating(false);
    }
  };

  return {
    extendCode,
    regenerateCode,
    isExtending,
    isRegenerating,
    error
  };
};
