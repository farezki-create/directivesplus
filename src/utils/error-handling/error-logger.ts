
/**
 * Service centralisé de journalisation des erreurs
 * Permet de collecter, formater et journaliser les erreurs de manière cohérente
 */

import { supabase } from "@/integrations/supabase/client";

// Types d'erreurs pour une meilleure catégorisation
export enum ErrorType {
  VALIDATION = 'validation_error',
  AUTHENTICATION = 'auth_error',
  NETWORK = 'network_error',
  API = 'api_error',
  DATABASE = 'database_error',
  UNKNOWN = 'unknown_error'
}

// Interface pour les métadonnées d'erreur
export interface ErrorMetadata {
  component?: string;
  action?: string;
  additionalInfo?: Record<string, any>;
  userId?: string;
}

/**
 * Journalise une erreur avec contexte et métadonnées
 * @param error L'erreur à journaliser
 * @param errorType Type d'erreur pour classification
 * @param metadata Métadonnées supplémentaires sur le contexte de l'erreur
 */
export async function logError(
  error: Error | unknown, 
  errorType: ErrorType = ErrorType.UNKNOWN,
  metadata: ErrorMetadata = {}
): Promise<void> {
  // Formatage de l'erreur pour la journalisation
  const errorObject = {
    type: errorType,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    ...metadata
  };

  // Journalisation console pour le développement
  console.error('ERREUR APPLICATIVE:', errorObject);

  // Récupérer l'utilisateur connecté si disponible
  try {
    if (!metadata.userId) {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        metadata.userId = data.user.id;
      }
    }

    // Enregistrement dans document_access_logs pour centraliser les logs
    await supabase
      .from('document_access_logs')
      .insert({
        user_id: metadata.userId || '00000000-0000-0000-0000-000000000000',
        access_code_id: 'error_log',
        nom_consultant: metadata.component || 'System',
        prenom_consultant: errorType,
        ip_address: 'internal',
        user_agent: `ERROR | Type: ${errorType} | Component: ${metadata.component} | Action: ${metadata.action} | Message: ${errorObject.message.substring(0, 200)}`
      });
  } catch (loggingError) {
    // Éviter les boucles infinies de journalisation
    console.error('Erreur lors de la journalisation:', loggingError);
  }
}
