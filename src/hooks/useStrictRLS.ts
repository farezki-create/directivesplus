
import { useState, useCallback } from 'react';
import { StrictRLSManager } from '@/utils/security/strictRLSManager';
import { EnhancedSecurityEventLogger } from '@/utils/security/enhancedSecurityEventLogger';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useStrictRLS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  const handleSecureLogAccess = useCallback(async (
    tableName: string,
    operation: string = 'SELECT',
    userId?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Vérifier les permissions d'accès
      const hasAccess = await StrictRLSManager.checkLogAccess(tableName, userId);
      
      if (!hasAccess) {
        const errorMsg = 'Accès non autorisé à cette table de logs';
        setError(errorMsg);
        
        // Logger la tentative d'accès non autorisé
        await EnhancedSecurityEventLogger.logSuspiciousActivity(
          'unauthorized_log_access_attempt',
          user?.id,
          undefined,
          navigator.userAgent,
          { 
            table_name: tableName, 
            operation: operation,
            attempted_user_filter: userId 
          }
        );
        
        toast({
          title: "Accès refusé",
          description: errorMsg,
          variant: "destructive"
        });
        
        return null;
      }

      // Accéder aux logs selon le type de table
      let data;
      switch (tableName) {
        case 'access_logs':
          data = await StrictRLSManager.getAccessLogs(userId);
          break;
        case 'access_code_attempts':
          data = await StrictRLSManager.getAccessCodeAttempts();
          break;
        case 'document_access_logs':
          data = await StrictRLSManager.getDocumentAccessLogs(userId);
          break;
        case 'medical_access_audit':
          data = await StrictRLSManager.getMedicalAccessAudit(userId);
          break;
        case 'institution_access_logs':
          data = await StrictRLSManager.getInstitutionAccessLogs(userId);
          break;
        case 'security_audit_logs':
          data = await StrictRLSManager.getSecurityAuditLogs(userId);
          break;
        case 'sms_send_logs':
          data = await StrictRLSManager.getSMSLogs(userId);
          break;
        default:
          throw new Error(`Table de logs non supportée: ${tableName}`);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'accès aux logs';
      setError(errorMessage);
      
      // Logger l'erreur d'accès
      await EnhancedSecurityEventLogger.logSuspiciousActivity(
        'log_access_error',
        user?.id,
        undefined,
        navigator.userAgent,
        { 
          table_name: tableName, 
          error_message: errorMessage 
        }
      );
      
      console.error('Error in secure log access:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  const logSecurityEvent = useCallback(async (
    eventType: string,
    details: Record<string, any> = {},
    riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    try {
      await StrictRLSManager.logSecurityEvent(eventType, details, riskLevel);
    } catch (err) {
      console.error('Error logging security event:', err);
    }
  }, []);

  const cleanupOldLogs = useCallback(async () => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent nettoyer les logs",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      await StrictRLSManager.cleanupOldLogs();
      toast({
        title: "Nettoyage terminé",
        description: "Les anciens logs ont été nettoyés avec succès"
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du nettoyage';
      setError(errorMessage);
      toast({
        title: "Erreur de nettoyage",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  return {
    loading,
    error,
    handleSecureLogAccess,
    logSecurityEvent,
    cleanupOldLogs,
    isAdmin
  };
};
