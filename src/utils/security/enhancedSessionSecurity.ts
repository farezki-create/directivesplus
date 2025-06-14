
import { supabase } from "@/integrations/supabase/client";
import { HDSSessionManager } from './hdsSessionManager';
import { EnhancedSecurityEventLogger } from './enhancedSecurityEventLogger';

interface SessionSecurityData {
  userId: string;
  sessionId: string;
  ipAddress?: string;
  userAgent: string;
  fingerprint: string;
  lastActivity: number;
  sessionStart: number;
}

export class EnhancedSessionSecurity {
  // Durées HDS conformes
  private static readonly HDS_SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 heures
  private static readonly HDS_INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly FINGERPRINT_KEY = 'hds_session_fingerprint';
  private static readonly SESSION_KEY = 'hds_secure_session_data';

  static initializeSecureSession(userId: string): void {
    const sessionData: SessionSecurityData = {
      userId,
      sessionId: this.generateSessionId(),
      userAgent: navigator.userAgent,
      fingerprint: this.generateFingerprint(),
      lastActivity: Date.now(),
      sessionStart: Date.now()
    };

    this.storeSessionData(sessionData);
    this.logSessionEvent('hds_session_initialized', userId);
    
    // Initialiser la gestion HDS
    HDSSessionManager.setSessionStartTime();
    HDSSessionManager.initializeHDSSession();
  }

  static async validateSecureSession(userId?: string): Promise<boolean> {
    const sessionData = this.getSessionData();
    
    if (!sessionData || !userId) {
      await this.logSessionEvent('hds_session_validation_failed_no_data', userId);
      return false;
    }

    // Vérifier l'ID utilisateur
    if (sessionData.userId !== userId) {
      await this.logSessionEvent('hds_session_validation_failed_user_mismatch', userId);
      this.clearSecureSession();
      return false;
    }

    // Vérifier timeout de session HDS (8h)
    if (Date.now() - sessionData.sessionStart > this.HDS_SESSION_TIMEOUT) {
      await this.logSessionEvent('hds_session_timeout_8h', userId);
      this.clearSecureSession();
      return false;
    }

    // Vérifier timeout d'inactivité HDS (30min)
    if (Date.now() - sessionData.lastActivity > this.HDS_INACTIVITY_TIMEOUT) {
      await this.logSessionEvent('hds_session_timeout_inactivity', userId);
      this.clearSecureSession();
      return false;
    }

    // Vérifier le fingerprint
    const currentFingerprint = this.generateFingerprint();
    if (sessionData.fingerprint !== currentFingerprint) {
      await this.logSessionEvent('hds_session_fingerprint_mismatch', userId);
      this.clearSecureSession();
      return false;
    }

    // Mettre à jour l'activité
    sessionData.lastActivity = Date.now();
    this.storeSessionData(sessionData);

    return true;
  }

  static startPeriodicValidation(userId: string): () => void {
    const interval = setInterval(async () => {
      const isValid = await this.validateSecureSession(userId);
      if (!isValid) {
        // Session invalide, nettoyer et rediriger
        this.clearSecureSession();
        window.location.href = '/auth';
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(interval);
  }

  static clearSecureSession(): void {
    // Nettoyer le stockage
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.FINGERPRINT_KEY);
    
    // Nettoyer les clés Supabase
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Nettoyer sessionStorage
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Destruction du gestionnaire HDS
    HDSSessionManager.destroy();
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
      console.error('Failed to store HDS session data:', error);
    }
  }

  private static getSessionData(): SessionSecurityData | null {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to retrieve HDS session data:', error);
      return null;
    }
  }

  private static async logSessionEvent(eventType: string, userId?: string): Promise<void> {
    await EnhancedSecurityEventLogger.logEvent({
      eventType: 'suspicious_activity', // Use valid SecurityEventType
      userId,
      success: false,
      riskLevel: 'high',
      details: {
        session_event: eventType,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        hds_compliance: true
      }
    });
  }
}
