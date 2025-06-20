
import { HDSSessionManager } from './hdsSessionManager';

export class SessionSecurity {
  // Durées conformes HDS : 8h max, auto-lock 30min
  private static readonly SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 heures
  private static readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly FINGERPRINT_KEY = 'hds_session_fingerprint';
  private static readonly SESSION_START_KEY = 'hds_session_start';
  
  static initializeSession(): void {
    // Déléguer à HDSSessionManager pour la conformité HDS
    HDSSessionManager.setSessionStartTime();
    HDSSessionManager.initializeHDSSession();
  }
  
  static validateSession(): boolean {
    // Utiliser la validation HDS conforme
    return HDSSessionManager.isSessionValid();
  }
  
  static clearSession(): void {
    // Déléguer le nettoyage au gestionnaire HDS
    HDSSessionManager.destroy();
  }
  
  private static generateFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString()
    ];
    
    // Simple hash function for fingerprinting
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(36);
  }
  
  static logSecurityEvent(eventType: string, details?: any): void {
    console.log(`HDS Security Event: ${eventType}`, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionDuration: Date.now() - (parseInt(sessionStorage.getItem(this.SESSION_START_KEY) || '0')),
      hdsCompliance: true,
      details
    });
  }
}
