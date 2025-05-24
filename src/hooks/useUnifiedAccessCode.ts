
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AccessCodeManager, type AccessCodeOptions, type PersonalInfo, type AccessCodeValidation } from "@/services/accessCode/AccessCodeManager";

/**
 * Hook unifié pour toute la gestion des codes d'accès
 * Remplace tous les autres hooks de codes d'accès
 */
export const useUnifiedAccessCode = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [currentCode, setCurrentCode] = useState<string | null>(null);

  /**
   * Obtient le code d'accès fixe d'un utilisateur (toujours le même)
   */
  const getFixedCode = (userId: string): string => {
    const code = AccessCodeManager.getFixedAccessCode(userId);
    setCurrentCode(code);
    return code;
  };

  /**
   * Génère un code temporaire de partage
   */
  const generateTemporaryCode = async (
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      console.log("🔄 Début génération code temporaire...");
      const result = await AccessCodeManager.generateTemporaryCode(userId, options);
      
      if (result.success && result.code) {
        setCurrentCode(result.code);
        
        console.log("✅ Code temporaire généré avec succès:", result.code);
        
        toast({
          title: "✅ Code temporaire créé avec succès",
          description: `Code ${result.code} valide ${options.expiresInDays || 30} jours - Enregistrement confirmé en base de données`
        });
        
        return result.code;
      } else {
        console.error("❌ Échec génération:", result.error);
        
        toast({
          title: "❌ Erreur de génération",
          description: result.error || "Impossible de générer le code",
          variant: "destructive"
        });
        return null;
      }
    } catch (error: any) {
      console.error("❌ Erreur technique:", error);
      
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
   * Valide un code d'accès (fixe ou temporaire)
   */
  const validateCode = async (
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessCodeValidation> => {
    setIsValidating(true);
    
    try {
      const result = await AccessCodeManager.validateAccessCode(accessCode, personalInfo);
      
      if (result.success) {
        toast({
          title: "Accès autorisé",
          description: result.message
        });
      }
      
      return result;
    } catch (error: any) {
      const errorResult = {
        success: false,
        error: "Erreur technique lors de la validation"
      };
      
      toast({
        title: "Erreur",
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
      const result = await AccessCodeManager.extendTemporaryCode(accessCode, additionalDays);
      
      if (result.success) {
        toast({
          title: "Code prolongé",
          description: `Code valide ${additionalDays} jours supplémentaires`
        });
        return true;
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de prolonger le code",
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
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
      const result = await AccessCodeManager.revokeTemporaryCode(accessCode);
      
      if (result.success) {
        toast({
          title: "Code révoqué",
          description: "Le code d'accès a été révoqué"
        });
        if (currentCode === accessCode) {
          setCurrentCode(null);
        }
        return true;
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de révoquer le code",
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
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
      title: "Code copié",
      description: "Le code a été copié dans le presse-papier"
    });
  };

  return {
    // État
    isGenerating,
    isValidating,
    isExtending,
    currentCode,
    
    // Actions principales
    getFixedCode,
    generateTemporaryCode,
    validateCode,
    extendCode,
    revokeCode,
    copyCode
  };
};
