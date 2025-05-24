
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { UnifiedAccessValidationService } from "./services/unifiedAccessValidation";
import type { AccessCodeValidationResult } from "./types";

/**
 * Hook pour la validation des codes d'accès
 */
export const useAccessValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAccess = async (
    accessCode: string,
    patientInfo?: {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
    }
  ): Promise<AccessCodeValidationResult> => {
    setIsValidating(true);
    setError(null);

    try {
      const result = await UnifiedAccessValidationService.validateAccessCode(accessCode, patientInfo);
      
      if (result.success) {
        toast({
          title: "Accès autorisé",
          description: result.message,
        });
      } else {
        toast({
          title: "Accès refusé",
          description: result.message,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la validation";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsValidating(false);
    }
  };

  return {
    validateAccess,
    isValidating,
    error
  };
};
