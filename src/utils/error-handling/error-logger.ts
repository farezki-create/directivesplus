
/**
 * Service centralisé de journalisation des erreurs
 * Permet de collecter, formater et journaliser les erreurs de manière cohérente
 */

import { supabase } from "@/integrations/supabase/client";
import { ErrorType } from "./error-handler";

// Interface pour les métadonnées d'erreur
export interface ErrorMetadata {
  error: any;
  type: ErrorType;
  component?: string;
  operation?: string;
  timestamp?: string;
  additionalInfo?: Record<string, any>;
  userId?: string;
}

/**
 * Journalise une erreur avec contexte et métadonnées
 */
export async function logError(metadata: ErrorMetadata): Promise<void> {
  // Formatage de l'erreur pour la journalisation
  const errorObject = {
    type: metadata.type,
    message: metadata.error instanceof Error ? metadata.error.message : String(metadata.error),
    stack: metadata.error instanceof Error ? metadata.error.stack : undefined,
    timestamp: metadata.timestamp || new Date().toISOString(),
    component: metadata.component,
    operation: metadata.operation,
    ...metadata.additionalInfo
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
        prenom_consultant: String(metadata.type),
        ip_address: 'internal',
        user_agent: `ERROR | Type: ${metadata.type} | Component: ${metadata.component} | Action: ${metadata.operation} | Message: ${errorObject.message.substring(0, 200)}`
      });
  } catch (loggingError) {
    // Éviter les boucles infinies de journalisation
    console.error('Erreur lors de la journalisation:', loggingError);
  }
}
