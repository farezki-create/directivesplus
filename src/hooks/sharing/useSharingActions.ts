
import { toast } from "@/hooks/use-toast";
import { AccessCodeService, ValidationService, DocumentService } from "@/services/sharing";
import type { 
  ShareableDocument, 
  AccessCodeOptions,
  ValidationRequest,
  ValidationResult 
} from "@/types/sharing";

/**
 * Hook pour les actions de partage
 */
export const useSharingActions = (state: {
  setIsGenerating: (loading: boolean) => void;
  setIsValidating: (loading: boolean) => void;
  setIsExtending: (loading: boolean) => void;
  setIsRegenerating: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetError: () => void;
}) => {
  /**
   * Génère un code d'accès global pour tous les documents de l'utilisateur
   */
  const generateGlobalCode = async (
    userId: string,
    options: AccessCodeOptions = {}
  ): Promise<string | null> => {
    state.setIsGenerating(true);
    state.resetError();
    
    try {
      const result = await AccessCodeService.generateGlobalCode(userId, options);
      
      if (result.success && result.code) {
        toast({
          title: "Code d'accès généré",
          description: "Code global créé pour tous vos documents"
        });
        return result.code;
      } else {
        throw new Error(result.error || "Erreur lors de la génération du code");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la génération du code";
      state.setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      state.setIsGenerating(false);
    }
  };

  /**
   * Génère un code d'accès personnel (utilise le code global)
   */
  const generatePersonalCode = async (
    document: ShareableDocument,
    options: AccessCodeOptions = {}
  ): Promise<string | null> => {
    return generateGlobalCode(document.user_id, {
      ...options,
      accessType: 'personal'
    });
  };

  /**
   * Génère un code d'accès institutionnel (utilise le code global)
   */
  const generateInstitutionCode = async (
    document: ShareableDocument,
    expiresInDays: number = 30
  ): Promise<string | null> => {
    return generateGlobalCode(document.user_id, {
      expiresInDays,
      accessType: 'institution'
    });
  };

  /**
   * Valide un code d'accès
   */
  const validateCode = async (request: ValidationRequest): Promise<ValidationResult> => {
    state.setIsValidating(true);
    state.resetError();
    
    try {
      const result = await ValidationService.validateCode(request);
      return result;
    } catch (err: any) {
      const errorResult = {
        success: false,
        error: err.message || "Erreur lors de la validation"
      };
      state.setError(errorResult.error);
      return errorResult;
    } finally {
      state.setIsValidating(false);
    }
  };

  /**
   * Prolonge un code d'accès
   */
  const extendCode = async (accessCode: string, days: number = 365): Promise<boolean> => {
    state.setIsExtending(true);
    try {
      const result = await AccessCodeService.extendCode(accessCode, days);
      if (result.success) {
        toast({
          title: "Code prolongé",
          description: `Code d'accès prolongé de ${days} jours`
        });
        return true;
      }
      return false;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de prolonger le code",
        variant: "destructive"
      });
      return false;
    } finally {
      state.setIsExtending(false);
    }
  };

  /**
   * Régénère un nouveau code d'accès global
   */
  const regenerateCode = async (
    currentCode: string, 
    document: ShareableDocument,
    options: AccessCodeOptions = {}
  ): Promise<string | null> => {
    state.setIsRegenerating(true);
    state.resetError();
    
    try {
      const result = await AccessCodeService.regenerateGlobalCode(
        currentCode, 
        document.user_id, 
        options
      );
      
      if (result.success && result.code) {
        toast({
          title: "Code régénéré",
          description: "Nouveau code d'accès global créé avec succès"
        });
        return result.code;
      } else {
        throw new Error(result.error || "Erreur lors de la régénération du code");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la régénération du code";
      state.setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      state.setIsRegenerating(false);
    }
  };

  return {
    generatePersonalCode,
    generateInstitutionCode,
    generateGlobalCode,
    validateCode,
    extendCode,
    regenerateCode
  };
};
