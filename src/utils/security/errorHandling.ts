
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
    }
  };

  static handleError(error: any, context?: string): string {
    const errorCode = this.extractErrorCode(error);
    const mapping = this.ERROR_MAPPINGS[errorCode];
    
    if (mapping) {
      this.logSecurityEvent(mapping.logMessage, mapping.severity, context, error);
      return mapping.userMessage;
    }
    
    // Default handling for unknown errors
    this.logSecurityEvent(
      `Unknown error: ${error.message || 'Unknown'}`,
      'medium',
      context,
      error
    );
    
    return 'Une erreur est survenue. Veuillez réessayer.';
  }
  
  private static extractErrorCode(error: any): string {
    if (error?.code) return error.code;
    if (error?.message) {
      // Extract common error patterns
      if (error.message.includes('not-found')) return 'document-not-found';
      if (error.message.includes('permission')) return 'permission-denied';
      if (error.message.includes('rate limit')) return 'auth/too-many-requests';
    }
    return 'unknown-error';
  }
  
  private static logSecurityEvent(
    message: string, 
    severity: string, 
    context?: string, 
    originalError?: any
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      severity,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      originalError: originalError?.message || 'Unknown'
    };
    
    // In production, this should be sent to a secure logging service
    if (severity === 'high' || severity === 'critical') {
      console.error('Security Event:', logEntry);
    } else {
      console.warn('Security Event:', logEntry);
    }
  }
  
  static sanitizeErrorForUser(error: any): string {
    // Never expose internal system details to users
    const safeMessage = this.handleError(error);
    
    // Additional sanitization
    return safeMessage
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]') // Remove IPs
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '[ID]') // Remove UUIDs
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]'); // Remove emails
  }
}
