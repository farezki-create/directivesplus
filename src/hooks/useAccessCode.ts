
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AccessCodeService } from "@/services/accessCode/AccessCodeService";
import type { 
  PersonalInfo, 
  AccessCodeOptions, 
  AccessValidationResult,
  CodeGenerationResult 
} from "@/types/accessCode";

/**
 * Hook unifié et simplifié pour la gestion des codes d'accès
 */
export const useAccessCode = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [currentCode, setCurrentCode] = useState<string | null>(null);

  /**
   * Obtient le code d'accès fixe d'un utilisateur
   */
  const getFixedCode = (userId: string): string => {
    const code = AccessCodeService.generateFixedCode(userId);
    setCurrentCode(code);
    return code;
  };

  /**
   * Génère un code temporaire
   */
  const generateTemporaryCode = async (
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      const result = await AccessCodeService.createTemporaryCode(userId, options);
      
      if (result.success && result.code) {
        setCurrentCode(result.code);
        
        toast({
          title: "✅ Code temporaire créé",
          description: result.message
        });
        
        return result.code;
      } else {
        toast({
          title: "❌ Erreur de génération",
          description: result.error,
          variant: "destructive"
        });
        return null;
      }
    } catch (error: any) {
      toast({
        title: "❌ Erreur technique",
        description: "Erreur technique lors de la génération",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Valide un code d'accès
   */
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

  /**
   * Prolonge un code temporaire
   */
  const extendCode = async (
    accessCode: string, 
    additionalDays: number = 30
  ): Promise<boolean> => {
    setIsExtending(true);
    
    try {
      const result = await AccessCodeService.extendCode(accessCode, additionalDays);
      
      if (result.success) {
        toast({
          title: "✅ Code prolongé",
          description: result.message
        });
        return true;
      } else {
        toast({
          title: "❌ Erreur",
          description: result.error,
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: "Erreur technique lors de la prolongation",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsExtending(false);
    }
  };

  /**
   * Révoque un code temporaire
   */
  const revokeCode = async (accessCode: string): Promise<boolean> => {
    try {
      const result = await AccessCodeService.revokeCode(accessCode);
      
      if (result.success) {
        toast({
          title: "✅ Code révoqué",
          description: result.message
        });
        if (currentCode === accessCode) {
          setCurrentCode(null);
        }
        return true;
      } else {
        toast({
          title: "❌ Erreur",
          description: result.error,
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: "Erreur technique lors de la révocation",
        variant: "destructive"
      });
      return false;
    }
  };

  /**
   * Copie un code dans le presse-papier
   */
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "📋 Code copié",
      description: "Le code a été copié dans le presse-papier"
    });
  };

  return {
    // État
    isGenerating,
    isValidating,
    isExtending,
    currentCode,
    
    // Actions
    getFixedCode,
    generateTemporaryCode,
    validateCode,
    extendCode,
    revokeCode,
    copyCode
  };
};

// Export des types pour compatibilité
export type { AccessValidationResult, AccessCodeOptions, PersonalInfo } from "@/types/accessCode";
