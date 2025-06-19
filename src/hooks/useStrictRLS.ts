
import { useState, useCallback } from 'react';
import { StrictRLSManager } from '@/utils/security/strictRLSManager';
import { EnhancedSecurityEventLogger } from '@/utils/security/enhancedSecurityEventLogger';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useStrictRLS = () => {
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkLogAccess = useCallback(async (tableName: string, targetUserId?: string) => {
    try {
      const hasAccess = await StrictRLSManager.checkLogAccess(tableName, targetUserId);
      
      if (!hasAccess) {
        await EnhancedSecurityEventLogger.logSuspiciousActivity(
          'unauthorized_log_access_attempt',
          user?.id,
          undefined,
          navigator.userAgent,
          { 
            table_name: tableName,
            target_user_id: targetUserId,
            reason: 'insufficient_permissions'
          }
        );
        
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions pour accéder à ces logs.",
          variant: "destructive"
        });
      }
      
      return hasAccess;
    } catch (error) {
      console.error('Error checking log access:', error);
      
      await EnhancedSecurityEventLogger.logSuspiciousActivity(
        'log_access_check_error',
        user?.id,
        undefined,
        navigator.userAgent,
        { 
          table_name: tableName,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      );
      
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier les permissions d'accès.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id]);

  const secureLogAccess = useCallback(async <T>(
    operation: () => Promise<T>,
    tableName: string,
    targetUserId?: string
  ): Promise<T | null> => {
    setLoading(true);
    
    try {
      // Vérifier les permissions d'accès
      const hasAccess = await checkLogAccess(tableName, targetUserId);
      if (!hasAccess) {
        return null;
      }

      // Exécuter l'opération sécurisée
      const result = await operation();
      
      // Logger l'accès réussi avec la nouvelle fonction
      await EnhancedSecurityEventLogger.logSecurityAudit(
        'secure_log_access_success',
        user?.id,
        {
          table_name: tableName,
          target_user_id: targetUserId,
          is_admin: isAdmin,
          access_type: 'read_operation'
        }
      );

      return result;
    } catch (error) {
      console.error('Secure log access failed:', error);
      
      // Logger l'échec d'accès
      await EnhancedSecurityEventLogger.logSuspiciousActivity(
        'secure_log_access_failed',
        user?.id,
        undefined,
        navigator.userAgent,
        {
          table_name: tableName,
          target_user_id: targetUserId,
          error: error instanceof Error ? error.message : 'Unknown error',
          is_admin: isAdmin
        }
      );

      toast({
        title: "Erreur d'accès",
        description: "Impossible d'accéder aux logs demandés.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [checkLogAccess, user?.id, isAdmin]);

  const getSecurityLogs = useCallback(async (userId?: string) => {
    return secureLogAccess(
      () => StrictRLSManager.getSecurityAuditLogs(userId),
      'security_audit_logs',
      userId
    );
  }, [secureLogAccess]);

  const getMedicalLogs = useCallback(async (userId?: string) => {
    return secureLogAccess(
      () => StrictRLSManager.getMedicalAccessAudit(userId),
      'medical_access_audit',
      userId
    );
  }, [secureLogAccess]);

  const getDocumentLogs = useCallback(async (userId?: string) => {
    return secureLogAccess(
      () => StrictRLSManager.getDocumentAccessLogs(userId),
      'document_access_logs',
      userId
    );
  }, [secureLogAccess]);

  const getAccessCodeAttempts = useCallback(async () => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent voir les tentatives de code d'accès.",
        variant: "destructive"
      });
      return null;
    }

    return secureLogAccess(
      () => StrictRLSManager.getAccessCodeAttempts(),
      'access_code_attempts'
    );
  }, [secureLogAccess, isAdmin]);

  const cleanupOldLogs = useCallback(async () => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent nettoyer les logs.",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);
      
      await StrictRLSManager.cleanupOldLogs();
      
      toast({
        title: "Nettoyage réussi",
        description: "Les anciens logs ont été supprimés avec succès.",
      });
      
      return true;
    } catch (error) {
      console.error('Error cleaning up logs:', error);
      
      toast({
        title: "Erreur de nettoyage",
        description: "Impossible de nettoyer les anciens logs.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  return {
    loading,
    checkLogAccess,
    secureLogAccess,
    getSecurityLogs,
    getMedicalLogs,
    getDocumentLogs,
    getAccessCodeAttempts,
    cleanupOldLogs,
    isAdmin
  };
};
