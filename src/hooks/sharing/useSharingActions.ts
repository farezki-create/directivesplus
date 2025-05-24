
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
   * Génère un code d'accès personnel
   */
  const generatePersonalCode = async (
    document: ShareableDocument,
    options: AccessCodeOptions = {}
  ): Promise<string | null> => {
    state.setIsGenerating(true);
    state.resetError();
    
    try {
      const result = await AccessCodeService.generateCode(document, {
        ...options,
        accessType: 'personal'
      });
      
      if (result.success && result.code) {
        toast({
          title: "Code généré",
          description: "Code d'accès personnel créé avec succès"
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
   * Génère un code d'accès institutionnel
   */
  const generateInstitutionCode = async (
    document: ShareableDocument,
    expiresInDays: number = 30
  ): Promise<string | null> => {
    state.setIsGenerating(true);
    state.resetError();
    
    try {
      const result = await AccessCodeService.generateCode(document, {
        expiresInDays,
        accessType: 'institution'
      });
      
      if (result.success && result.code) {
        toast({
          title: "Code professionnel généré",
          description: "Code d'accès institutionnel créé avec succès"
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
   * Régénère un nouveau code d'accès
   */
  const regenerateCode = async (
    currentCode: string, 
    document: ShareableDocument,
    options: AccessCodeOptions = {}
  ): Promise<string | null> => {
    state.setIsRegenerating(true);
    state.resetError();
    
    try {
      const result = await AccessCodeService.regenerateCode(currentCode, document, options);
      
      if (result.success && result.code) {
        toast({
          title: "Code régénéré",
          description: "Nouveau code d'accès créé avec succès"
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
    validateCode,
    extendCode,
    regenerateCode
  };
};
