
import { usePersonalCodeGeneration } from "./usePersonalCodeGeneration";
import { useInstitutionCodeGeneration } from "./useInstitutionCodeGeneration";
import { useCodeManagement } from "./useCodeManagement";
import { useAccessValidation } from "./useAccessValidation";

/**
 * Hook unifié pour toutes les opérations de partage
 * Combine les hooks spécialisés pour offrir une interface complète
 */
export const useUnifiedSharing = () => {
  const { 
    generatePersonalCode, 
    isGenerating: isGeneratingPersonal, 
    error: personalError 
  } = usePersonalCodeGeneration();
  
  const { 
    generateInstitutionCode, 
    isGenerating: isGeneratingInstitution, 
    error: institutionError 
  } = useInstitutionCodeGeneration();
  
  const { 
    extendCode, 
    regenerateCode, 
    isExtending, 
    isRegenerating, 
    error: managementError 
  } = useCodeManagement();
  
  const { 
    validateAccess, 
    isValidating, 
    error: validationError 
  } = useAccessValidation();

  // Combine loading states
  const isGenerating = isGeneratingPersonal || isGeneratingInstitution;
  
  // Combine errors
  const error = personalError || institutionError || managementError || validationError;

  return {
    // Actions de génération
    generatePersonalCode,
    generateInstitutionCode,
    
    // Actions de gestion
    extendCode,
    regenerateCode,
    
    // Actions de validation
    validateAccess,
    
    // États
    isGenerating,
    isValidating,
    isExtending,
    isRegenerating,
    error,
    
    // Alias pour compatibilité avec l'ancien système
    shareDocument: generatePersonalCode,
    isSharing: isGenerating,
    shareError: error
  };
};

// Export types for compatibility
export type { ShareableDocument, ShareOptions, AccessCodeValidationResult } from "./types";
