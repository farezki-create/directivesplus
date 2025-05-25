
import { auditService } from "./auditService";

/**
 * Gestionnaire d'erreurs sécurisé pour la conformité HDS
 */

export interface SecureError {
  code: string;
  message: string;
  userMessage: string;
  statusCode: number;
  shouldLog: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SecureErrorHandler {
  /**
   * Traite une erreur de manière sécurisée
   */
  static async handleError(error: any, context: string = 'unknown'): Promise<SecureError> {
    const secureError = this.createSecureError(error, context);
    
    if (secureError.shouldLog) {
      await this.logError(secureError, context);
    }

    return secureError;
  }

  /**
   * Crée une erreur sécurisée sans exposer d'informations sensibles
   */
  private static createSecureError(error: any, context: string): SecureError {
    // Erreurs de sécurité
    if (this.isSecurityError(error)) {
      return {
        code: 'SECURITY_ERROR',
        message: error.message,
        userMessage: 'Une erreur de sécurité s\'est produite. Veuillez contacter le support.',
        statusCode: 403,
        shouldLog: true,
        severity: 'high'
      };
    }

    // Erreurs d'authentification
    if (this.isAuthError(error)) {
      return {
        code: 'AUTH_ERROR',
        message: error.message,
        userMessage: 'Erreur d\'authentification. Veuillez vous reconnecter.',
        statusCode: 401,
        shouldLog: true,
        severity: 'medium'
      };
    }

    // Erreurs de validation
    if (this.isValidationError(error)) {
      return {
        code: 'VALIDATION_ERROR',
        message: error.message,
        userMessage: 'Les données saisies ne sont pas valides.',
        statusCode: 400,
        shouldLog: false,
        severity: 'low'
      };
    }

    // Erreurs réseau
    if (this.isNetworkError(error)) {
      return {
        code: 'NETWORK_ERROR',
        message: error.message,
        userMessage: 'Problème de connexion. Veuillez vérifier votre connexion internet.',
        statusCode: 503,
        shouldLog: false,
        severity: 'low'
      };
    }

    // Erreur générique
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Une erreur inattendue s\'est produite',
      userMessage: 'Une erreur s\'est produite. Veuillez réessayer.',
      statusCode: 500,
      shouldLog: true,
      severity: 'medium'
    };
  }

  /**
   * Log une erreur dans le système d'audit
   */
  private static async logError(secureError: SecureError, context: string): Promise<void> {
    try {
      if (secureError.severity === 'high' || secureError.severity === 'critical') {
        await auditService.logSecurityViolation(secureError.message, {
          context,
          code: secureError.code,
          severity: secureError.severity,
          statusCode: secureError.statusCode
        });
      }
    } catch (loggingError) {
      console.error('Erreur lors du logging de l\'erreur:', loggingError);
    }
  }

  private static isSecurityError(error: any): boolean {
    const securityKeywords = ['unauthorized', 'forbidden', 'csrf', 'xss', 'injection'];
    const errorMessage = (error.message || '').toLowerCase();
    return securityKeywords.some(keyword => errorMessage.includes(keyword));
  }

  private static isAuthError(error: any): boolean {
    const authKeywords = ['auth', 'login', 'token', 'session', 'unauthorized'];
    const errorMessage = (error.message || '').toLowerCase();
    return authKeywords.some(keyword => errorMessage.includes(keyword));
  }

  private static isValidationError(error: any): boolean {
    return error.name === 'ValidationError' || error.code === 'VALIDATION_ERROR';
  }

  private static isNetworkError(error: any): boolean {
    return error.name === 'NetworkError' || error.code === 'NETWORK_ERROR';
  }
}

/**
 * Hook pour gérer les erreurs dans les composants React
 */
export const useSecureErrorHandler = () => {
  const handleError = async (error: any, context: string = 'component') => {
    const secureError = await SecureErrorHandler.handleError(error, context);
    
    // Affichage utilisateur sécurisé
    console.error(`Erreur dans ${context}:`, secureError.userMessage);
    
    return secureError;
  };

  return { handleError };
};
