
import { useState, useEffect } from 'react';
import { EmailAuditResult } from '../types';
import { 
  auditClientConfig, 
  auditAuthSettings, 
  auditSMTPConfig, 
  auditRateLimits, 
  runFunctionalTests 
} from '../utils/auditUtils';

export const useEmailAudit = () => {
  const [auditResult, setAuditResult] = useState<EmailAuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runCompleteAudit = async () => {
    setLoading(true);
    try {
      console.log('🔍 Début de l\'audit complet email Supabase...');
      
      // 1. Test configuration client
      const clientConfig = await auditClientConfig();
      
      // 2. Test configuration auth
      const authSettings = await auditAuthSettings();
      
      // 3. Test SMTP et email
      const smtpConfig = await auditSMTPConfig();
      
      // 4. Test rate limits
      const rateLimits = await auditRateLimits();
      
      // 5. Tests de fonctionnement
      const testResults = await runFunctionalTests();
      
      setAuditResult({
        clientConfig,
        authSettings,
        smtpConfig,
        rateLimits,
        testResults
      });
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'audit:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCompleteAudit();
  }, []);

  return {
    auditResult,
    loading,
    runCompleteAudit
  };
};
