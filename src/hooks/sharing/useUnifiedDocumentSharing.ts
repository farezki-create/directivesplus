
import { useDocumentSharing } from "./useDocumentSharing";
import { useAccessCodeManagement } from "./useAccessCodeManagement";
import { useSharedDocumentRetrieval } from "./useSharedDocumentRetrieval";
import { useInstitutionCodeGeneration } from "./useInstitutionCodeGeneration";

export const useUnifiedDocumentSharing = () => {
  const { shareDocument, isSharing: isDocumentSharing, shareError } = useDocumentSharing();
  const { extendAccessCode, regenerateCode, isExtending, isRegenerating } = useAccessCodeManagement();
  const { getSharedDocuments, getSharedDocumentsByAccessCode, stopSharing } = useSharedDocumentRetrieval();
  const { generateInstitutionCode, isSharing: isInstitutionSharing, shareError: institutionShareError } = useInstitutionCodeGeneration();

  // Combine loading states - if either document or institution sharing is happening
  const isSharing = isDocumentSharing || isInstitutionSharing;
  const combinedShareError = shareError || institutionShareError;

  return {
    shareDocument,
    generateInstitutionCode,
    getSharedDocuments,
    getSharedDocumentsByAccessCode,
    stopSharing,
    extendAccessCode,
    regenerateCode,
    isSharing,
    shareError: combinedShareError,
    isExtending,
    isRegenerating
  };
};

// Export types for use in other components
export type { ShareableDocument, ShareOptions } from "./types";
