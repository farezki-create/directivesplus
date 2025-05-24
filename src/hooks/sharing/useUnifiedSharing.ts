
import { useSharingState } from "./useSharingState";
import { useSharingActions } from "./useSharingActions";
import { DocumentService } from "@/services/sharing";
import type { 
  ShareableDocument, 
  ValidationRequest, 
  ValidationResult,
  AccessCodeOptions
} from "@/types/sharing";

/**
 * Hook unifié pour toutes les opérations de partage
 */
export const useUnifiedSharing = () => {
  const state = useSharingState();
  const actions = useSharingActions(state);

  /**
   * Valide un code d'accès (alias pour compatibilité)
   */
  const validateAccessCode = async (
    accessCode: string,
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
    }
  ): Promise<ValidationResult> => {
    return actions.validateCode({
      accessCode,
      personalInfo
    });
  };

  /**
   * Récupère les documents d'un utilisateur
   */
  const getUserDocuments = async (userId: string): Promise<ShareableDocument[]> => {
    try {
      return await DocumentService.getUserDocuments(userId);
    } catch (err: any) {
      state.setError(err.message);
      return [];
    }
  };

  /**
   * Génère un code d'accès global pour tous les documents de l'utilisateur
   */
  const generateGlobalAccessCode = async (
    userId: string,
    options: AccessCodeOptions = {}
  ): Promise<string | null> => {
    return actions.generateGlobalCode(userId, options);
  };

  return {
    // État
    isGenerating: state.isGenerating,
    isValidating: state.isValidating,
    isExtending: state.isExtending,
    isRegenerating: state.isRegenerating,
    error: state.error,
    
    // Actions
    generatePersonalCode: actions.generatePersonalCode,
    generateInstitutionCode: actions.generateInstitutionCode,
    generateGlobalCode: actions.generateGlobalCode,
    generateGlobalAccessCode, // Alias plus explicite
    validateCode: actions.validateCode,
    validateAccessCode, // Alias pour compatibilité
    extendCode: actions.extendCode,
    regenerateCode: actions.regenerateCode,
    getUserDocuments
  };
};

// Export des types pour compatibilité
export type { ShareableDocument, ValidationRequest, ValidationResult, AccessCodeOptions } from "@/types/sharing";
