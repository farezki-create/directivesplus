
/**
 * Niveaux de journalisation standardisés pour l'application
 * Permet une meilleure classification et filtrage des erreurs
 */

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical"
}

/**
 * Interface pour les métadonnées de log enrichies
 */
export interface EnhancedLogMetadata {
  level: LogLevel;
  message: string;
  timestamp: string;
  component?: string;
  operation?: string;
  details?: any;
  userId?: string;
  sessionId?: string;
  correlationId?: string;
}

/**
 * Détermine le niveau de log approprié en fonction du type d'erreur
 */
export const getLogLevelFromErrorType = (errorType: string): LogLevel => {
  switch (errorType) {
    case "authentication":
    case "permission":
      return LogLevel.WARNING;
    case "validation":
      return LogLevel.INFO;
    case "network":
      return LogLevel.WARNING;
    case "database":
      return LogLevel.ERROR;
    case "security":
      return LogLevel.CRITICAL;
    default:
      return LogLevel.ERROR;
  }
};
