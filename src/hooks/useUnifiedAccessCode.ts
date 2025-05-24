
import { useState } from "react";
import { AccessCodeService } from "@/services/accessCode/AccessCodeService";
import { toast } from "@/hooks/use-toast";
import type { PersonalInfo, AccessValidationResult } from "@/types/accessCode";

/**
 * Hook unifié pour la validation des codes d'accès
 */
export const useUnifiedAccessCode = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateCode = async (
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessValidationResult> => {
    setIsValidating(true);
    
    try {
      const result = await AccessCodeService.validateCode(accessCode, personalInfo);
      
      if (result.success) {
        toast({
          title: "✅ Accès autorisé",
          description: result.message
        });
      } else {
        toast({
          title: "❌ Accès refusé", 
          description: result.error,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error: any) {
      const errorResult: AccessValidationResult = {
        success: false,
        error: "Erreur technique lors de la validation"
      };
      
      toast({
        title: "❌ Erreur",
        description: errorResult.error,
        variant: "destructive"
      });
      
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    isValidating,
    validateCode
  };
};
