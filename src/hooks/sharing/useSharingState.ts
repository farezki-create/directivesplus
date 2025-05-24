
import { useState } from "react";

/**
 * Hook pour gérer l'état du partage
 */
export const useSharingState = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = () => setError(null);

  return {
    // État
    isGenerating,
    isValidating,
    isExtending,
    isRegenerating,
    error,
    
    // Actions pour l'état
    setIsGenerating,
    setIsValidating,
    setIsExtending,
    setIsRegenerating,
    setError,
    resetError
  };
};
