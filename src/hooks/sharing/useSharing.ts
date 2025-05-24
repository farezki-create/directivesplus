
import { useUnifiedSharing } from "./useUnifiedSharing";

/**
 * Hook de partage (alias pour compatibilité)
 * @deprecated Utiliser useUnifiedSharing directement
 */
export const useSharing = () => {
  const unifiedSharing = useUnifiedSharing();
  
  return {
    ...unifiedSharing,
    // Alias pour compatibilité avec l'ancienne interface
    isSharing: unifiedSharing.isGenerating,
    shareError: unifiedSharing.error
  };
};

// Re-export des types pour compatibilité
export type { ShareableDocument } from "@/types/sharing";
