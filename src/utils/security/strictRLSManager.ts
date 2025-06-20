
import { supabase } from "@/integrations/supabase/client";

/**
 * Gestionnaire pour l'accès strict aux logs avec RLS renforcé
 */
export class StrictRLSManager {
  /**
   * Vérifie si l'utilisateur actuel est admin
   */
  static async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return false;
      
      // Vérification basée sur l'email et la fonction SQL
      const { data, error } = await supabase.rpc('is_current_user_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Accède aux logs d'accès avec audit automatique
   */
  static async getAccessLogs(userId?: string) {
    try {
      await this.auditLogAccess('access_logs', 'SELECT');

      let query = supabase.from('access_logs').select('*');
      
      if (userId) {
        query = query.eq('directive_id', userId);
      }

      const { data, error } = await query.order('accessed_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error accessing access logs:', error);
      throw error;
    }
  }

  /**
   * Accède aux logs de tentatives de code d'accès (admin seulement)
   */
  static async getAccessCodeAttempts() {
    try {
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        throw new Error('Accès non autorisé - privilèges administrateur requis');
      }

      await this.auditLogAccess('access_code_attempts', 'SELECT');

      const { data, error } = await supabase
        .from('access_code_attempts')
        .select('*')
        .order('attempt_time', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error accessing access code attempts:', error);
      throw error;
    }
  }

  /**
   * Accède aux logs d'accès aux documents avec sécurité renforcée
   */
  static async getDocumentAccessLogs(userId?: string) {
    try {
      await this.auditLogAccess('document_access_logs', 'SELECT');

      let query = supabase.from('document_access_logs').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.order('date_consultation', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error accessing document access logs:', error);
      throw error;
    }
  }

  /**
   * Accède aux logs d'audit médical
   */
  static async getMedicalAccessAudit(userId?: string) {
    try {
      await this.auditLogAccess('medical_access_audit', 'SELECT');

      let query = supabase.from('medical_access_audit').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.order('accessed_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error accessing medical access audit:', error);
      throw error;
    }
  }

  /**
   * Accède aux logs d'accès institutionnel
   */
  static async getInstitutionAccessLogs(userId?: string) {
    try {
      await this.auditLogAccess('institution_access_logs', 'SELECT');

      let query = supabase.from('institution_access_logs').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.order('accessed_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error accessing institution access logs:', error);
      throw error;
    }
  }

  /**
   * Accède aux logs d'audit de sécurité avec fonction SQL sécurisée
   */
  static async getSecurityAuditLogs(userId?: string) {
    try {
      await this.auditLogAccess('security_audit_logs', 'SELECT');

      let query = supabase.from('security_audit_logs').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error accessing security audit logs:', error);
      throw error;
    }
  }

  /**
   * Accède aux logs SMS (nouveau)
   */
  static async getSMSLogs(userId?: string) {
    try {
      await this.auditLogAccess('sms_send_logs', 'SELECT');

      let query = supabase.from('sms_send_logs').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error accessing SMS logs:', error);
      throw error;
    }
  }

  /**
   * Audit des accès aux logs avec logging sécurisé
   */
  private static async auditLogAccess(tableName: string, operation: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Utiliser la nouvelle fonction de logging sécurisé
      const { error } = await supabase.rpc('log_security_event_secure', {
        p_event_type: 'log_table_access',
        p_user_id: user?.id,
        p_details: {
          table_name: tableName,
          operation: operation,
          access_method: 'frontend_query'
        },
        p_risk_level: 'medium',
        p_resource_type: 'log_table'
      });

      if (error) {
        console.warn('Failed to audit log access:', error);
      }
    } catch (error) {
      console.warn('Error in audit log access:', error);
    }
  }

  /**
   * Vérifie les permissions d'accès à une table de logs
   */
  static async checkLogAccess(tableName: string, targetUserId?: string): Promise<boolean> {
    try {
      const isAdmin = await this.isCurrentUserAdmin();
      
      // Les admins ont accès à tous les logs
      if (isAdmin) return true;

      // Pour les tables nécessitant des privilèges admin
      const adminOnlyTables = ['access_code_attempts', 'logs_acces', 'institution_access_logs', 'sms_send_logs'];
      if (adminOnlyTables.includes(tableName)) {
        return false;
      }

      // Pour les autres tables, vérifier si l'utilisateur accède à ses propres logs
      if (targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id === targetUserId;
      }

      return true;
    } catch (error) {
      console.error('Error checking log access:', error);
      return false;
    }
  }

  /**
   * Log sécurisé d'événements système avec validation
   */
  static async logSecurityEvent(
    eventType: string, 
    details: Record<string, any> = {}, 
    riskLevel: string = 'medium'
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Utiliser la fonction SQL sécurisée
      const { error } = await supabase.rpc('log_security_event_secure', {
        p_event_type: eventType,
        p_user_id: user?.id,
        p_details: {
          ...details,
          source: 'strict_rls_manager'
        },
        p_risk_level: riskLevel
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  /**
   * Nettoie automatiquement les anciens logs
   */
  static async cleanupOldLogs(): Promise<void> {
    try {
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        throw new Error('Accès non autorisé - privilèges administrateur requis');
      }

      const { error } = await supabase.rpc('cleanup_old_security_logs');
      
      if (error) {
        console.error('Failed to cleanup old logs:', error);
        throw error;
      }

      await this.logSecurityEvent('logs_cleanup_completed', {
        action: 'automatic_cleanup',
        completed_at: new Date().toISOString()
      }, 'low');

    } catch (error) {
      console.error('Error cleaning up old logs:', error);
      throw error;
    }
  }
}
