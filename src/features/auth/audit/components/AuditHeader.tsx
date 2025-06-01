
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react';
import { EmailAuditResult } from '../types';

interface AuditHeaderProps {
  auditResult: EmailAuditResult;
  loading: boolean;
  onRerun: () => void;
}

export const AuditHeader: React.FC<AuditHeaderProps> = ({ auditResult, loading, onRerun }) => {
  const getStatusIcon = (status: boolean) => {
    return status ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: boolean, trueText = 'OK', falseText = 'Erreur') => {
    return (
      <Badge variant={status ? 'default' : 'destructive'}>
        {status ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Audit Email Supabase
          </CardTitle>
          <Button variant="outline" onClick={onRerun} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Relancer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            {getStatusIcon(auditResult.clientConfig.issues.length === 0)}
            <div className="text-sm font-medium mt-1">Client Config</div>
            {getStatusBadge(auditResult.clientConfig.issues.length === 0)}
          </div>
          <div className="text-center">
            {getStatusIcon(auditResult.authSettings.issues.length === 0)}
            <div className="text-sm font-medium mt-1">Auth Settings</div>
            {getStatusBadge(auditResult.authSettings.issues.length === 0)}
          </div>
          <div className="text-center">
            {getStatusIcon(auditResult.smtpConfig.configured)}
            <div className="text-sm font-medium mt-1">SMTP Config</div>
            {getStatusBadge(auditResult.smtpConfig.configured, 'Configuré', 'À configurer')}
          </div>
          <div className="text-center">
            {getStatusIcon(auditResult.testResults.emailTest)}
            <div className="text-sm font-medium mt-1">Email Test</div>
            {getStatusBadge(auditResult.testResults.emailTest)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
