
import { supabase } from "@/integrations/supabase/client";

/**
 * Service d'audit pour la conformité HDS
 */

export interface AuditEvent {
  user_id?: string;
  event_type: 'login' | 'logout' | 'access_document' | 'upload_document' | 'delete_document' | 'generate_pdf' | 'security_violation' | 'data_export' | 'profile_update';
  resource_type?: 'user' | 'document' | 'directive' | 'medical_data';
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  success: boolean;
  error_message?: string;
}

class AuditService {
  /**
   * Enregistre un événement d'audit
   */
  async logEvent(event: AuditEvent): Promise<void> {
    try {
      const auditRecord = {
        ...event,
        timestamp: new Date().toISOString(),
        ip_address: event.ip_address || this.getClientIP(),
        user_agent: event.user_agent || navigator.userAgent,
        session_id: event.session_id || this.getSessionId()
      };

      // En production, ceci serait envoyé vers une table d'audit sécurisée
      const { error } = await supabase
        .from('access_logs')
        .insert({
          user_id: event.user_id,
          access_type: event.event_type,
          resource_type: event.resource_type || 'unknown',
          resource_id: event.resource_id,
          ip_address: auditRecord.ip_address,
          user_agent: auditRecord.user_agent,
          success: event.success,
          details: JSON.stringify(auditRecord.details),
          timestamp: auditRecord.timestamp
        });

      if (error) {
        console.error('Erreur lors de l\'enregistrement de l\'audit:', error);
      }
    } catch (error) {
      console.error('Erreur critique dans le service d\'audit:', error);
    }
  }

  /**
   * Log d'accès aux documents
   */
  async logDocumentAccess(userId: string, documentId: string, success: boolean, details: any = {}): Promise<void> {
    await this.logEvent({
      user_id: userId,
      event_type: 'access_document',
      resource_type: 'document',
      resource_id: documentId,
      details: {
        ...details,
        timestamp: new Date().toISOString()
      },
      success
    });
  }

  /**
   * Log de violation de sécurité
   */
  async logSecurityViolation(violation: string, details: any = {}): Promise<void> {
    await this.logEvent({
      event_type: 'security_violation',
      details: {
        violation,
        ...details,
        severity: 'high',
        timestamp: new Date().toISOString()
      },
      success: false,
      error_message: violation
    });
  }

  /**
   * Log d'authentification
   */
  async logAuthentication(userId: string, success: boolean, method: string = 'password'): Promise<void> {
    await this.logEvent({
      user_id: userId,
      event_type: success ? 'login' : 'login',
      details: {
        method,
        timestamp: new Date().toISOString()
      },
      success,
      error_message: success ? undefined : 'Authentication failed'
    });
  }

  private getClientIP(): string {
    // En production, ceci serait récupéré depuis les headers HTTP
    return 'client-ip-not-available';
  }

  private getSessionId(): string {
    // Utilise l'ID de session Supabase ou génère un ID unique
    return crypto.randomUUID();
  }
}

export const auditService = new AuditService();
