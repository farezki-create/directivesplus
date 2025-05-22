
import { toast } from "@/hooks/use-toast";
import { logDossierSecurityEvent } from "./securityEventLogger";

/**
 * Creates and manages a security timeout
 * @param onTimeout Function to call when timeout expires
 * @param timeoutMs Timeout in milliseconds
 * @returns Object with timeout management functions
 */
export const createSecurityTimeout = (onTimeout: () => void, timeoutMs: number) => {
  let timeoutId: number | null = null;

  const startTimeout = () => {
    // Clear any existing timeout
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = window.setTimeout(() => {
      toast({
        title: "Session expirée",
        description: "Votre session a expiré pour des raisons de sécurité.",
        variant: "destructive"
      });
      logDossierSecurityEvent("timeout", true);
      onTimeout();
    }, timeoutMs);

    return Number(newTimeoutId);
  };

  const clearTimeout = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      return true;
    }
    return false;
  };

  return {
    startTimeout,
    clearTimeout,
  };
};
