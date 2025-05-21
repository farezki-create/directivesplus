
/**
 * Point d'entrée pour les utilitaires de gestion d'erreurs
 * Exporte tous les outils nécessaires pour la gestion centralisée des erreurs
 */

// Export error logger functionality but rename ErrorType to prevent conflicts
export { logError } from './error-logger';
export type { ErrorMetadata } from './error-logger';
// Explicitly export ErrorType only from error-handler to avoid conflicts
export { handleError, ErrorType } from './error-handler';
