
import { useState, useCallback } from 'react';
import { StrictRLSManager } from '@/utils/security/strictRLSManager';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useStrictRLS = () => {
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  const checkLogAccess = useCallback(async (tableName: string, targetUserId?: string) => {
    try {
      const hasAccess = await StrictRLSManager.checkLogAccess(tableName, targetUserId);
      
      if (!hasAccess) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions pour accéder à ces logs.",
          variant: "destructive"
        });
      }
      
      return hasAccess;
    } catch (error) {
      console.error('Error checking log access:', error);
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier les permissions d'accès.",
        variant: "destructive"
      });
      return false;
    }
  }, []);

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
      
      // Logger l'accès réussi
      await StrictRLSManager.logSecurityEvent('secure_log_access_success', {
        table_name: tableName,
        target_user_id: targetUserId,
        is_admin: isAdmin
      }, 'low');

      return result;
    } catch (error) {
      console.error('Secure log access failed:', error);
      
      // Logger l'échec d'accès
      await StrictRLSManager.logSecurityEvent('secure_log_access_failed', {
        table_name: tableName,
        target_user_id: targetUserId,
        error: error instanceof Error ? error.message : 'Unknown error',
        is_admin: isAdmin
      }, 'high');

      toast({
        title: "Erreur d'accès",
        description: "Impossible d'accéder aux logs demandés.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [checkLogAccess, isAdmin]);

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

  return {
    loading,
    checkLogAccess,
    secureLogAccess,
    getSecurityLogs,
    getMedicalLogs,
    getDocumentLogs,
    getAccessCodeAttempts,
    isAdmin
  };
};
