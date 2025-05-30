
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
  | 'password_reset';

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
      // Use security_audit_logs table instead of security_events
      await supabase.from('security_audit_logs').insert({
        event_type: eventData.eventType,
        user_id: eventData.userId,
        ip_address: eventData.ipAddress,
        user_agent: eventData.userAgent,
        risk_level: eventData.riskLevel || 'low',
        details: {
          resource_type: eventData.resourceType,
          resource_id: eventData.resourceId,
          success: eventData.success,
          ...eventData.details
        } || {}
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Don't throw - logging failures shouldn't break the application
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
}
