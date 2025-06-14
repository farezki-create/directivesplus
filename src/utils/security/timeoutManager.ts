
import { toast } from "@/hooks/use-toast";
import { HDSSessionManager } from "./hdsSessionManager";

/**
 * Timeout HDS conforme (8h max, auto-lock 30min)
 */
export const HDS_SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 heures
export const HDS_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Timeout de sécurité pour documents sensibles (5 minutes)
 */
export const DEFAULT_SECURITY_TIMEOUT_MS = 5 * 60 * 1000;

/**
 * Créer un timeout de sécurité HDS
 */
export const createHDSSecurityTimeout = (onTimeout: () => void, timeoutMs: number = DEFAULT_SECURITY_TIMEOUT_MS) => {
  let timeoutId: number | null = null;

  const startTimeout = () => {
    // Vérifier d'abord que la session HDS est valide
    if (!HDSSessionManager.isSessionValid()) {
      onTimeout();
      return null;
    }

    // Nettoyer le timeout existant
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    // Créer nouveau timeout
    const newTimeoutId = window.setTimeout(() => {
      toast({
        title: "Timeout de sécurité",
        description: "L'accès au document a expiré pour des raisons de sécurité HDS.",
        variant: "destructive"
      });
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

/**
 * Version legacy pour compatibilité
 */
export const createSecurityTimeout = createHDSSecurityTimeout;
