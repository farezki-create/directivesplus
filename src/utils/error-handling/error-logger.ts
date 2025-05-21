
/**
 * Service centralisé de journalisation des erreurs
 * Permet de collecter, formater et journaliser les erreurs de manière cohérente
 */

import { supabase } from "@/integrations/supabase/client";
import { ErrorType } from "./error-handler";
import { LogLevel, getLogLevelFromErrorType } from "./logger-levels";

// Interface pour les métadonnées d'erreur
export interface ErrorMetadata {
  error: any;
  type: ErrorType;
  component?: string;
  operation?: string;
  timestamp?: string;
  additionalInfo?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  correlationId?: string;
  resourceType?: string;  // Type de ressource concernée
  resourceId?: string;    // Identifiant de la ressource
  actionType?: string;    // Type d'action (lecture, écriture, etc.)
}

/**
 * Journalise une erreur avec contexte et métadonnées
 */
export async function logError(metadata: ErrorMetadata): Promise<void> {
  // Déterminer le niveau de log en fonction du type d'erreur
  const logLevel = getLogLevelFromErrorType(metadata.type);
  
  // Formatage de l'erreur pour la journalisation
  const errorObject = {
    type: metadata.type,
    level: logLevel,
    message: metadata.error instanceof Error ? metadata.error.message : String(metadata.error),
    stack: metadata.error instanceof Error ? metadata.error.stack : undefined,
    timestamp: metadata.timestamp || new Date().toISOString(),
    component: metadata.component,
    operation: metadata.operation,
    correlationId: metadata.correlationId || generateCorrelationId(),
    resourceType: metadata.resourceType,
    resourceId: metadata.resourceId,
    actionType: metadata.actionType,
    ...metadata.additionalInfo
  };

  // Journalisation console pour le développement avec indication du niveau
  const logPrefix = `[${logLevel.toUpperCase()}][${metadata.type}]`;
  
  switch(logLevel) {
    case LogLevel.DEBUG:
      console.debug(`${logPrefix}:`, errorObject);
      break;
    case LogLevel.INFO:
      console.info(`${logPrefix}:`, errorObject);
      break;
    case LogLevel.WARNING:
      console.warn(`${logPrefix}:`, errorObject);
      break;
    case LogLevel.ERROR:
    case LogLevel.CRITICAL:
      console.error(`${logPrefix}:`, errorObject);
      break;
    default:
      console.log(`${logPrefix}:`, errorObject);
  }

  // Récupérer l'utilisateur connecté si disponible
  try {
    if (!metadata.userId) {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        metadata.userId = data.user.id;
      }
    }

    // Récupérer la session courante si possible
    if (!metadata.sessionId) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        // Fix: La propriété 'id' n'existe pas sur le type Session
        // Utilisons plutôt une combinaison d'identifiants uniques disponibles
        metadata.sessionId = 
          sessionData.session.access_token?.substring(0, 8) || // Premiers caractères du token d'accès
          `session-${Date.now()}`; // Fallback avec timestamp
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
        user_agent: `ERROR | Level: ${logLevel} | Type: ${metadata.type} | Component: ${metadata.component} | Action: ${metadata.operation || metadata.actionType} | Resource: ${metadata.resourceType || 'unknown'}:${metadata.resourceId || 'unknown'} | CID: ${errorObject.correlationId} | Message: ${errorObject.message.substring(0, 180)}`
      });
  } catch (loggingError) {
    // Éviter les boucles infinies de journalisation
    console.error('Erreur lors de la journalisation:', loggingError);
  }
}

/**
 * Génère un identifiant de corrélation unique pour suivre les erreurs liées
 */
function generateCorrelationId(): string {
  return `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
