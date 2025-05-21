
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
 * Interface pour les options de gestion d'erreurs
 */
export interface ErrorHandlerOptions {
  error: any;
  type: ErrorType;
  component: string;
  operation: string;
  showToast?: boolean;
  toastMessage?: string;
}

/**
 * Gère les erreurs de manière centralisée
 * Compatible avec deux styles d'appel :
 * - Style objet: handleError({ error, type, component, operation, showToast, toastMessage })
 * - Style paramètres: handleError(error, type, component, operation, showToast, customMessage)
 */
export const handleError = async (
  errorOrOptions: any | ErrorHandlerOptions,
  typeOrUndefined?: ErrorType,
  componentOrUndefined?: string,
  operationOrUndefined?: string,
  showToastOrUndefined?: boolean,
  customMessageOrUndefined?: string
): Promise<void> => {
  // Détermine si la fonction est appelée avec un objet d'options ou des paramètres individuels
  let error: any;
  let type: ErrorType;
  let component: string;
  let operation: string;
  let showToast: boolean = true;
  let customMessage: string | undefined;

  // Si le premier argument est un objet et contient les propriétés attendues
  if (
    errorOrOptions && 
    typeof errorOrOptions === 'object' && 
    'error' in errorOrOptions && 
    'type' in errorOrOptions && 
    'component' in errorOrOptions && 
    'operation' in errorOrOptions
  ) {
    // Style objet
    error = errorOrOptions.error;
    type = errorOrOptions.type;
    component = errorOrOptions.component;
    operation = errorOrOptions.operation;
    showToast = errorOrOptions.showToast !== undefined ? errorOrOptions.showToast : true;
    customMessage = errorOrOptions.toastMessage;
  } else {
    // Style paramètres individuels
    error = errorOrOptions;
    type = typeOrUndefined as ErrorType;
    component = componentOrUndefined as string;
    operation = operationOrUndefined as string;
    showToast = showToastOrUndefined !== undefined ? showToastOrUndefined : true;
    customMessage = customMessageOrUndefined;
  }

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
