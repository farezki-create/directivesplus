
export class SessionSecurity {
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly FINGERPRINT_KEY = 'session_fingerprint';
  private static readonly SESSION_START_KEY = 'session_start';
  
  static initializeSession(): void {
    const now = Date.now().toString();
    const fingerprint = this.generateFingerprint();
    
    sessionStorage.setItem(this.SESSION_START_KEY, now);
    sessionStorage.setItem(this.FINGERPRINT_KEY, fingerprint);
  }
  
  static validateSession(): boolean {
    try {
      const sessionStart = sessionStorage.getItem(this.SESSION_START_KEY);
      const storedFingerprint = sessionStorage.getItem(this.FINGERPRINT_KEY);
      
      if (!sessionStart || !storedFingerprint) {
        return false;
      }
      
      // Check session age
      const startTime = parseInt(sessionStart);
      const now = Date.now();
      if (now - startTime > this.SESSION_TIMEOUT) {
        this.clearSession();
        return false;
      }
      
      // Check fingerprint
      const currentFingerprint = this.generateFingerprint();
      if (currentFingerprint !== storedFingerprint) {
        console.warn('Session fingerprint mismatch detected');
        this.clearSession();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      this.clearSession();
      return false;
    }
  }
  
  static clearSession(): void {
    sessionStorage.removeItem(this.SESSION_START_KEY);
    sessionStorage.removeItem(this.FINGERPRINT_KEY);
  }
  
  private static generateFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
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
    console.log(`Security Event: ${eventType}`, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      details
    });
  }
}
