
import { HDSSessionManager } from './hdsSessionManager';

export class SessionSecurity {
  private static readonly SESSION_TIMEOUT = 8 * 60 * 60 * 1000;
  private static readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000;
  private static readonly FINGERPRINT_KEY = 'hds_session_fingerprint';
  private static readonly SESSION_START_KEY = 'hds_session_start';
  
  static initializeSession(): void {
    HDSSessionManager.setSessionStartTime();
    HDSSessionManager.initializeHDSSession();
  }
  
  static validateSession(): boolean {
    return HDSSessionManager.isSessionValid();
  }
  
  static clearSession(): void {
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
    
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return hash.toString(36);
  }
  
  static logSecurityEvent(eventType: string, details?: any): void {
    // Security events are logged server-side via Supabase RPC
  }
}
