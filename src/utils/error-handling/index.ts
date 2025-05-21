
/**
 * Point d'entrée pour les utilitaires de gestion d'erreurs
 * Exporte tous les outils nécessaires pour la gestion centralisée des erreurs
 */

// Export error logger functionality
export { logError } from './error-logger';
export type { ErrorMetadata } from './error-logger';
// Export error handler and ErrorType enum
export { handleError, ErrorType } from './error-handler';

