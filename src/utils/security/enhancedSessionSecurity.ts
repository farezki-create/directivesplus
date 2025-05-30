
import { supabase } from "@/integrations/supabase/client";
import { EnhancedSecurityEventLogger } from './enhancedSecurityEventLogger';

interface SessionFingerprint {
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
  platform: string;
}

export class EnhancedSessionSecurity {
  private static readonly SESSION_FINGERPRINT_KEY = 'secure_session_fingerprint';
  private static readonly SESSION_START_KEY = 'secure_session_start';
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  static generateFingerprint(): SessionFingerprint {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      platform: navigator.platform
    };
  }

  static initializeSecureSession(userId?: string): void {
    const fingerprint = this.generateFingerprint();
    const sessionStart = Date.now().toString();

    sessionStorage.setItem(this.SESSION_FINGERPRINT_KEY, JSON.stringify(fingerprint));
    sessionStorage.setItem(this.SESSION_START_KEY, sessionStart);

    // Log session start
    EnhancedSecurityEventLogger.logEvent({
      eventType: 'login_attempt',
      userId,
      success: true,
      riskLevel: 'low',
      details: {
        session_start: true,
        fingerprint_hash: this.hashFingerprint(fingerprint)
      }
    });
  }

  static async validateSecureSession(userId?: string): Promise<boolean> {
    try {
      const storedFingerprintStr = sessionStorage.getItem(this.SESSION_FINGERPRINT_KEY);
      const sessionStartStr = sessionStorage.getItem(this.SESSION_START_KEY);

      if (!storedFingerprintStr || !sessionStartStr) {
        await this.logSecurityEvent('session_validation_failed', userId, 'No session data');
        return false;
      }

      const storedFingerprint: SessionFingerprint = JSON.parse(storedFingerprintStr);
      const sessionStart = parseInt(sessionStartStr);
      const now = Date.now();

      // Check session age
      if (now - sessionStart > this.SESSION_TIMEOUT) {
        await this.logSecurityEvent('session_expired', userId, 'Session timeout');
        this.clearSecureSession();
        return false;
      }

      // Check fingerprint
      const currentFingerprint = this.generateFingerprint();
      if (!this.compareFingerprintsSecurely(storedFingerprint, currentFingerprint)) {
        await this.logSecurityEvent('session_hijacking_detected', userId, 'Fingerprint mismatch');
        this.clearSecureSession();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      await this.logSecurityEvent('session_validation_error', userId, error.message);
      this.clearSecureSession();
      return false;
    }
  }

  private static compareFingerprintsSecurely(
    stored: SessionFingerprint, 
    current: SessionFingerprint
  ): boolean {
    // Allow some flexibility for screen resolution changes (external monitors, etc.)
    const criticalMatch = stored.userAgent === current.userAgent &&
                         stored.language === current.language &&
                         stored.timezone === current.timezone &&
                         stored.platform === current.platform;

    if (!criticalMatch) {
      return false;
    }

    // Screen resolution can change, but dramatic changes are suspicious
    const [storedWidth, storedHeight] = stored.screenResolution.split('x').map(Number);
    const [currentWidth, currentHeight] = current.screenResolution.split('x').map(Number);
    
    const resolutionChangeThreshold = 0.5; // 50% change is suspicious
    const widthChange = Math.abs(currentWidth - storedWidth) / storedWidth;
    const heightChange = Math.abs(currentHeight - storedHeight) / storedHeight;
    
    if (widthChange > resolutionChangeThreshold || heightChange > resolutionChangeThreshold) {
      return false;
    }

    return true;
  }

  private static hashFingerprint(fingerprint: SessionFingerprint): string {
    // Simple hash for logging (not cryptographic)
    const str = JSON.stringify(fingerprint);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  static clearSecureSession(): void {
    sessionStorage.removeItem(this.SESSION_FINGERPRINT_KEY);
    sessionStorage.removeItem(this.SESSION_START_KEY);
  }

  private static async logSecurityEvent(
    eventType: string, 
    userId?: string, 
    details?: string
  ): Promise<void> {
    await EnhancedSecurityEventLogger.logSuspiciousActivity(
      eventType,
      userId,
      undefined, // IP address would be set server-side
      navigator.userAgent,
      { details }
    );
  }

  static startPeriodicValidation(userId?: string): () => void {
    const intervalId = setInterval(async () => {
      const isValid = await this.validateSecureSession(userId);
      if (!isValid) {
        // Force logout on session validation failure
        await supabase.auth.signOut();
        window.location.href = '/auth';
      }
    }, this.SESSION_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }
}
