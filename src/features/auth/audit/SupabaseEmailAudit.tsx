
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw } from 'lucide-react';
import { EmailAuditResult } from './types';
import { 
  auditClientConfig, 
  auditAuthSettings, 
  auditSMTPConfig, 
  auditRateLimits, 
  runFunctionalTests 
} from './utils/auditUtils';
import { AuditHeader } from './components/AuditHeader';
import { ClientConfigSection } from './components/ClientConfigSection';
import { AuthSettingsSection } from './components/AuthSettingsSection';
import { SMTPConfigSection } from './components/SMTPConfigSection';
import { TestResultsSection } from './components/TestResultsSection';
import { EmailTestSection } from './components/EmailTestSection';
import { ConfigurationInstructions } from './components/ConfigurationInstructions';

export const SupabaseEmailAudit = () => {
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

  if (loading && !auditResult) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2">Audit en cours...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!auditResult) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Audit non disponible</p>
            <Button onClick={runCompleteAudit}>
              <Shield className="mr-2 h-4 w-4" />
              Lancer l'audit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <AuditHeader 
        auditResult={auditResult} 
        loading={loading} 
        onRerun={runCompleteAudit} 
      />
      
      <ClientConfigSection clientConfig={auditResult.clientConfig} />
      
      <AuthSettingsSection authSettings={auditResult.authSettings} />
      
      <SMTPConfigSection smtpConfig={auditResult.smtpConfig} />
      
      <TestResultsSection testResults={auditResult.testResults} />
      
      <EmailTestSection loading={loading} setLoading={setLoading} />
      
      <ConfigurationInstructions />
    </div>
  );
};
