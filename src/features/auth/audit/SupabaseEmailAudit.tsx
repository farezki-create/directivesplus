
import React, { useState } from 'react';
import { useEmailAudit } from './hooks/useEmailAudit';
import { AuditLoadingState } from './components/AuditLoadingState';
import { AuditHeader } from './components/AuditHeader';
import { ClientConfigSection } from './components/ClientConfigSection';
import { AuthSettingsSection } from './components/AuthSettingsSection';
import { SMTPConfigSection } from './components/SMTPConfigSection';
import { TestResultsSection } from './components/TestResultsSection';
import { EmailTestSection } from './components/EmailTestSection';
import { ConfigurationInstructions } from './components/ConfigurationInstructions';

export const SupabaseEmailAudit = () => {
  const { auditResult, loading, runCompleteAudit } = useEmailAudit();
  const [emailTestLoading, setEmailTestLoading] = useState(false);

  if (loading && !auditResult) {
    return <AuditLoadingState loading={true} onStartAudit={runCompleteAudit} />;
  }

  if (!auditResult) {
    return <AuditLoadingState loading={false} onStartAudit={runCompleteAudit} />;
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
      
      <EmailTestSection 
        loading={emailTestLoading} 
        setLoading={setEmailTestLoading} 
      />
      
      <ConfigurationInstructions />
    </div>
  );
};
