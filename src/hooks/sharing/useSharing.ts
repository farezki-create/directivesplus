
import { useUnifiedSharing } from "./useUnifiedSharing";

/**
 * Hook de partage (alias pour compatibilité)
 * @deprecated Utiliser useUnifiedSharing directement
 */
export const useSharing = () => {
  return useUnifiedSharing();
};

// Re-export des types pour compatibilité
export type { ShareableDocument } from "@/types/sharing";
