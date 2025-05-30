
import { supabase } from "@/integrations/supabase/client";
import { EnhancedSecurityEventLogger } from './enhancedSecurityEventLogger';

interface SessionSecurityData {
  userId: string;
  sessionId: string;
  ipAddress?: string;
  userAgent: string;
  fingerprint: string;
  lastActivity: number;
}

export class EnhancedSessionSecurity {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly FINGERPRINT_KEY = 'session_fingerprint';
  private static readonly SESSION_KEY = 'secure_session_data';

  static initializeSecureSession(userId: string): void {
    const sessionData: SessionSecurityData = {
      userId,
      sessionId: this.generateSessionId(),
      userAgent: navigator.userAgent,
      fingerprint: this.generateFingerprint(),
      lastActivity: Date.now()
    };

    this.storeSessionData(sessionData);
    this.logSessionEvent('session_initialized', userId);
  }

  static async validateSecureSession(userId?: string): Promise<boolean> {
    const sessionData = this.getSessionData();
    
    if (!sessionData || !userId) {
      await this.logSessionEvent('session_validation_failed_no_data', userId);
      return false;
    }

    // Check user ID match
    if (sessionData.userId !== userId) {
      await this.logSessionEvent('session_validation_failed_user_mismatch', userId);
      this.clearSecureSession();
      return false;
    }

    // Check session timeout
    if (Date.now() - sessionData.lastActivity > this.SESSION_TIMEOUT) {
      await this.logSessionEvent('session_timeout', userId);
      this.clearSecureSession();
      return false;
    }

    // Check fingerprint
    const currentFingerprint = this.generateFingerprint();
    if (sessionData.fingerprint !== currentFingerprint) {
      await this.logSessionEvent('session_fingerprint_mismatch', userId);
      this.clearSecureSession();
      return false;
    }

    // Update last activity
    sessionData.lastActivity = Date.now();
    this.storeSessionData(sessionData);

    return true;
  }

  static startPeriodicValidation(userId: string): () => void {
    const interval = setInterval(async () => {
      const isValid = await this.validateSecureSession(userId);
      if (!isValid) {
        // Session invalid, clear and redirect
        this.clearSecureSession();
        window.location.href = '/auth';
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }

  static clearSecureSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.FINGERPRINT_KEY);
  }

  private static generateSessionId(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private static generateFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString()
    ];
    
    return btoa(components.join('|')).substring(0, 32);
  }

  private static storeSessionData(sessionData: SessionSecurityData): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to store session data:', error);
    }
  }

  private static getSessionData(): SessionSecurityData | null {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to retrieve session data:', error);
      return null;
    }
  }

  private static async logSessionEvent(eventType: string, userId?: string): Promise<void> {
    await EnhancedSecurityEventLogger.logEvent({
      eventType: 'suspicious_activity',
      userId,
      success: false,
      riskLevel: 'high',
      details: {
        session_event: eventType,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    });
  }
}
