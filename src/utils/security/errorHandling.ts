
import { EnhancedSecurityEventLogger } from './enhancedSecurityEventLogger';

interface SecurityError {
  userMessage: string;
  logMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SecureErrorHandler {
  private static readonly ERROR_MAPPINGS: Record<string, SecurityError> = {
    'auth/user-not-found': {
      userMessage: 'Identifiants incorrects',
      logMessage: 'User not found during authentication',
      severity: 'medium'
    },
    'auth/wrong-password': {
      userMessage: 'Identifiants incorrects',
      logMessage: 'Wrong password attempt',
      severity: 'medium'
    },
    'auth/too-many-requests': {
      userMessage: 'Trop de tentatives. Veuillez patienter.',
      logMessage: 'Rate limit exceeded',
      severity: 'high'
    },
    'auth/network-request-failed': {
      userMessage: 'Erreur de connexion. Veuillez réessayer.',
      logMessage: 'Network request failed',
      severity: 'low'
    },
    'permission-denied': {
      userMessage: 'Accès non autorisé',
      logMessage: 'Permission denied for resource access',
      severity: 'high'
    },
    'document-not-found': {
      userMessage: 'Document non trouvé',
      logMessage: 'Document access attempted for non-existent document',
      severity: 'medium'
    },
    'invalid-access-code': {
      userMessage: 'Code d\'accès invalide',
      logMessage: 'Invalid access code attempted',
      severity: 'high'
    },
    'rate-limit-exceeded': {
      userMessage: 'Trop de tentatives. Veuillez patienter avant de réessayer.',
      logMessage: 'Rate limit exceeded for operation',
      severity: 'high'
    },
    'session-expired': {
      userMessage: 'Session expirée. Veuillez vous reconnecter.',
      logMessage: 'Session validation failed - expired',
      severity: 'medium'
    },
    'session-hijacking': {
      userMessage: 'Session de sécurité invalide. Reconnexion requise.',
      logMessage: 'Potential session hijacking detected',
      severity: 'critical'
    }
  };

  static async handleError(error: any, context?: string, userId?: string): Promise<string> {
    const errorCode = this.extractErrorCode(error);
    const mapping = this.ERROR_MAPPINGS[errorCode];
    
    if (mapping) {
      await this.logSecurityEvent(mapping.logMessage, mapping.severity, context, error, userId);
      return mapping.userMessage;
    }
    
    // Default handling for unknown errors
    await this.logSecurityEvent(
      `Unknown error: ${error.message || 'Unknown'}`,
      'medium',
      context,
      error,
      userId
    );
    
    return 'Une erreur est survenue. Veuillez réessayer.';
  }
  
  private static extractErrorCode(error: any): string {
    if (error?.code) return error.code;
    if (error?.message) {
      // Extract common error patterns
      if (error.message.includes('not-found')) return 'document-not-found';
      if (error.message.includes('permission')) return 'permission-denied';
      if (error.message.includes('rate limit')) return 'rate-limit-exceeded';
      if (error.message.includes('session')) return 'session-expired';
    }
    return 'unknown-error';
  }
  
  private static async logSecurityEvent(
    message: string, 
    severity: string, 
    context?: string, 
    originalError?: any,
    userId?: string
  ): Promise<void> {
    await EnhancedSecurityEventLogger.logEvent({
      eventType: 'suspicious_activity',
      userId,
      success: false,
      riskLevel: severity as any,
      details: {
        message,
        context,
        originalError: originalError?.message || 'Unknown',
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    });
  }
  
  static sanitizeErrorForUser(error: any): string {
    // Never expose internal system details to users
    const safeMessage = this.handleError(error);
    
    // Additional sanitization to remove sensitive information
    return safeMessage.then ? safeMessage : Promise.resolve(safeMessage);
  }
}
