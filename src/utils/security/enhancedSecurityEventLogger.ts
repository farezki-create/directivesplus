
import { supabase } from "@/integrations/supabase/client";

export type SecurityEventType = 
  | 'login_attempt'
  | 'document_access'
  | 'shared_document_access'
  | 'unauthorized_document_access'
  | 'admin_action'
  | 'rate_limit_exceeded'
  | 'suspicious_activity'
  | 'data_export'
  | 'user_registration'
  | 'password_reset'
  | 'security_audit'
  | 'log_table_access';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface SecurityEventData {
  eventType: SecurityEventType;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  resourceType?: string;
  resourceId?: string;
  success: boolean;
  riskLevel?: RiskLevel;
  details?: Record<string, any>;
}

export class EnhancedSecurityEventLogger {
  static async logEvent(eventData: SecurityEventData): Promise<void> {
    try {
      // Utiliser la nouvelle fonction SQL sécurisée avec validation
      const { error } = await supabase.rpc('log_security_event_secure', {
        p_event_type: eventData.eventType,
        p_user_id: eventData.userId,
        p_ip_address: eventData.ipAddress,
        p_user_agent: eventData.userAgent,
        p_details: {
          success: eventData.success,
          ...eventData.details
        },
        p_risk_level: eventData.riskLevel || 'low',
        p_resource_id: eventData.resourceId,
        p_resource_type: eventData.resourceType
      });

      if (error) {
        console.error('Failed to log security event:', error);
        // Ne pas faire échouer l'application si le logging échoue
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Ne pas faire échouer l'application si le logging échoue
    }
  }

  static async logLoginAttempt(
    success: boolean,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      eventType: 'login_attempt',
      userId,
      ipAddress,
      userAgent,
      success,
      riskLevel: success ? 'low' : 'medium',
      details
    });
  }

  static async logDocumentAccess(
    documentId: string,
    success: boolean,
    userId?: string,
    accessMethod?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logEvent({
      eventType: 'document_access',
      userId,
      ipAddress,
      userAgent,
      resourceType: 'pdf_document',
      resourceId: documentId,
      success,
      riskLevel: success ? 'low' : 'high',
      details: { access_method: accessMethod }
    });
  }

  static async logSuspiciousActivity(
    activityType: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      eventType: 'suspicious_activity',
      userId,
      ipAddress,
      userAgent,
      success: false,
      riskLevel: 'high',
      details: { activity_type: activityType, ...details }
    });
  }

  static async logSecurityAudit(
    auditType: string,
    userId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      eventType: 'security_audit',
      userId,
      success: true,
      riskLevel: 'medium',
      details: { audit_type: auditType, ...details }
    });
  }

  static async logAdminAction(
    action: string,
    userId?: string,
    targetResource?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      eventType: 'admin_action',
      userId,
      success: true,
      riskLevel: 'medium',
      resourceType: targetResource,
      details: { admin_action: action, ...details }
    });
  }
}
