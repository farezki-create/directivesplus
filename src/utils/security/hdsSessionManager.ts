
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export class HDSSessionManager {
  // Durée maximale de session HDS : 8 heures
  private static readonly HDS_MAX_SESSION_DURATION = 8 * 60 * 60 * 1000; // 8h en ms
  
  // Auto-verrouillage après inactivité : 30 minutes
  private static readonly HDS_INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30min en ms
  
  // Warning avant expiration : 5 minutes
  private static readonly SESSION_WARNING_TIME = 5 * 60 * 1000; // 5min en ms
  
  private static inactivityTimer: number | null = null;
  private static sessionWarningTimer: number | null = null;
  private static lastActivity: number = Date.now();
  
  /**
   * Initialise la gestion de session HDS
   */
  static initializeHDSSession(): void {
    this.lastActivity = Date.now();
    this.startInactivityTimer();
    this.startSessionExpirationWarning();
    this.setupActivityListeners();
    
    
  }
  
  /**
   * Démarre le timer d'inactivité
   */
  private static startInactivityTimer(): void {
    this.clearInactivityTimer();
    
    this.inactivityTimer = window.setTimeout(() => {
      this.handleInactivityTimeout();
    }, this.HDS_INACTIVITY_TIMEOUT);
  }
  
  /**
   * Démarre le warning avant expiration de session
   */
  private static startSessionExpirationWarning(): void {
    const sessionStartTime = this.getSessionStartTime();
    if (!sessionStartTime) return;
    
    const timeUntilWarning = this.HDS_MAX_SESSION_DURATION - this.SESSION_WARNING_TIME - (Date.now() - sessionStartTime);
    
    if (timeUntilWarning > 0) {
      this.sessionWarningTimer = window.setTimeout(() => {
        this.showSessionExpirationWarning();
      }, timeUntilWarning);
    }
  }
  
  /**
   * Configure les listeners d'activité utilisateur
   */
  private static setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, this.resetActivityTimer.bind(this), true);
    });
  }
  
  /**
   * Remet à zéro le timer d'activité
   */
  private static resetActivityTimer(): void {
    this.lastActivity = Date.now();
    this.startInactivityTimer();
  }
  
  /**
   * Gère le timeout d'inactivité
   */
  private static async handleInactivityTimeout(): Promise<void> {
    toast({
      title: "Session verrouillée",
      description: "Votre session a été verrouillée pour inactivité (conformité HDS)",
      variant: "destructive"
    });
    
    // Log de sécurité pour le verrouillage
    await this.logSecurityEvent('hds_session_locked_inactivity');
    
    // Redirection vers l'authentification
    window.location.href = '/auth';
  }
  
  /**
   * Affiche le warning avant expiration de session
   */
  private static showSessionExpirationWarning(): void {
    toast({
      title: "Session expiration imminente",
      description: "Votre session expirera dans 5 minutes (limite HDS de 8h)",
      variant: "destructive"
    });
    
    // Timer pour expiration finale
    setTimeout(() => {
      this.handleSessionExpiration();
    }, this.SESSION_WARNING_TIME);
  }
  
  /**
   * Gère l'expiration de session
   */
  private static async handleSessionExpiration(): Promise<void> {
    toast({
      title: "Session expirée",
      description: "Session expirée après 8h (limite HDS)",
      variant: "destructive"
    });
    
    await this.logSecurityEvent('hds_session_expired_8h_limit');
    await this.cleanupSession();
  }
  
  /**
   * Vérifie si la session est valide selon les règles HDS
   */
  static isSessionValid(): boolean {
    const sessionStartTime = this.getSessionStartTime();
    if (!sessionStartTime) return false;
    
    const sessionAge = Date.now() - sessionStartTime;
    const inactivityDuration = Date.now() - this.lastActivity;
    
    // Vérifier limite de 8h
    if (sessionAge > this.HDS_MAX_SESSION_DURATION) {
      this.handleSessionExpiration();
      return false;
    }
    
    // Vérifier inactivité de 30min
    if (inactivityDuration > this.HDS_INACTIVITY_TIMEOUT) {
      this.handleInactivityTimeout();
      return false;
    }
    
    return true;
  }
  
  /**
   * Nettoyage complet de la session
   */
  private static async cleanupSession(): Promise<void> {
    try {
      // Nettoyage des timers
      this.clearInactivityTimer();
      this.clearSessionWarningTimer();
      
      // Nettoyage du stockage local
      this.cleanupAuthState();
      
      // Déconnexion Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Redirection
      window.location.href = '/auth';
    } catch (error) {
      console.error("Erreur lors du nettoyage de session:", error);
      // Forcer la redirection même en cas d'erreur
      window.location.href = '/auth';
    }
  }
  
  /**
   * Nettoie l'état d'authentification
   */
  private static cleanupAuthState(): void {
    // Nettoyer toutes les clés Supabase
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
    
    // Supprimer les clés de session HDS
    localStorage.removeItem('hds_session_start');
    sessionStorage.removeItem('hds_session_start');
  }
  
  /**
   * Obtient l'heure de début de session
   */
  private static getSessionStartTime(): number | null {
    const stored = localStorage.getItem('hds_session_start') || 
                  sessionStorage.getItem('hds_session_start');
    return stored ? parseInt(stored) : null;
  }
  
  /**
   * Définit l'heure de début de session
   */
  static setSessionStartTime(): void {
    const now = Date.now().toString();
    localStorage.setItem('hds_session_start', now);
  }
  
  /**
   * Nettoie les timers
   */
  private static clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      window.clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }
  
  private static clearSessionWarningTimer(): void {
    if (this.sessionWarningTimer) {
      window.clearTimeout(this.sessionWarningTimer);
      this.sessionWarningTimer = null;
    }
  }
  
  /**
   * Log des événements de sécurité liés à la session
   */
  private static async logSecurityEvent(eventType: string): Promise<void> {
    try {
      await supabase.rpc('log_security_event_secure', {
        p_event_type: eventType,
        p_details: {
          session_duration: Date.now() - (this.getSessionStartTime() || Date.now()),
          last_activity: this.lastActivity,
          hds_compliance: true
        },
        p_risk_level: 'medium'
      });
    } catch (error) {
      console.error("Erreur lors du log de sécurité:", error);
    }
  }
  
  /**
   * Déstruction propre
   */
  static destroy(): void {
    this.clearInactivityTimer();
    this.clearSessionWarningTimer();
    
    // Supprimer les listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.removeEventListener(event, this.resetActivityTimer.bind(this), true);
    });
  }
}
