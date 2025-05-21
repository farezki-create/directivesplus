
/**
 * Types et fonctions pour la gestion centralisée des erreurs
 */

import { toast } from "@/hooks/use-toast";
import { logError } from "./error-logger";

/**
 * Types d'erreurs pouvant survenir dans l'application
 */
export enum ErrorType {
  AUTH = "authentication",
  PERMISSION = "permission",
  VALIDATION = "validation",
  NETWORK = "network",
  DATABASE = "database",
  UNKNOWN = "unknown"
}

/**
 * Gère les erreurs de manière centralisée
 * @param error L'erreur à gérer
 * @param type Le type d'erreur
 * @param component Le composant source de l'erreur
 * @param operation L'opération qui a échoué
 * @param showToast Afficher une notification à l'utilisateur
 * @param customMessage Message personnalisé à afficher
 */
export const handleError = async (
  error: any,
  type: ErrorType,
  component: string,
  operation: string,
  showToast: boolean = true,
  customMessage?: string
): Promise<void> => {
  // Logger l'erreur
  await logError({
    error,
    type,
    component,
    operation,
    timestamp: new Date().toISOString()
  });

  // Afficher un toast si demandé
  if (showToast) {
    toast({
      title: "Erreur",
      description: customMessage || "Une erreur est survenue. Veuillez réessayer.",
      variant: "destructive"
    });
  }
  
  // Enregistrer dans la console pour le débogage
  console.error(`[${type}] Erreur dans ${component}.${operation}:`, error);
};
